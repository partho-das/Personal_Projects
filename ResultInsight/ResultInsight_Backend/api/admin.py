from django.contrib import admin
from .models import *
# Register your models here.

class StudentAdmin(admin.ModelAdmin):
    list_display = ["reg_no", 'name',]
    filter_horizontal = ['subject_grades']
    ordering = ('reg_no', )

admin.site.register(Student, StudentAdmin)
admin.site.register(SubjectGrade)
admin.site.register(Subject)

# admin.site.unregister(User)


class UserAdminR(admin.ModelAdmin):
    list_display = ('id', 'username', 'is_staff')
    list_display_links = ('id', 'username')
    filter_horizontal = ('following',) 
    
    pass
# Register your models here.

admin.site.register(User, UserAdminR)


# admin.site.register(User)
