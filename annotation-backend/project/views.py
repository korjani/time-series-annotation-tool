import os
import json
from django.dispatch import receiver
from django.db.models import signals
from django.shortcuts import render
from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from project.models import Group, Project, Tag, ProjectFile, AnnotatedFile, AnnotatedData
from project.serializers import (
    GroupSerializer,
    GroupBaseSerializer,
    ProjectSerializer,
    ProjectDetailSerializer,
    TagSerializer,
    ProjectFileSerializer,
    AnnotatedFileSerializer,
    AnnotatedDataSerializer,
    DashboardProjectSerializer,
    DashboardProjectFileSerializer
)
from project.permissions import (
    ProjectPermission,
    TagPermission,
    ProjectFilePermission,
    AnnotatedFilePermission
)

class GroupList(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupBaseSerializer
    permission_classes = [IsAdminUser]
    

class GroupDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAdminUser]



class ProjectList(generics.ListCreateAPIView):
    # queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [ProjectPermission]

    def get_queryset(self):
        req_user = self.request.user
        qs = []
        if req_user.is_superuser:
            qs = Project.objects.all()
        if hasattr(req_user, 'manager'):
            qs = Project.objects.filter(group__in=req_user.manager.groups.all())
        if hasattr(req_user, 'annotator'):
            qs = req_user.annotator.projects.all()
        return qs


class ProjectDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectDetailSerializer
    permission_classes = [ProjectPermission]


