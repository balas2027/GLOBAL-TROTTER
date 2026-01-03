from flask import Blueprint, jsonify
from app.models.user import User
from app.models.trip import Trip
from app.models.itinerary import Itinerary, Activity
from app.extensions import db
from sqlalchemy import func, desc
from flask_jwt_extended import jwt_required, get_jwt_identity

admin_bp = Blueprint('admin', __name__)

def is_admin(user_id):
    user = User.query.get(user_id)
    # Hardcoded admin check for simplicity, or check a role column if it exists
    return user and user.username == 'admin'

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    current_user_id = get_jwt_identity()
    if not is_admin(current_user_id):
        return jsonify({'error': 'Unauthorized'}), 403

    total_users = User.query.count()
    total_trips = Trip.query.count()
    completed_trips = Trip.query.filter(Trip.end_date < func.now()).count()
    
    return jsonify({
        'total_users': total_users,
        'total_trips': total_trips,
        'completed_trips': completed_trips,
        'active_trips': total_trips - completed_trips
    })

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    current_user_id = get_jwt_identity()
    if not is_admin(current_user_id):
        return jsonify({'error': 'Unauthorized'}), 403

    users = User.query.order_by(User.created_at.desc()).limit(20).all()
    return jsonify([u.to_dict() for u in users])

@admin_bp.route('/trends/trips', methods=['GET'])
@jwt_required()
def get_trip_trends():
    current_user_id = get_jwt_identity()
    if not is_admin(current_user_id):
        return jsonify({'error': 'Unauthorized'}), 403

    # Group trips by creation month (using start_date as proxy for activity period)
    trips = Trip.query.with_entities(Trip.start_date).all()
    from collections import Counter
    
    dates = [t.start_date.strftime('%Y-%m') for t in trips if t.start_date]
    counts = Counter(dates)
    
    # Sort by date
    sorted_data = sorted([{'name': date, 'trips': count} for date, count in counts.items()], key=lambda x: x['name'])
    
    return jsonify(sorted_data[-6:]) # Last 6 months

@admin_bp.route('/popular/cities', methods=['GET'])
@jwt_required()
def get_popular_cities():
    current_user_id = get_jwt_identity()
    if not is_admin(current_user_id):
        return jsonify({'error': 'Unauthorized'}), 403
        
    # Aggregate stats from Activities (location) since Trip doesn't have destination column
    results = db.session.query(Activity.location, func.count(Activity.id).label('count')) \
        .filter(Activity.location != None) \
        .group_by(Activity.location) \
        .order_by(desc('count')) \
        .limit(5) \
        .all()
        
    return jsonify([{'name': r[0], 'value': r[1]} for r in results])

@admin_bp.route('/trips', methods=['GET'])
@jwt_required()
def get_all_public_trips():
    """Get all public trips for admin management."""
    current_user_id = get_jwt_identity()
    if not is_admin(current_user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Get all public trips
    trips = Trip.query.filter(Trip.visibility == '1').order_by(Trip.created_at.desc()).all()
    
    result = []
    for trip in trips:
        trip_data = trip.to_dict()
        author = User.query.get(trip.user_id)
        trip_data['author'] = author.to_dict() if author else None
        result.append(trip_data)
    
    return jsonify(result)

@admin_bp.route('/trips/<int:trip_id>', methods=['DELETE'])
@jwt_required()
def delete_trip(trip_id):
    """Admin can delete any public trip."""
    current_user_id = get_jwt_identity()
    if not is_admin(current_user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    trip = Trip.query.get(trip_id)
    if not trip:
        return jsonify({'error': 'Trip not found'}), 404
    
    db.session.delete(trip)
    db.session.commit()
    
    return jsonify({'message': 'Trip deleted successfully'}), 200
