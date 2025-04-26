from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(64))
    last_name = db.Column(db.String(64))
    role = db.Column(db.String(20), default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    @property
    def password(self):
        raise AttributeError('Password is not a readable attribute')
    
    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Inventory(db.Model):
    __tablename__ = 'inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    height = db.Column(db.Float)  # height in meters
    weight = db.Column(db.Float)  # weight in kg
    type = db.Column(db.String(20))  # flamable, inflamable, fragile, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_name': self.product_name,
            'quantity': self.quantity,
            'height': self.height,
            'weight': self.weight,
            'type': self.type,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Container(db.Model):
    __tablename__ = 'containers'
    
    id = db.Column(db.Integer, primary_key=True)
    container_id = db.Column(db.String(20), unique=True, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='At Yard')
    container_type = db.Column(db.String(50))
    size = db.Column(db.String(20))
    weight = db.Column(db.Float)
    source = db.Column(db.String(100))
    destination = db.Column(db.String(100))
    arrival_date = db.Column(db.DateTime)
    departure_date = db.Column(db.DateTime)
    owner = db.Column(db.String(100))
    contents = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'container_id': self.container_id,
            'status': self.status,
            'container_type': self.container_type,
            'size': self.size,
            'weight': self.weight,
            'source': self.source,
            'destination': self.destination,
            'arrival_date': self.arrival_date.isoformat() if self.arrival_date else None,
            'departure_date': self.departure_date.isoformat() if self.departure_date else None,
            'owner': self.owner,
            'contents': self.contents,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }