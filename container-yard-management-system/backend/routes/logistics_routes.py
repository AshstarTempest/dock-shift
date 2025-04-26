from flask import Blueprint, request, jsonify
from flask_login import login_required
from services.logistics_optimizer import generate_logistics_plan, get_indian_states, get_hubs_data

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