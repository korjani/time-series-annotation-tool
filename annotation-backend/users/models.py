from django.db import models
from django.contrib.auth.models import User
from project.models import Group, Project


def get_user_type(user):
    if user.is_superuser:
        return 'Admin'
    if hasattr(user, 'manager'):
        return 'Manager'
    if hasattr(user, 'annotator'):
        return 'Annotator'
    return None


class BaseUser(models.Model):
    HOLD = 'H'
    ACTIVE = 'A'
    REMOVED = 'R'
    CANCELED = 'C'
    INVITE_STATUS_CHOICES = (
        (HOLD, 'HOLD'),
        (ACTIVE, 'ACTIVE'),
        (REMOVED, 'REMOVED'),
        (CANCELED, 'CANCELED'),
    )
    invite_status = models.CharField(max_length=1, choices=INVITE_STATUS_CHOICES, default=HOLD)
    company_role = models.CharField(max_length=256, null=True)

    class Meta:
        abstract = True

class Annotator(BaseUser):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="annotator")
    projects = models.ManyToManyField(Project, related_name="annotators")

class Manager(BaseUser):
    price_per_annotation = models.FloatField(default=0)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="manager")
    groups = models.ManyToManyField(Group, related_name="managers")

# class InvitedUser(models.Model):
#     MANAGER = 'M'
#     ANNOTATOR = 'A'
#     INVITED_USER_TYPE = (
#         (MANAGER, 'MANAGER'),
#         (ANNOTATOR, 'ANNOTATOR'),
#     )
#     email = models.CharField(max_length=256)
#     token = models.CharField(max_length=32)
#     related_id = models.IntegerField()
#     type = models.CharField(max_length=1, choices=INVITED_USER_TYPE)