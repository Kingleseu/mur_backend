from django import forms
from .models import Testimony, TestimonyImage


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class TestimonyForm(forms.Form):
    KIND_CHOICES = (
        ('text', 'Texte'),
        ('video', 'VidÃ©o'),
    )
    VERIFY_CHOICES = (
        ('email', 'Email'),
        ('phone', 'TÃ©lÃ©phone'),
    )

    kind = forms.ChoiceField(choices=KIND_CHOICES, initial='text', widget=forms.RadioSelect)
    name = forms.CharField(max_length=200, label="Votre nom (ou initiales)")
    title = forms.CharField(max_length=255, label="Titre du tÃ©moignage")
    verification_type = forms.ChoiceField(choices=VERIFY_CHOICES, initial='email', widget=forms.RadioSelect)
    email = forms.EmailField(required=False)
    phone = forms.CharField(required=False, max_length=30)

    text = forms.CharField(required=False, widget=forms.Textarea)
    postit_color = forms.CharField(required=False, max_length=20)
    font_family = forms.CharField(required=False, max_length=100)
    images = forms.FileField(required=False, widget=MultipleFileInput())

    video = forms.URLField(required=False, label="URL de la vidéo")
    video_file = forms.FileField(required=False, label="Fichier vidéo")
    category = forms.CharField(required=False, max_length=100)

    def clean(self):
        cleaned = super().clean()
        kind = cleaned.get('kind')
        vtype = cleaned.get('verification_type')

        if vtype == 'email' and not cleaned.get('email'):
            self.add_error('email', "L'email est requis pour la vÃ©rification par email.")
        if vtype == 'phone' and not cleaned.get('phone'):
            self.add_error('phone', "Le tÃ©lÃ©phone est requis pour la vÃ©rification par tÃ©lÃ©phone.")

        if kind == 'text' and not cleaned.get('text'):
            self.add_error('text', "Le tÃ©moignage texte est requis.")
        if kind == 'video' and not (cleaned.get('video') or cleaned.get('video_file')):
            self.add_error("video", "Une URL ou un fichier vidéo est requis.")
        return cleaned

    def save(self, *, request=None, auto_approve=False):
        name = self.cleaned_data['name'].strip()
        parts = name.split()
        first_name = parts[0] if parts else ''
        last_name = ' '.join(parts[1:]) if len(parts) > 1 else ''

        instance = Testimony.objects.create(
            kind=self.cleaned_data['kind'],
            first_name=first_name,
            last_name=last_name,
            title=self.cleaned_data['title'],
            text=self.cleaned_data.get('text') or '',
            video=self.cleaned_data.get('video') or None,
            email=self.cleaned_data.get('email') or '',
            phone=self.cleaned_data.get('phone') or '',
            verification_type=self.cleaned_data['verification_type'],
            postit_color=self.cleaned_data.get('postit_color') or '',
            font_family=self.cleaned_data.get('font_family') or '',
            category=self.cleaned_data.get('category') or '',
            status='approved' if auto_approve else 'pending',
        )

        video_file = self.cleaned_data.get('video_file') or (request.FILES.get('video_file') if request else None)

        if video_file:
            instance.video_file.save(video_file.name, video_file, save=True)

        files = request.FILES.getlist('images') if request else None
        if files:
            for f in files[:5]:
                TestimonyImage.objects.create(testimony=instance, image=f)

        return instance


