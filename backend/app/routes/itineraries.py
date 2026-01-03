from flask import Blueprint, request, jsonify
from app.services.itinerary_service import ItineraryService
from flask_jwt_extended import jwt_required

itinerary_bp = Blueprint('itinerary', __name__)

@itinerary_bp.route('/<int:trip_id>', methods=['GET'])
def get_itinerary(trip_id):
    # Public access allowed for now if trip is public, service should handle check ideally or we check trip here.
    # For now assuming open read for simplicity or relying on frontend to only req if allowed.
    sections = ItineraryService.get_trip_itinerary(trip_id)
    return jsonify([s.to_dict() for s in sections]), 200

@itinerary_bp.route('/<int:trip_id>/sections', methods=['POST'])
@jwt_required()
def add_section(trip_id):
    data = request.json
    section = ItineraryService.add_section(trip_id, data)
    return jsonify(section.to_dict()), 201

@itinerary_bp.route('/section/<int:itinerary_id>/activity', methods=['POST'])
@jwt_required()
def add_activity(itinerary_id):
    data = request.json
    activity = ItineraryService.add_activity(itinerary_id, data)
    return jsonify(activity.to_dict()), 201
