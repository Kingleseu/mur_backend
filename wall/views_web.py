import json
import logging
import os
import re
from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.conf import settings
from django.utils.html import escape
from django.utils import timezone
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http import JsonResponse
from django.core.mail import send_mail
from django.db.models import Count
from django.core.files.storage import default_storage

from .models import Testimony, VerificationCode, MemberProfile
from .forms import TestimonyForm


def _normalize_color(value: str) -> str:
    token_map = {
        'pink': '#FFE5E5',
        'yellow': '#FFF6D9',
        'green': '#E4FFEB'
    }
    val = (value or '').strip()
    if not val:
        return token_map['yellow']
    low = val.lower()
    if low in token_map:
        return token_map[low]
    return val


def _normalize_font(value: str) -> str:
    css = (value or '').lower()
    mapping = [
        ('permanent marker', 'Permanent Marker'),
        ('patrick hand', 'Patrick Hand'),
        ('indie flower', 'Indie Flower'),
        ('merriweather', 'Merriweather'),
        ('caveat', 'Caveat'),
        ('kalam', 'Kalam'),
        ('shadows into light', 'Shadows Into Light'),
        ('inter', 'Inter')
    ]
    for needle, label in mapping:
        if needle in css:
            return label
    return 'Inter'


def _absolute(request, url: str) -> str:
    if not url:
        return ''
    if url.startswith('http://') or url.startswith('https://'):
        return url
    if request:
        return request.build_absolute_uri(url)
    return url

def _normalize_media_url(url: str) -> str:
    if not url:
        return ''
    cleaned = url.replace('/media/media/', '/media/', 1).replace('media/media/', 'media/', 1)
    return cleaned

def _resolve_media_name(storage, name: str) -> str:
    if not name:
        return ''
    try:
        if storage.exists(name):
            return name
    except Exception:
        pass
    base, ext = os.path.splitext(name)
    simplified = re.sub(r'_[A-Za-z0-9]{6,}$', '', base)
    alt = simplified + ext
    if alt != name:
        try:
            if storage.exists(alt):
                return alt
        except Exception:
            pass
    return name

def _file_url_from_field(field, request):
    if not field or not getattr(field, 'name', ''):
        return ''
    storage = getattr(field, 'storage', default_storage)
    resolved = _resolve_media_name(storage, field.name)
    try:
        raw_url = storage.url(resolved)
    except Exception:
        raw_url = f"{settings.MEDIA_URL}{resolved}"
    return _absolute(request, _normalize_media_url(raw_url))

@ensure_csrf_cookie
def home(request):
    try:
        kind = request.GET.get('kind')  # 'text' | 'video' | None

        qs = Testimony.objects.filter(status='approved').annotate(
            amen_count=Count('amen_entries')
        ).order_by('-created_at')

        if kind in ('text', 'video'):
            qs = qs.filter(kind=kind)

        testimonies = []
        for t in qs[:200]:  # cap pour éviter les gros payloads
            base = {
                'id': t.id,
                'title': t.title,
                'text': (t.text or '')[:240],
                'fullText': t.text or '',
                'color': _normalize_color(t.postit_color),
                'font': _normalize_font(t.font_family or ''),
                'author': f"{t.first_name} {t.last_name}".strip() or 'Anonyme',
                'location': '',
                'date': (f"{t.created_at.day} {t.created_at.strftime('%b')}" if hasattr(t.created_at, 'strftime') else ''),
                'category': t.category or '',
                'amen_count': getattr(t, 'amen_count', t.amen_entries.count()),
            }

            images_qs = list(t.images.all()[:5])
            if images_qs:
                valid_urls = []
                for img in images_qs:
                    url = _file_url_from_field(img.image, request)
                    if url:
                        valid_urls.append(url)
                if valid_urls:
                    base['images'] = valid_urls
                    base.setdefault('thumbnail', valid_urls[0])

            if t.kind == 'video':
                thumb_url = ''
                first_image = t.images.first()
                if first_image and first_image.image:
                    thumb_url = _file_url_from_field(first_image.image, request)
                video_url = _file_url_from_field(t.video_file, request)
                if not video_url and t.video:
                    video_url = t.video
                base.update({
                    'type': 'video',
                    'thumbnail': thumb_url,
                    'videoUrl': video_url,
                    'duration': '',
                })

            testimonies.append(base)

        testimonies_json = json.dumps(testimonies, ensure_ascii=False)
        return render(request, 'wall/vanilla_home.html', {'testimonies_json': testimonies_json})

    except Exception as e:
        logging.exception("Erreur dans la vue home (testimonies)")
        return render(request, 'wall/vanilla_home.html', {
            'testimonies_json': '[]',
            'error': str(e) if settings.DEBUG else "Une erreur est survenue. Merci de réessayer plus tard."
        })


def create_testimony(request):
    # Enforcer: exige utilisateur vérifié en session
    if not request.session.get('verified_user'):
        # Redirige vers la home avec ouverture de la modale de connexion
        return redirect('/?signin=1')

    if request.method == 'POST':
        form = TestimonyForm(request.POST, request.FILES)
        if form.is_valid():
            inst = form.save(request=request)  # ✅ auto_approve supprimé
            return redirect('wall:home')
    else:
        form = TestimonyForm()
    return render(request, 'wall/testimony_form.html', {'form': form})


