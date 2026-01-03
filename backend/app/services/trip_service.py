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
            visibility=int(data.get('visibility', 0)), # Ensure int
            cover_image=data.get('cover_image')
        )
        db.session.add(new_trip)
        db.session.commit()
        return new_trip

    @staticmethod
    def get_user_trips(user_id):
        return Trip.query.filter_by(user_id=user_id).order_by(Trip.start_date.asc()).all()
    
    @staticmethod
    def get_public_destinations():
        # Fetch seeded destinations, or public trips (using destinations table for now)
        from app.models.destination import Destination
        return Destination.query.limit(4).all()

    @staticmethod
    def get_trip(trip_id, user_id):
        # Allow access if owner OR public (1)
        trip = Trip.query.filter(Trip.id == trip_id).first() # Avoid 404 immediately to check visibility
        if not trip:
            return None
            
        if trip.user_id != user_id and trip.visibility != 1:
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
        if 'visibility' in data: trip.visibility = int(data['visibility'])
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
