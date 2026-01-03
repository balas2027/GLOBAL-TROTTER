from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    with db.engine.connect() as connection:
        try:
            connection.execute(text("ALTER TABLE activities ADD COLUMN location VARCHAR(255);"))
            print("Added 'location' column.")
        except Exception as e:
            print(f"Error adding location (maybe exists): {e}")

        try:
            connection.execute(text("ALTER TABLE activities ADD COLUMN image_url VARCHAR(500);"))
            print("Added 'image_url' column.")
        except Exception as e:
            print(f"Error adding image_url (maybe exists): {e}")
            
        connection.commit()
