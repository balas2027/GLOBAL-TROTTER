from app import create_app, db
from app.models.user import User

app = create_app()

with app.app_context():
    # Check if admin exists
    admin = User.query.filter_by(username='admin_traveler').first()
    if not admin:
        admin = User(
            username='admin_traveler',
            email='admin@example.com',
            first_name='Admin',
            last_name='User'
        )
        admin.set_password('admin123') # Default password
        db.session.add(admin)
        db.session.commit()
        print("Admin user created: admin_traveler / admin123")
    else:
        print("Admin user already exists.")
