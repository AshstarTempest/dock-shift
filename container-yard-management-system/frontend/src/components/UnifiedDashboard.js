import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import Header from './Header';
import MSTVisualizer from './MSTVisualizer';
import '../styles/ModularDashboard.css';

// Container Card Component
const ContainerCard = ({
  container,
  onDispatch,
  onMarkUrgent,
  onAddProduct,
}) => {
  const getStatusClass = (status) => {
    status = status.toLowerCase().replace(/\s+/g, '-');
    if (status === 'in-transit') return 'in-transit';
    if (status === 'at-yard' || status === 'in-yard') return 'in-yard';
    if (status === 'delivered') return 'delivered';
    return '';
  };

  // Fill percentage with default value
  const fillPercentage = container.fill_percentage || 0;

  // Determine if container is ready for dispatch based on urgency and fill level
  const isUrgent = container.is_urgent || false;
  const dispatchThreshold = isUrgent ? 50 : 90;
  const isReadyForDispatch = fillPercentage >= dispatchThreshold;

  // Get color for fill bar
  const getFillColor = () => {
    if (fillPercentage >= 90) return '#e53935'; // Red for very full
    if (fillPercentage >= 75) return '#ff9800'; // Orange for mostly full
    if (fillPercentage >= 50) return '#4caf50'; // Green for half full
    return '#2196f3'; // Blue for low fill
  };

  // Handle the dispatch button click
  const handleDispatch = () => {
    if (onDispatch && isReadyForDispatch) {
      onDispatch(container.id);
    }
  };

  // Handle marking container as urgent
  const handleMarkUrgent = () => {
    if (onMarkUrgent) {
      onMarkUrgent(container.id, true);
    }
  };

  // Handle adding a product to the container
  const handleAddProduct = () => {
    if (onAddProduct) {
      onAddProduct(container.id);
    }
  };

  return (
    <div className={`container-card ${isUrgent ? 'urgent' : ''}`}>
      <div className="container-card-header">
        <span className="container-id">{container.id}</span>
        <span
          className={`container-status ${getStatusClass(container.status)}`}
        >
          {container.status}
        </span>
        {isUrgent && (
          <span className="urgency-badge">
            <i className="fas fa-exclamation-circle"></i> URGENT
          </span>
        )}
      </div>

      {/* Fill percentage indicator */}
      <div className="fill-percentage-container">
        <div className="fill-percentage-bar-container">
          <div
            className="fill-percentage-bar"
            style={{
              width: `${fillPercentage}%`,
              backgroundColor: getFillColor(),
            }}
          ></div>
          {/* Threshold indicator */}
          <div
            className="dispatch-threshold"
            style={{ left: `${dispatchThreshold}%` }}
            title={`Dispatch at ${dispatchThreshold}%`}
          ></div>
        </div>
        <div className="fill-percentage-text">
          {fillPercentage}% filled
          {isReadyForDispatch && <span className="dispatch-ready"> READY</span>}
        </div>
      </div>

      <div className="container-content">
        <div className="container-detail">
          <span className="detail-label">Type:</span>
          <span className="detail-value">{container.type || '40HQ'}</span>
        </div>
        <div className="container-detail">
          <span className="detail-label">Location:</span>
          <span className="detail-value">
            {container.location || 'Block A, Row 3, Slot 12'}
          </span>
        </div>
        <div className="container-detail">
          <span className="detail-label">Arrival:</span>
          <span className="detail-value">
            {container.arrival_date || container.arrival || '4/20/2025'}
          </span>
        </div>
        <div className="container-detail">
          <span className="detail-label">Departure:</span>
          <span className="detail-value">
            {container.departure_date || container.departure || 'Not scheduled'}
          </span>
        </div>
        <div className="container-detail">
          <span className="detail-label">Contents:</span>
          <span className="detail-value">
            {container.contents_description ||
              (container.contents && Array.isArray(container.contents)
                ? `${container.contents.length} items`
                : container.contents || 'Empty')}
          </span>
        </div>
        <div className="container-detail">
          <span className="detail-label">Weight:</span>
          <span className="detail-value">
            {container.total_weight ? `${container.total_weight} kg` : 'N/A'}
          </span>
        </div>
      </div>
      <div className="container-actions">
        <button
          className="container-action-btn view"
          onClick={handleAddProduct}
        >
          <i className="fas fa-plus"></i>
          Add Product
        </button>
        {isReadyForDispatch && (
          <button
            className="container-action-btn dispatch"
            onClick={handleDispatch}
          >
            <i className="fas fa-shipping-fast"></i>
            Dispatch
          </button>
        )}
        {!isReadyForDispatch && !isUrgent && (
          <button
            className="container-action-btn set-urgent"
            onClick={handleMarkUrgent}
          >
            <i className="fas fa-exclamation-triangle"></i>
            Mark Urgent
          </button>
        )}
      </div>
    </div>
  );
};

