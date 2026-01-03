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
    return user and user.username == 'admin_traveler'

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
    # SQLite specific date formatting might differ, assuming Postgres for production but dev is likely SQLite.
    # We'll use a simpler Python-side aggregation for safety if DB is uncertain, or try generic SQL.
    # Let's just fetch all start_dates and process in Python for this scale.
    
    trips = Trip.query.with_entities(Trip.start_date).all()
    from collections import Counter
    from datetime import datetime
    
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
        
    # Aggregate cities from Trips (destination)
    # destinations is a text field, potentially comma-separated? 
    # Current model doesn't strictly normalize destinations. 
    # Let's count by 'destination' column grouping.
    
    results = db.session.query(Trip.destination, func.count(Trip.id).label('count')) \
        .group_by(Trip.destination) \
        .order_by(desc('count')) \
        .limit(5) \
        .all()
        
    return jsonify([{'name': r[0], 'value': r[1]} for r in results])
