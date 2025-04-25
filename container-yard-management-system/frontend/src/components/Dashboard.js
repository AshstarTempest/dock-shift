import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Header from './Header';

function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  // Container form state
  const [containerForm, setContainerForm] = useState({
    length: '',
    width: '',
    height: '',
    weight: '',
    itemType: '',
    containerStatus: '',
  });

  // Journey form state
  const [journeyForm, setJourneyForm] = useState({
    startCoordinates: '',
    destinationCoordinates: '',
    urgency: '',
    estimatedDeparture: '',
  });

  // Transport plan state
  const [transportPlan, setTransportPlan] = useState(null);

  useEffect(() => {
    // Fetch dashboard data when component mounts
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (err) {
      setError('Error loading dashboard data. Please try again later.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleContainerFormChange = (e) => {
    const { name, value } = e.target;
    setContainerForm({
      ...containerForm,
      [name]: value,
    });
  };

  const handleJourneyFormChange = (e) => {
    const { name, value } = e.target;
    setJourneyForm({
      ...journeyForm,
      [name]: value,
    });
  };

  const calculateRoute = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch('/api/calculate-route', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          container: containerForm,
          journey: journeyForm,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate route');
      }

      const data = await response.json();
      setTransportPlan(data);
      setLoading(false);
    } catch (err) {
      setError(
        'Error calculating route. Please check your inputs and try again.'
      );
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <Header />

      <main className="main-content-container">
        <h1 className="page-title">Container Management Dashboard</h1>
        <p className="welcome-message">
          Welcome, {currentUser?.firstName || 'User'}!
        </p>

        {error && <div className="error-message">{error}</div>}

        {dashboardData && (
          <div className="dashboard-summary">
            <div className="stats-container">
              <div className="stat-card">
                <h3>Total Containers</h3>
                <p className="stat-value">
                  {dashboardData.stats.totalContainers}
                </p>
              </div>
              <div className="stat-card">
                <h3>In Transit</h3>
                <p className="stat-value">{dashboardData.stats.inTransit}</p>
              </div>
              <div className="stat-card">
                <h3>At Yard</h3>
                <p className="stat-value">{dashboardData.stats.atYard}</p>
              </div>
              <div className="stat-card">
                <h3>Delivered</h3>
                <p className="stat-value">{dashboardData.stats.delivered}</p>
              </div>
            </div>

            <div className="recent-containers">
              <h2>Recent Containers</h2>
              <table className="container-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Destination</th>
                    <th>Arrival Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.containers.map((container) => (
                    <tr key={container.id}>
                      <td>{container.id}</td>
                      <td>
                        <span
                          className={`status-badge status-${container.status
                            .toLowerCase()
                            .replace(' ', '-')}`}
                        >
                          {container.status}
                        </span>
                      </td>
                      <td>{container.destination}</td>
                      <td>{container.arrival}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="dashboard-grid">
          <section className="container-details">
            <h2>Container Details</h2>
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="containerLength">Length (m):</label>
                  <input
                    id="containerLength"
                    type="number"
                    name="length"
                    max="12.19"
                    step="0.01"
                    placeholder="Enter container length"
                    required
                    value={containerForm.length}
                    onChange={handleContainerFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="containerWidth">Width (m):</label>
                  <input
                    id="containerWidth"
                    type="number"
                    name="width"
                    max="2.44"
                    step="0.01"
                    placeholder="Enter container width"
                    required
                    value={containerForm.width}
                    onChange={handleContainerFormChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="containerHeight">Height (m):</label>
                  <input
                    id="containerHeight"
                    type="number"
                    name="height"
                    max="2.59"
                    step="0.01"
                    placeholder="Enter container height"
                    required
                    value={containerForm.height}
                    onChange={handleContainerFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="containerWeight">Weight (kg):</label>
                  <input
                    id="containerWeight"
                    type="number"
                    name="weight"
                    max="30480"
                    placeholder="Enter container weight"
                    required
                    value={containerForm.weight}
                    onChange={handleContainerFormChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="itemType">Item Type:</label>
                  <select
                    id="itemType"
                    name="itemType"
                    required
                    value={containerForm.itemType}
                    onChange={handleContainerFormChange}
                  >
                    <option value="" disabled>
                      Select item type
                    </option>
                    <option value="non-hazardous">Non-Hazardous</option>
                    <option value="hazardous">Hazardous</option>
                    <option value="perishable">Perishable</option>
                    <option value="fragile">Fragile</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="containerStatus">Status:</label>
                  <select
                    id="containerStatus"
                    name="containerStatus"
                    required
                    value={containerForm.containerStatus}
                    onChange={handleContainerFormChange}
                  >
                    <option value="" disabled>
                      Select status
                    </option>
                    <option value="ready">Ready for Transport</option>
                    <option value="in-transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </div>
              </div>
            </form>
          </section>

          <section className="journey-parameters">
            <h2>Journey Parameters</h2>
            <form onSubmit={calculateRoute}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startCoordinates">
                    Start Coordinates (GPS):
                  </label>
                  <input
                    id="startCoordinates"
                    type="text"
                    name="startCoordinates"
                    placeholder="e.g. 51.5074° N, 0.1278° W"
                    required
                    value={journeyForm.startCoordinates}
                    onChange={handleJourneyFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="destinationCoordinates">
                    Destination Coordinates (GPS):
                  </label>
                  <input
                    id="destinationCoordinates"
                    type="text"
                    name="destinationCoordinates"
                    placeholder="e.g. 48.8566° N, 2.3522° E"
                    required
                    value={journeyForm.destinationCoordinates}
                    onChange={handleJourneyFormChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="urgency">Urgency:</label>
                  <select
                    id="urgency"
                    name="urgency"
                    required
                    value={journeyForm.urgency}
                    onChange={handleJourneyFormChange}
                  >
                    <option value="" disabled>
                      Select urgency
                    </option>
                    <option value="normal">Normal</option>
                    <option value="express">Express</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="estimatedDeparture">
                    Estimated Departure:
                  </label>
                  <input
                    id="estimatedDeparture"
                    type="datetime-local"
                    name="estimatedDeparture"
                    required
                    value={journeyForm.estimatedDeparture}
                    onChange={handleJourneyFormChange}
                  />
                </div>
              </div>

              <div className="button-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Calculating...' : 'Calculate Route'}
                </button>
                <button type="reset" className="btn btn-secondary">
                  Reset
                </button>
              </div>
            </form>
          </section>

          <section className="transport-plan">
            <h2>Transport Plan</h2>
            {transportPlan ? (
              <div className="transport-plan-details">
                <div className="info-card">
                  <div className="info-card-header">
                    <h3>Route Information</h3>
                  </div>
                  <div className="info-card-body">
                    <div className="info-item">
                      <span className="info-label">Distance:</span>
                      <span className="info-value">
                        {transportPlan.route.distance} km
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Estimated Travel Time:</span>
                      <span className="info-value">
                        {transportPlan.route.travelTime} hours
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Fuel Consumption:</span>
                      <span className="info-value">
                        {transportPlan.route.fuelConsumption} liters
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Carbon Footprint:</span>
                      <span className="info-value">
                        {transportPlan.route.carbonFootprint} kg CO2
                      </span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-header">
                    <h3>Price Quote</h3>
                  </div>
                  <div className="info-card-body">
                    <div className="quote-breakdown">
                      <div className="quote-item">
                        <span className="quote-label">Base Price:</span>
                        <span className="quote-value">
                          ${transportPlan.pricing.basePrice}
                        </span>
                      </div>
                      <div className="quote-item">
                        <span className="quote-label">Distance Fee:</span>
                        <span className="quote-value">
                          ${transportPlan.pricing.distanceFee}
                        </span>
                      </div>
                      <div className="quote-item">
                        <span className="quote-label">Weight Fee:</span>
                        <span className="quote-value">
                          ${transportPlan.pricing.weightFee}
                        </span>
                      </div>
                      <div className="quote-item">
                        <span className="quote-label">Urgency Fee:</span>
                        <span className="quote-value">
                          ${transportPlan.pricing.urgencyFee}
                        </span>
                      </div>
                      <div className="quote-total">
                        <span className="quote-label">Total:</span>
                        <span className="quote-value">
                          ${transportPlan.pricing.total}
                        </span>
                      </div>
                    </div>
                    <button className="btn btn-success">
                      Confirm Transport Plan
                    </button>
                  </div>
                </div>

                <div className="map-container">
                  <h3>Route Map</h3>
                  <div className="route-map">
                    {/* Map visualization would go here - could use Google Maps, Leaflet, etc. */}
                    <div className="map-placeholder">
                      <p>
                        Interactive map showing route from{' '}
                        {journeyForm.startCoordinates} to{' '}
                        {journeyForm.destinationCoordinates}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-plan-message">
                <p>
                  Enter container details and journey parameters to calculate a
                  transport plan.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
