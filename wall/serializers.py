# wall/serializers.py
from rest_framework import serializers
from .models import Testimony, TestimonyImage

MAX_VIDEO_UPLOAD_MB = 20
MAX_VIDEO_UPLOAD_BYTES = MAX_VIDEO_UPLOAD_MB * 1024 * 1024

class TestimonyImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = TestimonyImage
        fields = ['id', 'url']

    def get_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url) if obj.image and request else None


class TestimonySerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    images = TestimonyImageSerializer(many=True, read_only=True)
    amen_count = serializers.SerializerMethodField()

    class Meta:
        model = Testimony
        fields = [
            'id', 'kind',
            'first_name', 'last_name', 'author',
            'title', 'email', 'phone', 'verification_type',
            'text', 'postit_color', 'font_family',
            'video', 'video_file', 'video_url', 'images',
            'status', 'created_at','category', 'amen_count'
        ]
        read_only_fields = ['status', 'created_at']
        extra_kwargs = {
            'video_file': {'write_only': True}
        }

    def get_author(self, obj):
        return obj.author_fullname()

    def get_video_url(self, obj):
        request = self.context.get('request')
        if obj.video_file:
            url = obj.video_file.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return obj.video or None

    def get_amen_count(self, obj):
        if hasattr(obj, 'amen_count') and obj.amen_count is not None:
            return obj.amen_count
        if hasattr(obj, 'amen_entries_count'):
            return obj.amen_entries_count
        return obj.amen_entries.count()

    def validate(self, attrs):
        kind = attrs.get('kind', 'text')
        verification_type = attrs.get('verification_type', 'email')
        request = self.context.get('request')

        # Vérification identité
        if verification_type == 'email' and not attrs.get('email'):
            raise serializers.ValidationError("L'email est requis pour la vérification par email.")
        if verification_type == 'phone' and not attrs.get('phone'):
            raise serializers.ValidationError("Le téléphone est requis pour la vérification par téléphone.")

        # Règles selon kind
        if kind in ('text', 'mix') and not attrs.get('text'):
            raise serializers.ValidationError("Le champ 'text' est requis pour un témoignage texte.")
        if kind in ('video', 'mix'):
            has_upload = bool(attrs.get('video_file'))
            has_external = bool(attrs.get('video'))
            file_from_request = bool(request and (request.FILES.get('video_file') or request.FILES.get('video')))
            if not (has_upload or has_external or file_from_request):
                raise serializers.ValidationError("La vidéo est requise pour un témoignage vidéo.")
            upload_candidate = attrs.get('video_file')
            if not upload_candidate and request:
                upload_candidate = request.FILES.get('video_file') or request.FILES.get('video')
            if upload_candidate and getattr(upload_candidate, 'size', 0) > MAX_VIDEO_UPLOAD_BYTES:
                raise serializers.ValidationError(f"La vidéo ne doit pas dépasser {MAX_VIDEO_UPLOAD_MB} MB.")

        return attrs

    def create(self, validated_data):
        """
        On doit récupérer les fichiers (video + images[]) dans request.FILES.
        """
        request = self.context['request']
        video_upload = validated_data.pop('video_file', None)
        images_files = request.FILES.getlist('images')  # <input name="images" multiple>

        # Si kind = video/mix, valider la présence d'une vidéo soit dans validated_data, soit dans request.FILES
        kind = validated_data.get('kind', 'text')
        if kind in ('video', 'mix'):
            has_video = (
                bool(validated_data.get('video')) or
                bool(video_upload) or
                bool(request.FILES.get('video_file')) or
                bool(request.FILES.get('video'))
            )
            if not has_video:
                raise serializers.ValidationError("La vidéo est requise pour un témoignage vidéo.")

        instance = Testimony.objects.create(**validated_data)

        # Sauvegarder la vidéo uploadée (champ video_file ou fallback sur 'video')
        file_from_request = request.FILES.get('video_file') or request.FILES.get('video')
        file_to_save = file_from_request or video_upload
        if file_to_save:
            filename = getattr(file_to_save, 'name', f'testimony-video-{instance.pk}.mp4')
            instance.video_file.save(filename, file_to_save, save=True)

        # Créer les images liées (max 5)
        if images_files:
            if len(images_files) > 5:
                raise serializers.ValidationError("Maximum 5 images autorisées.")
            for f in images_files:
                TestimonyImage.objects.create(testimony=instance, image=f)

        return instance
