import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Modal,
  Alert,
} from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Containers = () => {
  // Authentication context
  const { currentUser } = useAuth();

  // State management
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Get Indian cities for dropdowns
  const [cities, setCities] = useState([
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Ahmedabad',
    'Pune',
    'Jaipur',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Patna',
    'Vadodara',
    'Ghaziabad',
    'Ludhiana',
    'Coimbatore',
    'Kochi',
    'Surat',
    'Guwahati',
    'Bhubaneswar',
  ]);

  // Urgency status options
  const urgencyOptions = ['Low', 'Medium', 'High', 'Critical'];

  // Container status options
  const statusOptions = ['In Transit', 'At Yard', 'Delivered'];

  // Form state
  const [currentContainer, setCurrentContainer] = useState({
    container_id: '',
    status: 'In Transit',
    pickup_city: '',
    destination_city: '',
    total_items: 1,
    total_weight: '',
    urgency_status: 'Medium',
  });

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    variant: '',
    message: '',
  });

  // API URL
  const API_URL = 'http://localhost:5000';

  // Initial data fetching
  useEffect(() => {
    fetchContainers();
  }, []);

  // Fetch containers from API
  const fetchContainers = async () => {
    try {
      setLoading(true);
      // In a real application, this would be an API call like:
      // const response = await fetch(`${API_URL}/api/containers`);
      // For now, we'll use mock data
      setTimeout(() => {
        const mockContainers = [
          {
            id: 'C1001',
            container_id: 'C1001',
            status: 'In Transit',
            pickup_city: 'Mumbai',
            destination_city: 'Delhi',
            total_items: 45,
            total_weight: 2500,
            urgency_status: 'High',
            created_at: '2025-04-20T10:30:00',
            updated_at: '2025-04-21T08:15:00',
          },
          {
            id: 'C1002',
            container_id: 'C1002',
            status: 'At Yard',
            pickup_city: 'Chennai',
            destination_city: 'Bangalore',
            total_items: 30,
            total_weight: 1800,
            urgency_status: 'Medium',
            created_at: '2025-04-19T14:20:00',
            updated_at: '2025-04-19T18:45:00',
          },
          {
            id: 'C1003',
            container_id: 'C1003',
            status: 'Delivered',
            pickup_city: 'Kolkata',
            destination_city: 'Hyderabad',
            total_items: 60,
            total_weight: 3200,
            urgency_status: 'Low',
            created_at: '2025-04-18T09:10:00',
            updated_at: '2025-04-22T11:30:00',
          },
        ];
        setContainers(mockContainers);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError(`Failed to load containers: ${err.message}`);
      setAlert({
        show: true,
        variant: 'danger',
        message: `Failed to load containers: ${err.message}`,
      });
      setLoading(false);
    }
  };

  // Create new container
  const handleAddContainer = async () => {
    try {
      // Validate container ID format (e.g., C followed by numbers)
      if (!/^C\d{4,}$/.test(currentContainer.container_id)) {
        throw new Error(
          'Container ID must start with C followed by at least 4 numbers'
        );
      }

      // In a real application, this would be an API call
      // const response = await fetch(`${API_URL}/api/containers`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   credentials: 'include',
      //   body: JSON.stringify(currentContainer),
      // });

      // Mock successful response
      const newContainer = {
        id: currentContainer.container_id,
        ...currentContainer,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setContainers([...containers, newContainer]);
      setAlert({
        show: true,
        variant: 'success',
        message: 'Container added successfully!',
      });
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setAlert({
        show: true,
        variant: 'danger',
        message: `Error adding container: ${err.message}`,
      });
    }
  };

  // Update existing container
  const handleUpdateContainer = async () => {
    try {
      // In a real application, this would be an API call
      // const response = await fetch(`${API_URL}/api/containers/${currentContainer.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   credentials: 'include',
      //   body: JSON.stringify(currentContainer),
      // });

      // Mock successful update
      const updatedContainers = containers.map((container) =>
        container.id === currentContainer.id
          ? { ...currentContainer, updated_at: new Date().toISOString() }
          : container
      );

      setContainers(updatedContainers);
      setAlert({
        show: true,
        variant: 'success',
        message: 'Container updated successfully!',
      });
      setShowEditModal(false);
    } catch (err) {
      setAlert({
        show: true,
        variant: 'danger',
        message: `Error updating container: ${err.message}`,
      });
    }
  };

  // Delete container
  const handleDeleteContainer = async (id) => {
    if (window.confirm('Are you sure you want to delete this container?')) {
      try {
        // In a real application, this would be an API call
        // const response = await fetch(`${API_URL}/api/containers/${id}`, {
        //   method: 'DELETE',
        //   credentials: 'include',
        // });

        // Mock successful deletion
        const filteredContainers = containers.filter(
          (container) => container.id !== id
        );
        setContainers(filteredContainers);
        setAlert({
          show: true,
          variant: 'success',
          message: 'Container deleted successfully!',
        });
      } catch (err) {
        setAlert({
          show: true,
          variant: 'danger',
          message: `Error deleting container: ${err.message}`,
        });
      }
    }
  };

  // Set container for editing
  const editContainer = (container) => {
    setCurrentContainer(container);
    setShowEditModal(true);
  };

  // Reset form values
  const resetForm = () => {
    setCurrentContainer({
      container_id: '',
      status: 'In Transit',
      pickup_city: '',
      destination_city: '',
      total_items: 1,
      total_weight: '',
      urgency_status: 'Medium',
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContainer({
      ...currentContainer,
      [name]: name === 'total_items' ? parseInt(value, 10) : value,
    });
  };

  return (
    <Container fluid className="mt-4">
      {/* Header and alert message */}
      <Row className="mb-4">
        <Col>
          <h2>Container Management</h2>
          {alert.show && (
            <Alert
              variant={alert.variant}
              onClose={() => setAlert({ ...alert, show: false })}
              dismissible
            >
              {alert.message}
            </Alert>
          )}
        </Col>
      </Row>

      {/* Add container button */}
      <Row className="mb-4">
        <Col className="d-flex justify-content-end">
          <Button
            variant="primary"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <i className="fas fa-plus me-2"></i>
            Add New Container
          </Button>
        </Col>
      </Row>

      {/* Containers table */}
      <Row>
        <Col>
          <Card>
            <Card.Header as="h5">Container Records</Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading containers...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : containers.length === 0 ? (
                <div className="text-center my-4">
                  <p>
                    No containers found. Click "Add New Container" to add your
                    first container.
                  </p>
                </div>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Container ID</th>
                      <th>Status</th>
                      <th>Pickup City</th>
                      <th>Destination City</th>
                      <th>Total Items</th>
                      <th>Weight (kg)</th>
                      <th>Urgency</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {containers.map((container) => (
                      <tr key={container.id}>
                        <td>{container.container_id}</td>
                        <td>
                          <span
                            className={`status-${container.status
                              .toLowerCase()
                              .replace(/\s+/g, '-')}`}
                          >
                            {container.status}
                          </span>
                        </td>
                        <td>{container.pickup_city}</td>
                        <td>{container.destination_city}</td>
                        <td>{container.total_items}</td>
                        <td>{container.total_weight}</td>
                        <td>
                          <span
                            className={`urgency-${container.urgency_status.toLowerCase()}`}
                          >
                            {container.urgency_status}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => editContainer(container)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteContainer(container.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Container Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Container</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Container ID</Form.Label>
              <Form.Control
                type="text"
                name="container_id"
                value={currentContainer.container_id}
                onChange={handleInputChange}
                placeholder="C1234"
                required
              />
              <Form.Text className="text-muted">
                Container ID should start with 'C' followed by numbers.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={currentContainer.status}
                onChange={handleInputChange}
              >
                {statusOptions.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pickup City</Form.Label>
              <Form.Control
                as="select"
                name="pickup_city"
                value={currentContainer.pickup_city}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Pickup City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Destination City</Form.Label>
              <Form.Control
                as="select"
                name="destination_city"
                value={currentContainer.destination_city}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Destination City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Items</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="total_items"
                value={currentContainer.total_items}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Weight (kg)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="total_weight"
                value={currentContainer.total_weight}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Urgency Status</Form.Label>
              <Form.Control
                as="select"
                name="urgency_status"
                value={currentContainer.urgency_status}
                onChange={handleInputChange}
              >
                {urgencyOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddContainer}>
            Add Container
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Container Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Container</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Container ID</Form.Label>
              <Form.Control
                type="text"
                name="container_id"
                value={currentContainer.container_id}
                onChange={handleInputChange}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={currentContainer.status}
                onChange={handleInputChange}
              >
                {statusOptions.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pickup City</Form.Label>
              <Form.Control
                as="select"
                name="pickup_city"
                value={currentContainer.pickup_city}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Pickup City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Destination City</Form.Label>
              <Form.Control
                as="select"
                name="destination_city"
                value={currentContainer.destination_city}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Destination City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Items</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="total_items"
                value={currentContainer.total_items}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Weight (kg)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="total_weight"
                value={currentContainer.total_weight}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Urgency Status</Form.Label>
              <Form.Control
                as="select"
                name="urgency_status"
                value={currentContainer.urgency_status}
                onChange={handleInputChange}
              >
                {urgencyOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateContainer}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Containers;
