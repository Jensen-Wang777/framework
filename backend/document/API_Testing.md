# API 测试指南

## 🧪 测试工具推荐

### 1. Postman
- **下载地址:** https://www.postman.com/downloads/
- **优点:** 图形界面友好，支持集合管理，环境变量
- **适用场景:** 接口调试、团队协作

### 2. curl 命令行
- **优点:** 轻量级，脚本化，跨平台
- **适用场景:** 快速测试，自动化脚本

### 3. VS Code REST Client 插件
- **优点:** 在编辑器中直接测试，支持变量
- **适用场景:** 开发过程中的快速测试

---

## 🔧 环境准备

### 1. 启动后端服务
```bash
cd backend
python manage.py runserver
```
服务地址：http://localhost:8000

### 2. 环境变量设置
```
BASE_URL = http://localhost:8000
API_PREFIX = /api
```

---

## 📋 完整测试流程

### 步骤1：用户注册

**请求:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser001",
    "email": "testuser001@example.com",
    "password": "password123"
  }'
```

**预期响应:**
```json
{
    "message": "注册成功",
    "user": {
        "id": 1,
        "username": "testuser001",
        "email": "testuser001@example.com"
    }
}
```

**状态码:** 201 Created

---

### 步骤2：用户登录

**请求:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser001",
    "password": "password123"
  }'
```

**预期响应:**
```json
{
    "message": "登录成功",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InRlc3R1c2VyMDAxIiwiZXhwIjoxNzA2NzgxNjAwfQ.example_token_signature",
    "user": {
        "id": 1,
        "username": "testuser001",
        "email": "testuser001@example.com",
        "first_name": "",
        "last_name": ""
    }
}
```

**状态码:** 200 OK

**重要:** 保存返回的 `token`，后续请求需要使用！

---

### 步骤3：获取用户资料

**请求:**
```bash
curl -X GET http://localhost:8000/api/users/profile/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**预期响应:**
```json
{
    "user": {
        "id": 1,
        "username": "testuser001",
        "email": "testuser001@example.com",
        "first_name": "",
        "last_name": "",
        "date_joined": "2024-01-01T10:00:00Z",
        "profile": {
            "avatar": null,
            "phone": null,
            "birth_date": null,
            "gender": null,
            "bio": null,
            "created_at": "2024-01-01T10:00:00Z",
            "updated_at": "2024-01-01T10:00:00Z"
        }
    }
}
```

**状态码:** 200 OK

---

### 步骤4：更新用户资料

**请求:**
```bash
curl -X PUT http://localhost:8000/api/users/profile/update/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "张",
    "last_name": "三",
    "email": "zhangsan@example.com",
    "profile": {
        "phone": "13800138000",
        "birth_date": "1990-01-01",
        "gender": "male",
        "bio": "这是我的个人简介"
    }
  }'
```

**预期响应:**
```json
{
    "message": "用户资料更新成功",
    "user": {
        "id": 1,
        "username": "testuser001",
        "email": "zhangsan@example.com",
        "first_name": "张",
        "last_name": "三",
        "date_joined": "2024-01-01T10:00:00Z",
        "profile": {
            "avatar": null,
            "phone": "13800138000",
            "birth_date": "1990-01-01",
            "gender": "male",
            "bio": "这是我的个人简介",
            "created_at": "2024-01-01T10:00:00Z",
            "updated_at": "2024-01-01T12:00:00Z"
        }
    }
}
```

**状态码:** 200 OK

---

### 步骤5：修改密码

**请求:**
```bash
curl -X POST http://localhost:8000/api/users/change-password/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "password123",
    "new_password": "newpassword456"
  }'
```

**预期响应:**
```json
{
    "message": "密码修改成功"
}
```

**状态码:** 200 OK

---

### 步骤6：用户登出

**请求:**
```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**预期响应:**
```json
{
    "message": "登出成功"
}
```

**状态码:** 200 OK

---

## ❌ 错误场景测试

### 1. 注册错误测试

**用户名已存在:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser001",
    "email": "another@example.com",
    "password": "password123"
  }'
```

**预期响应:** 400 Bad Request
```json
{
    "error": "用户名已存在"
}
```

**邮箱格式错误:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "invalid-email",
    "password": "password123"
  }'
```

**预期响应:** 400 Bad Request
```json
{
    "error": "注册失败，请检查输入信息"
}
```

### 2. 登录错误测试

**用户名或密码错误:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser001",
    "password": "wrongpassword"
  }'
```

**预期响应:** 401 Unauthorized
```json
{
    "error": "用户名或密码错误"
}
```

### 3. Token 验证错误测试

**无效 Token:**
```bash
curl -X GET http://localhost:8000/api/users/profile/ \
  -H "Authorization: Bearer invalid_token"
