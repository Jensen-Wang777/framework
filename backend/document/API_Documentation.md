# Django 后端 API 接口文档

## 基础信息

- **Base URL:** `http://localhost:8000`
- **API 前缀:** `/api`
- **认证方式:** JWT Token
- **数据格式:** JSON
- **字符编码:** UTF-8

## 认证说明

### JWT Token 使用方式
```
Authorization: Bearer <your_jwt_token>
```

### Token 获取
通过登录接口获取，有效期为1小时（3600秒）

---

## 🔐 认证模块 API

### 1. 用户注册

**接口地址:** `POST /api/auth/register/`

**请求参数:**
```json
{
    "username": "string",     // 用户名，3-20字符，必填
    "email": "string",        // 邮箱地址，必填
    "password": "string"      // 密码，最少6字符，必填
}
```

**请求示例:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "123456"
  }'
```

**成功响应:** `201 Created`
```json
{
    "message": "注册成功",
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com"
    }
}
```

**错误响应:** `400 Bad Request`
```json
{
    "error": "用户名已存在"
}
```

**可能的错误信息:**
- `用户名、邮箱和密码都是必填项`
- `用户名已存在`
- `邮箱已被注册`
- `注册失败，请检查输入信息`

---

### 2. 用户登录

**接口地址:** `POST /api/auth/login/`

**请求参数:**
```json
{
    "username": "string",     // 用户名，必填
    "password": "string"      // 密码，必填
}
```

**请求示例:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456"
  }'
```

**成功响应:** `200 OK`
```json
{
    "message": "登录成功",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "first_name": "",
        "last_name": ""
    }
}
```

**错误响应:** `401 Unauthorized`
```json
{
    "error": "用户名或密码错误"
}
```

**可能的错误信息:**
- `用户名和密码都是必填项`
- `用户名或密码错误`

---

### 3. 用户登出

**接口地址:** `POST /api/auth/logout/`

**请求头:**
```
Authorization: Bearer <your_jwt_token>
```

**请求示例:**
```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Authorization: Bearer <your_jwt_token>"
```

**成功响应:** `200 OK`
```json
{
    "message": "登出成功"
}
```

---

## 👤 用户管理模块 API

### 1. 获取用户资料

**接口地址:** `GET /api/users/profile/`

**请求头:**
```
Authorization: Bearer <your_jwt_token>
```

**请求示例:**
```bash
curl -X GET http://localhost:8000/api/users/profile/ \
  -H "Authorization: Bearer <your_jwt_token>"
```

**成功响应:** `200 OK`
```json
{
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
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
            "updated_at": "2024-01-01T10:00:00Z"
        }
    }
}
```

**错误响应:** `401 Unauthorized`
```json
{
    "error": "无效的token"
}
```

---

### 2. 更新用户资料

**接口地址:** `PUT /api/users/profile/update/`

**请求头:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**请求参数:**
```json
{
    "first_name": "string",      // 姓，可选
    "last_name": "string",       // 名，可选
    "email": "string",           // 邮箱，可选
    "profile": {                 // 扩展资料，可选
        "phone": "string",       // 手机号，可选
        "birth_date": "string",  // 生日，格式：YYYY-MM-DD，可选
        "gender": "string",      // 性别：male/female/other，可选
        "bio": "string"          // 个人简介，可选
    }
}
```

**请求示例:**
```bash
curl -X PUT http://localhost:8000/api/users/profile/update/ \
  -H "Authorization: Bearer <your_jwt_token>" \
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

**成功响应:** `200 OK`
```json
{
    "message": "用户资料更新成功",
    "user": {
        "id": 1,
        "username": "testuser",
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

**错误响应:** `400 Bad Request`
```json
{
    "error": "数据验证失败",
    "details": {
        "email": ["请输入正确的邮箱地址"]
    }
}
```

---

### 3. 修改密码

**接口地址:** `POST /api/users/change-password/`

**请求头:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**请求参数:**
```json
{
    "old_password": "string",    // 当前密码，必填
    "new_password": "string"     // 新密码，最少6字符，必填
}
```

**请求示例:**
```bash
curl -X POST http://localhost:8000/api/users/change-password/ \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "123456",
    "new_password": "newpassword123"
  }'
```

**成功响应:** `200 OK`
```json
{
    "message": "密码修改成功"
}
```

**错误响应:** `400 Bad Request`
```json
{
    "error": "旧密码错误"
}
```

**可能的错误信息:**
- `旧密码和新密码都是必填项`
- `旧密码错误`
- `修改密码失败`

---

## 📋 HTTP 状态码说明

| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 201 | Created | 创建成功（注册） |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权（Token无效/过期） |
| 404 | Not Found | 接口不存在 |
| 500 | Internal Server Error | 服务器内部错误 |

---

## 🔧 数据模型说明

### User 模型（Django内置）
```python
{
    "id": "integer",              // 用户ID
    "username": "string",         // 用户名，唯一
    "email": "string",            // 邮箱地址
    "first_name": "string",       // 姓
    "last_name": "string",        // 名
    "date_joined": "datetime",    // 注册时间
    "is_active": "boolean",       // 是否激活
    "is_staff": "boolean",        // 是否为管理员
    "is_superuser": "boolean"     // 是否为超级用户
}
```

### UserProfile 模型（自定义扩展）
```python
{
    "avatar": "string",           // 头像URL，可为null
    "phone": "string",            // 手机号，可为null
    "birth_date": "date",         // 生日，格式：YYYY-MM-DD，可为null
    "gender": "string",           // 性别：male/female/other，可为null
    "bio": "string",              // 个人简介，最多500字符，可为null
    "created_at": "datetime",     // 创建时间
    "updated_at": "datetime"      // 更新时间
}
```

---

## 🧪 测试用例

### Postman 测试集合

1. **注册用户**
   - Method: POST
   - URL: `{{base_url}}/api/auth/register/`
   - Body: 见注册接口示例

2. **用户登录**
   - Method: POST
   - URL: `{{base_url}}/api/auth/login/`
   - Body: 见登录接口示例

3. **获取用户资料**
   - Method: GET
   - URL: `{{base_url}}/api/users/profile/`
   - Headers: `Authorization: Bearer {{token}}`

4. **更新用户资料**
   - Method: PUT
   - URL: `{{base_url}}/api/users/profile/update/`
   - Headers: `Authorization: Bearer {{token}}`
   - Body: 见更新接口示例

5. **修改密码**
   - Method: POST
   - URL: `{{base_url}}/api/users/change-password/`
   - Headers: `Authorization: Bearer {{token}}`
   - Body: 见修改密码接口示例

### 环境变量
```
base_url: http://localhost:8000
token: <从登录接口获取的JWT Token>
```

---

## 📝 注意事项

1. **Token 管理**
   - Token 有效期为1小时
   - Token 过期后需要重新登录
   - 前端应处理Token过期的情况

2. **数据验证**
   - 用户名：3-20字符，字母数字下划线
   - 邮箱：标准邮箱格式
   - 密码：6-30字符，只能包含字母和数字
   - 手机号：中国大陆手机号格式

3. **安全考虑**
   - 所有敏感操作需要Token验证
   - 密码使用PBKDF2加密存储
   - 支持CORS跨域请求

4. **错误处理**
   - 统一的错误响应格式
   - 详细的错误信息提示
   - 适当的HTTP状态码