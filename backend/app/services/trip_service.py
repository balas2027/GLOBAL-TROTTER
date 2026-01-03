from app.extensions import db
from app.models.trip import Trip
from datetime import datetime

class TripService:
    @staticmethod
    def create_trip(user_id, data):
        new_trip = Trip(
            user_id=user_id,
            title=data.get('title'),
            start_date=datetime.strptime(data.get('start_date'), '%Y-%m-%d').date() if data.get('start_date') else None,
            end_date=datetime.strptime(data.get('end_date'), '%Y-%m-%d').date() if data.get('end_date') else None,
            description=data.get('description'),
            budget_limit=data.get('budget_limit'),
            distance=data.get('distance', 0.0),
            visibility=str(data.get('visibility', '0')), # Ensure string
            cover_image=data.get('cover_image')
        )
        db.session.add(new_trip)
        db.session.commit()
        return new_trip

    @staticmethod
    def get_user_trips(user_id):
        return Trip.query.filter_by(user_id=user_id).order_by(Trip.start_date.asc()).all()

    @staticmethod
    def get_public_trips():
        return Trip.query.filter_by(visibility='1').order_by(Trip.created_at.desc()).limit(12).all()
    
    @staticmethod
    def get_public_destinations():
        # Fetch seeded destinations, or public trips (using destinations table for now)
        from app.models.destination import Destination
        return Destination.query.limit(20).all()

    @staticmethod
    def get_trip(trip_id, user_id):
        # Allow access if owner OR public (1)
        trip = Trip.query.filter(Trip.id == trip_id).first() # Avoid 404 immediately to check visibility
        if not trip:
            return None
            
        if trip.user_id != user_id and trip.visibility != '1':
            return None 
        return trip

    @staticmethod
    def update_trip(trip_id, user_id, data):
        trip = Trip.query.get_or_404(trip_id)
        if trip.user_id != user_id:
            return None
            
        if 'title' in data: trip.title = data['title']
        if 'description' in data: trip.description = data['description']
        if 'budget_limit' in data: trip.budget_limit = data['budget_limit']
        if 'distance' in data: trip.distance = data['distance']
        if 'visibility' in data: trip.visibility = str(data['visibility'])
        if 'cover_image' in data: trip.cover_image = data['cover_image']
        if 'start_date' in data and data['start_date']: trip.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        if 'end_date' in data and data['end_date']: trip.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        
        db.session.commit()
        return trip

    @staticmethod
    def delete_trip(trip_id, user_id):
        trip = Trip.query.get_or_404(trip_id)
        if trip.user_id != user_id:
            return False
            
        db.session.delete(trip)
        db.session.commit()
        return True

    @staticmethod
    def duplicate_trip(trip_id, user_id):
        original_trip = Trip.query.filter_by(id=trip_id).first()
        if not original_trip:
            return None
            
        # 1. Copy Trip
        new_trip = Trip(
            user_id=user_id,
            title=f"Copy of {original_trip.title}",
            start_date=original_trip.start_date, 
            end_date=original_trip.end_date,
            description=original_trip.description,
            budget_limit=original_trip.budget_limit,
            distance=original_trip.distance,
            visibility='0', # Always private copy
            cover_image=original_trip.cover_image
        )
        db.session.add(new_trip)
        db.session.flush() # get ID

        # 2. Copy Itineraries (Sections)
        from app.models.itinerary import Itinerary, Activity
        for original_itin in original_trip.itineraries:
            new_itin = Itinerary(
                trip_id=new_trip.id,
                day_number=original_itin.day_number,
                notes=original_itin.notes
            )
            db.session.add(new_itin)
            db.session.flush()

            # 3. Copy Activities
            for original_act in original_itin.activities:
                new_act = Activity(
                    itinerary_id=new_itin.id,
                    type=original_act.type,
                    title=original_act.title,
                    description=original_act.description,
                    cost=original_act.cost,
                    start_time=original_act.start_time,
                    end_time=original_act.end_time,
                    location=original_act.location,
                    image_url=original_act.image_url,
                    location_lat=original_act.location_lat,
                    location_lng=original_act.location_lng,
                    booking_ref=original_act.booking_ref
                )
                
                # Copy tags
                for tag in original_act.tags:
                    new_act.tags.append(tag)
                    
                db.session.add(new_act)

        db.session.commit()
        return new_trip
