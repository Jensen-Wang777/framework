from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """用户资料序列化器"""
    class Meta:
        model = UserProfile
        fields = ['avatar', 'phone', 'birth_date', 'gender', 'bio', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """用户序列化器"""
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'profile']
        read_only_fields = ['id', 'date_joined']


class UserUpdateSerializer(serializers.ModelSerializer):
    """用户更新序列化器"""
    profile = UserProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'profile']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)

        # 更新用户基本信息
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 更新或创建用户资料
        if profile_data:
            profile, created = UserProfile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance