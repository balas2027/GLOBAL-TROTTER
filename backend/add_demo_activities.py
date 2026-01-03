from app import create_app, db
from app.models.trip import Trip
from app.models.itinerary import Itinerary, Activity
from app.models.user import User
from datetime import datetime, timedelta, time

app = create_app()

# Sample activities for different trip types
SAMPLE_ACTIVITIES = [
    # Day 1 Activities
    [
        {"title": "Airport Arrival & Hotel Check-in", "start_time": time(9, 0), "end_time": time(11, 0), "location": "City Center", "description": "Settle in and prepare for the adventure", "type": "transport"},
        {"title": "Welcome Lunch at Local Restaurant", "start_time": time(12, 0), "end_time": time(13, 30), "location": "Old Town Square", "description": "Try the local cuisine", "cost": 45.00, "type": "food"},
        {"title": "City Walking Tour", "start_time": time(14, 30), "end_time": time(17, 30), "location": "Historic District", "description": "Explore landmarks and hidden gems", "type": "attraction"},
        {"title": "Sunset Viewpoint Visit", "start_time": time(18, 0), "end_time": time(19, 0), "location": "Hilltop Observatory", "description": "Perfect photo opportunity", "type": "attraction"},
        {"title": "Dinner & Cultural Show", "start_time": time(20, 0), "end_time": time(22, 30), "location": "Cultural Center", "description": "Traditional performance", "cost": 75.00, "type": "food"},
    ],
    # Day 2 Activities
    [
        {"title": "Breakfast at Boutique Cafe", "start_time": time(8, 0), "end_time": time(9, 0), "location": "Hotel Area", "description": "Start the day with local pastries", "cost": 25.00, "type": "food"},
        {"title": "Museum & Art Gallery Visit", "start_time": time(10, 0), "end_time": time(13, 0), "location": "Museum District", "description": "World-renowned collections", "cost": 30.00, "type": "attraction"},
        {"title": "Gourmet Lunch Experience", "start_time": time(13, 30), "end_time": time(15, 0), "location": "Fine Dining District", "description": "Michelin-recommended", "cost": 85.00, "type": "food"},
        {"title": "Shopping & Local Markets", "start_time": time(15, 30), "end_time": time(18, 0), "location": "Market Street", "description": "Souvenirs and local crafts", "type": "attraction"},
        {"title": "Rooftop Bar & Networking", "start_time": time(19, 0), "end_time": time(21, 0), "location": "Sky Lounge", "description": "Panoramic city views", "cost": 40.00, "type": "food"},
    ],
    # Day 3 Activities
    [
        {"title": "Early Morning Beach Walk", "start_time": time(6, 30), "end_time": time(8, 0), "location": "Coastal Path", "description": "Sunrise experience", "type": "attraction"},
        {"title": "Adventure Activity", "start_time": time(9, 0), "end_time": time(12, 0), "location": "Adventure Park", "description": "Hiking, zip-lining, or water sports", "cost": 95.00, "type": "attraction"},
        {"title": "Picnic Lunch", "start_time": time(13, 0), "end_time": time(14, 0), "location": "Scenic Lookout", "description": "Pack lunch provided", "type": "food"},
        {"title": "Spa & Relaxation", "start_time": time(15, 0), "end_time": time(17, 30), "location": "Wellness Center", "description": "Unwind after adventure", "cost": 120.00, "type": "hotel"},
        {"title": "Farewell Dinner", "start_time": time(19, 30), "end_time": time(21, 30), "location": "Signature Restaurant", "description": "Celebration dinner", "cost": 100.00, "type": "food"},
    ],
]

with app.app_context():
    # Find admin user
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        print("Admin user not found!")
        exit()

    # Get all trips by admin
    admin_trips = Trip.query.filter_by(user_id=admin.id).all()
    print(f"Found {len(admin_trips)} admin trips")

    for trip in admin_trips:
        # Check if trip already has itineraries
        existing_itins = Itinerary.query.filter_by(trip_id=trip.id).count()
        
        if existing_itins > 0:
            print(f"Trip '{trip.title}' already has itineraries, skipping...")
            continue

        print(f"Adding activities to '{trip.title}'...")
        
        # Calculate days
        if trip.start_date and trip.end_date:
            num_days = (trip.end_date - trip.start_date).days + 1
        else:
            num_days = 3  # Default 3 days

        num_days = min(num_days, 3)  # Cap at 3 days of sample data

        for day_num in range(num_days):
            # Create itinerary for each day
            if trip.start_date:
                day_date = trip.start_date + timedelta(days=day_num)
            else:
                day_date = datetime.now().date() + timedelta(days=day_num)

            itinerary = Itinerary(
                trip_id=trip.id,
                day_number=day_num + 1,
                date=day_date,
                notes=f"Day {day_num + 1} - {'Arrival' if day_num == 0 else 'Exploration' if day_num == 1 else 'Adventure & Farewell'}"
            )
            db.session.add(itinerary)
            db.session.flush()  # Get ID

            # Add activities for this day
            activities_for_day = SAMPLE_ACTIVITIES[day_num % len(SAMPLE_ACTIVITIES)]
            for act_data in activities_for_day:
                activity = Activity(
                    itinerary_id=itinerary.id,
                    title=act_data["title"],
                    type=act_data.get("type", "attraction"),
                    start_time=act_data.get("start_time"),
                    end_time=act_data.get("end_time"),
                    location=act_data.get("location"),
                    description=act_data.get("description"),
                    cost=act_data.get("cost", 0)
                )
                db.session.add(activity)

        db.session.commit()
        print(f"  ✓ Added {num_days} days with activities")

    print("\n✅ Done! All admin trips now have demo activities.")
