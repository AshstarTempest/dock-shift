from flask import Blueprint

api = Blueprint('api', __name__)

from . import logistics_routes  # Import the existing routes module