from app import create_app, db
from app.models.user import User

app = create_app()

with app.app_context():
    email = "admin@globaltrotter.com"
    target_username = "admin"
    
    user = User.query.filter_by(email=email).first()
    if user:
        if user.username != target_username:
            print(f"Updating username from '{user.username}' to '{target_username}'")
            user.username = target_username
            try:
                db.session.commit()
                print("Username updated successfully.")
            except Exception as e:
                print(f"Failed to update username: {e}")
                db.session.rollback()
        else:
            print("Username is already correct.")
    else:
        print("Admin user not found.")
