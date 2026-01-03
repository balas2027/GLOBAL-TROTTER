from flask import Blueprint, request, jsonify
from app.services.trip_service import TripService
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.exceptions import HTTPException

trips_bp = Blueprint('trips', __name__)

@trips_bp.errorhandler(HTTPException)
def handle_exception(e):
    return jsonify({'error': e.description}), e.code

@trips_bp.route('/', methods=['POST'])
@jwt_required()
def create_trip():
    user_id = int(get_jwt_identity())
    data = request.json
    try:
        trip = TripService.create_trip(user_id, data)
        return jsonify(trip.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@trips_bp.route('/', methods=['GET'])
@jwt_required()
def get_trips():
    user_id = int(get_jwt_identity())
    trips = TripService.get_user_trips(user_id)
    return jsonify([t.to_dict() for t in trips]), 200

@trips_bp.route('/public', methods=['GET'])
def get_public_trips():
    try:
        trips = TripService.get_public_trips()
        return jsonify([t.to_dict() for t in trips]), 200
    except Exception as e:
        print(f"Error getting public trips: {e}")
        return jsonify({'error': str(e)}), 500

@trips_bp.route('/<int:trip_id>', methods=['GET'])
@jwt_required()
def get_trip(trip_id):
    user_id = int(get_jwt_identity())
    trip = TripService.get_trip(trip_id, user_id)
    if not trip:
        return jsonify({'error': 'Trip not found or access denied'}), 404
    return jsonify(trip.to_dict()), 200

@trips_bp.route('/<int:trip_id>', methods=['PUT'])
@jwt_required()
def update_trip(trip_id):
    user_id = get_jwt_identity()
    data = request.json
    trip = TripService.update_trip(trip_id, user_id, data)
    if not trip:
        return jsonify({'error': 'Trip not found or unauthorized'}), 404
    return jsonify(trip.to_dict()), 200

@trips_bp.route('/destinations', methods=['GET'])
def get_destinations():
    destinations = TripService.get_public_destinations()
    return jsonify([d.to_dict() for d in destinations]), 200

@trips_bp.route('/<int:trip_id>', methods=['DELETE'])
@jwt_required()
def delete_trip(trip_id):
    user_id = get_jwt_identity()
    success = TripService.delete_trip(trip_id, user_id)
    if not success:
        return jsonify({'error': 'Trip not found or unauthorized'}), 404
    return jsonify({'message': 'Trip deleted'}), 200

@trips_bp.route('/<int:trip_id>/copy', methods=['POST'])
@jwt_required()
def copy_trip(trip_id):
    user_id = int(get_jwt_identity())
    new_trip = TripService.duplicate_trip(trip_id, user_id)
    if not new_trip:
        return jsonify({'error': 'Trip not found'}), 404
    return jsonify(new_trip.to_dict()), 201
