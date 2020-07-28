from rest_framework import serializers
from project.models import Group, Project, Tag, ProjectFile, AnnotatedFile, AnnotatedData
from users.serializers import AnnotatorBaseSerializer, ManagerSerializer
from users.models import Manager, Annotator, get_user_type

class GroupBaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = (
            'id',
            'name',
        )

class TagBaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ('id', 'name')


class ProjectSerializer(serializers.ModelSerializer):
    group_name = serializers.SlugRelatedField(many=False, read_only=True, source='group', slug_field='name')
    tags_name = serializers.SlugRelatedField(many=True, read_only=True, source='tags', slug_field='name')

    class Meta:
        model = Project
        fields = (
            'id',
            'name',
            'description',
            'instruction',
            'deadline',
            'created_at',
            'group',
            'group_name',
            'tags',
            'tags_name',
            'annotators',
        )
        extra_kwargs = {
            'annotators': {
                'read_only': True,
            },
            'instruction': {
                'allow_blank': True,
                'allow_null': True,
            },
            'description': {
                'allow_blank': True,
                'allow_null': True,
            },
        }


class GroupSerializer(serializers.ModelSerializer):
    managers = ManagerSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    manager_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=False,
        queryset=Manager.objects.all(),
        source="managers"
    )
    project_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=False,
        queryset=Project.objects.all(),
        source="projects"
    )
    class Meta:
        model = Group
        fields = (
            'id',
            'name',
            'managers',
            'projects',
            'manager_ids',
            'project_ids'
        )


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ('id', 'name', 'project')


class AnnotatedDataSerializer(serializers.ModelSerializer):

    owner = serializers.SerializerMethodField()

    class Meta:
        model = AnnotatedData
        fields = (
            'id',
            'owner',
            'parent',
            'completed',
            'tagged_data',
            'selected_area',
            'last_edit',
            'created_at',
        )
        read_only_fields = ('owner',)

    def get_owner(self, obj):
        owner_data = obj.owner.username + ' (' + get_user_type(obj.owner) + ')'
        return owner_data


class ProjectFileSerializer(serializers.ModelSerializer):

    size = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    filetype = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()
    # annotated_files = serializers.SerializerMethodField()
    annotated_data = serializers.SerializerMethodField()

    class Meta:
        model = ProjectFile
        fields = (
            'id',
            'file',
            'project',
            'size',
            'name',
            'filetype',
            'curves_count',
            'data_type',
            'is_vertical',
            'owner',
            # 'annotated_files',
            'annotated_data',
            'created_at',
        )
    def get_size(self, obj):
        file_size = ''
        if obj.file and hasattr(obj.file, 'size'):
            file_size = obj.file.size
        return file_size
    def get_name(self, obj):
        file_name = ''
        if obj.file and hasattr(obj.file, 'name'):
            file_name = obj.file.name
        return file_name
    def get_filetype(self, obj):
        filename = obj.file.name
        return filename.split('.')[-1]
    def get_owner(self, obj):
        # owner_data = {
        #     'id': obj.owner.id,
        #     'type': get_user_type(obj.owner),
        # }
        owner_data = obj.owner.username + ' (' + get_user_type(obj.owner) + ')'
        return owner_data
    def get_annotated_files(self, obj):
        user = None
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
        oncompleted_file = obj.annotated_files.filter(completed=False, owner=user).last()
        annotated_file = None
        if oncompleted_file:
            annotated_file = {
                'id': oncompleted_file.id,
                'file': oncompleted_file.file.url,
                'selected_area': oncompleted_file.selected_area,
            }
        return annotated_file
    def get_annotated_data(self, obj):
        user = None
        annotated_data = AnnotatedDataSerializer(obj.annotated_data, many=True).data
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
        if hasattr(user, 'annotator'):
            oncompleted_tagged = obj.annotated_data.filter(completed=False, owner=user).last()
            annotated_data = None
            if oncompleted_tagged:
                annotated_data = {
                    'id': oncompleted_tagged.id,
                    'tagged_data': oncompleted_tagged.tagged_data,
                    'selected_area': oncompleted_tagged.selected_area,
                }
        return annotated_data


