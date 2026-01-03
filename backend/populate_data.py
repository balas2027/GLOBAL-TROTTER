from app import create_app, db
from app.models.trip import Trip
import random

app = create_app()

with app.app_context():
    trips = Trip.query.all()
    count = 0
    for trip in trips:
        # Assign random distance between 500km and 15000km
        trip.distance = random.uniform(500, 15000)
        # Also ensure budget is set if missing
        if not trip.budget_limit:
            trip.budget_limit = random.uniform(1000, 10000)
        count += 1
    
    db.session.commit()
    print(f"Updated {count} trips with random distance and budget data.")
