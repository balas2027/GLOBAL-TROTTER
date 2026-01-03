from app import create_app, db
from sqlalchemy import text
from datetime import date, timedelta

app = create_app()

with app.app_context():
    print("Fixing TBD trips (setting default dates)...")
    
    # Set default start to 1 month from now
    default_start = '2026-06-01'
    default_end = '2026-06-10'

    # Find trips with NULL start_date
    query = text(f"UPDATE trips SET start_date = '{default_start}', end_date = '{default_end}' WHERE start_date IS NULL")
    result = db.session.execute(query)
    db.session.commit()
    
    print(f"Updated {result.rowcount} trips with default dates.")
