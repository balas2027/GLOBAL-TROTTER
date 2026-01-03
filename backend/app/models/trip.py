from datetime import datetime
from app.extensions import db

class Trip(db.Model):
    __tablename__ = 'trips'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    description = db.Column(db.Text)
    budget_limit = db.Column(db.Float)
    distance = db.Column(db.Float, default=0.0) # In km
    visibility = db.Column(db.String(20), default='0') # 0=Private, 1=Public
    cover_image = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    itineraries = db.relationship('Itinerary', backref='trip', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'start_date': self.start_date.isoformat() if hasattr(self.start_date, 'isoformat') else self.start_date,
            'end_date': self.end_date.isoformat() if hasattr(self.end_date, 'isoformat') else self.end_date,
            'description': self.description,
            'budget_limit': self.budget_limit,
            'distance': self.distance,
            'visibility': self.visibility,
            'cover_image': self.cover_image,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
