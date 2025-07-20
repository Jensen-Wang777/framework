# Vue 前端通用框架

这是一个基于 Vue 3 + TypeScript 的前后端分离通用框架的前端部分，采用 Element Plus 作为 UI 组件库，具有登录、注册、用户信息管理等功能。

## 项目特点

- **Vue 3 + TypeScript + Vite**：采用最新的前端技术栈
- **Pinia 状态管理**：轻量且高效的状态管理
- **Element Plus 组件库**：美观且功能丰富的 UI 组件
- **Axios 封装**：统一的请求处理和错误处理
- **前后端分离**：与 Django 后端 RESTful API 交互
- **响应式设计**：适配不同屏幕大小
- **权限管理**：基于 JWT 的登录验证与授权

## 功能模块

1. **用户认证**
   - 用户注册
   - 用户登录
   - 密码重置
   - 记住登录状态
   - 社交媒体登录（开发中）

2. **用户信息管理**
   - 个人资料查看与修改
   - 头像上传
   - 密码修改
   - 账号安全设置

## 项目结构

```
fronted/
├── src/                        # 源代码目录
│   ├── assets/                 # 静态资源
│   ├── components/             # 通用组件
│   ├── composables/            # 组合式函数
│   ├── router/                 # 路由配置
│   ├── services/               # API 服务
│   ├── stores/                 # Pinia 状态管理
│   ├── views/                  # 页面组件
│   │   ├── LoginView.vue       # 登录页面
│   │   ├── RegisterView.vue    # 注册页面
│   │   ├── ProfileView.vue     # 用户信息管理
│   │   └── ...                 # 其他页面
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 入口文件
├── public/                     # 公共资源
├── index.html                  # HTML 入口
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # TypeScript 配置
├── package.json                # 项目依赖
└── README.md                   # 项目说明
```

## 安装与运行

1. 安装依赖
```bash
npm install
```

2. 开发环境运行
```bash
npm run dev
```

3. 生产环境构建
```bash
npm run build
```

## 接口说明

与后端 Django REST API 通信，主要接口包括：

- `/api/auth/register/` - 用户注册
- `/api/auth/login/` - 用户登录
- `/api/auth/logout/` - 用户登出
- `/api/auth/reset-password/` - 密码重置
- `/api/users/profile/` - 获取用户信息
- `/api/users/profile/update/` - 更新用户信息
- `/api/users/change-password/` - 修改密码

## 配置说明

环境变量配置（`.env` 文件）：

```
VITE_API_BASE_URL=http://localhost:8000/api
```

## 后续开发计划

1. 完善社交媒体登录功能
2. 添加多语言支持
3. 实现暗黑模式
4. 优化移动端体验
5. 集成更多后台管理功能

## 开发须知

- 请遵循项目的代码规范和命名约定
- 提交前运行测试确保功能正常
- 新增功能请先创建分支，开发完成后提交 PR
