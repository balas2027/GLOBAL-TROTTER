from app.extensions import db
from app.models.itinerary import Itinerary, Activity
from app.models.trip import Trip

class ItineraryService:
    @staticmethod
    def get_trip_itinerary(trip_id):
        return Itinerary.query.filter_by(trip_id=trip_id).order_by(Itinerary.day_number.asc()).all()

    @staticmethod
    def add_section(trip_id, data):
        # 'Section' maps to an Itinerary (Day or Phase)
        # Determine next day number
        last_section = Itinerary.query.filter_by(trip_id=trip_id).order_by(Itinerary.day_number.desc()).first()
        next_day = (last_section.day_number + 1) if last_section else 1
        
        new_section = Itinerary(
            trip_id=trip_id,
            day_number=next_day,
            notes=data.get('description', ''),
            # We might want to store title in notes or add a title field later, 
            # for now let's assume notes handles the "Description/Title"
        )
        db.session.add(new_section)
        db.session.commit()
        return new_section

    @staticmethod
    def add_activity(itinerary_id, data):
        new_activity = Activity(
            itinerary_id=itinerary_id,
            title=data.get('title'),
            type=data.get('type', 'generic'),
            description=data.get('description'),
            cost=data.get('cost', 0.0),
            location=data.get('location'),
            image_url=data.get('image_url'),
            start_time=data.get('start_time'), # conversion needed if string
            end_time=data.get('end_time')      # conversion needed if string
        )
        db.session.add(new_activity)
        db.session.commit()
        return new_activity
