from rest_framework.permissions import BasePermission
from .models import Project

class ProjectPermission(BasePermission):

    def has_permission(self, request, view):
        req_user = request.user
        if req_user.is_superuser:
            return True
        if hasattr(req_user, 'manager'):
            if request.method == 'GET':
                return True
            if request.method == 'PATCH' and 'annotator_ids' in request.data:
                return True
            return False
        if hasattr(req_user, 'annotator'):
            if request.method == 'GET':
                return True
            return False
        return False
    
    def has_object_permission(self, request, view, obj):
        req_user = request.user
        if req_user.is_superuser:
            return True
        if hasattr(req_user, 'manager'):
            if obj.group in req_user.manager.groups.all():
                return True
            return False
        if hasattr(req_user, 'annotator'):
            if obj in req_user.annotator.projects.all():
                return True
            return False
        return False


class TagPermission(BasePermission):

    def has_permission(self, request, view):
        req_user = request.user
        if req_user.is_superuser:
            return True
        if hasattr(req_user, 'manager'):
            if request.method == 'POST':
                try:
                    p_id = int(request.data['project'])
                    project = Project.objects.get(pk=p_id)
                    if project.group in req_user.manager.groups.all():
                        return True
                except:
                    return True
                return False
            return True
        if hasattr(req_user, 'annotator'):
            if request.method == 'GET':
                return True
            return False
        return False

    def has_object_permission(self, request, view, obj):
        req_user = request.user
        if req_user.is_superuser:
            return True
        if hasattr(req_user, 'manager'):
            if obj.project.group in req_user.manager.groups.all():
                return True
            return False
        if hasattr(req_user, 'annotator'):
            if obj.project in req_user.annotator.projects.all():
                return True
            return False
        return False


class ProjectFilePermission(BasePermission):

    def has_permission(self, request, view):
        req_user = request.user
        if req_user.is_superuser:
            return True
        if hasattr(req_user, 'manager'):
            if request.method == 'POST':
                try:
                    p_id = int(request.data['project'])
                    project = Project.objects.get(pk=p_id)
                    if project.group in req_user.manager.groups.all():
                        return True
                except:
                    return True
                return False
            return True
        if hasattr(req_user, 'annotator'):
            if request.method == 'GET':
                return True
        return False

    def has_object_permission(self, request, view, obj):
        req_user = request.user
        if req_user.is_superuser:
            return True
        if hasattr(req_user, 'manager'):
            if obj.project.group in req_user.manager.groups.all():
                return True
            return False
        if hasattr(req_user, 'annotator'):
            if obj.project in req_user.annotator.projects.all():
                return True
            return False
        return False


class AnnotatedFilePermission(BasePermission):

    def has_permission(self, request, view):
        # req_user = request.user
        # if req_user.is_superuser:
        #     return True
        # if hasattr(req_user, 'manager'):
        #     if request.method == 'POST':
        #         try:
        #             p_id = int(request.data['project'])
        #             project = Project.objects.get(pk=p_id)
        #             if project.group in req_user.manager.groups.all():
        #                 return True
        #         except:
        #             return True
        #         return False
        #     return True
        # if hasattr(req_user, 'annotator'):
        #     if request.method == 'GET':
        #         return True
        # return False
        return True

    def has_object_permission(self, request, view, obj):
        # req_user = request.user
        # if req_user.is_superuser:
        #     return True
        # if hasattr(req_user, 'manager'):
        #     if obj.project.group in req_user.manager.groups.all():
        #         return True
        #     return False
        # if hasattr(req_user, 'annotator'):
        #     if obj.project in req_user.annotator.projects.all():
        #         return True
        #     return False
        # return False
        return True
