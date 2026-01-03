from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    with db.engine.connect() as connection:
        # Ensure clean state
        try:
            connection.rollback()
        except: pass
        
        try:
            # Try to select
            connection.execute(text("SELECT preferences FROM users LIMIT 1;"))
            print("Column 'preferences' already exists.")
        except Exception as e:
            print("Column 'preferences' missing (or other error). Trying to add it...")
            # We must rollback the failed SELECT before proceeding in Postgres
            connection.rollback()
            
            try:
                connection.execute(text("ALTER TABLE users ADD COLUMN preferences TEXT;"))
                connection.commit()
                print("Successfully added 'preferences' column.")
            except Exception as e:
                print(f"FAILED to add column: {e}")
                connection.rollback()
