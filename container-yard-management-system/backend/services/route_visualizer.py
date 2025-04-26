import os
import folium
import polyline
import openrouteservice as ors
from flask import render_template_string, url_for
import json
import logging
import tempfile
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# API Configuration
ORS_API_KEY = os.environ.get("ORS_API_KEY", "5b3ce3597851110001cf62480dc1469b88f248a7825ce5221a92e361")

class RouteVisualizer:
    """
    Creates interactive maps for visualizing routes between hubs using Folium and OpenRouteService.
    """
    def __init__(self):
        self.client = ors.Client(key=ORS_API_KEY)
        # Ensure static folder exists
        self.maps_dir = Path(__file__).parent.parent / 'static' / 'maps'
        os.makedirs(self.maps_dir, exist_ok=True)
    
    def create_route_map(self, start_coords, end_coords, start_name, end_name):
        """
        Creates an interactive map showing the route between two points.
        
        Args:
            start_coords (tuple): (lat, lon) of starting point
            end_coords (tuple): (lat, lon) of ending point
            start_name (str): Name of the starting location
            end_name (str): Name of the ending location
            
        Returns:
            str: Path to the generated HTML file
        """
        try:
            # Calculate the route using OpenRouteService
            coordinates = [[start_coords[1], start_coords[0]], [end_coords[1], end_coords[0]]]
            
            # Request the route from OpenRouteService
            route = self.client.directions(
                coordinates=coordinates,
                profile='driving-hgv',
                format='geojson',
                validate=False
            )
            
            # Center the map between the start and end points
            center_lat = (start_coords[0] + end_coords[0]) / 2
            center_lon = (start_coords[1] + end_coords[1]) / 2
            
            # Create the map
            m = folium.Map(location=[center_lat, center_lon], zoom_start=6)
            
            # Add start marker
            folium.Marker(
                location=[start_coords[0], start_coords[1]],
                popup=start_name,
                icon=folium.Icon(color='green', icon='play', prefix='fa')
            ).add_to(m)
            
            # Add end marker
            folium.Marker(
                location=[end_coords[0], end_coords[1]],
                popup=end_name,
                icon=folium.Icon(color='red', icon='stop', prefix='fa')
            ).add_to(m)
            
            # Extract route geometry
            route_coords = route['features'][0]['geometry']['coordinates']
            route_points = [[y, x] for x, y in route_coords]  # Folium needs [lat, lon] but GeoJSON gives [lon, lat]
            
            # Add the route as a line
            folium.PolyLine(
                route_points,
                color='blue',
                weight=5,
                opacity=0.7,
                tooltip=f"Route: {start_name} to {end_name}"
            ).add_to(m)
            
            # Extract summary information
            summary = route['features'][0]['properties']['summary']
            distance_km = summary['distance'] / 1000
            duration_hrs = summary['duration'] / 3600
            
            # Add route information
            folium.LayerControl().add_to(m)
            
            # Add a title to the map
            title_html = f'''
                <h3 align="center" style="font-size:16px"><b>Route: {start_name} to {end_name}</b></h3>
                <h4 align="center" style="font-size:14px">Distance: {distance_km:.2f} km | Duration: {duration_hrs:.2f} hours</h4>
            '''
            m.get_root().html.add_child(folium.Element(title_html))
            
            # Generate a unique filename for the map
            map_filename = f"route_{start_name.replace(' ', '_')}_{end_name.replace(' ', '_')}.html"
            map_path = self.maps_dir / map_filename
            
            # Save the map
            m.save(str(map_path))
            logger.info(f"Map created at {map_path}")
            
            return {
                'map_file': map_filename,
                'distance_km': distance_km,
                'duration_hrs': duration_hrs,
                'success': True
            }
            
        except Exception as e:
            logger.error(f"Error creating route map: {str(e)}")
            return {
                'error': f"Error creating route map: {str(e)}",
                'success': False
            }
    
    def create_multi_hub_map(self, hubs_data):
        """
        Creates a map showing multiple hubs and their connections.
        
        Args:
            hubs_data (list): List of hub dictionaries with name, lat, lng fields
            
        Returns:
            str: Path to the generated HTML file
        """
        try:
            # Calculate center of all hubs
            lats = [hub['coordinates']['lat'] for hub in hubs_data]
            lngs = [hub['coordinates']['lng'] for hub in hubs_data]
            center_lat = sum(lats) / len(lats)
            center_lng = sum(lngs) / len(lngs)
            
            # Create map centered on the average position
            m = folium.Map(location=[center_lat, center_lng], zoom_start=5)
            
            # Add markers for each hub
            for hub in hubs_data:
                folium.Marker(
                    location=[hub['coordinates']['lat'], hub['coordinates']['lng']],
                    popup=f"{hub['city']}, {hub['state']}",
                    tooltip=hub['city'],
                    icon=folium.Icon(color='blue')
                ).add_to(m)
            
            # Add a title to the map
            title_html = f'''
                <h3 align="center" style="font-size:16px"><b>Container Yard Management System: Major Hubs</b></h3>
                <h4 align="center" style="font-size:14px">{len(hubs_data)} Major Hubs in India</h4>
            '''
            m.get_root().html.add_child(folium.Element(title_html))
            
            # Generate a unique filename for the map
            map_filename = "major_hubs.html"
            map_path = self.maps_dir / map_filename
            
            # Save the map
            m.save(str(map_path))
            logger.info(f"Multi-hub map created at {map_path}")
            
            return {
                'map_file': map_filename,
                'hub_count': len(hubs_data),
                'success': True
            }
            
        except Exception as e:
            logger.error(f"Error creating multi-hub map: {str(e)}")
            return {
                'error': f"Error creating multi-hub map: {str(e)}",
                'success': False
            }