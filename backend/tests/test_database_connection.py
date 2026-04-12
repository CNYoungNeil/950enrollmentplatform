from sqlalchemy import text

from backend.app.core.database import engine


def test_database_connection():
    """
    Verify that the current database configuration can create a real connection.

    This test opens a database connection and runs a very small SQL statement.
    If the database, username, password, or host configuration is wrong,
    this test will fail immediately.
    """
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

        # SELECT 1 is the simplest connectivity check. A return value of 1
        # means the application can successfully talk to the database.
        assert result.scalar() == 1
