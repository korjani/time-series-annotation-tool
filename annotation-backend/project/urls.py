from django.urls import path
# from project.views import GroupList, GroupDetails
from project import views

urlpatterns = [
    path('groups/', views.GroupList.as_view(), name='group-list'),
    path('groups/<pk>/', views.GroupDetails.as_view(), name='single-group'),
    path('projects/', views.ProjectList.as_view(), name='project-list'),
    path('projects/<pk>/', views.ProjectDetails.as_view(), name='single-project'),
    path('projects/annotating-files/<pk>/', views.AnnotatingProjectFileList.as_view(), name='single-project-annotating-file-list'),
    path('projects/dashboard/<pk>/', views.DashboardProjectDetails.as_view(), name='dashboard-project'),
    path('tags/', views.TagList.as_view(), name='tag-list'),
    path('tags/<pk>/', views.TagDetails.as_view(), name='single-tag'),
    path('project-files/', views.ProjectFileList.as_view(), name='project-file-list'),
    # path('annotating-project-files/', views.AnnotatingProjectFileList.as_view(), name='annotating-project-file-list'),
    path('project-files/<pk>/', views.ProjectFileDetails.as_view(), name='single-project-file'),
    path('project-files/assign/<pk>/', views.AssignProjectFile.as_view(), name='assign-project-files'),
    path('annotated-files/add/', views.AnnotatedFileCreate.as_view(), name='add-annotated-file'),
    path('annotated-files/update/<pk>/', views.AnnotatedFileUpdate.as_view(), name='update-annotated-file'),
    path('annotated-files/', views.AnnotatedFileList.as_view(), name='annotated-file-list'),
    path('annotated-files/<pk>/', views.AnnotatedFileDetails.as_view(), name='single-annotated-file'),
    path('annotated-data/', views.AnnotatedDataList.as_view(), name='annotated-data-list'),
    path('annotated-data/<pk>/', views.AnnotatedDataDetails.as_view(), name='single-annotated-data'),
    path('annotated-data/download/<pk>/', views.AnnotatedFile.as_view(), name='download-annotated-data'),
]

