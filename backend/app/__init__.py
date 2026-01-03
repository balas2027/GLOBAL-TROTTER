from flask import Flask
from flask_cors import CORS
from .config import Config
from app.extensions import db, migrate
from flask_jwt_extended import JWTManager

jwt = JWTManager()

from app import models

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Blueprints
    from app.routes.auth import auth_bp
    from app.routes.trips import trips_bp
    from app.routes.itineraries import itinerary_bp
    from app.routes.admin import admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(trips_bp, url_prefix='/api/trips')
    app.register_blueprint(itinerary_bp, url_prefix='/api/itineraries')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'VibeHolidays API is running'}

    return app