class DashboardProjectDetails(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = DashboardProjectSerializer
    permission_classes = [ProjectPermission]


class TagList(generics.ListCreateAPIView):
    # queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [TagPermission]

    def get_queryset(self):
        req_user = self.request.user
        qs = []
        if req_user.is_superuser:
            qs = Tag.objects.all()
        if hasattr(req_user, 'manager'):
            qs = Tag.objects.filter(project__group__in=req_user.manager.groups.all())
        if hasattr(req_user, 'annotator'):
            qs = Tag.objects.filter(project__in=req_user.annotator.projects.all())
        return qs
    

class TagDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [TagPermission]



class ProjectFileList(generics.ListCreateAPIView):
    # queryset = ProjectFile.objects.all()
    serializer_class = ProjectFileSerializer
    permission_classes = [ProjectFilePermission]
    # parser_class = (FileUploadParser,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        req_user = self.request.user
        qs = []
        if req_user.is_superuser:
            qs = ProjectFile.objects.all()
        if hasattr(req_user, 'manager'):
            qs = ProjectFile.objects.filter(project__group__in=req_user.manager.groups.all())
        if hasattr(req_user, 'annotator'):
            qs = ProjectFile.objects.filter(project__in=req_user.annotator.projects.all())
        return qs
# from django.db.models import F
class AnnotatingProjectFileList(generics.ListAPIView):
    serializer_class = ProjectFileSerializer
    permission_classes = [ProjectFilePermission]

    # def get_queryset(self):
    #     req_user = self.request.user
    #     qs = []
    #     if req_user.is_superuser:
    #         qs =  ProjectFile.objects.all()
    #     if hasattr(req_user, 'manager'):
    #         qs =  ProjectFile.objects.filter(project__group__in=req_user.manager.groups.all())
    #     if hasattr(req_user, 'annotator'):
    #         qs =  ProjectFile.objects.filter(project__in=req_user.annotator.projects.all())
    #     return qs

    def get(self, request, pk):
        req_user = request.user
        project_id = pk
        qs = ProjectFile.objects.filter(project__id=project_id)
        if req_user.is_superuser:
            qs = qs.all()
        if hasattr(req_user, 'manager'):
            qs = qs.filter(project__group__in=req_user.manager.groups.all())
        if hasattr(req_user, 'annotator'):
            qs = qs.filter(project__in=req_user.annotator.projects.all())
        qs1 = [pFile for pFile in qs if req_user in pFile.annotated_data.values('owner')]
        qs2 = [pFile for pFile in qs if pFile.annotated_data.count() < pFile.project.max_annotations]
        qs = qs1 + qs2
        return Response([pFile.id for pFile in qs])


# from django.shortcuts import get_object_or_404
from django.http import Http404
class ProjectFileDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProjectFile.objects.all()
    serializer_class = ProjectFileSerializer
    permission_classes = [ProjectFilePermission]
    # parser_class = (FileUploadParser,)
    # def delete(self, request, *args, **kwargs):
    #     try:
    #         print('>'*1000, kwargs.items())
    #         for k, v in kwargs.items():
    #             for id in v.split(','):
    #                 obj = get_object_or_404(ProjectFile, pk=int(id))
    #                 self.perform_delete(obj)
    #     except Http404:
    #         pass
    #     return Response(status=status.HTTP_204_NO_CONTENT)

@receiver(signals.post_delete, sender=ProjectFile)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `ProjectFile` object is deleted.
    """
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)

@receiver(signals.pre_save, sender=ProjectFile)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes old file from filesystem
    when corresponding `ProjectFile` object is updated
    with new file.
    """
    if not instance.pk:
        return False


class AssignProjectFile(generics.RetrieveAPIView):
    queryset = ProjectFile.objects.all()
    serializer_class = DashboardProjectFileSerializer
    permission_classes = [ProjectFilePermission]

import csv
def add_processed_data(main_file, annotated_data, tag_list):
    processed_data = list()
    label_row = list()
    new_row = list()
    parent_file_path = main_file.file.path
    start_index = main_file.curves_count + 1
    with open(parent_file_path) as csvfile:
        readCSV = csv.reader(csvfile, delimiter=',')
        for row in readCSV:
            try:
                float(row[1])
                for cell_i, cell in enumerate(row):
                    label_row.append('column-' + str(cell_i))
            except:
                label_row = row
            for tag in tag_list:
                label_row.append(str(tag['id']) + ':' +tag['name'])
            processed_data.append(label_row)
            break
        shift = 0
        for row_i, row in enumerate(readCSV):
            if row_i==0 and len(processed_data) == 0:
                shift = 1
                continue
            for col_j, tag in enumerate(tag_list):
                new_row = row[0:start_index]
                new_row.append( str(annotated_data[ str(tag['id']) ][row_i - shift]) )
            processed_data.append(new_row)
    return processed_data
def create_annotated_path(main_file, user_name):
    path_array = main_file.file.path.split('\\')
    path_array.pop(-1)
    # path_array.append(str(main_file.project.id))
    # if not os.path.isdir('\\'.join(path_array)):
    #     os.mkdir('\\'.join(path_array))
    # path_array.append(user_name)
    # if not os.path.isdir('\\'.join(path_array)):
    #     os.mkdir('\\'.join(path_array))
    pf_names = main_file.file.name.split('.')
    new_file_name = ''.join(pf_names[0:-1])
    new_file_name += '_annotated_fake_'
    new_file_name += str(main_file.annotated_files.filter(owner__username=user_name).count() + 1)
    new_file_name += '.' + pf_names[-1]
    path_array.append(new_file_name)
    annotated_file_path = '\\'.join(path_array)
    return annotated_file_path

from rest_framework_csv.renderers import CSVRenderer
from django.core.files import File
import tempfile
class AnnotatedFileCreate(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        annotated_data = request.data['annotated']
        parent_id = request.data['parent']
        selected_area = request.data['area']
        req_user = request.user
        try:
            project_file = ProjectFile.objects.get(pk=parent_id)
        except:
            return Response({"result": "invalid parent_id"}, status=status.HTTP_400_BAD_REQUEST)
        
        if hasattr(req_user, 'manager') and project_file.project.group not in req_user.manager.groups.all():
            return Response({"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN)
        if hasattr(req_user, 'annotator') and project_file.project not in req_user.annotator.projects.all():
            return Response({"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN)
        tag_list = list()
        try:
            for tag_id, data in annotated_data.items():
                tag = Tag.objects.get(pk=tag_id)
                tag_list.append({
                    'id': tag.id,
                    'name': tag.name
                })
        except:
            return Response({'tag not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        processed_data = add_processed_data(project_file, annotated_data, tag_list)
        annotated_fake_path = create_annotated_path(project_file, req_user.username)

        # f = tempfile.NamedTemporaryFile(mode='w+', newline='')
        # writer = csv.writer(f)
        # writer.writerows(processed_data)
        # saved_file = File(f)
        # saved_file.name = annotated_file_path
        # *******************
        with open(annotated_fake_path, 'w', newline='') as writeFile:
            writer = csv.writer(writeFile)
            writer.writerows(processed_data)
        writeFile.close()
        fake_file = open(annotated_fake_path, 'r')
        saved_file = File(fake_file)
        i = annotated_fake_path.rfind('_annotated_fake_')
        annotated_file_path = annotated_fake_path[:i] + '_annotated_' + annotated_fake_path[i+16:]
        saved_file.name = annotated_file_path
        data = {
            # 'file': File(saved_file),
            # 'owner': req_user.id,
            'parent': parent_id,
            'selected_area': selected_area
        }
        if request.data.get('completed'):
            data['completed'] = request.data.get('completed')
        a_f_s = AnnotatedFileSerializer(data=data)
        if a_f_s.is_valid():
            a_f_s.save(file=File(saved_file), owner=req_user)
            fake_file.close()
            if os.path.isfile(annotated_fake_path):
                os.remove(annotated_fake_path)
            return Response(a_f_s.data, status=status.HTTP_201_CREATED)
        return Response({"detail": a_f_s.errors}, status=status.HTTP_400_BAD_REQUEST)

class AnnotatedFileUpdate(views.APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        annotated_data = request.data['annotated']
        selected_area = request.data['area']
        req_user = request.user
        try:
            annotated_file = AnnotatedFile.objects.get(pk=pk)
        except AnnotatedFile.DoesNotExist:
            raise Http404()

        tag_list = list()
        try:
            for tag_id, data in annotated_data.items():
                tag = Tag.objects.get(pk=tag_id)
                tag_list.append({
                    'id': tag.id,
                    'name': tag.name
                })
        except:
            return Response({'tag not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        processed_data = add_processed_data(annotated_file.parent, annotated_data, tag_list)
        annotated_file_path = annotated_file.file.path

        with open(annotated_file_path, 'r+', newline='') as writeFile:
            writer = csv.writer(writeFile)
            writer.writerows(processed_data)
        writeFile.close()
        data = {
            'parent': annotated_file.parent.id,
            'selected_area': selected_area,
        }
        if request.data.get('completed'):
            data['completed'] = request.data.get('completed')
        a_f_s = AnnotatedFileSerializer(annotated_file, data=data)
        if a_f_s.is_valid():
            a_f_s.save(file__name=annotated_file_path)
            return Response(a_f_s.data)
        return Response({"detail": a_f_s.errors}, status=status.HTTP_400_BAD_REQUEST)


class AnnotatedFileList(generics.ListAPIView):
    serializer_class = AnnotatedFileSerializer
    permission_classes = [AnnotatedFilePermission]

    def get_queryset(self):
        req_user = self.request.user
        qs = []
        if req_user.is_superuser:
            qs = AnnotatedFile.objects.all()
        if hasattr(req_user, 'manager'):
            qs = AnnotatedFile.objects.filter(parent__project__group__in=req_user.manager.groups.all())
        if hasattr(req_user, 'annotator'):
            qs = AnnotatedFile.objects.filter(parent__project__in=req_user.annotator.projects.all())
        return qs


class AnnotatedFileDetails(generics.RetrieveDestroyAPIView):
    queryset = AnnotatedFile.objects.all()
    serializer_class = AnnotatedFileSerializer
    permission_classes = [AnnotatedFilePermission]

@receiver(signals.post_delete, sender=AnnotatedFile)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `AnnotatedFile` object is deleted.
    """
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)

@receiver(signals.pre_save, sender=AnnotatedFile)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes old file from filesystem
    when corresponding `AnnotatedFile` object is updated
    with new file.
    """
    if not instance.pk:
        return False


class AnnotatedDataList(generics.ListCreateAPIView):
    serializer_class = AnnotatedDataSerializer
    permission_classes = [AnnotatedFilePermission]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        req_user = self.request.user
        qs = []
        if req_user.is_superuser:
            qs = AnnotatedData.objects.all()
        if hasattr(req_user, 'manager'):
            qs = AnnotatedData.objects.filter(project__group__in=req_user.manager.groups.all())
        if hasattr(req_user, 'annotator'):
            qs = AnnotatedData.objects.filter(project__in=req_user.annotator.projects.all())
        return qs

class AnnotatedDataDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = AnnotatedData.objects.all()
    serializer_class = AnnotatedDataSerializer
    permission_classes = [AnnotatedFilePermission]


import boto3
import codecs
import csv
from storages.backends.s3boto3 import S3Boto3Storage
from django.core.files.storage import default_storage
from io import BytesIO as StringIO # python3
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import HttpResponse
storage = S3Boto3Storage()
class AnnotatedFile(views.APIView):
    # main_file, annotated_data, tag_list
    # permission_classes = [AnnotatedFilePermission]
    permission_classes = [AllowAny]
    def get(self, request, pk):
        tag_list = list()
        new_row = list()
        label_row = list()
        processed_data = list()
        anno_data = AnnotatedData.objects.get(pk=pk)
        main_file = anno_data.parent
        # annotated_data = anno_data.tagged_data
        annotated_data = json.loads(anno_data.tagged_data)
        # perform tag_list from tagged_data (add column to csv for each tag)
        try:
            if annotated_data:
                for tag_id, data in annotated_data.items():
                    tag = Tag.objects.get(pk=tag_id)
                    tag_list.append({
                        'id': tag.id,
                        'name': tag.name
                    })
        except:
            return Response({'tag not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        start_index = main_file.curves_count + 1
        bucket = 'django-file-service'
        file_key = str(main_file.file)
        s3 = boto3.client('s3')
        csvfile = s3.get_object(Bucket=bucket, Key=file_key)
        csvcontent = csvfile['Body'].read().split()
        readCSV = csv.DictReader(csvcontent)
        with storage.open(file_key) as f:
            readCSV = csv.reader(codecs.iterdecode(f, 'utf-8'))
            # make column label
            for row in readCSV:
                # make column label for main data (if not has)
                try:
                    float(row[1])
                    for cell_i, cell in enumerate(row):
                        label_row.append('column-' + str(cell_i))
                except:
                    label_row = row
                # make column label for tagged data
                for tag in tag_list:
                    label_row.append(str(tag['id']) + ':' +tag['name'])
                processed_data.append(label_row)
                break
            shift = 0
            # add tagged data column to csv file data
            for row_i, row in enumerate(readCSV):
                if row_i==0 and len(processed_data) == 1:
                    shift = 1
                    continue
                new_row = row[0:start_index]
                for col_j, tag in enumerate(tag_list):
                    new_row.append( str(annotated_data[ str(tag['id']) ][row_i - shift]) )
                processed_data.append(new_row)
        # preparing response
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="export.csv"'
        writer = csv.writer(response)
        writer.writerows(processed_data)
        return response
