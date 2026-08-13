from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'age', 'gender', 'phone_number', 'created_at')
    search_fields = ('email', 'full_name', 'phone_number')