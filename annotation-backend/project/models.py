from django.db import models
from users.models import User

class Group(models.Model):
    name = models.CharField(max_length=256)

class Project(models.Model):
    name = models.CharField(max_length=256)
    description = models.TextField(null=True)
    deadline = models.DateTimeField(null=True)
    max_annotations = models.IntegerField(default=3)
    instruction = models.CharField(max_length=256, null=True)
    created_at = models.DateTimeField(auto_now=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="projects")

class Tag(models.Model):
    name = models.CharField(max_length=256)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tags")

def project_directory_path(instance, filename):
    project_id = instance.project.id
    owner_username = instance.owner.username
    return '{0}/{1}/{2}'.format(project_id, owner_username, filename)

class ProjectFile(models.Model):
    # name = models.CharField(max_length=256)
    file = models.FileField(blank=False, null=False)
    created_at = models.DateTimeField(auto_now=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="files")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="files")
    curves_count = models.IntegerField()
    data_type = models.CharField(max_length=20)
    is_vertical = models.BooleanField(default=False)


class AnnotatedFile(models.Model):
    file = models.FileField(blank=False, null=False)
    created_at = models.DateTimeField(auto_now=True)
    last_edit = models.DateTimeField(auto_now=True)
    completed = models.BooleanField(default=False)
    selected_area = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="annotated_files")
    parent = models.ForeignKey(ProjectFile, on_delete=models.CASCADE, related_name="annotated_files")

class AnnotatedData(models.Model):
    tagged_data = models.TextField()
    selected_area = models.TextField()
    created_at = models.DateTimeField(auto_now=True)
    last_edit = models.DateTimeField(auto_now=True)
    completed = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="annotated_data")
    parent = models.ForeignKey(ProjectFile, on_delete=models.CASCADE, related_name="annotated_data")