```

**预期响应:** 401 Unauthorized
```json
{
    "error": "无效的token"
}
```

**缺少 Token:**
```bash
curl -X GET http://localhost:8000/api/users/profile/
```

**预期响应:** 401 Unauthorized

---

## 📦 Postman 测试集合

### 导入 Postman 集合

创建一个名为 `Django_Vue_Framework.postman_collection.json` 的文件：

```json
{
    "info": {
        "name": "Django Vue Framework API",
        "description": "Django + Vue 万能框架 API 测试集合",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {
            "key": "base_url",
            "value": "http://localhost:8000",
            "type": "string"
        },
        {
            "key": "token",
            "value": "",
            "type": "string"
        }
    ],
    "item": [
        {
            "name": "认证接口",
            "item": [
                {
                    "name": "用户注册",
                    "request": {
                        "method": "POST",
                        "header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"username\": \"testuser001\",\n    \"email\": \"testuser001@example.com\",\n    \"password\": \"password123\"\n}"
                        },
                        "url": {
                            "raw": "{{base_url}}/api/auth/register/",
                            "host": ["{{base_url}}"],
                            "path": ["api", "auth", "register", ""]
                        }
                    }
                },
                {
                    "name": "用户登录",
                    "request": {
                        "method": "POST",
                        "header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"username\": \"testuser001\",\n    \"password\": \"password123\"\n}"
                        },
                        "url": {
                            "raw": "{{base_url}}/api/auth/login/",
                            "host": ["{{base_url}}"],
                            "path": ["api", "auth", "login", ""]
                        }
                    },
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "if (pm.response.code === 200) {",
                                    "    const response = pm.response.json();",
                                    "    pm.collectionVariables.set('token', response.token);",
                                    "}"
                                ]
                            }
                        }
                    ]
                },
                {
                    "name": "用户登出",
                    "request": {
                        "method": "POST",
                        "header": [
                            {
                                "key": "Authorization",
                                "value": "Bearer {{token}}"
                            }
                        ],
                        "url": {
                            "raw": "{{base_url}}/api/auth/logout/",
                            "host": ["{{base_url}}"],
                            "path": ["api", "auth", "logout", ""]
                        }
                    }
                }
            ]
        },
        {
            "name": "用户管理接口",
            "item": [
                {
                    "name": "获取用户资料",
                    "request": {
                        "method": "GET",
                        "header": [
                            {
                                "key": "Authorization",
                                "value": "Bearer {{token}}"
                            }
                        ],
                        "url": {
                            "raw": "{{base_url}}/api/users/profile/",
                            "host": ["{{base_url}}"],
                            "path": ["api", "users", "profile", ""]
                        }
                    }
                },
                {
                    "name": "更新用户资料",
                    "request": {
                        "method": "PUT",
                        "header": [
                            {
                                "key": "Authorization",
                                "value": "Bearer {{token}}"
                            },
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"first_name\": \"张\",\n    \"last_name\": \"三\",\n    \"email\": \"zhangsan@example.com\",\n    \"profile\": {\n        \"phone\": \"13800138000\",\n        \"birth_date\": \"1990-01-01\",\n        \"gender\": \"male\",\n        \"bio\": \"这是我的个人简介\"\n    }\n}"
                        },
                        "url": {
                            "raw": "{{base_url}}/api/users/profile/update/",
                            "host": ["{{base_url}}"],
                            "path": ["api", "users", "profile", "update", ""]
                        }
                    }
                },
                {
                    "name": "修改密码",
                    "request": {
                        "method": "POST",
                        "header": [
                            {
                                "key": "Authorization",
                                "value": "Bearer {{token}}"
                            },
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"old_password\": \"password123\",\n    \"new_password\": \"newpassword456\"\n}"
                        },
                        "url": {
                            "raw": "{{base_url}}/api/users/change-password/",
                            "host": ["{{base_url}}"],
                            "path": ["api", "users", "change-password", ""]
                        }
                    }
                }
            ]
        }
    ]
}
```

### 使用步骤

1. **导入集合**
   - 打开 Postman
   - 点击 Import
   - 选择上面的 JSON 文件

2. **设置环境变量**
   - base_url: `http://localhost:8000`
   - token: 登录后自动设置

3. **测试流程**
   - 先执行"用户注册"
   - 再执行"用户登录"（会自动保存token）
   - 执行其他需要认证的接口

---

## 🔍 调试技巧

### 1. 查看 Django 日志
```bash
# 在 backend 目录下启动服务时查看详细日志
python manage.py runserver --verbosity=2
```

### 2. 检查数据库数据
```bash
# 进入 Django shell
python manage.py shell

# 查看用户数据
from django.contrib.auth.models import User
from apps.users.models import UserProfile

users = User.objects.all()
for user in users:
    print(f"用户: {user.username}, 邮箱: {user.email}")

profiles = UserProfile.objects.all()
for profile in profiles:
    print(f"用户资料: {profile.user.username}, 手机: {profile.phone}")
```

### 3. 常见问题排查

**问题1: CORS 错误**
- 检查 `settings.py` 中的 CORS 配置
- 确认前端地址在 `CORS_ALLOWED_ORIGINS` 中

**问题2: Token 验证失败**
- 检查 Token 格式：`Bearer <token>`
- 确认 Token 未过期（1小时有效期）
- 检查 JWT 密钥配置

**问题3: 数据库连接错误**
- 检查 MySQL 服务是否启动
- 确认数据库配置正确
- 检查数据库用户权限

---

## 📊 性能测试

### 使用 Apache Bench (ab) 进行压力测试

```bash
# 测试登录接口性能
ab -n 100 -c 10 -p login_data.json -T application/json http://localhost:8000/api/auth/login/

# login_data.json 内容:
# {"username": "testuser001", "password": "password123"}
```

### 使用 curl 测试响应时间

```bash
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/api/users/profile/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# curl-format.txt 内容:
#      time_namelookup:  %{time_namelookup}\n
#         time_connect:  %{time_connect}\n
#      time_appconnect:  %{time_appconnect}\n
#     time_pretransfer:  %{time_pretransfer}\n
#        time_redirect:  %{time_redirect}\n
#   time_starttransfer:  %{time_starttransfer}\n
#                      ----------\n
#           time_total:  %{time_total}\n
```