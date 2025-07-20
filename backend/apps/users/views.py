from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer, UserUpdateSerializer
from .models import UserProfile
import jwt
from django.conf import settings


def get_user_from_token(request):
    """从JWT token中获取用户"""
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return None

        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get('user_id')
        return User.objects.get(id=user_id)
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
        return None


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """获取用户资料"""
    try:
        user = get_user_from_token(request)
        if not user:
            return Response({
                'error': '无效的token'
            }, status=status.HTTP_401_UNAUTHORIZED)

        # 确保用户有profile
        profile, created = UserProfile.objects.get_or_create(user=user)

        serializer = UserSerializer(user)
        return Response({
            'user': serializer.data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'error': f'获取用户资料失败: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """更新用户资料"""
    try:
        user = get_user_from_token(request)
        if not user:
            return Response({
                'error': '无效的token'
            }, status=status.HTTP_401_UNAUTHORIZED)

        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            # 返回更新后的用户信息
            updated_user = User.objects.get(id=user.id)
            user_serializer = UserSerializer(updated_user)

            return Response({
                'message': '用户资料更新成功',
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': '数据验证失败',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            'error': f'更新用户资料失败: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """修改密码"""
    try:
        user = get_user_from_token(request)
        if not user:
            return Response({
                'error': '无效的token'
            }, status=status.HTTP_401_UNAUTHORIZED)

        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not all([old_password, new_password]):
            return Response({
                'error': '旧密码和新密码都是必填项'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 验证旧密码
        if not user.check_password(old_password):
            return Response({
                'error': '旧密码错误'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 设置新密码
        user.set_password(new_password)
        user.save()

        return Response({
            'message': '密码修改成功'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'error': f'修改密码失败: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)