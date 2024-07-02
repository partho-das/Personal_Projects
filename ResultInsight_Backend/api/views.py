from .models import *
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import mixins, generics, views, status
from rest_framework_simplejwt.views import TokenRefreshView
from .serializer import StudentSerializer, SubjectSerializer, SubjectGradeSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly


# Create your views here.

def index(request):
    return HttpResponse("Hello World!")



class RegisterView(views.APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        session = request.data.get('session')


        password = request.data.get('password')
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, email=email,session=session, password=password, is_staff = True, is_superuser=True)
        user.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

class LoginView(views.APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
       
        user = authenticate(request, username=username, password=password)
        print(user)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'session': user.session,
                }
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(views.APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class StudentView(generics.GenericAPIView,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.RetrieveModelMixin):
    serializer_class = StudentSerializer
    queryset = Student.objects.all().order_by('-gpa')
    lookup_field = 'reg_no'
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get_queryset(self):
        qs = Student.objects.all().order_by('-gpa')
        if 'session' in self.kwargs:
            qs = qs.filter(session=self.kwargs['session'])
        return qs

    def get(self, request, *args, **kwargs):
        if 'reg_no' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            return self.list(request, *args, **kwargs)


class SubjectView(generics.GenericAPIView,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.RetrieveModelMixin):
    serializer_class = SubjectSerializer
    queryset = Subject.objects.all().order_by('code')
    lookup_field = 'code'
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset()
        if 'session' in self.kwargs:
            session = self.kwargs.get('session')
            qs = Subject.objects.filter(
                subject_grades__students__session=session
            ).distinct().order_by('code')
        return qs

    def get(self, request, *args, **kwargs):
        if 'code' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            return self.list(request, *args, **kwargs)
        
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        grouped_subjects = {}

        # Group subjects by semester
        for subject in queryset:
            semester = subject.semester
            if semester not in grouped_subjects:
                grouped_subjects[semester] = []
            grouped_subjects[semester].append(subject)

        # Serialize grouped subjects
        serialized_data = {semester: self.get_serializer(grouped_subjects[semester], many=True).data
                           for semester in grouped_subjects}
        return Response(serialized_data)
    

class UserView(generics.GenericAPIView,
                        mixins.CreateModelMixin,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.DestroyModelMixin,
                        mixins.ListModelMixin):
    
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    lookup_field = 'pk'
    queryset = User.objects.all()

    def get_queryset(self):
        if 'following' in self.request.path:
            return self.request.user.following.all()
        return User.objects.all()

    def get(self, request, *args, **kwargs):
        if 'profile' in self.request.path:
            user = request.user
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif 'following' in self.request.path:
            return  Response(StudentSerializer(request.user.following.all(), many=True).data, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid Request.'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, *args, **kwargs):
        # print("HI")
        if 'follow-unfollow' in self.request.path:
            student_to_follow = Student.objects.get(reg_no=kwargs['pk'])
            if student_to_follow != self.request.user:
                self.request.user.following.add(student_to_follow)
                return Response({'message': 'Successfully followed the user.'}, status=status.HTTP_200_OK)
            return Response({'message': 'User already followed.'}, status=status.HTTP_400_BAD_REQUEST)

        elif 'update-session' in self.request.path:
            user = self.request.user
            user.session = kwargs['pk']
            user.save()
            return Response({'message': 'Successfully Updated Session.'}, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid Operation.'}, status=status.HTTP_404_BAD_REQUEST)

    
    def delete(self, request, *args, **kwargs):
        student_to_unfollow = Student.objects.get(reg_no=kwargs['pk'])
        if student_to_unfollow != self.request.user:
            self.request.user.following.remove(student_to_unfollow)
            return Response({'message': 'Successfully unfollowed the user.'}, status=status.HTTP_200_OK)
        return Response({'message': 'You cannot unfollow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
    
    