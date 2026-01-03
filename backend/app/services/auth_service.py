from app.extensions import db
from app.models.user import User
from flask_jwt_extended import create_access_token
from werkzeug.exceptions import Conflict, Unauthorized

class AuthService:
    @staticmethod
    def register_user(data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if User.query.filter_by(username=username).first():
            raise Conflict('Username already exists')
        if User.query.filter_by(email=email).first():
            raise Conflict('Email already exists')
            
        user = User(
            username=username,
            email=email,
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            city=data.get('city'),
            country=data.get('country'),
            phone=data.get('phone'),
            bio=data.get('bio')
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return user

    @staticmethod
    def authenticate_user(email, password):
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            raise Unauthorized('Invalid email or password')
            
        access_token = create_access_token(identity=str(user.id))
        return {
            'access_token': access_token,
            'user': user.to_dict()
        }

    @staticmethod
    def get_user(user_id):
        return User.query.get(user_id)

    @staticmethod
    def update_user(user_id, data):
        user = User.query.get(user_id)
        if not user:
            return None
        
        if 'first_name' in data: user.first_name = data['first_name']
        if 'last_name' in data: user.last_name = data['last_name']
        if 'city' in data: user.city = data['city']
        if 'country' in data: user.country = data['country']
        if 'bio' in data: user.bio = data['bio']
        if 'avatar_url' in data: user.avatar_url = data['avatar_url']
        if 'phone' in data: user.phone = data['phone']
        
        db.session.commit()
        return user
