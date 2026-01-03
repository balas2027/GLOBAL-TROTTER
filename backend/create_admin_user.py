from app import create_app, db
from app.models.user import User

app = create_app()

with app.app_context():
    email = "admin@globaltrotter.com"
    username = "admin"
    password = "admin123"
    
    existing_user = User.query.filter_by(email=email).first()
    
    if existing_user:
        print(f"User with email {email} already exists.")
        # Optional: reset password if needed
        existing_user.set_password(password)
        db.session.commit()
        print(f"Password reset to '{password}' for {email}")
    else:
        new_user = User(
            username=username, 
            email=email,
            first_name="Admin",
            last_name="User",
            bio="System Administrator"
        )
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        print(f"Created admin user: {email} / {password}")
