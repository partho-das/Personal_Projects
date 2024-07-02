from api.models import *
import csv

csv_file_path = 'utility/csv_files/Subject_info.csv'

with open(csv_file_path, 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        if len(row) > 2:
            code = int(row[0])
            name = row[2]
            semester = int(row[1])
            credit = 1.5 if 'LAB' in name else 3.0
            # print(code, name, semester, credit)
            if Subject.objects.filter(code=code).exists() is False:
                Subject.objects.create(name=name, code=code, semester=semester, credit=credit)
                
    for subject in Subject.objects.all():
        for grade in [4.00,3.75,3.50,3.25,3.00,2.75,2.50,2.25,2.00,0.00,-1.00]:
            if SubjectGrade.objects.filter(subject=subject, grade=grade).exists() is False:
                SubjectGrade.objects.create(subject=subject, grade=grade)
