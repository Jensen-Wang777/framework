from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """用户扩展信息"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True, verbose_name='头像')
    phone = models.CharField(max_length=20, null=True, blank=True, verbose_name='手机号')
    birth_date = models.DateField(null=True, blank=True, verbose_name='生日')
    gender = models.CharField(
        max_length=10,
        choices=[('male', '男'), ('female', '女'), ('other', '其他')],
        null=True,
        blank=True,
        verbose_name='性别'
    )
    bio = models.TextField(max_length=500, null=True, blank=True, verbose_name='个人简介')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        verbose_name = '用户资料'
        verbose_name_plural = '用户资料'

    def __str__(self):
        return f'{self.user.username}的资料'