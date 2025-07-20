# Django + Vue 万能框架

这是一个基于Django后端和Vue前端的万能框架，提供用户认证和用户信息管理功能，方便快速开发其他项目。

## 项目结构

```
框架/
├── backend/                 # Django后端
│   ├── config/             # Django项目配置
│   │   ├── __init__.py
│   │   ├── settings.py     # 项目设置
│   │   ├── urls.py         # URL路由配置
│   │   └── wsgi.py         # WSGI配置
│   ├── apps/               # 应用程序
│   │   ├── authentication/ # 用户认证应用
│   │   │   ├── __init__.py
│   │   │   ├── apps.py
│   │   │   ├── views.py    # 注册、登录、登出视图
│   │   │   └── urls.py
│   │   └── users/          # 用户管理应用
│   │       ├── __init__.py
│   │       ├── apps.py
│   │       ├── models.py   # 用户扩展模型
│   │       ├── serializers.py # 序列化器
│   │       ├── views.py    # 用户资料管理视图
│   │       ├── urls.py
│   │       └── admin.py
│   ├── manage.py           # Django管理脚本
│   └── requirements.txt    # Python依赖
├── fronted/                # Vue前端
│   ├── src/
│   │   ├── views/          # 页面组件
│   │   │   ├── LoginView.vue    # 登录页面
│   │   │   ├── RegisterView.vue # 注册页面
│   │   │   └── ProfileView.vue  # 用户信息管理页面
│   │   ├── stores/         # Pinia状态管理
│   │   │   └── counter.ts  # 用户状态管理
│   │   ├── services/       # API服务
│   │   │   └── api.ts      # HTTP请求封装
│   │   ├── router/         # 路由配置
│   │   │   └── index.ts
│   │   ├── App.vue         # 根组件
│   │   └── main.ts         # 入口文件
│   ├── package.json        # 前端依赖
│   └── ...
└── README.md               # 项目说明
```

## 技术栈

### 后端
- **Django 4.2.0** - Web框架
- **Django REST Framework** - API框架
- **MySQL** - 数据库
- **JWT** - 身份认证
- **django-cors-headers** - 跨域处理

### 前端
- **Vue 3** - 前端框架
- **TypeScript** - 类型支持
- **Vue Router** - 路由管理
- **Pinia** - 状态管理
- **Element Plus** - UI组件库
- **Axios** - HTTP客户端

## 功能特性

### 用户认证
- ✅ 用户注册
- ✅ 用户登录
- ✅ JWT Token认证
- ✅ 自动登出（Token过期）

### 用户管理
- ✅ 用户资料查看
- ✅ 用户资料编辑
- ✅ 密码修改
- ✅ 用户扩展信息（头像、手机、生日、性别、简介）

### 前端特性
- ✅ 响应式设计
- ✅ 路由守卫
- ✅ 表单验证
- ✅ 错误处理
- ✅ 加载状态
- ✅ 美观的UI界面

## 快速开始

### 后端设置

1. **创建虚拟环境**
```bash
cd backend
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
编辑 `backend/config/settings.py` 中的数据库配置：
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_database_name',
        'USER': 'your_username',
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

5. **创建超级用户（可选）**
```bash
python manage.py createsuperuser
```

6. **启动开发服务器**
```bash
python manage.py runserver
```

后端服务将在 `http://localhost:8000` 运行

### 前端设置

1. **安装依赖**
```bash
cd fronted
npm install
```

2. **启动开发服务器**
```bash
npm run dev
```

前端应用将在 `http://localhost:5173` 运行

## API接口

### 认证接口
- `POST /api/auth/register/` - 用户注册
- `POST /api/auth/login/` - 用户登录
- `POST /api/auth/logout/` - 用户登出

### 用户接口
- `GET /api/users/profile/` - 获取用户资料
- `PUT /api/users/profile/update/` - 更新用户资料
- `POST /api/users/change-password/` - 修改密码

## 页面路由

- `/` - 重定向到登录页
- `/login` - 登录页面
- `/register` - 注册页面
- `/profile` - 用户信息管理页面（需要登录）

## 开发说明

### 添加新功能
1. 后端：在 `backend/apps/` 下创建新的Django应用
2. 前端：在 `fronted/src/views/` 下创建新的Vue页面组件
3. 更新路由配置和API接口

### 自定义配置
- 修改 `backend/config/settings.py` 进行后端配置
- 修改 `fronted/src/services/api.ts` 调整API基础URL
- 修改 `fronted/src/router/index.ts` 配置路由

## 部署建议

### 后端部署
- 使用 Gunicorn + Nginx
- 配置静态文件服务
- 使用环境变量管理敏感配置

### 前端部署
- 运行 `npm run build` 构建生产版本
- 将 `dist` 目录部署到Web服务器
- 配置反向代理到后端API

## 许可证

MIT License
