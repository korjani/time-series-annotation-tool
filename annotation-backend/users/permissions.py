from rest_framework.permissions import BasePermission
from project.models import Project

class InvitationPermission(BasePermission):

    def has_permission(self, request, view):
        req_user = request.user
        if req_user.is_superuser:
            return True
        if hasattr(req_user, 'manager'):
            if request.data['type'] != 'A':
                return False
            try:
                p_id = int(request.data['related_id'])
                project = Project.objects.get(pk=p_id)
                if project.group in req_user.manager.groups.all():
                    return True
            except:
                return True
            return False
        if hasattr(req_user, 'annotator'):
            return False
        return False