// Product Modal Component for adding products to containers
const ProductModal = ({ show, onClose, onAddProduct, containerId }) => {
  const [product, setProduct] = useState({
    name: '',
    weight: 0,
    volume: 0,
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === 'name' || name === 'description' ? value : parseFloat(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct(containerId, product);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="product-modal">
        <div className="modal-header">
          <h3>Add Product to Container {containerId}</h3>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={product.weight}
              onChange={handleChange}
              min="0.1"
              step="0.1"
              required
            />
          </div>
          <div className="form-group">
            <label>Volume (cubic meters)</label>
            <input
              type="number"
              name="volume"
              value={product.volume}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Container Management Dashboard Component
const ContainerManagementDashboard = ({
  containers,
  onDispatch,
  onMarkUrgent,
  onAddProduct,
}) => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);

  const handleAddProductClick = (containerId) => {
    setSelectedContainer(containerId);
    setShowProductModal(true);
  };

  const handleProductAdd = (containerId, product) => {
    onAddProduct(containerId, product);
  };

  return (
    <div className="container-management-dashboard">
      <h2>Container Management</h2>
      <p className="dashboard-subtitle">
        Monitor and manage every container with detailed tracking and status
        information
      </p>

      {containers.length === 0 ? (
        <div className="no-containers">
          <i className="fas fa-shipping-fast fa-3x"></i>
          <p>No containers available. Create a new container to get started.</p>
        </div>
      ) : (
        <div className="container-cards-grid">
          {containers.map((container) => (
            <ContainerCard
              key={container.id}
              container={container}
              onDispatch={onDispatch}
              onMarkUrgent={onMarkUrgent}
              onAddProduct={handleAddProductClick}
            />
          ))}
        </div>
      )}

      <ProductModal
        show={showProductModal}
        onClose={() => setShowProductModal(false)}
        onAddProduct={handleProductAdd}
        containerId={selectedContainer}
      />
    </div>
  );
};

// Network Dashboard Component
const NetworkDashboard = ({ mstData, selectedPath }) => {
  return (
    <div className="network-dashboard">
      <h2>Network Optimization</h2>
      <p className="dashboard-subtitle">
        Visualize the Minimum Spanning Tree (MST) network connecting all hubs
      </p>

      <div className="visualizer-container">
        <MSTVisualizer mstData={mstData} selectedPath={selectedPath} />
      </div>
    </div>
  );
};

// Dashboard Command Bar Component
const CommandBar = ({ onSearchChange, activeModule, setActiveModule }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting = 'Good morning';

  if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good afternoon';
  } else if (currentHour >= 17) {
    greeting = 'Good evening';
  }

  return (
    <div className="command-bar">
      <div className="greeting-section">
        <h2>
          {greeting}, {currentUser?.firstName || 'User'}
        </h2>
        <p className="date-display">
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="search-section">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search across containers, inventory, routes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button className="voice-search">
            <i className="fas fa-microphone"></i>
          </button>
        </div>
      </div>

      <div className="module-selector">
        <button
          className={`module-button ${
            activeModule === 'network' ? 'active' : ''
          }`}
          onClick={() => setActiveModule('network')}
        >
          <i className="fas fa-project-diagram"></i>
          <span>Network</span>
        </button>
        <button
          className={`module-button ${
            activeModule === 'containers' ? 'active' : ''
          }`}
          onClick={() => setActiveModule('containers')}
        >
          <i className="fas fa-shipping-fast"></i>
          <span>Containers</span>
        </button>
        <button
          className={`module-button ${
            activeModule === 'dispatch' ? 'active' : ''
          }`}
          onClick={() => setActiveModule('dispatch')}
        >
          <i className="fas fa-truck-loading"></i>
          <span>Dispatch</span>
        </button>
      </div>

      <div className="quick-actions">
        <button className="action-button">
          <i className="fas fa-plus"></i>
          <span>New</span>
        </button>
        <button className="action-button">
          <i className="fas fa-cog"></i>
        </button>
        <button className="action-button notification">
          <i className="fas fa-bell"></i>
          <span className="notification-badge">3</span>
        </button>
      </div>
    </div>
  );
};

// Stats Overview Component
const StatsOverview = ({ stats }) => {
  return (
    <div className="stats-overview">
      <div className="stat-card total">
        <div className="stat-icon">
          <i className="fas fa-cubes"></i>
        </div>
        <div className="stat-details">
          <span className="stat-value">{stats.totalContainers}</span>
          <span className="stat-label">Total Containers</span>
        </div>
        <div className="stat-trend positive">
          <i className="fas fa-arrow-up"></i>
          <span>4%</span>
        </div>
      </div>

      <div className="stat-card transit">
        <div className="stat-icon">
          <i className="fas fa-shipping-fast"></i>
        </div>
        <div className="stat-details">
          <span className="stat-value">{stats.inTransit}</span>
          <span className="stat-label">In Transit</span>
        </div>
        <div className="stat-trend positive">
          <i className="fas fa-arrow-up"></i>
          <span>7%</span>
        </div>
      </div>

      <div className="stat-card yard">
        <div className="stat-icon">
          <i className="fas fa-warehouse"></i>
        </div>
        <div className="stat-details">
          <span className="stat-value">{stats.atYard}</span>
          <span className="stat-label">At Yard</span>
        </div>
        <div className="stat-trend negative">
          <i className="fas fa-arrow-down"></i>
          <span>2%</span>
        </div>
      </div>

      <div className="stat-card delivered">
        <div className="stat-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <div className="stat-details">
          <span className="stat-value">
            {stats.readyForDispatch || stats.delivered}
          </span>
          <span className="stat-label">Ready for Dispatch</span>
        </div>
        <div className="stat-trend positive">
          <i className="fas fa-arrow-up"></i>
          <span>12%</span>
        </div>
      </div>
    </div>
  );
};

// Create Container Form Component
const CreateContainerForm = ({ onCreateContainer, onClose }) => {
  const [containerData, setContainerData] = useState({
    type: '40HQ',
    location: '',
    hub_id: '',
  });
  const [hubs, setHubs] = useState({});
  const [majorHubs, setMajorHubs] = useState({});
  const [selectedMajorHub, setSelectedMajorHub] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch hubs data
  useEffect(() => {
    const fetchHubs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'http://localhost:5000/api/logistics/hubs',
          {
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch hubs data');
        }

        const data = await response.json();

        if (data.success) {
          setMajorHubs(data.majorHubs);
          setHubs(data.hubs);
        }
      } catch (error) {
        console.error('Error fetching hubs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHubs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'majorHub') {
      setSelectedMajorHub(value);
      setContainerData((prev) => ({ ...prev, hub_id: '' }));
    } else {
      setContainerData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateContainer(containerData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="product-modal">
        <div className="modal-header">
          <h3>Create New Container</h3>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading hubs data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Container Type</label>
              <select
                name="type"
                value={containerData.type}
                onChange={handleChange}
                required
              >
                <option value="20GP">20GP - General Purpose</option>
                <option value="40HQ">40HQ - High Cube</option>
                <option value="40RF">40RF - Refrigerated</option>
                <option value="20TK">20TK - Tank Container</option>
              </select>
            </div>

            <div className="form-group">
              <label>Major Hub</label>
              <select
                name="majorHub"
                value={selectedMajorHub}
                onChange={handleChange}
                required
              >
                <option value="">Select a major hub</option>
                {Object.entries(majorHubs).map(([id, hub]) => (
                  <option key={id} value={id}>
                    {hub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hub</label>
              <select
                name="hub_id"
                value={containerData.hub_id}
                onChange={handleChange}
                disabled={!selectedMajorHub}
                required
              >
                <option value="">Select a hub</option>
                {selectedMajorHub &&
                  hubs[selectedMajorHub]?.map((hub) => (
                    <option key={hub.id} value={hub.id}>
                      {hub.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location Description</label>
              <input
                type="text"
                name="location"
                value={containerData.location}
                onChange={handleChange}
                placeholder="e.g., Block A, Row 3, Slot 12"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-submit">
                Create Container
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
const UnifiedDashboard = () => {
  const [activeModule, setActiveModule] = useState('containers');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [containers, setContainers] = useState([]);
  const [mstData, setMstData] = useState(null);
  const [selectedPath, setSelectedPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch initial dashboard data
  useEffect(() => {
    fetchDashboardData();
    fetchContainers();
    fetchMstData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real implementation, fetch from your API
      // Here, use mock data
      setDashboardStats({
        totalContainers: 125,
        inTransit: 43,
        atYard: 67,
        readyForDispatch: 15,
      });
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Error loading dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchContainers = async () => {
    try {
      // In a real implementation, fetch from your API
      // For this demonstration, use mock data with different fill percentages
      const mockContainers = [
        {
          id: 'C1042',
          status: 'In Yard',
          type: '40HQ',
          fill_percentage: 85,
          location: 'Block A, Row 3, Slot 12',
          arrival_date: '2025-04-20',
          contents: 'Electronics',
          total_weight: 15000,
        },
        {
          id: 'C7589',
          status: 'In Transit',
          type: '20GP',
          fill_percentage: 100,
          location: 'En route to yard',
          arrival_date: '2025-04-26',
          contents: 'Automotive Parts',
          total_weight: 8500,
        },
        {
          id: 'C2305',
          status: 'In Yard',
          type: '40RF',
          fill_percentage: 45,
          is_urgent: true,
          location: 'Block C, Row 1, Slot 4',
          arrival_date: '2025-04-18',
          contents: 'Perishable Goods',
          total_weight: 12000,
        },
        {
          id: 'C8912',
          status: 'In Yard',
          type: '40HQ',
          fill_percentage: 92,
          location: 'Block B, Row 5, Slot 2',
          arrival_date: '2025-04-15',
          contents: 'Furniture',
          total_weight: 18000,
        },
      ];

      setContainers(mockContainers);
    } catch (err) {
      console.error('Container data fetch error:', err);
      setError('Error loading containers');
    }
  };

  const fetchMstData = async () => {
    try {
      // In a real implementation, fetch from your API
      // For this demonstration, use mock MST data
      setMstData({
        mst: [
          { source: '28_1', target: '28_2', distance: 12.5 },
          { source: '28_2', target: '28_3', distance: 58.7 },
          { source: '28_3', target: '28_4', distance: 26.3 },
          { source: '28_1', target: '19_1', distance: 130.2 },
          { source: '19_1', target: '19_2', distance: 25.8 },
          { source: '19_2', target: '19_3', distance: 150.4 },
          { source: '19_1', target: '14_2', distance: 340.6 },
        ],
        totalDistance: 744.5,
        edgeCount: 7,
      });

      // Set a default selected path
      setSelectedPath(['19_1', '14_2']);
    } catch (err) {
      console.error('MST data fetch error:', err);
      setError('Error loading network data');
    }
  };

  // Handle container actions
  const handleDispatchContainer = (containerId) => {
    // In a real implementation, call your API
    console.log(`Dispatching container ${containerId}`);

    // Update local state to reflect the change
    setContainers((prevContainers) =>
      prevContainers.filter((container) => container.id !== containerId)
    );

    // Update stats
    setDashboardStats((prevStats) => ({
      ...prevStats,
      atYard: prevStats.atYard - 1,
      inTransit: prevStats.inTransit + 1,
      readyForDispatch: prevStats.readyForDispatch - 1,
    }));
  };

  const handleMarkUrgent = (containerId, isUrgent) => {
    // In a real implementation, call your API
    console.log(
      `Marking container ${containerId} as ${
        isUrgent ? 'urgent' : 'not urgent'
      }`
    );

    // Update local state to reflect the change
    setContainers((prevContainers) =>
      prevContainers.map((container) =>
        container.id === containerId
          ? { ...container, is_urgent: isUrgent }
          : container
      )
    );
  };

  const handleAddProduct = (containerId, product) => {
    // In a real implementation, call your API
    console.log(`Adding product to container ${containerId}:`, product);

    // Update local state to reflect the change
    setContainers((prevContainers) =>
      prevContainers.map((container) => {
        if (container.id === containerId) {
          const newFillPercentage = Math.min(
            100,
            container.fill_percentage + 15
          );
          return {
            ...container,
            fill_percentage: newFillPercentage,
            total_weight: container.total_weight + product.weight,
          };
        }
        return container;
      })
    );
  };

  const handleCreateContainer = (containerData) => {
    // In a real implementation, call your API
    console.log('Creating new container:', containerData);

    // Generate a new container ID
    const containerId = `C${Math.floor(1000 + Math.random() * 9000)}`;

    // Create a new container object
    const newContainer = {
      id: containerId,
      status: 'In Yard',
      type: containerData.type,
      fill_percentage: 0,
      location: containerData.location,
      hub_id: containerData.hub_id,
      arrival_date: new Date().toISOString().split('T')[0],
      contents: [],
      total_weight: 0,
    };

    // Add to containers
    setContainers((prevContainers) => [...prevContainers, newContainer]);

    // Update stats
    setDashboardStats((prevStats) => ({
      ...prevStats,
      totalContainers: prevStats.totalContainers + 1,
      atYard: prevStats.atYard + 1,
    }));
  };

  const renderMainContent = () => {
    switch (activeModule) {
      case 'network':
        return (
          <NetworkDashboard mstData={mstData} selectedPath={selectedPath} />
        );
      case 'containers':
        return (
          <ContainerManagementDashboard
            containers={containers}
            onDispatch={handleDispatchContainer}
            onMarkUrgent={handleMarkUrgent}
            onAddProduct={handleAddProduct}
          />
        );
      case 'dispatch':
        // Filter for containers ready for dispatch
        const readyContainers = containers.filter((container) => {
          const isUrgent = container.is_urgent || false;
          const dispatchThreshold = isUrgent ? 50 : 90;
          return container.fill_percentage >= dispatchThreshold;
        });

        return (
          <ContainerManagementDashboard
            containers={readyContainers}
            onDispatch={handleDispatchContainer}
            onMarkUrgent={handleMarkUrgent}
            onAddProduct={handleAddProduct}
          />
        );
      default:
        return <div>Select a module to view</div>;
    }
  };

  return (
    <div className="modular-dashboard-container">
      <Header />
      <main className="dashboard-main">
        <CommandBar
          onSearchChange={(query) => console.log('Search:', query)}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
        />

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {dashboardStats && <StatsOverview stats={dashboardStats} />}

            <div className="dashboard-actions">
              <button
                className="create-container-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="fas fa-plus"></i> New Container
              </button>
            </div>

            <div className="dashboard-content">{renderMainContent()}</div>

            {showCreateModal && (
              <CreateContainerForm
                onCreateContainer={handleCreateContainer}
                onClose={() => setShowCreateModal(false)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UnifiedDashboard;
