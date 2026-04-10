# Project Structure

This project uses a layered backend structure that fits a course project such as a student course selection platform.

## Directory Overview

### `app/`

Main application package. All backend source code should be placed here.

Notes:
- `main.py` is usually the application entry point
- Subdirectories under `app/` should follow a clear layered structure

### `app/api/`

API layer.


### `app/service/`

Business logic layer.

Responsibilities:
- implement core business rules
- coordinate multi-step operations
- handle course selection logic


### `app/model/`

Data model layer.

Responsibilities:
- define database models
- represent core entities such as students, courses, and selections


### `app/schema/`

Request and response schema layer, similar to `dto`, `vo` in java projects.

Responsibilities:
- define input structures
- define output structures
- validate and serialize data


### `app/repository/`

Data access layer, similar to `mapper` or `dao` in Java projects.


### `app/core/`

Core infrastructure layer.

Responsibilities:
- project configuration
- database setup
- shared constants
- common foundational components


### `app/utils/`

Utility layer.

Responsibilities:
- shared helper functions
- formatting helpers
- time and string helpers
- common lightweight utilities


### `tests/`

Test code directory.

Responsibilities:
- store unit tests
- store API tests
- validate business logic

Suggested contents:
- `test_student.py`
- `test_course.py`
- `test_selection.py`

## Dependency List (initial)

- `fastapi`
- `uvicorn`
- `sqlalchemy`
- `alembic`
- `pydantic`
- `pymysql`
- `pytest`
- `pytest-asyncio`


## Summary

This structure is suitable for the current project because it is:

- clear and easy to explain
- easy to extend
- suitable for a synchronous backend setup
- simple enough for staged development
