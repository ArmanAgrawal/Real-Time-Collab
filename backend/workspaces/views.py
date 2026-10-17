from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
import random
import string
from .models import (
    Workspace,WorkspaceMember
)
from .serializers import (
    WorkspaceSerializer, CreateWorkspaceSerializer,WorkspaceDetailSerializer
)

def generate_join_code():
    return ''.join(random.choices(string.ascii_uppercase+string.digits,k=6))

class WorkspaceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users can see workspaces they are members of
        return Workspace.objects.filter(
            workspacemember__user=self.request.user
        ).distinct()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateWorkspaceSerializer
        if self.action == 'retrieve':
            return WorkspaceDetailSerializer
        return WorkspaceSerializer
    
    def perform_create(self, serializer):
        workspace = serializer.save(owner=self.request.user,join_code = generate_join_code())

        WorkspaceMember.objects.create(workspace=workspace,user = self.request.user)

    @action(detail=False, methods=['post'])
    def join(self,request):
        code = request.data.get("join_code")
        print("Received:", repr(code))
        workspace = Workspace.objects.filter(join_code = code).first()
        if not workspace:
            return Response({"error":"Invalid Join code"},status=400)
        
        if WorkspaceMember.objects.filter(
            workspace=workspace,
            user = request.user
        ).exists():
            return Response({"message":"Already Joined"})

        WorkspaceMember.objects.create(
            workspace = workspace,
            user = request.user
        )

        return Response({"message":"Joined SuccessFully"})

