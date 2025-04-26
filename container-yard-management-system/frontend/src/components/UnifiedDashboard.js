import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/App.css';
import '../styles/ModularDashboard.css';
import { Alert } from 'react-bootstrap';

// Import our custom components
import MapPicker from './MapPicker';
import CreateContainerModal from './CreateContainerModal';

const UnifiedDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [containers, setContainers] = useState([]);
  const [majorHubs, setMajorHubs] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [activeTab, setActiveTab] = useState('containers');
  const [mstData, setMstData] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch required data on component mount
  useEffect(() => {
    fetchContainers();
    fetchHubs();
    fetchMSTData();

    // Check for messages from route navigation (like after dispatching a container)
    if (location.state?.success) {
      setNotification({
        type: 'success',
        message: location.state.message,
      });

      // Clear location state after showing the notification
      window.history.replaceState({}, document.title);

      // Auto-dismiss notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  }, [location]);

  // Fetch containers data
  const fetchContainers = async () => {
    try {
      const response = await axios.get('/api/containers');
      if (response.data.success) {
        setContainers(response.data.containers);
      } else {
        // For demo/development, use mock data
        setContainers([
          {
            id: 'MAEU1234567',
            container_id: 'MAEU1234567',
            type: '20GP',
            status: 'In Yard',
            major_hub: 'mumbai_hub',
            hub: 'mumbai_north',
            contents: 'Electronics',
            notes: 'Handle with care',
            fill_percentage: 75,
            priority: 'normal',
            pickup_lat: '19.0760',
            pickup_lng: '72.8777',
            drop_lat: '18.5204',
            drop_lng: '73.8567',
            pickup_address: 'Mumbai Port',
            drop_address: 'Pune Logistics Hub',
          },
          {
            id: 'CMAU7654321',
            container_id: 'CMAU7654321',
            type: '40HC',
            status: 'In Transit',
            major_hub: 'delhi_hub',
            hub: 'delhi_tughlakabad',
            contents: 'Textiles',
            notes: '',
            fill_percentage: 90,
            priority: 'high',
            pickup_lat: '28.7041',
            pickup_lng: '77.1025',
            drop_lat: '20.2961',
            drop_lng: '85.8245',
            pickup_address: 'Delhi Hub',
            drop_address: 'Bhubaneswar, Odisha',
          },
          {
            id: 'HLXU5432198',
            container_id: 'HLXU5432198',
            type: '40RF',
            status: 'Delivered',
            major_hub: 'chennai_hub',
            hub: 'chennai_port',
            contents: 'Perishable Goods',
            notes: 'Temperature controlled',
            fill_percentage: 65,
            priority: 'urgent',
            pickup_lat: '13.0827',
            pickup_lng: '80.2707',
            drop_lat: '12.9716',
            drop_lng: '77.5946',
            pickup_address: 'Chennai Port',
            drop_address: 'Bangalore City',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching containers:', error);
    }
  };

  // Fetch hubs data
  const fetchHubs = async () => {
    try {
      const response = await axios.get('/api/logistics/hubs');
      if (response.data?.success) {
        setMajorHubs(response.data.majorHubs);
        setHubs(response.data.hubs);
      } else {
        // Mock data for development
        setMajorHubs([
          { id: 'mumbai_hub', name: 'Mumbai Container Terminal' },
          { id: 'delhi_hub', name: 'Delhi Inland Container Depot' },
          { id: 'chennai_hub', name: 'Chennai Port Terminal' },
          { id: 'kolkata_hub', name: 'Kolkata Container Facility' },
          { id: 'bangalore_hub', name: 'Bangalore Logistics Park' },
        ]);

        setHubs([
          {
            id: 'mumbai_north',
            name: 'Mumbai North Terminal',
            major_hub: 'mumbai_hub',
          },
          {
            id: 'mumbai_south',
            name: 'Mumbai South Terminal',
            major_hub: 'mumbai_hub',
          },
          {
            id: 'delhi_tughlakabad',
            name: 'Tughlakabad ICD',
            major_hub: 'delhi_hub',
          },
          {
            id: 'delhi_patparganj',
            name: 'Patparganj ICD',
            major_hub: 'delhi_hub',
          },
          {
            id: 'chennai_port',
            name: 'Chennai Port',
            major_hub: 'chennai_hub',
          },
          {
            id: 'kolkata_dock',
            name: 'Kolkata Dock System',
            major_hub: 'kolkata_hub',
          },
          {
            id: 'whitefield',
            name: 'Whitefield ICD',
            major_hub: 'bangalore_hub',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching hubs:', error);
    }
  };

  // Fetch MST data for visualization
  const fetchMSTData = async () => {
    try {
      const response = await axios.get('/api/logistics/mst');
      if (response.data?.success) {
        setMstData(response.data.mst);
      } else {
        // Mock MST data for development
        setMstData({
          nodeCount: 12,
          edgeCount: 11,
          totalDistance: 2680.42,
          nodes: [
            { id: 'mumbai_hub', lat: 19.076, lng: 72.8777 },
            { id: 'delhi_hub', lat: 28.7041, lng: 77.1025 },
            { id: 'chennai_hub', lat: 13.0827, lng: 80.2707 },
            { id: 'kolkata_hub', lat: 22.5726, lng: 88.3639 },
            { id: 'bangalore_hub', lat: 12.9716, lng: 77.5946 },
          ],
          edges: [
            { from: 'mumbai_hub', to: 'delhi_hub', distance: 1163 },
            { from: 'delhi_hub', to: 'kolkata_hub', distance: 1304 },
            { from: 'kolkata_hub', to: 'chennai_hub', distance: 1369 },
            { from: 'chennai_hub', to: 'bangalore_hub', distance: 335 },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching MST data:', error);
    }
  };

  // Open container creation modal
  const openCreateModal = () => {
    setSelectedContainer(null);
    setShowCreateModal(true);
  };

  // Handle container save from modal
  const handleSaveContainer = async (containerData) => {
    try {
      // In a real implementation, this would call an API endpoint
      const isNewContainer = !selectedContainer;
      let updatedContainer;

      if (isNewContainer) {
        // For demo purposes, just add the container to state
        updatedContainer = {
          ...containerData,
          id: containerData.container_id,
          created_at: new Date().toISOString(),
        };

        setContainers([...containers, updatedContainer]);

        setNotification({
          type: 'success',
          message: `Container ${containerData.container_id} created successfully!`,
        });
      } else {
        // Update existing container
        updatedContainer = {
          ...containerData,
          id: selectedContainer.id,
          updated_at: new Date().toISOString(),
        };

        setContainers(
          containers.map((c) =>
            c.id === selectedContainer.id ? updatedContainer : c
          )
        );

        setNotification({
          type: 'success',
          message: `Container ${containerData.container_id} updated successfully!`,
        });
      }

      // Auto-dismiss notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.error('Error saving container:', error);
      setNotification({
        type: 'danger',
        message: `Error ${
          selectedContainer ? 'updating' : 'creating'
        } container: ${error.message}`,
      });
    }
  };

  // Open container edit modal
  const handleEditContainer = (container) => {
    setSelectedContainer(container);
    setShowCreateModal(true);
  };

  // Handle container deletion
  const handleDeleteContainer = async (containerId) => {
    if (!window.confirm('Are you sure you want to delete this container?')) {
      return;
    }

    try {
      // In a real implementation, this would call an API endpoint
      setContainers(containers.filter((c) => c.id !== containerId));

      setNotification({
        type: 'success',
        message: `Container ${containerId} deleted successfully!`,
      });

      // Auto-dismiss notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.error('Error deleting container:', error);
      setNotification({
        type: 'danger',
        message: `Error deleting container: ${error.message}`,
      });
    }
  };

  // Handle container actions (Urgent or Dispatch)
  const handleContainerAction = (container, action) => {
    // Navigate to the route optimization page with container details
    navigate('/route-optimization', {
      state: {
        container: container,
        action: action,
      },
    });
  };

  // Calculate progress bar color based on fill percentage
  const getProgressColor = (fillPercentage, priority) => {
    if (priority === 'urgent' && fillPercentage >= 50) {
      return '#ff4d4f'; // Red for urgent containers past threshold
    } else if (fillPercentage >= 90) {
      return '#ff4d4f'; // Red for regular containers past threshold
    } else if (fillPercentage >= 75) {
      return '#faad14'; // Yellow/amber for approaching threshold
    } else {
      return '#52c41a'; // Green for normal levels
    }
  };

  // Render container cards
  const renderContainerCards = () => {
    if (containers.length === 0) {
      return (
        <div className="no-containers">
          <i className="fas fa-box-open"></i>
          <p>
            No containers found. Click "Create New Container" to add your first
            container.
          </p>
        </div>
      );
    }

    return (
      <div className="container-grid">
        {containers.map((container) => (
          <div
            key={container.id || container.container_id}
            className={`container-card priority-${
              container.priority || 'normal'
            }`}
          >
            <div className="container-header">
              <h3>{container.id || container.container_id}</h3>
              <span
                className={`status-badge status-${
                  container.status?.toLowerCase().replace(/\s/g, '-') ||
                  'in-yard'
                }`}
              >
                {container.status || 'In Yard'}
              </span>
            </div>

            <div className="container-details">
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{container.type || 'N/A'}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Contents:</span>
                <span className="detail-value">
                  {container.contents || 'N/A'}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Hub:</span>
                <span className="detail-value">
                  {hubs.find((h) => h.id === container.hub)?.name ||
                    container.hub ||
                    'N/A'}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Major Hub:</span>
                <span className="detail-value">
                  {majorHubs.find((h) => h.id === container.major_hub)?.name ||
                    container.major_hub ||
                    'N/A'}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Priority:</span>
                <span
                  className={`detail-value priority-text priority-${
                    container.priority || 'normal'
                  }`}
                >
                  {container.priority
                    ? container.priority.charAt(0).toUpperCase() +
                      container.priority.slice(1)
                    : 'Normal'}
                </span>
              </div>

              {/* Fill percentage bar */}
              <div className="fill-percentage-container">
                <span className="detail-label">Fill %:</span>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${container.fill_percentage || 0}%`,
                      backgroundColor: getProgressColor(
                        container.fill_percentage || 0,
                        container.priority || 'normal'
                      ),
                    }}
                  ></div>
                </div>
                <span className="percentage-value">
                  {container.fill_percentage || 0}%
                </span>
              </div>

              {/* Show pickup/drop info if available */}
              {container.pickup_lat && container.pickup_lng && (
                <div className="detail-row">
                  <span className="detail-label">Pickup:</span>
                  <span className="detail-value coord-value">
                    {container.pickup_address ||
                      `${container.pickup_lat}, ${container.pickup_lng}`}
                  </span>
                </div>
              )}

              {container.drop_lat && container.drop_lng && (
                <div className="detail-row">
                  <span className="detail-label">Destination:</span>
                  <span className="detail-value coord-value">
                    {container.drop_address ||
                      `${container.drop_lat}, ${container.drop_lng}`}
                  </span>
                </div>
              )}
            </div>

            <div className="container-actions">
              <button
                className="action-button edit-button btn-small btn-outline"
                onClick={() => handleEditContainer(container)}
              >
                <i className="fas fa-edit"></i> Edit
              </button>
              <button
                className="action-button urgent-button btn-small btn-warning"
                onClick={() => handleContainerAction(container, 'urgent')}
                disabled={container.status === 'Delivered'}
              >
                <i className="fas fa-exclamation-triangle"></i> Urgent
              </button>
              <button
                className="action-button dispatch-button btn-small btn-primary"
                onClick={() => handleContainerAction(container, 'dispatch')}
                disabled={
                  container.status === 'In Transit' ||
                  container.status === 'Delivered'
                }
              >
                <i className="fas fa-truck"></i> Dispatch
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render MST visualization tab
  const renderMSTVisualizer = () => {
    return (
      <div className="mst-visualizer-container">
        <div className="dashboard-summary">
          <div className="stats-container">
            <div className="stat-card">
              <h3>Network Nodes</h3>
              <div className="stat-value">
                {mstData ? mstData.nodeCount || 'N/A' : 'Loading...'}
              </div>
            </div>
            <div className="stat-card">
              <h3>Optimized Connections</h3>
              <div className="stat-value">
                {mstData ? mstData.edgeCount || 'N/A' : 'Loading...'}
              </div>
            </div>
            <div className="stat-card">
              <h3>Total Distance</h3>
              <div className="stat-value">
                {mstData
                  ? `${mstData.totalDistance?.toFixed(2)} km` || 'N/A'
                  : 'Loading...'}
              </div>
            </div>
            <div className="stat-card">
              <h3>Efficiency Score</h3>
              <div className="stat-value">
                {mstData ? '94.8%' : 'Loading...'}
              </div>
            </div>
          </div>
        </div>

        <div className="recent-containers">
          <h2>Network Optimization Visualization</h2>
          <div className="mst-canvas-container">
            <canvas id="mst-canvas" className="mst-canvas"></canvas>
          </div>
        </div>
      </div>
    );
  };

  // Render statistics tab
  const renderStatistics = () => {
    return (
      <div className="statistics-container">
        <div className="dashboard-summary">
          <div className="stats-container">
            <div className="stat-card">
              <h3>Active Containers</h3>
              <div className="stat-value">{containers.length}</div>
              <div className="stat-trend trend-up">↑ 12% from last month</div>
            </div>
            <div className="stat-card">
              <h3>In Transit</h3>
              <div className="stat-value">
                {containers.filter((c) => c.status === 'In Transit').length}
              </div>
              <div className="stat-trend trend-up">↑ 8% from last week</div>
            </div>
            <div className="stat-card">
              <h3>Average Fill</h3>
              <div className="stat-value">
                {containers.length
                  ? `${Math.round(
                      containers.reduce(
                        (acc, c) => acc + (c.fill_percentage || 0),
                        0
                      ) / containers.length
                    )}%`
                  : '0%'}
              </div>
              <div className="stat-trend trend-up">↑ 5% improvement</div>
            </div>
            <div className="stat-card">
              <h3>Urgent Status</h3>
              <div className="stat-value">
                {containers.filter((c) => c.priority === 'urgent').length}
              </div>
              <div className="stat-trend trend-down">↓ 15% reduction</div>
            </div>
          </div>
        </div>

        <div className="recent-containers">
          <h2>Container Status Overview</h2>
          <table className="container-table">
            <thead>
              <tr>
                <th>Container ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Fill %</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {containers.slice(0, 5).map((container) => (
                <tr key={container.id || container.container_id}>
                  <td>{container.id || container.container_id}</td>
                  <td>{container.type || 'N/A'}</td>
                  <td>
                    <span
                      className={`status-badge status-${
                        container.status?.toLowerCase().replace(/\s/g, '-') ||
                        'in-yard'
                      }`}
                    >
                      {container.status || 'In Yard'}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`priority-${container.priority || 'normal'}`}
                    >
                      {container.priority
                        ? container.priority.charAt(0).toUpperCase() +
                          container.priority.slice(1)
                        : 'Normal'}
                    </span>
                  </td>
                  <td>{container.fill_percentage || 0}%</td>
                  <td>{container.hub || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="unified-dashboard">
      <div className="page-title">Unified Container Management Dashboard</div>
      <p className="welcome-message">
        Monitor and manage all container operations from a single interface.
        Coordinate logistics, track inventory, and optimize routes.
      </p>

      {/* Notification area */}
      {notification && (
        <Alert
          variant={notification.type}
          className="notification"
          onClose={() => setNotification(null)}
          dismissible
        >
          {notification.message}
        </Alert>
      )}

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${
            activeTab === 'containers' ? 'active' : ''
          } btn ${activeTab === 'containers' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('containers')}
        >
          <i className="fas fa-box-open"></i> Container Management
        </button>
        <button
          className={`tab-button ${activeTab === 'mst' ? 'active' : ''} btn ${
            activeTab === 'mst' ? 'btn-primary' : 'btn-outline'
          }`}
          onClick={() => setActiveTab('mst')}
        >
          <i className="fas fa-project-diagram"></i> Network Visualization
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''} btn ${
            activeTab === 'stats' ? 'btn-primary' : 'btn-outline'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          <i className="fas fa-chart-line"></i> Logistics Statistics
        </button>
      </div>

      {/* Create Container Button */}
      <div className="dashboard-actions">
        <button className="btn btn-primary btn-icon" onClick={openCreateModal}>
          <i className="fas fa-plus"></i> Create New Container
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {activeTab === 'containers' && renderContainerCards()}
        {activeTab === 'mst' && renderMSTVisualizer()}
        {activeTab === 'stats' && renderStatistics()}
      </div>

      {/* Container Creation/Edit Modal */}
      <CreateContainerModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        handleSave={handleSaveContainer}
        container={selectedContainer}
      />
    </div>
  );
};

export default UnifiedDashboard;
