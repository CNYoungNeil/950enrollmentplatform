# Project Structure

本项目当前采用面向后端分层的基础结构，适合课程作业阶段逐步补充业务代码。

## 目录说明

### `app/`

项目主代码目录，后续后端核心代码统一放在这里。

依赖关系说明：
- `main.py` 一般作为项目启动入口，会导入 `app` 下的各层代码
- `app` 下各子目录之间按分层方式依赖，尽量避免反向依赖和循环依赖

### `app/api/`

接口层，也可以理解为控制层。

主要职责：
- 定义接口路由
- 接收前端或测试请求
- 调用 `service` 层处理业务
- 返回响应结果

建议放置内容：
- 学生接口
- 课程接口
- 选课接口

典型依赖：
- 依赖 `schema` 定义请求和响应数据结构
- 依赖 `service` 执行业务逻辑
- 如果使用 `FastAPI`，这里会直接使用 `fastapi`

### `app/service/`

业务逻辑层。

主要职责：
- 编写核心业务规则
- 组织多步操作流程
- 判断选课是否允许执行
- 协调数据库访问层

建议放置内容：
- 学生业务服务
- 课程业务服务
- 选课业务服务

典型依赖：
- 依赖 `repository` 读取和写入数据库
- 依赖 `model` 使用数据库对象
- 必要时可依赖 `schema` 做数据转换

### `app/model/`

数据模型层，主要放数据库模型。

主要职责：
- 定义数据表结构
- 描述学生、课程、选课记录等实体

建议放置内容：
- `student.py`
- `course.py`
- `selection.py`

典型依赖：
- 如果使用 `SQLAlchemy`，这里会直接定义 ORM 模型
- 通常会依赖 `core` 中的数据库基础配置

### `app/schema/`

数据校验和接口收发结构层。

主要职责：
- 定义请求参数结构
- 定义响应结果结构
- 做输入校验和输出序列化

建议放置内容：
- `student_schema.py`
- `course_schema.py`
- `selection_schema.py`

典型依赖：
- 如果使用 `Pydantic`，这里会直接定义 BaseModel 类
- 常被 `api` 层直接使用
- 也可能被 `service` 层用于返回统一数据结构

说明：
- `model` 偏数据库表结构
- `schema` 偏接口输入输出结构
- 两者用途不同，建议分开

### `app/repository/`

数据访问层，作用类似 Java 项目中的 `mapper` 或 `dao`。

主要职责：
- 查询数据库
- 插入数据
- 更新数据
- 删除数据

建议放置内容：
- `student_repository.py`
- `course_repository.py`
- `selection_repository.py`

典型依赖：
- 依赖 `model` 中定义的数据库模型
- 依赖 `core` 中的数据库连接或 session 管理
- 通常被 `service` 层调用，不建议直接暴露给 `api`

### `app/core/`

核心基础层，放全项目通用的底层配置。

主要职责：
- 配置管理
- 数据库连接初始化
- 全局常量
- 通用基础组件

建议放置内容：
- `config.py`
- `database.py`
- `constants.py`

典型依赖：
- 会被 `model`、`repository`、`service` 等多层共同依赖
- 如果使用 `SQLAlchemy`，数据库引擎、Session 通常放在这里

### `app/utils/`

工具层，放与具体业务无强绑定的公共方法。

主要职责：
- 通用格式处理
- 时间处理
- 字符串处理
- 公共辅助函数

建议放置内容：
- `common.py`
- `time_util.py`

典型依赖：
- 可以被各层调用
- 应尽量保持轻量，不要把复杂业务逻辑塞进 `utils`

### `tests/`

测试代码目录。

主要职责：
- 存放单元测试
- 存放接口测试
- 验证业务逻辑是否正确

建议放置内容：
- `test_student.py`
- `test_course.py`
- `test_selection.py`

典型依赖：
- 使用 `pytest` 编写测试
- 测试 `service` 层时可直接导入业务函数
- 测试 `api` 层时可配合 `FastAPI` 的测试客户端

说明：
- 当前项目使用同步方案，因此测试通常先使用 `pytest`
- 暂时不必引入 `pytest-asyncio`

## 推荐依赖及用途

### `fastapi`

接口框架。

建议用途：
- 定义路由
- 编写学生、课程、选课相关接口

主要使用位置：
- `app/api/`
- 启动入口 `main.py`

### `uvicorn`

运行 `FastAPI` 项目的服务器。

建议用途：
- 本地启动项目
- 开发阶段调试接口

主要使用位置：
- 一般通过命令行启动，不一定直接写进业务代码

### `sqlalchemy`

数据库 ORM 和数据库操作工具。

建议用途：
- 定义模型
- 创建数据库连接
- 进行增删改查

主要使用位置：
- `app/model/`
- `app/repository/`
- `app/core/`

### `alembic`

数据库迁移工具。

建议用途：
- 管理表结构变更
- 自动生成迁移脚本

主要使用位置：
- 一般会在项目根目录生成迁移相关文件
- 会依赖 `SQLAlchemy` 的模型定义

说明：
- 如果项目后续要持续改表，建议接入
- 对课程作业来说也很实用，能让结构变更更规范

### `pydantic`

数据校验与序列化工具。

建议用途：
- 定义请求参数
- 定义响应结构
- 做字段校验

主要使用位置：
- `app/schema/`
- 部分配置类也可放在 `app/core/`

### `pymysql`

MySQL 同步驱动。

建议用途：
- 作为同步方案下连接 MySQL 的驱动

主要使用位置：
- 通常通过 `SQLAlchemy` 间接使用
- 配置连接字符串时会在 `app/core/database.py` 一类文件中出现

### `pytest`

测试框架。

建议用途：
- 写单元测试
- 写接口测试
- 验证业务逻辑

主要使用位置：
- `tests/`

### `pytest-asyncio`

异步测试支持插件。

说明：
- 当前项目采用同步方案，暂时不是必需依赖
- 只有在后续引入异步代码时才建议添加

## 当前推荐的依赖关系

建议保持如下依赖方向：

`api -> service -> repository -> model`

辅助依赖：

- `api -> schema`
- `service -> schema`
- `model -> core`
- `repository -> core`
- `tests -> api/service/model`

建议避免：
- `repository` 反向依赖 `service`
- `model` 依赖 `api`
- 在 `utils` 中堆积核心业务逻辑

## 后续可继续补充的文件

后面如果继续初始化项目，通常会新增：

- `main.py`：项目启动入口
- `app/core/config.py`：配置项
- `app/core/database.py`：数据库连接与 Session 管理
- `app/model/*.py`：数据库模型
- `app/schema/*.py`：请求与响应模型
- `app/repository/*.py`：数据库访问代码
- `app/service/*.py`：业务逻辑
- `app/api/*.py`：接口定义
- `tests/test_*.py`：测试文件

## 总结

这套结构适合当前“模拟学生选课平台”的课程作业场景，优点是：

- 分层清楚，便于答辩说明
- 后续扩展数据库和接口比较自然
- 适合同步方案，复杂度较低
- 可以逐步补代码，不需要一次写完整个系统
