from rest_framework import permissions
from .models import WorkspaceMember

class IsWorkspaceMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.members.filter(id=request.user.id).exists()

class IsWorkspaceAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        try:
            member = obj.workspacemember_set.get(user=request.user)
            return member.role in ['owner', 'admin']
        except WorkspaceMember.DoesNotExist:
            return False

# class IsDocumentMember(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         return obj.members.filter(user=request.user).exists()

# class IsDocumentOwner(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         try:
#             member = obj.documentmember_set.get(user=request.user)
#             return member.permission == 'owner'
#         except DocumentMember.DoesNotExist:
#             return False

# class CanEditDocument(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         try:
#             member = obj.documentmember_set.get(user=request.user)
#             return member.permission in ['owner', 'editor']
#         except DocumentMember.DoesNotExist:
#             return False

# class CanCommentDocument(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         try:
#             member = obj.documentmember_set.get(user=request.user)
#             return member.permission in ['owner', 'editor', 'commenter']
#         except DocumentMember.DoesNotExist:
#             return False