from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import (
    Workspace,
    WorkspaceMember,
)

from presentations.models import Document
from presentations.serializers import DocumentSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'profile_picture'
        ]

        ref_name = "WorkspaceUserSerializer"


class WorkspaceMemberSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = WorkspaceMember

        fields = [
            'id',
            'user',
            'joined_at'
        ]


class WorkspaceSerializer(serializers.ModelSerializer):

    owner = UserSerializer(read_only=True)

    class Meta:
        model = Workspace

        fields = [
            'id',
            'name',
            'description',
            'color',
            'icon',
            'owner',
            'created_at'
        ]

        read_only_fields = [
            'owner',
            'join_code',
            'created_at'
        ]

    def get_member_count(self, obj):
        return obj.workspacemember_set.count()


class CreateWorkspaceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Workspace

        fields = [
            'name',
            'description',
            'color',
            'icon'
        ]


class WorkspaceDetailSerializer(serializers.ModelSerializer):

    owner = UserSerializer(read_only=True)

    members = WorkspaceMemberSerializer(
        many=True,
        read_only=True,
        source='workspacemember_set'
    )

    member_count = serializers.SerializerMethodField()

    documents = serializers.SerializerMethodField()

    class Meta:
        model = Workspace

        fields = [
            'id',
            'name',
            'description',
            'color',
            'icon',
            'owner',
            'join_code',
            'created_at',
            'member_count',
            'members',
            'documents',
        ]

    def get_member_count(self, obj):

        return obj.workspacemember_set.count()

    def get_documents(self, obj):

        documents = Document.objects.filter(
            workspace=obj
        )

        return DocumentSerializer(
            documents,
            many=True
        ).data