def testimony_detail(request, pk: int):
    """
    Anciennement cette vue essayait d'afficher un template wall/detail.html
    (inexistant). On redirige maintenant vers la page principale du mur pour
    éviter l'erreur TemplateDoesNotExist tout en conservant le contrôle d'accès.
    """
    obj = get_object_or_404(Testimony, pk=pk)
    return redirect('wall:home')


# ---------------------- Auth via OTP (email) ----------------------

@csrf_exempt  # Dev convenience: évite les 403 CSRF sur appels JSON
@require_POST
def auth_start(request):
    try:
        try:
            payload = json.loads(request.body.decode('utf-8')) if request.body else {}
        except Exception:
            payload = request.POST

        first_name = (payload.get('first_name') or '').strip()
        last_name = (payload.get('last_name') or '').strip()
        email = (payload.get('email') or '').strip().lower()
        mode = (payload.get('mode') or 'signup').strip().lower()
        if mode not in ('signup', 'login'):
            mode = 'signup'

        if not email:
            return JsonResponse({'ok': False, 'error': 'Email requis.'}, status=400)

        profile = MemberProfile.objects.filter(email=email).first()
        if mode == 'login':
            if not profile:
                return JsonResponse({'ok': False, 'error': 'Aucun compte trouvé pour cet email.'}, status=404)
            first_name = profile.first_name
            last_name = profile.last_name
        else:
            if not first_name:
                return JsonResponse({'ok': False, 'error': 'Le prénom est requis.'}, status=400)
            if profile:
                return JsonResponse({'ok': False, 'error': 'Un compte existe déjà avec cet email.'}, status=400)

        vc = VerificationCode.create_for(email=email, first_name=first_name, last_name=last_name)

        subject = 'Votre code de vérification Bunda21'
        message = f"Bonjour {first_name or ''} {last_name or ''},\n\nVoici votre code de vérification: {vc.code}\nIl expire dans 10 minutes.\n\nCMP - Bunda21"

        try:
            send_mail(subject, message, getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@localhost'), [email], fail_silently=True)
        except Exception as e:
            logging.warning("Fail sending email OTP: %s", e)

        if settings.DEBUG:
            logging.getLogger(__name__).info("OTP for %s: %s", email, vc.code)

        request.session['pending_user'] = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'mode': mode,
            'ts': timezone.now().isoformat()
        }
        request.session.modified = True
        return JsonResponse({'ok': True})
    except Exception as e:
        logging.exception("auth_start failed")
        msg = str(e) if settings.DEBUG else 'Erreur serveur'
        return JsonResponse({'ok': False, 'error': msg}, status=500)


@csrf_exempt  # Dev convenience: évite les 403 CSRF sur appels JSON
@require_POST
def auth_verify(request):
    try:
        try:
            payload = json.loads(request.body.decode('utf-8')) if request.body else {}
        except Exception:
            payload = request.POST
        email = (payload.get('email') or '').strip().lower()
        code = (payload.get('code') or '').strip()

        if not email or not code:
            return JsonResponse({'ok': False, 'error': 'Email et code requis.'}, status=400)

        pending = request.session.get('pending_user') or {}
        mode = pending.get('mode', 'signup')
        if mode not in ('signup', 'login'):
            mode = 'signup'

        vc = VerificationCode.objects.filter(email=email).order_by('-created_at').first()
        if not vc:
            return JsonResponse({'ok': False, 'error': 'Aucun code trouvé. Recommencez.'}, status=400)
        vc.attempts += 1
        if vc.is_valid(code):
            vc.used = True
            vc.save(update_fields=['used', 'attempts'])

            profile = MemberProfile.objects.filter(email=email).first()
            if mode == 'login':
                if not profile:
                    return JsonResponse({'ok': False, 'error': 'Compte introuvable.'}, status=404)
            else:
                first_name = pending.get('first_name', '')
                last_name = pending.get('last_name', '')
                profile, created = MemberProfile.objects.get_or_create(
                    email=email,
                    defaults={'first_name': first_name, 'last_name': last_name}
                )
                if not created:
                    updated = False
                    if first_name and profile.first_name != first_name:
                        profile.first_name = first_name
                        updated = True
                    if last_name and profile.last_name != last_name:
                        profile.last_name = last_name
                        updated = True
                    if updated:
                        profile.save(update_fields=['first_name', 'last_name'])

            request.session.cycle_key()
            request.session['verified_user'] = {
                'first_name': profile.first_name or '',
                'last_name': profile.last_name or '',
                'email': email,
            }
            request.session.pop('pending_user', None)
            request.session.modified = True
            return JsonResponse({'ok': True})
        else:
            vc.save(update_fields=['attempts'])
            return JsonResponse({'ok': False, 'error': 'Code invalide ou expiré.'}, status=400)
    except Exception as e:
        logging.exception("auth_verify failed")
        msg = str(e) if settings.DEBUG else 'Erreur serveur'
        return JsonResponse({'ok': False, 'error': msg}, status=500)


def auth_status(request):
    vu = request.session.get('verified_user')
    return JsonResponse({'ok': bool(vu), 'user': vu or None})


@require_POST
def auth_logout(request):
    request.session.pop('verified_user', None)
    request.session.pop('pending_user', None)
    request.session.modified = True
    return JsonResponse({'ok': True})
