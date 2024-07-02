from api.models import *
import csv

for i in range(2021, 2022):
    csv_path = f'utility/csv_files/{i}-{i + 1}.csv'
    with open(csv_path, 'r') as file:
        reader = csv.reader(file)
        header = next(reader)
        
        for std_info in reader:
            if len(std_info):
                for i in range(0, 5):
                    if header[i] == 'Name of Student':
                        name = std_info[i]
                    if header[i] == "Mother's Name":
                        mother_name = std_info[i]
                    if header[i] == "Father's Name":
                        father_name = std_info[i]
                    if header[i] == "College Name":
                        college_name = std_info[i]
                    if header[i] == "Registration No.":
                        reg_no = int(std_info[i])
                session = int(reg_no / 1000000000) + 2000
                college_code = int(college_name.split('[')[1].split(']')[0])
                print(name, father_name, mother_name, college_name, reg_no, session, college_code)
                if Student.objects.filter(reg_no=reg_no).exists() is False:
                    instance = Student.objects.create(name=name, father_name=father_name, mother_name=mother_name, college_name=college_name, reg_no=reg_no, session=session, college_code=college_code)
                    for i in range(5, len(std_info)):
                        code = int(header[i])
                        subject_grades = SubjectGrade.objects.filter(subject__code=code)
                        subject_grade = subject_grades.get(grade=std_info[i])
                        if subject_grade is not None:
                            instance.subject_grades.add(subject_grade)
                        else:
                            raise(f"Subject {code} not Found in DB")
                        # print(subject_grade)   
                        # for subject in subject_grade:
                        #     print(header, subject)
                    instance.update_gpa()
                    instance.save()