from flask import Blueprint

api = Blueprint('api', __name__)

from . import container_routes, yard_routes  # Import your route modules here