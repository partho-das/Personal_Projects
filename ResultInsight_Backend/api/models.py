from django.db import models
from django.db.models import Avg, Count, Q
from django.contrib.auth.models import (AbstractUser)


class User(AbstractUser):
    session = models.IntegerField(default=2018)
    following = models.ManyToManyField('Student', related_name='followers', blank=True)

class Student(models.Model):
    name = models.CharField(max_length=50)
    reg_no = models.IntegerField()
    session = models.IntegerField()
    father_name = models.CharField(max_length=50)
    mother_name = models.CharField(max_length=50)
    college_name = models.CharField(max_length=50)
    college_code = models.IntegerField()
    subject_grades = models.ManyToManyField("SubjectGrade", related_name="students")
    gpa = models.FloatField(default=4)

    def calculate_semester_grades(self, semester):
        subject_grades = self.subject_grades.filter(subject__semester=semester)
        total_credit = 0
        total_weightedsum = 0
        for sg in subject_grades: 
            total_credit += sg.subject.credit
            total_weightedsum += sg.subject.credit * max(sg.grade, float(0))
        if total_credit != 0:
            return {
                'subjects': [{
                    'name': sg.subject.name,
                    'code': sg.subject.code,
                    'grade': sg.grade,
                    'credit': sg.subject.credit,
                } for sg in sorted(subject_grades, key=lambda sg: sg.subject.code)],
                'total_weightedsum' : total_weightedsum,
                'total_credit' : total_credit,
                'cgpa': round(total_weightedsum / total_credit, 2),
            }
        else:
            return None
        
    def update_gpa(self):
        semesters = set(self.subject_grades.values_list('subject__semester', flat=True))
        total_credit_sum = 0
        total_weighted_sum = 0
        for semester in semesters:
            subject_grades = self.subject_grades.filter(subject__semester=semester)
            semester_credit_sum = sum(sg.subject.credit for sg in subject_grades)
            semester_weighted_sum = sum(sg.subject.credit * max(sg.grade, 0.0) for sg in subject_grades)
            total_credit_sum += semester_credit_sum
            total_weighted_sum += semester_weighted_sum

        if total_credit_sum != 0:
            self.gpa = round(total_weighted_sum / total_credit_sum, 2)
        else:
            self.gpa = 0.0
        self.save()

    def __str__(self):
        return self.name

class SubjectGrade(models.Model):
    subject = models.ForeignKey("Subject", on_delete=models.CASCADE, related_name='subject_grades')
    grade = models.FloatField()

    def __str__(self):
        return f"{self.subject.name} - {self.grade}"


class Subject(models.Model):
    name = models.CharField(max_length=50)
    code = models.IntegerField()
    credit = models.FloatField()
    semester = models.IntegerField()

    def __str__(self):
        return f"{self.code}: {self.name}"

    def calculate_average_grade(self):
        total_grades = 0
        total_students = 0
        
        subject_grades = SubjectGrade.objects.filter(subject=self)
        for subject_grade in subject_grades:
            total_students += subject_grade.students.count()
            total_grades += subject_grade.students.count() * max(subject_grade.grade, float(0))
        avg_grade = total_grades / total_students if total_students > 0 else 0
        return round(avg_grade * 4) / 4

    def count_aplus_grades(self):
        return Student.objects.filter(subject_grades__subject=self, subject_grades__grade='4').count()

    def count_failed_grades(self):
        return Student.objects.filter(subject_grades__subject=self, subject_grades__grade='0').count()