class DashboardProjectFileSerializer(ProjectFileSerializer):
    annotated_data = serializers.SerializerMethodField()

    class Meta:
        model = ProjectFile
        fields = (
            'id',
            'file',
            'project',
            'size',
            'name',
            'filetype',
            'curves_count',
            'data_type',
            'is_vertical',
            'owner',
            'annotated_data',
            'created_at',
        )
    def get_annotated_data(self, obj):
        user = None
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user

        # assign to cuurent user (if not assigned)
        if not obj.annotated_data.filter(owner=user).exists():
            d = {
                'tagged_data': '{}',
                'selected_area': '{}',
                'owner': user,
                'parent': obj,
            }
            empty_anno = AnnotatedData.objects.create(**d)
            empty_anno.save()
        oncompleted_tagged = obj.annotated_data.filter(completed=False, owner=user).last()
        annotated_data = None
        if oncompleted_tagged:
            annotated_data = {
                'id': oncompleted_tagged.id,
                'tagged_data': oncompleted_tagged.tagged_data,
                'selected_area': oncompleted_tagged.selected_area,
            }
        return annotated_data


class AnnotatedFileSerializer(serializers.ModelSerializer):

    size = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    file_type = serializers.SerializerMethodField()
    # owner = serializers.SerializerMethodField()

    class Meta:
        model = AnnotatedFile
        fields = (
            'id',
            'file',
            'name',
            'size',
            'file_type',
            'owner',
            'parent',
            'completed',
            'selected_area',
            'last_edit',
            'created_at',
        )
        read_only_fields = ('created', 'file', 'owner')

    def get_size(self, obj):
        file_size = ''
        if obj.file and hasattr(obj.file, 'size'):
            file_size = obj.file.size
        return file_size

    def get_name(self, obj):
        file_name = ''
        if obj.file and hasattr(obj.file, 'name'):
            file_name = obj.file.name
        return file_name

    def get_file_type(self, obj):
        filename = obj.file.name
        return filename.split('.')[-1]

    def get_owner(self, obj):
        owner_data = obj.owner.username + ' (' + get_user_type(obj.owner) + ')'
        return owner_data


class ProjectDetailSerializer(serializers.ModelSerializer):
    group = GroupBaseSerializer()
    tags = TagBaseSerializer(many=True)
    files = ProjectFileSerializer(many=True)
    annotators = AnnotatorBaseSerializer(many=True, read_only=True)
    progress_percent = serializers.SerializerMethodField()
    annotator_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=False,
        queryset=Annotator.objects.all(),
        source="annotators"
    )

    class Meta:
        model = Project
        fields = (
            'id',
            'name',
            'description',
            'instruction',
            'created_at',
            'deadline',
            'annotators',
            'annotator_ids',
            'max_annotations',
            'progress_percent',
            'files',
            'group',
            'tags',
        )

    def get_progress_percent(self, obj):
        total_annotation = obj.files.count() * obj.max_annotations
        if total_annotation == 0:
            return 0
        completed_annotation = obj.files.filter(annotated_data__completed=True).count()
        percent = completed_annotation / total_annotation * 100
        return round(percent, 2)


class DashboardProjectSerializer(serializers.ModelSerializer):
    group = GroupBaseSerializer()
    tags = TagBaseSerializer(many=True)
    # files = DashboardProjectFileSerializer(many=True)
    files = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            'id',
            'name',
            'description',
            'instruction',
            'created_at',
            'deadline',
            'files',
            'group',
            'tags',
        )

    def get_files(self, obj):
        req_user = None
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            req_user = request.user
        qs = obj.files
        if req_user.is_superuser:
            qs = qs.all()
        if hasattr(req_user, 'manager'):
            qs = qs.filter(project__group__in=req_user.manager.groups.all())
        if hasattr(req_user, 'annotator'):
            qs = qs.filter(project__in=req_user.annotator.projects.all())
        qs1 = [pFile for pFile in qs if req_user in pFile.annotated_data.values('owner')]
        qs2 = [pFile for pFile in qs if pFile.annotated_data.count() < pFile.project.max_annotations]
        qs = qs1 + qs2
        return [pFile.id for pFile in qs]
