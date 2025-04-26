from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import enum

db = SQLAlchemy()

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    role = db.Column(db.String(20), default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    containers = db.relationship('Container', backref='user', lazy=True)
    inventory_items = db.relationship('Inventory', backref='user', lazy=True)
    
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')
        
    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
        
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class ContainerStatus(enum.Enum):
    IN_YARD = "In Yard"
    IN_TRANSIT = "In Transit"
    DELIVERED = "Delivered"
    DELAYED = "Delayed"
    MAINTENANCE = "Maintenance"

class PriorityLevel(enum.Enum):
    LOW = "Low"
    NORMAL = "Normal"
    HIGH = "High"
    URGENT = "Urgent"

class Hub(db.Model):
    __tablename__ = 'hubs'
    
    id = db.Column(db.Integer, primary_key=True)
    hub_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    is_major = db.Column(db.Boolean, default=False)
    hub_type = db.Column(db.String(50))  # port, inland, etc.
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Parent-child relationship for major hubs and sub-hubs
    major_hub_id = db.Column(db.Integer, db.ForeignKey('hubs.id'), nullable=True)
    sub_hubs = db.relationship('Hub', backref=db.backref('major_hub', remote_side=[id]), lazy=True)
    
    # Containers at this hub
    containers = db.relationship('Container', backref='hub', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'hub_id': self.hub_id,
            'name': self.name,
            'city': self.city,
            'state': self.state,
            'is_major': self.is_major,
            'hub_type': self.hub_type,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'major_hub_id': self.major_hub_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class InventoryType(enum.Enum):
    FLAMABLE = "flamable"
    INFLAMABLE = "inflamable"
    FRAGILE = "fragile"
    NON_HAZARDOUS = "non-hazardous"
    HAZARDOUS = "hazardous"
    PERISHABLE = "perishable"

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
    
    # Container assignment - an inventory item can be assigned to a container
    container_id = db.Column(db.Integer, db.ForeignKey('containers.id'), nullable=True)
    
    # User who created/owns this inventory item
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_name': self.product_name,
            'quantity': self.quantity,
            'height': self.height,
            'weight': self.weight,
            'type': self.type,
            'container_id': self.container_id,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Container(db.Model):
    __tablename__ = 'containers'
    
    id = db.Column(db.Integer, primary_key=True)
    container_id = db.Column(db.String(20), unique=True, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='In Yard')
    container_type = db.Column(db.String(50))  # 40HQ, 20GP, 40RF, etc.
    size = db.Column(db.String(20))
    total_weight = db.Column(db.Float)  # weight in kg
    fill_percentage = db.Column(db.Integer, default=0)  # 0-100%
    
    # Location details
    pickup_city = db.Column(db.String(100))
    pickup_lat = db.Column(db.Float)
    pickup_lng = db.Column(db.Float)
    destination_city = db.Column(db.String(100))
    destination_lat = db.Column(db.Float)
    destination_lng = db.Column(db.Float)
    
    # Hub assignment
    hub_id = db.Column(db.Integer, db.ForeignKey('hubs.id'), nullable=True)
    
    # Dates
    arrival_date = db.Column(db.DateTime)
    departure_date = db.Column(db.DateTime)
    
    # Additional details
    contents = db.Column(db.String(255))
    notes = db.Column(db.Text)
    priority = db.Column(db.String(20), default='normal')  # low, normal, high, urgent
    
    # User assignment
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with inventory items
    inventory_items = db.relationship('Inventory', backref='container', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'container_id': self.container_id,
            'status': self.status,
            'container_type': self.container_type,
            'size': self.size,
            'total_weight': self.total_weight,
            'fill_percentage': self.fill_percentage,
            'pickup_city': self.pickup_city,
            'pickup_lat': self.pickup_lat,
            'pickup_lng': self.pickup_lng,
            'destination_city': self.destination_city, 
            'destination_lat': self.destination_lat,
            'destination_lng': self.destination_lng,
            'hub_id': self.hub_id,
            'arrival_date': self.arrival_date.isoformat() if self.arrival_date else None,
            'departure_date': self.departure_date.isoformat() if self.departure_date else None,
            'contents': self.contents,
            'notes': self.notes,
            'priority': self.priority,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Routes model to track shipping routes
class Route(db.Model):
    __tablename__ = 'routes'
    
    id = db.Column(db.Integer, primary_key=True)
    origin_hub_id = db.Column(db.Integer, db.ForeignKey('hubs.id'), nullable=False)
    destination_hub_id = db.Column(db.Integer, db.ForeignKey('hubs.id'), nullable=False)
    distance_km = db.Column(db.Float)
    duration_hrs = db.Column(db.Float)
    transport_mode = db.Column(db.String(50))  # Truck, Train, Ship, etc.
    cost = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    origin_hub = db.relationship('Hub', foreign_keys=[origin_hub_id])
    destination_hub = db.relationship('Hub', foreign_keys=[destination_hub_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'origin_hub_id': self.origin_hub_id,
            'destination_hub_id': self.destination_hub_id,
            'distance_km': self.distance_km,
            'duration_hrs': self.duration_hrs,
            'transport_mode': self.transport_mode,
            'cost': self.cost,
            'created_at': self.created_at.isoformat()
        }

# Join table for tracking container journeys through multiple routes
class ContainerJourney(db.Model):
    __tablename__ = 'container_journeys'
    
    id = db.Column(db.Integer, primary_key=True)
    container_id = db.Column(db.Integer, db.ForeignKey('containers.id'), nullable=False)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'), nullable=False)
    sequence_number = db.Column(db.Integer) # Order in the journey 
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    status = db.Column(db.String(50))  # Planned, In Progress, Completed, Cancelled
    
    # Relationships
    container = db.relationship('Container')
    route = db.relationship('Route')
    
    def to_dict(self):
        return {
            'id': self.id,
            'container_id': self.container_id,
            'route_id': self.route_id,
            'sequence_number': self.sequence_number,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'status': self.status
        }