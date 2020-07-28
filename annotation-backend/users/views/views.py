from rest_framework.response import Response
from rest_framework import status, generics, viewsets, views
from django_filters.rest_framework import DjangoFilterBackend
from users.models import Manager, Annotator, get_user_type
from django.contrib.auth.models import User, Group
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from users.serializers import (
    UserSerializer,
    ManagerSerializer,
    AnnotatorSerializer,
    ChangePasswordSerializer,
    UserProfileSerializer
)

# class UserViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows users to be viewed or edited.
#     """
#     queryset = User.objects.all().order_by('-date_joined')
#     serializer_class = UserSerializer


class UserDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]


class ChangePassword(views.APIView):
    queryset = User.objects.all()
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            old_password = serializer.data.get("oldPassword")
            if not self.object.check_password(old_password):
                return Response({"oldPassword": ["Wrong password."]}, 
                                status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("newPassword"))
            self.object.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ManagerList(generics.ListCreateAPIView):
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer
    permission_classes = [IsAdminUser]
    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = ['groups']

    # def create(self, request):
    #     user = request.data.pop('user')
    #     user = User.objects.create(**user)
    #     manager = Manager.objects.create(**request.data, user=user)
    #     return Response(ManagerSerializer(manager).data, status=status.HTTP_201_CREATED)


class ManagerDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer
    permission_classes = [IsAdminUser]



class AnnotatorList(generics.ListCreateAPIView):
    queryset = Annotator.objects.all()
    serializer_class = AnnotatorSerializer
    permission_classes = [IsAdminUser]


class AnnotatorDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Annotator.objects.all()
    serializer_class = AnnotatorSerializer
    permission_classes = [IsAdminUser]

class UserType(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_type = get_user_type(request.user)
        return Response({'user_type': user_type})