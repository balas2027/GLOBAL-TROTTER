from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        with db.engine.connect() as conn:
            conn.execute(text("ALTER TABLE trips ADD COLUMN distance FLOAT DEFAULT 0"))
            conn.commit()
            print("Successfully added distance column.")
    except Exception as e:
        print(f"Error (column might already exist): {e}")
