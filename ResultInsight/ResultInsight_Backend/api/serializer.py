from rest_framework import serializers
from .models import *

class SubjectSerializer(serializers.ModelSerializer):
    average = serializers.SerializerMethodField()
    aplus = serializers.SerializerMethodField()
    failed = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = ['id', 'name', 'code', 'credit', 'semester', 'average', 'aplus', 'failed']
        read_only_fields = ['id', 'average', 'aplus', 'failed']

    def get_average(self, obj):
        return obj.calculate_average_grade()

    def get_aplus(self, obj):
        return obj.count_aplus_grades()

    def get_failed(self, obj):
        return obj.count_failed_grades()
    
class StudentSerializer(serializers.ModelSerializer):
    semester_data = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = ['id', 'name', 'reg_no', 'session', 'gpa', 'semester_data',]
        read_only_fields = ['id', 'name', 'reg_no', 'gpa', 'session', 'semester_data']

    def get_semester_data(self, obj):
        combined_semesters = {}
        
        for semester_number in range(1, 9):  # Assuming semesters are from 1 to 8
            semester_key = f"{semester_number}"
            combined_semesters[semester_key] = obj.calculate_semester_grades(semester_number)
        
        return combined_semesters
    
class SubjectGradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubjectGrade
        fields = ['id', 'subject', 'grade']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'session', 'following']