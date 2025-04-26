import sys
import ssl
import certifi
import os
import requests
import logging
import geopy
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderUnavailable, GeocoderServiceError
from tabulate import tabulate
from flask import jsonify

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configure SSL certificates properly
geopy.geocoders.options.default_ssl_context = ssl.create_default_context(cafile=certifi.where())

# API Configuration - Get from environment variables with fallbacks
ORS_API_KEY = os.environ.get("ORS_API_KEY", "5b3ce3597851110001cf62480dc1469b88f248a7825ce5221a92e361")
OWM_API_KEY = os.environ.get("OWM_API_KEY", "f22b8105f58599ce05b1dd7812869c50")

class StateSelector:
    """
    Manages the list of Indian states for logistics operations.
    """
    INDIAN_STATES = {
        1: "Andhra Pradesh",     2: "Arunachal Pradesh", 3: "Assam",
        4: "Bihar",              5: "Chhattisgarh",     6: "Goa",
        7: "Gujarat",            8: "Haryana",          9: "Himachal Pradesh",
        10: "Jharkhand",         11: "Karnataka",       12: "Kerala",
        13: "Madhya Pradesh",    14: "Maharashtra",     15: "Manipur",
        16: "Meghalaya",         17: "Mizoram",         18: "Nagaland",
        19: "Odisha",            20: "Punjab",          21: "Rajasthan",
        22: "Sikkim",            23: "Tamil Nadu",      24: "Telangana",
        25: "Tripura",           26: "Uttar Pradesh",   27: "Uttarakhand",
        28: "West Bengal"
    }

    @classmethod
    def get_states(cls):
        """Returns a dictionary of state IDs and names."""
        return {str(num): state for num, state in cls.INDIAN_STATES.items()}


class GeoCoder:
    """
    Handles geocoding operations to convert addresses to coordinates.
    """
    def __init__(self):
        self.geolocator = Nominatim(
            user_agent="container_logistics",
            scheme='https'
        )

    def get_city_coords(self, city, state):
        """
        Converts a city and state to geographical coordinates.
        
        Args:
            city (str): City name
            state (str): State name
            
        Returns:
            tuple: (latitude, longitude) or None if geocoding failed
        """
        try:
            location = self.geolocator.geocode(
                f"{city}, {state}, India",
                timeout=15,
                exactly_one=True
            )
            if location:
                return (location.latitude, location.longitude)
            logger.warning(f"Could not geocode location: {city}, {state}, India")
            return None
        except (GeocoderUnavailable, GeocoderServiceError) as e:
            logger.error(f"Geocoding error: {str(e)}")
            return None


