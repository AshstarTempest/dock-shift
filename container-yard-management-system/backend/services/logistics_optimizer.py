import sys
import ssl
import certifi
import os
import requests
import geopy
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderUnavailable, GeocoderServiceError
from tabulate import tabulate
from flask import jsonify

# Configure SSL certificates
ssl._create_default_https_context = ssl._create_unverified_context
geopy.geocoders.options.default_ssl_context = ssl.create_default_context(cafile=certifi.where())

# API Configuration
ORS_API_KEY = "5b3ce3597851110001cf62480dc1469b88f248a7825ce5221a92e361"
OWM_API_KEY = "f22b8105f58599ce05b1dd7812869c50"

class StateSelector:
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
        return {str(num): state for num, state in cls.INDIAN_STATES.items()}


class GeoCoder:
    def __init__(self):
        self.geolocator = Nominatim(
            user_agent="container_logistics",
            scheme='https'
        )

    def get_city_coords(self, city, state):
        try:
            location = self.geolocator.geocode(
                f"{city}, {state}, India",
                timeout=15,
                exactly_one=True
            )
            if location:
                return (location.latitude, location.longitude)
            return None
        except (GeocoderUnavailable, GeocoderServiceError) as e:
            print(f"Geocoding error: {str(e)}")
            return None


class RouteOptimizer:
    TRANSPORT_MODES = {
        'urgent': ['driving-car', 'cycling-regular'],
        'normal': ['foot-walking', 'wheelchair']
    }

    @staticmethod
    def optimize_route(start, end, urgency):
        try:
            profile = RouteOptimizer.TRANSPORT_MODES[urgency][0]
            url = f"https://api.openrouteservice.org/v2/directions/{profile}"
            headers = {"Authorization": ORS_API_KEY}
            params = {
                "start": f"{start[1]},{start[0]}",
                "end": f"{end[1]},{end[0]}"
            }
            response = requests.get(url, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if 'features' in data and len(data['features']) > 0:
                return data
            return None
            
        except Exception as e:
            print(f"Routing error: {str(e)}")
            return None


class LogisticsSystem:
    @staticmethod
    def validate_container(length, width, height, weight):
        iso_max = (100, 100, 100)
        errors = []
        
        if length > iso_max[0] or width > iso_max[1] or height > iso_max[2]:
            errors.append("Dimensions exceed ISO 668 standards")
        
        if weight > 30480:
            errors.append("Weight exceeds 30,480kg limit")
            
        return errors


def generate_logistics_plan(data):
    try:
        # Extract container details
        container = {
            'length': float(data.get('length', 0)),
            'width': float(data.get('width', 0)),
            'height': float(data.get('height', 0)),
            'weight': float(data.get('weight', 0))
        }
        
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
        origin_city = data.get('origin_city')
        origin_state = data.get('origin_state')
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
        dest_city = data.get('dest_city')
        dest_state = data.get('dest_state')
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
            urgency = 'normal'
            
        route_data = RouteOptimizer.optimize_route(origin_coords, dest_coords, urgency)
        if not route_data:
            return jsonify({
                'success': False, 
                'message': 'Failed to optimize route'
            }), 500
            
        # Process results
        try:
            summary = route_data['features'][0]['properties']['summary']
            distance_km = summary['distance'] / 1000
            duration_hrs = summary['duration'] / 3600
            cost = distance_km * 15 * (container['weight']/1000)  # Sample pricing
            
            # Return results
            return jsonify({
                'success': True,
                'route': {
                    'origin': f"{origin_city}, {origin_state}",
                    'destination': f"{dest_city}, {dest_state}",
                    'distance_km': round(distance_km, 2),
                    'duration_hrs': round(duration_hrs, 2),
                    'transport_mode': urgency.capitalize(),
                    'cost': round(cost, 2),
                    'container': container
                }
            }), 200
            
        except KeyError as e:
            return jsonify({
                'success': False, 
                'message': f'Missing data in route response: {str(e)}'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Error generating logistics plan: {str(e)}'
        }), 500

def get_indian_states():
    return StateSelector.get_states()