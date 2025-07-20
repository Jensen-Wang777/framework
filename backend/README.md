# Django 后端通用框架

这是一个基于 Django 和 Django REST framework 的后端通用框架，提供完整的用户认证和用户信息管理 RESTful API，使用 MySQL 作为数据库。

## 核心特点

- **Django & Django REST Framework**：强大的 Python Web 框架
- **JWT 认证**：安全的身份验证机制
- **MySQL 数据库**：高性能关系型数据库
- **模块化设计**：清晰的代码组织结构
- **RESTful API**：标准的 API 设计
- **完整的用户系统**：包含注册、登录、资料管理等功能
- **权限控制**：基于角色的访问控制

## 项目结构

```
backend/
├── config/                     # Django 项目配置
│   ├── settings.py             # 项目设置
│   ├── urls.py                 # URL 路由
│   └── ...                     # 其他配置
├── apps/                       # 应用程序
│   ├── users/                  # 用户管理应用
│   │   ├── models.py           # 用户模型
│   │   ├── serializers.py      # 数据序列化
│   │   ├── views.py            # API 视图
│   │   └── ...                 # 其他文件
│   └── auth/                   # 认证应用
│       ├── views.py            # 认证视图
│       ├── serializers.py      # 认证序列化
│       └── ...                 # 其他文件
├── utils/                      # 工具函数
│   ├── permissions.py          # 自定义权限
│   ├── validators.py           # 数据验证器
│   └── ...                     # 其他工具
└── requirements.txt            # 项目依赖
```

## 安装与运行

1. **创建虚拟环境并激活**
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

2. **安装依赖**
```bash
pip install -r requirements.txt
```

3. **配置数据库**
编辑 `config/settings.py` 文件中的数据库配置：
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'django_vue_db',
        'USER': 'root',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

4. **运行数据库迁移**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **创建超级管理员**
```bash
python manage.py createsuperuser
```

6. **启动开发服务器**
```bash
python manage.py runserver
```

## API 接口

### 用户认证

| 接口 | 方法 | 描述 | 参数 |
| --- | --- | --- | --- |
| `/api/auth/register/` | POST | 用户注册 | username, email, password |
| `/api/auth/login/` | POST | 用户登录 | username, password |
| `/api/auth/logout/` | POST | 用户登出 | token |
| `/api/auth/token/verify/` | POST | 验证 Token 有效性 | token |
| `/api/auth/token/refresh/` | POST | 刷新 Token | refresh |
| `/api/auth/reset-password/` | POST | 请求重置密码 | email |
| `/api/auth/reset-password-confirm/` | POST | 确认重置密码 | token, uid, new_password |

### 用户管理

| 接口 | 方法 | 描述 | 参数 |
| --- | --- | --- | --- |
| `/api/users/profile/` | GET | 获取用户资料 | - |
| `/api/users/profile/update/` | PUT | 更新用户资料 | first_name, last_name, email, profile.* |
| `/api/users/change-password/` | POST | 修改密码 | old_password, new_password |

## 开发指南

### 添加新应用

1. 创建新的应用：
```bash
python manage.py startapp new_app apps/new_app
```

2. 在 `config/settings.py` 中添加应用：
```python
INSTALLED_APPS = [
    # ...
    'apps.new_app',
]
```

### 数据库迁移

每次修改模型后需要进行数据库迁移：
```bash
python manage.py makemigrations
python manage.py migrate
```

### 运行测试

```bash
python manage.py test
```

## 部署指南

### Docker 部署

1. 创建 Dockerfile 和 docker-compose.yml
2. 构建并运行容器：
```bash
docker-compose up -d
```

### 传统部署

1. 配置 WSGI 服务器（如 Gunicorn）
2. 配置 Nginx 作为反向代理
3. 设置 SSL 证书
4. 配置静态文件服务

## 环境变量

可以通过环境变量或 `.env` 文件配置以下设置：

- `DJANGO_SECRET_KEY`: Django 密钥
- `DJANGO_DEBUG`: 是否开启调试模式
- `DATABASE_URL`: 数据库连接 URL
- `ALLOWED_HOSTS`: 允许的主机列表

## 贡献指南

1. Fork 项目并克隆到本地
2. 创建新的功能分支
3. 提交代码并推送到远程
4. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 