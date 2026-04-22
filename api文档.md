# API 文档

## 基础信息

- 前端地址：`http://localhost:5173`
- 后端地址：`http://localhost:8088`

## 1. 登录

- 请求方法：`POST`
- 相对路径：`/api/login`
- 请求类型：`application/json`

### 请求参数

| 字段名 | 类型 | 说明 |
|---|---|---|
| email | string | 用户邮箱 |
| password | string | 用户密码 |

### 请求 JSON 结构

```json
{
  "email": "",
  "password": ""
}
```

### 响应参数

| 字段名 | 类型 | 说明 |
|---|---|---|
| AuthResp | object | 登录接口响应对象 |

### 响应 JSON 结构

```json
{
  "token": "",
  "msg": null,
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "role": "",
    "status": "",
    "created_at": "",
    "updated_at": ""
  }
}
```

### AuthResp 对象结构

| 字段名 | 类型 | 说明 |
|---|---|---|
| token | string \| null | 登录成功时返回的身份令牌 |
| msg | string \| null | 附加提示信息，登录成功时通常为 `null` |
| user | object \| null | 当前登录用户信息，登录成功时返回 |

### AuthResp.user 对象结构

| 字段名 | 类型 | 说明 |
|---|---|---|
| id | integer | 用户 ID |
| name | string | 用户姓名 |
| email | string | 用户邮箱 |
| role | integer | 用户角色 |
| status | integer | 用户状态 |
| created_at | string | 创建时间，datetime |
| updated_at | string | 更新时间，datetime |

## 2. 注册

- 请求方法：`POST`
- 相对路径：`/api/register`
- 请求类型：`application/json`

### 请求参数

| 字段名 | 类型 | 说明 |
|---|---|---|
| name | string | 用户姓名 |
| email | string | 用户邮箱 |
| password | string | 用户密码 |
| role     | integer | 用户角色 |

### 请求 JSON 结构

```json
{
  "name": "",
  "email": "",
  "password": "",
  "role": ""
}
```

### 响应参数

| 字段名 | 类型 | 说明 |
|---|---|---|
| AuthResp | object | 注册接口响应对象 |

### 响应 JSON 结构

```json
{
  "token": "",
  "msg": null,
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "role": "",
    "status": "",
    "created_at": "",
    "updated_at": ""
  }
}
```

### 邮箱已注册时的响应 JSON 示例

```json
{
  "token": null,
  "msg": "This email has been registered.",
  "user": null
}
```

### AuthResp 对象结构

| 字段名 | 类型 | 说明 |
|---|---|---|
| token | string \| null | 注册成功时返回的身份令牌；邮箱已存在时为 `null` |
| msg | string \| null | 附加提示信息；邮箱已存在时返回 `This email has been registered.` |
| user | object \| null | 注册成功后的用户信息；邮箱已存在时为 `null` |

### AuthResp.user 对象结构

| 字段名 | 类型 | 说明 |
|---|---|---|
| id | integer | 用户 ID |
| name | string | 用户姓名 |
| email | string | 用户邮箱 |
| role | integer | 用户角色 |
| status | integer | 用户状态 |
| created_at | string | 创建时间，datetime |
| updated_at | string | 更新时间，datetime |
