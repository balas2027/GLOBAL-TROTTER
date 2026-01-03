from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    with db.engine.connect() as connection:
        try:
            connection.execute(text("ALTER TABLE users ADD COLUMN preferences TEXT;"))
            print("Added 'preferences' column.")
        except Exception as e:
            print(f"Error adding preferences (maybe exists): {e}")

        # Also ensuring other cols exist just in case
        try:
            connection.execute(text("ALTER TABLE users ADD COLUMN bio TEXT;"))
            print("Added 'bio' column.")
        except Exception: pass
        
        try:
            connection.execute(text("ALTER TABLE users ADD COLUMN first_name VARCHAR(64);"))
            print("Added 'first_name' column.")
        except Exception: pass
        
        try:
            connection.execute(text("ALTER TABLE users ADD COLUMN last_name VARCHAR(64);"))
            print("Added 'last_name' column.")
        except Exception: pass

        connection.commit()
