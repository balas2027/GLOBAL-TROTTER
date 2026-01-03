from app.extensions import db

class Destination(db.Model):
    __tablename__ = 'destinations'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(256))
    currency = db.Column(db.String(10))
    cost_index = db.Column(db.Float) # 1.0 = Average, >1 Expensive
    category = db.Column(db.String(50)) # e.g. beach, mountain, city, food
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'country': self.country,
            'description': self.description,
            'image_url': self.image_url,
            'currency': self.currency,
            'cost_index': self.cost_index,
            'category': self.category
        }
