from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from users.models import User
from users.serializers import InvitedUserSerializer, AnnotatorSerializer, ManagerSerializer
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import update_last_login
from users.permissions import InvitationPermission

def send_invitation_email(users_email, token, user_type):
    subject = 'Please Accept Your Invitation'
    # host = settings.ALLOWED_HOSTS[0]
    # host = 'https://chart-tagging.herokuapp.com'
    host = 'https://data-annotation.herokuapp.com'
    link = '{}/register/{}'.format(host, token)
    message = {
        'M': '''
            To accept your invitation, go to 
            {}
            Thank you from {}
        '''.format(link, host),
        'A': '''
            Hi,

            You are invited to participate in SolveX. We’re excited to have you on board!
            With SolveX’s data annotation platform behind you, get ready to collect, clean, and label your data at scale.

            To accept the invitation please go to:
                {}

            Best regards,

            The SolveX AI Team

            P.S. Need help navigating the platform? Our support team support@solvex.ai shows you how to upload data, design a job, set quality control measures, and more.

            SolveX does more than solve data problems. We combine the best of human and machine intelligence to collect, clean, and label data, no matter the size or complexity.
        '''.format(link)
    }
    from_mail = settings.EMAIL_HOST_USER
    to_mail = users_email
    send_mail(subject, message[user_type], from_mail, to_mail, fail_silently=False)

class UserInvitation(APIView):
    permission_classes = [InvitationPermission]

    def post(self, request):
        # token = get_random_string(length=32)
        # data = {
        #     'email': request.data.get('email'),
        #     'type': request.data.get('type'),
        #     'related_id': request.data.get('related_id'),
        #     'token': token
        # }
        # serializer = InvitedUserSerializer(data=data)
        # if serializer.is_valid():
        #     serializer.save(token=token)
        #     subject = 'Please Accept Your Invitation'
        #     host = settings.ALLOWED_HOSTS[0]
        #     link = 'http://{}/users/registration/{}'.format(host, token)
        #     message = '''
        #         To accept your invitation, go to 
        #         <a href={} target="_blank"> {}</a>
        #         Thank you from {}
        #     '''.format(link, link, host)
        #     from_mail = settings.EMAIL_HOST_USER
        #     to_mail = [data['email']]
        #     send_mail(subject, message, from_mail, to_mail, fail_silently=False)
        #     # return Response({"result": "email sended to invited user"})
        #     return Response({"result": serializer.data})
        # return Response({"result": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        token = get_random_string(length=32)
        required_data = {
            'email': request.data.get('email'),
            'type': request.data.get('type'),
            'related_id': request.data.get('related_id'),
        }
        invitation_serializer = InvitedUserSerializer(data=required_data)
        if not invitation_serializer.is_valid():
            return Response({"result": invitation_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        user_data = {
            'email': invitation_serializer.data['email'],
            'username': token,
            'password': '*'
        }
        if invitation_serializer.data['type'] == 'M':
            manager_data = {
                'user': user_data,
                'groups': [invitation_serializer.data['related_id']],
                'invite_status': 'H',
                'price_per_annotation': 0,
            }
            manager_serializer = ManagerSerializer(data=manager_data)
            if manager_serializer.is_valid():
                manager_serializer.save()
                invited_user = manager_serializer
            else:
                return Response({"result": manager_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        if invitation_serializer.data['type'] == 'A':
            annotator_data = {
                'user': user_data,
                'projects': [invitation_serializer.data['related_id']],
                'invite_status': 'H',
            }
            annotator_serializer = AnnotatorSerializer(data=annotator_data)
            if annotator_serializer.is_valid():
                annotator_serializer.save()
                invited_user = annotator_serializer
            else:
                return Response({"result": annotator_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        send_invitation_email([user_data['email']], token, invitation_serializer.data['type'])
        return Response(invited_user.data)

class CheckInviteValidation(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if 'token' not in request.data:
            return Response({"result": {"token": ["This field is required."]}}, status=status.HTTP_400_BAD_REQUEST)
        token = request.data.get('token')
        invited = get_object_or_404(User, username=token)
        return Response({"result": "valid"})


class UserRegistration(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # if 'token' not in request.data:
        #     return Response({"result": {"token": ["This field is required."]}}, status=status.HTTP_400_BAD_REQUEST)
        # token = request.data.get('token')
        # invited = get_object_or_404(InvitedUser, token=token)
        # user_data = {
        #     'email': invited.email,
        #     'username': request.data.get('username'),
        #     'first_name': request.data.get('first_name') or '',
        #     'last_name': request.data.get('last_name') or '',
        #     'password': request.data.get('password'),
        # }
        # # user_serializer = UserRegistrationSerializer(data=user_data)
        # # if user_serializer.is_valid():
        # #     user_serializer.save()
        # # else:
        # #     return Response({"result": user_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        # if invited.type == 'M':
        #     manager_data = {
        #         'user': user_data,
        #         'groups': [invited.related_id],
        #         # 'company_role',
        #         'invite_status': 'A',
        #         'price_per_annotation': 0,
        #     }
        #     manager_serializer = ManagerSerializer(data=manager_data)
        #     if manager_serializer.is_valid():
        #         registered_user = manager_serializer.save()
        #     else:
        #         return Response({"result": manager_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        # if invited.type == 'A':
        #     annotator_data = {
        #         'user': user_data,
        #         'projects': [invited.related_id],
        #         # 'company_role',
        #         'invite_status': 'A',
        #     }
        #     annotator_serializer = AnnotatorSerializer(data=annotator_data)
        #     if annotator_serializer.is_valid():
        #         registered_user = annotator_serializer.save()
        #     else:
        #         return Response({"result": annotator_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        # token = Token.objects.create(user=registered_user.user)
        # return Response({"key": token.key})
        if 'token' not in request.data:
            return Response({"result": {"token": ["This field is required."]}}, status=status.HTTP_400_BAD_REQUEST)
        if 'username' not in request.data:
            return Response({"result": {"username": ["This field is required."]}}, status=status.HTTP_400_BAD_REQUEST)
        if 'password' not in request.data:
            return Response({"result": {"password": ["This field is required."]}}, status=status.HTTP_400_BAD_REQUEST)
        token = request.data.get('token')
        invited = get_object_or_404(User, username=token)
        invited.username = request.data.get('username')
        invited.first_name = request.data.get('first_name') or ''
        invited.last_name = request.data.get('last_name') or ''
        if hasattr(invited, 'manager'):
            invited.manager.invite_status = 'A'
            invited.manager.save()
        if hasattr(invited, 'annotator'):
            invited.annotator.invite_status = 'A'
            invited.annotator.save()
        invited.set_password(request.data.get('password'))
        invited.save()
        token = Token.objects.create(user=invited)
        update_last_login(None, invited)
        return Response({"key": token.key})