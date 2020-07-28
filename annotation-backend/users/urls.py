from django.urls import path
from users.views import views, invite_user

urlpatterns = [
    # path('users/', views.UserViewSet, name='user-list'),
    path('users/<pk>', views.UserDetails.as_view(), name='single-user'),
    path('change-password/', views.ChangePassword.as_view(), name='change-password'),
    path('annotators/', views.AnnotatorList.as_view(), name='annotator-list'),
    path('annotators/<pk>/', views.AnnotatorDetails.as_view(), name='single-annotator'),
    path('managers/', views.ManagerList.as_view(), name='manager-list'),
    path('managers/<pk>/', views.ManagerDetails.as_view(), name='single-manager'),
    path('user-type/', views.UserType.as_view(), name='user-type'),
    path('invite-user/', invite_user.UserInvitation.as_view(), name='invite-user'),
    path('check-invitation/', invite_user.CheckInviteValidation.as_view(), name='check-invitation'),
    path('registration/', invite_user.UserRegistration.as_view(), name='registration'),
]

