from app import create_app
from app.services.trip_service import TripService
import sys

app = create_app()

with app.app_context():
    print("Attempting to fetch public trips...")
    try:
        trips = TripService.get_public_trips()
        print(f"Found {len(trips)} trips.")
        for trip in trips:
            print(f"Processing trip ID: {trip.id}, Title: {trip.title}")
            data = trip.to_dict()
            print("  -> to_dict() successful")
    except Exception as e:
        print("Caught exception:")
        print(e)
        import traceback
        traceback.print_exc()
