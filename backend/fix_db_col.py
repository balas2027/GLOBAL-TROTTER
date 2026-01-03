from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    with db.engine.connect() as connection:
        try:
            # Check if column exists first to be sure
            result = connection.execute(text("SELECT preferences FROM users LIMIT 1;"))
            print("Column 'preferences' already exists.")
        except Exception:
            print("Column 'preferences' missing. Adding it...")
            try:
                connection.execute(text("ALTER TABLE users ADD COLUMN preferences TEXT;"))
                connection.commit()
                print("Successfully added 'preferences' column.")
            except Exception as e:
                print(f"FAILED to add column: {e}")
