from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    # List of (id, start_date, end_date)
    # Spreading trips across 2026 and 2027
    updates = [
        # Kyoto (Original: 2024-04-01)
        (6, '2026-03-01', '2026-03-10'),
        (10, '2026-04-01', '2026-04-10'),
        (14, '2026-05-01', '2026-05-10'),
        (22, '2026-09-01', '2026-09-10'),
        (23, '2026-10-01', '2026-10-10'),

        # Iceland (Original: 2024-06-15)
        (7, '2026-06-15', '2026-06-25'),
        (11, '2026-07-15', '2026-07-25'),
        (15, '2026-08-15', '2026-08-25'),
        (19, '2027-06-15', '2027-06-25'),

        # Bali (Original: 2024-09-01)
        (8, '2026-02-10', '2026-02-24'),
        (12, '2026-11-01', '2026-11-14'),
        (16, '2026-12-01', '2026-12-14'),
        (20, '2027-01-10', '2027-01-24'),

        # Swiss Alps (Original: 2024-07-10)
        (9, '2026-05-15', '2026-05-22'),
        (13, '2026-06-20', '2026-06-27'),
        (17, '2026-07-25', '2026-08-01'),
        (21, '2027-07-10', '2027-07-17'),
    ]

    print("Updating trip dates...")
    for tid, start, end in updates:
        # Check if trip exists first to avoid errors
        check = db.session.execute(text(f"SELECT id FROM trips WHERE id = {tid}")).fetchone()
        if check:
            query = text(f"UPDATE trips SET start_date = '{start}', end_date = '{end}' WHERE id = {tid}")
            db.session.execute(query)
            print(f" -> Updated Trip {tid} to {start}")
        else:
            print(f" -> Trip {tid} not found, skipping.")
    
    db.session.commit()
    print("Successfully distributed trip dates!")
