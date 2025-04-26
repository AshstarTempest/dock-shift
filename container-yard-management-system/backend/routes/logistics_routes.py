from flask import Blueprint, request, jsonify
from flask_login import login_required
from services.logistics_optimizer import generate_logistics_plan, get_indian_states, get_hubs_data
from services.mst_service import mst_optimizer
from services.container_service import container_service

logistics_bp = Blueprint('logistics', __name__)

@logistics_bp.route('/api/logistics/states', methods=['GET'])
def get_states():
    """Get the list of Indian states for logistics planning"""
    return jsonify({
        'success': True,
        'states': get_indian_states()
    })

@logistics_bp.route('/api/logistics/hubs', methods=['GET'])
def get_hubs():
    """Get the list of major hubs and hubs for logistics planning"""
    major_hubs, hubs = get_hubs_data()
    return jsonify({
        'success': True,
        'majorHubs': major_hubs,
        'hubs': hubs
    })

@logistics_bp.route('/api/logistics/optimize', methods=['POST'])
@login_required
def optimize_logistics():
    """Generate an optimized logistics plan for container transportation"""
    data = request.get_json()
    
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
    
    # Required fields
    required_fields = ['length', 'width', 'height', 'weight', 
                       'origin_city', 'origin_state', 'dest_city', 'dest_state']
    
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False, 
                'message': f'Missing required field: {field}'
            }), 400
    
    # Generate logistics plan
    return generate_logistics_plan(data)

@logistics_bp.route('/api/logistics/mst', methods=['GET'])
def get_mst():
    """Get the Minimum Spanning Tree for the logistics network"""
    # Get hub data from the service
    major_hubs, hubs = get_hubs_data()
    
    # Build MST from hub data
    mst_edges, total_distance = mst_optimizer.build_mst(hubs)
    
    # Return MST data for visualization
    return jsonify({
        'success': True,
        'mst': mst_optimizer.get_mst_for_visualization(),
        'totalDistance': round(total_distance, 2),
        'edgeCount': len(mst_edges)
    })

@logistics_bp.route('/api/logistics/path', methods=['POST'])
def find_path():
    """Find the optimal path between two hubs using the MST"""
    data = request.get_json()
    
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
    
    start_hub_id = data.get('start_hub_id')
    end_hub_id = data.get('end_hub_id')
    
    if not start_hub_id or not end_hub_id:
        return jsonify({
            'success': False,
            'message': 'Missing start_hub_id or end_hub_id'
        }), 400
    
    # Find the path using MST
    path, distance = mst_optimizer.find_shortest_path(start_hub_id, end_hub_id)
    
    if not path:
        return jsonify({
            'success': False,
            'message': 'No path found between the specified hubs'
        }), 404
    
    return jsonify({
        'success': True,
        'path': path,
        'distance': round(distance, 2)
    })

# Container management routes
@logistics_bp.route('/api/containers', methods=['GET'])
def get_containers():
    """Get all active containers in the system"""
    containers = container_service.get_all_containers()
    
    return jsonify({
        'success': True,
        'containers': containers
    })