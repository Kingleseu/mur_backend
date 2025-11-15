from django.db.models import Count
from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.decorators import action

from .models import Testimony, TestimonyAmen
from .serializers import TestimonySerializer


class TestimonyViewSet(mixins.CreateModelMixin,
                       mixins.ListModelMixin,
                       mixins.RetrieveModelMixin,
                       viewsets.GenericViewSet):

    queryset = Testimony.objects.all()
    serializer_class = TestimonySerializer

    # Autorise l'upload multipart et form-data (et JSON pour les cas sans fichiers)
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    # Filtres / recherche / tri
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["status", "kind"]   # ex: ?status=approved&kind=video
    ordering_fields = ["created_at"]        # ex: ?ordering=-created_at
    search_fields = ["first_name", "last_name", "text", "title"]

    def get_queryset(self):
        qs = super().get_queryset().annotate(
            amen_count=Count('amen_entries')
        )
        # Par défaut, masquer ce qui n'est pas approuvé dans la liste publique
        if self.action == "list":
            status_param = self.request.query_params.get("status")
            if not status_param:
                qs = qs.filter(status="approved")
        return qs

    def get_serializer_context(self):
        """
        IMPORTANT : passer request dans le context pour que le serializer
        puisse construire des URLs absolues (video_url, images, etc.)
        et lire request.FILES lors du create().
        """
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    def create(self, request, *args, **kwargs):
        """
        Création d'un témoignage.
        - On valide directement request.data (pas de copy()).
        - La modération est forcée à 'pending'.
        - Le serializer gère les fichiers (video + images[] via request.FILES).
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        instance = serializer.save(status="pending")

        data = self.get_serializer(instance).data
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=["post"], url_path="amen")
    def amen(self, request, pk=None):
        """
        Enregistre un Amen pour un témoignage donné. Idempotent par session.
        """
        testimony = self.get_object()
        if not request.session.session_key:
            request.session.save()
        session_key = request.session.session_key
        if not session_key:
            return Response({'detail': 'Session requise.'}, status=status.HTTP_400_BAD_REQUEST)

        verified = request.session.get('verified_user') or {}
        user_email = verified.get('email', '')

        filter_kwargs = {'testimony': testimony}
        defaults = {}
        if user_email:
            filter_kwargs['user_email'] = user_email
            defaults['session_key'] = session_key
        else:
            filter_kwargs['session_key'] = session_key
            defaults['user_email'] = ''

        amen = TestimonyAmen.objects.filter(**filter_kwargs).first()
        if amen:
            amen.delete()
            liked = False
        else:
            TestimonyAmen.objects.create(**filter_kwargs, **defaults)
            liked = True

        amen_count = testimony.amen_entries.count()
        return Response(
            {
                "ok": True,
                "amen_count": amen_count,
                "liked": liked
            },
            status=status.HTTP_200_OK
        )

    # --- (Optionnel) actions de modération admin ---
    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        obj = self.get_object()
        obj.status = "approved"
        obj.save(update_fields=["status"])
        return Response({"detail": "Approuvé."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        obj = self.get_object()
        obj.status = "rejected"
        obj.save(update_fields=["status"])
        return Response({"detail": "Rejeté."}, status=status.HTTP_200_OK)
