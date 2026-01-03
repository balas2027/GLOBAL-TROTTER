from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    avatar_url = db.Column(db.Text)
    
    # Profile Fields
    first_name = db.Column(db.String(64))
    last_name = db.Column(db.String(64))
    phone = db.Column(db.String(20))
    city = db.Column(db.String(64))
    country = db.Column(db.String(64))
    country = db.Column(db.String(64))
    bio = db.Column(db.Text)
    preferences = db.Column(db.Text) # JSON string

    trips = db.relationship('Trip', backref='author', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'avatar_url': self.avatar_url,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'city': self.city,
            'country': self.country,
            'bio': self.bio,
            'bio': self.bio,
            'phone': self.phone,
            'preferences': self.preferences
        }