class RouteOptimizer:
    """
    Optimizes transportation routes based on origin, destination, and urgency.
    """
    # Realistic transport modes for container shipping
    TRANSPORT_MODES = {
        'urgent': ['driving-hgv', 'driving-truck'],  # Heavy goods vehicles for urgent delivery
        'normal': ['driving-hgv', 'driving-car']     # Standard options for normal delivery
    }

    @staticmethod
    def optimize_route(start, end, urgency):
        """
        Calculates an optimized route between two points.
        
        Args:
            start (tuple): (lat, lon) of starting point
            end (tuple): (lat, lon) of ending point
            urgency (str): 'urgent' or 'normal' priority
            
        Returns:
            dict: Route data or None if optimization failed
        """
        try:
            profile = RouteOptimizer.TRANSPORT_MODES[urgency][0]
            url = f"https://api.openrouteservice.org/v2/directions/{profile}"
            headers = {"Authorization": ORS_API_KEY}
            params = {
                "start": f"{start[1]},{start[0]}",
                "end": f"{end[1]},{end[0]}"
            }
            
            logger.info(f"Optimizing route from {start} to {end} using {profile} mode")
            response = requests.get(url, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if 'features' in data and len(data['features']) > 0:
                return data
            
            logger.warning("No route features found in API response")
            return None
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Route API request error: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Routing error: {str(e)}")
            return None


class LogisticsSystem:
    """
    Core logistics system for container management and transportation.
    """
    @staticmethod
    def validate_container(length, width, height, weight):
        """
        Validates container dimensions and weight against standard limits.
        
        Args:
            length, width, height (float): Container dimensions in meters
            weight (float): Container weight in kg
            
        Returns:
            list: Validation errors, if any
        """
        # Standard ISO container limits
        iso_max = {
            'standard_20ft': {'length': 6.06, 'width': 2.44, 'height': 2.59, 'weight': 24000},
            'standard_40ft': {'length': 12.19, 'width': 2.44, 'height': 2.59, 'weight': 30480},
            'high_cube_40ft': {'length': 12.19, 'width': 2.44, 'height': 2.89, 'weight': 30480}
        }
        
        # Minimum reasonable values for a container
        min_values = {
            'length': 0.5,  # 0.5 meters minimum length
            'width': 0.5,   # 0.5 meters minimum width
            'height': 0.5,  # 0.5 meters minimum height
            'weight': 10    # 10 kg minimum weight
        }
        
        errors = []
        
        # Check if dimensions are within reasonable ranges
        if length <= 0:
            errors.append("Container length must be a positive number")
        elif length < min_values['length']:
            errors.append(f"Container length ({length}m) is below minimum size ({min_values['length']}m)")
        elif length > iso_max['standard_40ft']['length']:
            errors.append(f"Container length ({length}m) exceeds maximum standard size ({iso_max['standard_40ft']['length']}m)")
            
        if width <= 0:
            errors.append("Container width must be a positive number")
        elif width < min_values['width']:
            errors.append(f"Container width ({width}m) is below minimum size ({min_values['width']}m)")
        elif width > iso_max['standard_40ft']['width']:
            errors.append(f"Container width ({width}m) exceeds maximum standard size ({iso_max['standard_40ft']['width']}m)")
            
        if height <= 0:
            errors.append("Container height must be a positive number")
        elif height < min_values['height']:
            errors.append(f"Container height ({height}m) is below minimum size ({min_values['height']}m)")
        elif height > iso_max['high_cube_40ft']['height']:
            errors.append(f"Container height ({height}m) exceeds maximum standard size ({iso_max['high_cube_40ft']['height']}m)")
            
        if weight <= 0:
            errors.append("Container weight must be a positive number")
        elif weight < min_values['weight']:
            errors.append(f"Container weight ({weight}kg) is below minimum weight ({min_values['weight']}kg)")
        elif weight > iso_max['standard_40ft']['weight']:
            errors.append(f"Container weight ({weight}kg) exceeds maximum limit of {iso_max['standard_40ft']['weight']}kg")
            
        return errors


def generate_logistics_plan(data):
    """
    Generates a comprehensive logistics plan for container transportation.
    
    Args:
        data (dict): Container and journey details
        
    Returns:
        tuple: (JSON response, status code)
    """
    try:
        # Extract container details with proper type conversion
        try:
            container = {
                'length': float(data.get('length', 0)) if data.get('length') not in (None, '') else 0,
                'width': float(data.get('width', 0)) if data.get('width') not in (None, '') else 0,
                'height': float(data.get('height', 0)) if data.get('height') not in (None, '') else 0,
                'weight': float(data.get('weight', 0)) if data.get('weight') not in (None, '') else 0
            }
        except ValueError as e:
            logger.error(f"Type conversion error: {str(e)}")
            return jsonify({
                'success': False, 
                'message': 'Invalid container dimensions. Please enter numeric values only.'
            }), 400
        
        logger.info(f"Processing container with dimensions: l={container['length']}m, w={container['width']}m, h={container['height']}m, weight={container['weight']}kg")
        
        # Validate container
        validation_errors = LogisticsSystem.validate_container(
            container['length'],
            container['width'],
            container['height'],
            container['weight']
        )
        
        if validation_errors:
            return jsonify({
                'success': False, 
                'errors': validation_errors
            }), 400
        
        # Get coordinates
        geocoder = GeoCoder()
        
        # Origin
        origin_city = data.get('origin_city', '').strip()
        origin_state = data.get('origin_state', '').strip()
        if not origin_city or not origin_state:
            return jsonify({
                'success': False, 
                'message': 'Origin city and state are required'
            }), 400
            
        origin_coords = geocoder.get_city_coords(origin_city, origin_state)
        if not origin_coords:
            return jsonify({
                'success': False, 
                'message': f'Could not find coordinates for {origin_city}, {origin_state}'
            }), 400
            
        # Destination
        dest_city = data.get('dest_city', '').strip()
        dest_state = data.get('dest_state', '').strip()
        if not dest_city or not dest_state:
            return jsonify({
                'success': False, 
                'message': 'Destination city and state are required'
            }), 400
            
        dest_coords = geocoder.get_city_coords(dest_city, dest_state)
        if not dest_coords:
            return jsonify({
                'success': False, 
                'message': f'Could not find coordinates for {dest_city}, {dest_state}'
            }), 400
            
        # Route optimization
        urgency = data.get('urgency', 'normal').lower()
        if urgency not in ['urgent', 'normal']:
            logger.warning(f"Invalid urgency value: {urgency}, defaulting to 'normal'")
            urgency = 'normal'
            
        route_data = RouteOptimizer.optimize_route(origin_coords, dest_coords, urgency)
        if not route_data:
            return jsonify({
                'success': False, 
                'message': 'Failed to optimize route. Please try again later.'
            }), 500
            
        # Process results
        try:
            summary = route_data['features'][0]['properties']['summary']
            distance_km = summary['distance'] / 1000
            duration_hrs = summary['duration'] / 3600
            
            # Calculate cost based on distance, weight and urgency factor
            base_cost = distance_km * 15
            weight_factor = max(container['weight'], 1) / 1000  # Avoid division by zero
            urgency_factor = 1.5 if urgency == 'urgent' else 1.0
            
            cost = base_cost * weight_factor * urgency_factor
            
            # Return results
            return jsonify({
                'success': True,
                'route': {
                    'origin': f"{origin_city}, {origin_state}",
                    'destination': f"{dest_city}, {dest_state}",
                    'distance_km': round(distance_km, 2),
                    'duration_hrs': round(duration_hrs, 2),
                    'transport_mode': 'Truck (Expedited)' if urgency == 'urgent' else 'Truck (Standard)',
                    'cost': round(cost, 2),
                    'container': container
                }
            }), 200
            
        except KeyError as e:
            logger.error(f"Missing data in route response: {str(e)}")
            return jsonify({
                'success': False, 
                'message': f'Missing data in route response: {str(e)}'
            }), 500
            
    except Exception as e:
        logger.error(f"Error generating logistics plan: {str(e)}")
        return jsonify({
            'success': False, 
            'message': f'Error generating logistics plan: {str(e)}'
        }), 500

def get_indian_states():
    """Returns a dictionary of Indian states for use in forms."""
    return StateSelector.get_states()