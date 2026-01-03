from app.extensions import db

# Association table for Activity <-> Tags
activity_tags = db.Table('activity_tags',
    db.Column('activity_id', db.Integer, db.ForeignKey('activities.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

class Itinerary(db.Model):
    __tablename__ = 'itineraries'
    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    day_number = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date)
    notes = db.Column(db.Text)
    
    activities = db.relationship('Activity', backref='itinerary', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'day_number': self.day_number,
            'date': self.date.isoformat() if self.date else None,
            'notes': self.notes,
            'activities': [a.to_dict() for a in self.activities]
        }

class Activity(db.Model):
    __tablename__ = 'activities'
    id = db.Column(db.Integer, primary_key=True)
    itinerary_id = db.Column(db.Integer, db.ForeignKey('itineraries.id'), nullable=False)
    type = db.Column(db.String(50)) # flight, hotel, attraction, food
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)
    cost = db.Column(db.Float, default=0.0)
    location_lat = db.Column(db.Float)
    location_lng = db.Column(db.Float)
    booking_ref = db.Column(db.String(100))
    
    tags = db.relationship('Tag', secondary=activity_tags, backref=db.backref('activities', lazy='dynamic'))

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'title': self.title,
            'description': self.description,
            'start_time': self.start_time.strftime('%H:%M') if self.start_time else None,
            'end_time': self.end_time.strftime('%H:%M') if self.end_time else None,
            'cost': self.cost,
            'tags': [t.name for t in self.tags]
        }

class Tag(db.Model):
    __tablename__ = 'tags'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def to_dict(self):
        return {'id': self.id, 'name': self.name}
