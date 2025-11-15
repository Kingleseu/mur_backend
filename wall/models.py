# wall/models.py
from django.db import models
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta

class Testimony(models.Model):
    KIND_CHOICES = (('text', 'text'), ('video', 'video'), ('mix', 'mix'))
    STATUS_CHOICES = (('pending', 'pending'), ('approved', 'approved'), ('rejected', 'rejected'))
    VERIFY_CHOICES = (('email', 'email'), ('phone', 'phone'), ('both', 'both'))

    kind = models.CharField(max_length=10, choices=KIND_CHOICES, default='text')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    title = models.CharField(max_length=255)
    text = models.TextField(blank=True, null=True)
    # URL de la vidéo (YouTube/Vimeo/URL publique)
    video = models.URLField(blank=True, null=True)
    video_file = models.FileField(upload_to='testimonies/videos/', blank=True, null=True)
    # UI customization for text testimonies
    postit_color = models.CharField(max_length=20, blank=True, default="")
    font_family = models.CharField(max_length=100, blank=True, default="")
    category = models.CharField(max_length=100, blank=True, null=True)

    email = models.EmailField(blank=True, default="")
    phone = models.CharField(max_length=30, blank=True, default="")
    verification_type = models.CharField(
        max_length=10, choices=VERIFY_CHOICES, default='email'
    )

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def author_fullname(self):
        return f"{self.first_name} {self.last_name}".strip()

    def __str__(self):
        return f"[{self.kind}] {self.author_fullname()} ({self.status})"


class TestimonyImage(models.Model):  # <— NOUVEAU
    testimony = models.ForeignKey(
        Testimony, on_delete=models.CASCADE, related_name='images'
    )
    image = models.ImageField(upload_to='testimonies/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.testimony_id}"


class TestimonyAmen(models.Model):
    testimony = models.ForeignKey(
        Testimony,
        on_delete=models.CASCADE,
        related_name='amen_entries'
    )
    session_key = models.CharField(max_length=64, blank=True, default="")
    user_email = models.EmailField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['testimony', 'session_key'],
                condition=Q(session_key__gt=''),
                name='unique_amen_per_session'
            ),
            models.UniqueConstraint(
                fields=['testimony', 'user_email'],
                condition=Q(user_email__gt=''),
                name='unique_amen_per_email'
            ),
        ]
        ordering = ['-created_at']

    def __str__(self):
        owner = self.user_email or self.session_key or 'unknown'
        return f"Amen for {self.testimony_id} by {owner}"


class MemberProfile(models.Model):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True, default="")
    last_name = models.CharField(max_length=150, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})".strip()


class VerificationCode(models.Model):
    email = models.EmailField()
    first_name = models.CharField(max_length=100, blank=True, default="")
    last_name = models.CharField(max_length=100, blank=True, default="")
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    attempts = models.PositiveIntegerField(default=0)

    class Meta:
        indexes = [models.Index(fields=["email", "code"])]

    @classmethod
    def create_for(cls, email: str, first_name: str = "", last_name: str = "", ttl_minutes: int = 10, code: str | None = None):
        if code is None:
            import random
            code = f"{random.randint(0, 999999):06d}"
        return cls.objects.create(
            email=email,
            first_name=first_name,
            last_name=last_name,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=ttl_minutes),
        )

    def is_valid(self, candidate: str) -> bool:
        now = timezone.now()
        return (not self.used) and (self.expires_at >= now) and (self.code == candidate)
