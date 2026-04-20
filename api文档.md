# API 文档

## 基础信息

- 前端地址：`http://localhost:8000`
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
| AuthRespVO | object | 登录接口响应对象 |

### 响应 JSON 结构

```json
{
  "token": "",
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

### AuthRespVO 对象结构

| 字段名 | 类型 | 说明 |
|---|---|---|
| token | string | 登录后的身份令牌 |
| user | object | 当前登录用户信息 |

### AuthRespVO.user 对象结构

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

### 请求 JSON 结构

```json
{
  "name": "",
  "email": "",
  "password": ""
}
```

### 响应参数

| 字段名 | 类型 | 说明 |
|---|---|---|
| AuthRespVO | object | 注册接口响应对象 |

### 响应 JSON 结构

```json
{
  "token": "",
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

### AuthRespVO 对象结构

| 字段名 | 类型 | 说明 |
|---|---|---|
| token | string | 注册成功后的身份令牌 |
| user | object | 注册成功后的用户信息 |

### AuthRespVO.user 对象结构

| 字段名 | 类型 | 说明 |
|---|---|---|
| id | integer | 用户 ID |
| name | string | 用户姓名 |
| email | string | 用户邮箱 |
| role | integer | 用户角色 |
| status | integer | 用户状态 |
| created_at | string | 创建时间，datetime |
| updated_at | string | 更新时间，datetime |
