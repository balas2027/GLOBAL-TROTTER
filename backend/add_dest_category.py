from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    # 1. Add Column
    try:
        db.session.execute(text("ALTER TABLE destinations ADD COLUMN category VARCHAR(50)"))
        print("Added category column.")
    except Exception as e:
        print(f"Column might already exist: {e}")
        db.session.rollback()

    # 2. Update Categories
    updates = {
        'Santorini': 'beach',
        'Kyoto': 'city',
        'Banff': 'mountain',
        'Marrakech': 'city',
        'Reykjavik': 'mountain',
        'Ubud': 'mountain',
        'Interlaken': 'mountain',
        'Paris': 'city',
        'New York': 'city',
        'Bali': 'beach'
    }

    print("Updating categories...")
    for name, cat in updates.items():
        # Update by name (ilike for case insensitivity)
        query = text(f"UPDATE destinations SET category = '{cat}' WHERE name ILIKE '%{name}%'")
        result = db.session.execute(query)
        print(f"Updated {name} -> {cat} (Rows: {result.rowcount})")

    db.session.commit()
    print("Done.")
