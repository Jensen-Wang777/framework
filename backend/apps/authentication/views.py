from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import IntegrityError
import jwt
from django.conf import settings
from datetime import datetime, timedelta


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """用户注册"""
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not all([username, email, password]):
            return Response({
                'error': '用户名、邮箱和密码都是必填项'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 检查用户名是否已存在
        if User.objects.filter(username=username).exists():
            return Response({
                'error': '用户名已存在'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 检查邮箱是否已存在
        if User.objects.filter(email=email).exists():
            return Response({
                'error': '邮箱已被注册'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 创建用户
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        return Response({
            'message': '注册成功',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)

    except IntegrityError:
        return Response({
            'error': '注册失败，请检查输入信息'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'注册失败: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """用户登录"""
    try:
        username = request.data.get('username')
        password = request.data.get('password')

        if not all([username, password]):
            return Response({
                'error': '用户名和密码都是必填项'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 验证用户
        user = authenticate(username=username, password=password)
        if not user:
            return Response({
                'error': '用户名或密码错误'
            }, status=status.HTTP_401_UNAUTHORIZED)

        # 生成JWT token
        payload = {
            'user_id': user.id,
            'username': user.username,
            'exp': datetime.utcnow() + timedelta(seconds=settings.JWT_EXPIRATION_DELTA)
        }

        token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

        return Response({
            'message': '登录成功',
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'error': f'登录失败: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def logout(request):
    """用户登出"""
    return Response({
        'message': '登出成功'
    }, status=status.HTTP_200_OK)