from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from users.models import Manager, Annotator
from django.contrib.auth.models import User
from project.models import Group, Project

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'username',
            'password',
            'last_name',
            'first_name',
            'date_joined',
            'last_login',
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'last_login': {'read_only': True}
        }

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'username',
            'last_name',
            'first_name',
            'date_joined',
            'last_login',
        )
        extra_kwargs = {
            'last_login': {'read_only': True}
        }

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    oldPassword = serializers.CharField(required=True)
    newPassword = serializers.CharField(required=True)

    # def validate_new_password(self, value):
    #     validate_password(value)
    #     return value

class InviteStatusSerializer(serializers.Field):
    def to_representation(self, value):
        return {k:v for k,v in Annotator.INVITE_STATUS_CHOICES}[value]
    def to_internal_value(self, data):
        return data

class AnnotatorBaseSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    invite_status = InviteStatusSerializer()

    class Meta:
        model = Annotator
        fields = (
            'id',
            'user',
            'company_role',
            'invite_status'
        )
        extra_kwargs = {
            'company_role': {'allow_blank': True},
        }

class AnnotatorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    invite_status = InviteStatusSerializer()

    class Meta:
        model = Annotator
        fields = (
            'id',
            'user',
            'projects',
            'company_role',
            'invite_status'
        )
        extra_kwargs = {
            'projects': {'allow_empty': True},
            'company_role': {'allow_blank': True},
        }
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = user_data.pop('password')
        projects = None
        if 'projects' in validated_data:
            projects = validated_data.pop('projects')
        user = User(**user_data)
        user.set_password(password)
        user.save()
        annotator = Annotator.objects.create(**validated_data, user=user)
        if projects:
            annotator.projects.add(*projects)
        return annotator


class ManagerSerializer(AnnotatorSerializer):
    # user = UserSerializer()
    # groups = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=Group.objects.all())

    class Meta:
        model = Manager
        fields = (
            'id',
            'user',
            'groups',
            'company_role',
            'invite_status',
            'price_per_annotation'
        )
        extra_kwargs = {
            'groups': {'allow_empty': True},
            'company_role': {'allow_blank': True},
        }
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = user_data.pop('password')
        groups = None
        if 'groups' in validated_data:
            groups = validated_data.pop('groups')
        user = User(**user_data)
        user.set_password(password)
        user.save()
        manager = Manager.objects.create(**validated_data, user=user)
        if groups:
            manager.groups.add(*groups)
        return manager


class InvitedUserSerializer(serializers.Serializer):
    MANAGER = 'M'
    ANNOTATOR = 'A'
    INVITED_USER_TYPE = (
        (MANAGER, 'MANAGER'),
        (ANNOTATOR, 'ANNOTATOR'),
    )
    email = serializers.EmailField(max_length=256)
    related_id = serializers.IntegerField()
    type = serializers.ChoiceField(INVITED_USER_TYPE)