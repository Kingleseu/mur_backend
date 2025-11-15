from django.contrib import admin
from .models import (
    Testimony,
    TestimonyImage,
    TestimonyAmen,
    MemberProfile,
    VerificationCode,
)


class TestimonyImageInline(admin.TabularInline):
    model = TestimonyImage
    extra = 0
    fields = ("image",)


@admin.register(Testimony)
class TestimonyAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'kind', 'title', 'first_name', 'last_name', 'status', 'created_at'
    )
    list_filter = (
        'kind', 'status', 'verification_type', 'category', 'created_at'
    )
    search_fields = (
        'first_name', 'last_name', 'title', 'text', 'email', 'phone'
    )
    readonly_fields = ('created_at',)
    inlines = [TestimonyImageInline]
    ordering = ('-created_at',)

    fieldsets = (
        (None, {
            'fields': (
                'kind', 'status', 'title', 'text', 'video', 'video_file', 'category'
            )
        }),
        ('Auteur', {
            'fields': ('first_name', 'last_name')
        }),
        ('Vérification', {
            'fields': ('verification_type', 'email', 'phone')
        }),
        ('Apparence (post-it)', {
            'fields': ('postit_color', 'font_family')
        }),
        ('Meta', {
            'fields': ('created_at',)
        }),
    )

    actions = [
        'mark_approved', 'mark_pending', 'mark_rejected'
    ]

    def mark_approved(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f"{updated} témoignage(s) approuvé(s).")
    mark_approved.short_description = "Marquer comme approuvé"

    def mark_pending(self, request, queryset):
        updated = queryset.update(status='pending')
        self.message_user(request, f"{updated} témoignage(s) en attente.")
    mark_pending.short_description = "Marquer comme en attente"

    def mark_rejected(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f"{updated} témoignage(s) rejeté(s).")
    mark_rejected.short_description = "Marquer comme rejeté"


@admin.register(TestimonyImage)
class TestimonyImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'testimony', 'created_at')
    search_fields = ('testimony__title', 'testimony__first_name', 'testimony__last_name')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)


@admin.register(TestimonyAmen)
class TestimonyAmenAdmin(admin.ModelAdmin):
    list_display = ('testimony', 'user_email', 'session_key', 'created_at')
    search_fields = (
        'testimony__title',
        'user_email',
        'session_key',
    )
    list_filter = ('created_at',)
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)


@admin.register(MemberProfile)
class MemberProfileAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'created_at', 'updated_at')
    search_fields = ('email', 'first_name', 'last_name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('email',)


@admin.register(VerificationCode)
class VerificationCodeAdmin(admin.ModelAdmin):
    list_display = ('email', 'code', 'used', 'attempts', 'expires_at', 'created_at')
    list_filter = ('used', 'created_at')
    search_fields = ('email', 'code')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
