from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService
from flask_jwt_extended import jwt_required, get_jwt_identity, current_user
from app.models.user import User
from werkzeug.exceptions import HTTPException

auth_bp = Blueprint('auth', __name__)

@auth_bp.errorhandler(HTTPException)
def handle_exception(e):
    return jsonify({'error': e.description}), e.code

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    try:
        user = AuthService.register_user(data)
        return jsonify({'message': 'User created successfully', 'user': user.to_dict()}), 201
    except Exception as e:
        # Fallback for non-HTTP exceptions
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
        
    try:
        result = AuthService.authenticate_user(data.get('email'), data.get('password'))
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = AuthService.get_user(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict()), 200

@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.json
    try:
        user = AuthService.update_user(user_id, data)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
