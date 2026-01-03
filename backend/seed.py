from app import create_app, db
from app.models.destination import Destination
from app.models.trip import Trip
from app.models.user import User

app = create_app()

def seed_data():
    with app.app_context():
        # Clear existing destinations to avoid duplicates for now (or check exists)
        # db.session.query(Destination).delete()
        
        # 1. Seed Destinations (Top Regional Selections)
        destinations = [
            {
                'name': 'Santorini',
                'country': 'Greece',
                'description': 'A volcanic island in the Cyclades group of the Greek islands.',
                'image_url': 'https://images.unsplash.com/photo-1613395877344-13d4c280d286?q=80&w=1000&auto=format&fit=crop',
                'currency': 'EUR',
                'cost_index': 1.5
            },
            {
                'name': 'Kyoto',
                'country': 'Japan',
                'description': 'Famous for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.',
                'image_url': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop',
                'currency': 'JPY',
                'cost_index': 1.3
            },
            {
                'name': 'Banff',
                'country': 'Canada',
                'description': 'Resort town in the province of Alberta, located within Banff National Park.',
                'image_url': 'https://images.unsplash.com/photo-1609863528735-f12ba72719ba?q=80&w=1000&auto=format&fit=crop',
                'currency': 'CAD',
                'cost_index': 1.2
            },
            {
                'name': 'Marrakech',
                'country': 'Morocco',
                'description': 'A major city of the Kingdom of Morocco.',
                'image_url': 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=1000&auto=format&fit=crop',
                'currency': 'MAD',
                'cost_index': 0.8
            }
        ]

        for dest_data in destinations:
            exists = Destination.query.filter_by(name=dest_data['name']).first()
            if not exists:
                new_dest = Destination(**dest_data)
                db.session.add(new_dest)
                print(f"Added destination: {dest_data['name']}")
        
        db.session.commit()

        # 2. Seed a Sample Public Trip if User exists
        user = User.query.first()
        if user:
            existing_trip = Trip.query.filter_by(title="My European Summer").first()
            if not existing_trip:
                public_trip = Trip(
                    user_id=user.id,
                    title="My European Summer",
                    start_date=None,
                    end_date=None,
                    description="Backpacking across France and Italy.",
                    budget_limit=5000,
                    visibility=1, # Public
                    cover_image="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&w=1350&q=80"
                )
                db.session.add(public_trip)
                print("Added sample Public Trip")
                db.session.commit()
    
    print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()
