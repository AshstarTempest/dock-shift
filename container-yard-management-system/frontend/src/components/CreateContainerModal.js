import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Tabs,
  Tab,
} from 'react-bootstrap';
import MapPicker from './MapPicker';

const CreateContainerModal = ({
  show,
  handleClose,
  handleSave,
  container: existingContainer,
}) => {
  // Basic container state - use existing container data if editing
  const [container, setContainer] = useState({
    id: '',
    container_id: '',
    type: '20GP',
    status: 'In Yard',
    contents: '',
    priority: 'Normal',
    fill_percentage: 50,
    major_hub: '',
    hub: '',
    pickup_lat: '',
    pickup_lng: '',
    drop_lat: '',
    drop_lng: '',
    address: '',
    longitude: '',
    latitude: '',
    ...(existingContainer || {}),
  });

  // Form tabs and validation
  const [activeTab, setActiveTab] = useState('basic');
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options for dropdowns
  const containerTypes = [
    { value: '20GP', label: '20GP (General Purpose)' },
    { value: '40GP', label: '40GP (General Purpose)' },
    { value: '40HC', label: '40HC (High Cube)' },
    { value: '20FR', label: '20FR (Flat Rack)' },
    { value: '40FR', label: '40FR (Flat Rack)' },
    { value: '20OT', label: '20OT (Open Top)' },
    { value: '40OT', label: '40OT (Open Top)' },
    { value: '20RF', label: '20RF (Refrigerated)' },
    { value: '40RF', label: '40RF (Refrigerated)' },
  ];

  const statusOptions = [
    { value: 'In Yard', label: 'In Yard' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Delayed', label: 'Delayed' },
    { value: 'Maintenance', label: 'Maintenance' },
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Normal', label: 'Normal' },
    { value: 'High', label: 'High' },
    { value: 'Urgent', label: 'Urgent' },
  ];

  // Mock major hub data - in real app this would come from API
  const majorHubs = [
    { value: 'mumbai_hub', label: 'Mumbai Container Terminal' },
    { value: 'delhi_hub', label: 'Delhi Inland Container Depot' },
    { value: 'chennai_hub', label: 'Chennai Port Terminal' },
    { value: 'kolkata_hub', label: 'Kolkata Container Facility' },
    { value: 'bangalore_hub', label: 'Bangalore Logistics Park' },
  ];

  // Secondary hubs would typically be filtered based on major hub selection
  const [hubOptions, setHubOptions] = useState([]);

  // Load secondary hubs based on major hub selection
  useEffect(() => {
    // Reset hub selection when major hub changes
    if (container.major_hub !== existingContainer?.major_hub) {
      setContainer((prev) => ({
        ...prev,
        hub: '', // Reset hub when major hub changes
      }));
    }

    if (!container.major_hub) {
      setHubOptions([]);
      return;
    }

    // Mock API call to get hubs for the selected major hub
    // This would be replaced with an actual API call in production
    const fetchHubOptions = () => {
      const mockHubData = {
        mumbai_hub: [
          { value: 'mumbai_north', label: 'Mumbai North Terminal' },
          { value: 'mumbai_south', label: 'Mumbai South Terminal' },
          { value: 'navi_mumbai', label: 'Navi Mumbai Terminal' },
        ],
        delhi_hub: [
          { value: 'delhi_tughlakabad', label: 'Tughlakabad ICD' },
          { value: 'delhi_patparganj', label: 'Patparganj ICD' },
          { value: 'ghaziabad', label: 'Ghaziabad Terminal' },
        ],
        chennai_hub: [
          { value: 'chennai_port', label: 'Chennai Port' },
          { value: 'ennore', label: 'Ennore Terminal' },
          { value: 'kattupalli', label: 'Kattupalli Port' },
        ],
        kolkata_hub: [
          { value: 'kolkata_dock', label: 'Kolkata Dock System' },
          { value: 'haldia', label: 'Haldia Terminal' },
        ],
        bangalore_hub: [
          { value: 'whitefield', label: 'Whitefield ICD' },
          { value: 'bangalore_city', label: 'Bangalore City Terminal' },
        ],
      };

      return mockHubData[container.major_hub] || [];
    };

    setHubOptions(fetchHubOptions());
  }, [container.major_hub, existingContainer?.major_hub]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for major_hub to reset hub
    if (name === 'major_hub') {
      setContainer({
        ...container,
        [name]: value,
        hub: '', // Reset hub when major hub changes
      });
    } else {
      setContainer({
        ...container,
        [name]: value,
      });
    }
  };

  // Handle pickup location change from map
  const handlePickupLocationChange = (coords) => {
    setContainer({
      ...container,
      pickup_lat: coords.lat,
      pickup_lng: coords.lng,
    });
  };

  // Handle drop location change from map
  const handleDropLocationChange = (coords) => {
    setContainer({
      ...container,
      drop_lat: coords.lat,
      drop_lng: coords.lng,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    const newErrors = {};
    setValidated(true);

    // Custom validation
    if (!container.container_id) {
      newErrors.container_id = 'Container ID is required';
    } else if (!/^[A-Za-z]{4}\d{7}$/.test(container.container_id)) {
      newErrors.container_id = 'Container ID must be in format ABCD1234567';
    }

    if (!container.contents) {
      newErrors.contents = 'Please specify container contents';
    }

    // Validate major hub and hub are selected
    if (activeTab === 'location') {
      if (!container.major_hub) {
        newErrors.major_hub = 'Please select a major hub';
      }

      if (container.major_hub && !container.hub) {
        newErrors.hub = 'Please select a hub';
      }

      if (!container.pickup_lat || !container.pickup_lng) {
        newErrors.pickup_coordinates =
          'Please select a pickup location on the map';
      }
    }

    if (activeTab === 'dropoff') {
      if (!container.drop_lat || !container.drop_lng) {
        newErrors.drop_coordinates =
          'Please select a drop-off location on the map';
      }
    }

    setErrors(newErrors);

    // If the form is valid
    if (form.checkValidity() && Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      // Format the container object for saving
      const containerToSave = {
        ...container,
        // Generate a random ID if not provided
        id: container.id || `CONT${Math.floor(Math.random() * 100000)}`,
      };

      // Call the save handler from parent component
      handleSave(containerToSave);

      // Reset form state
      setValidated(false);
      setContainer({
        id: '',
        container_id: '',
        type: '20GP',
        status: 'In Yard',
        contents: '',
        priority: 'Normal',
        fill_percentage: 50,
        major_hub: '',
        hub: '',
        pickup_lat: '',
        pickup_lng: '',
        drop_lat: '',
        drop_lng: '',
        address: '',
        longitude: '',
        latitude: '',
      });

      // Close modal
      handleClose();
    }
  };

  // Generate a container ID suggestion
  const generateContainerId = () => {
    const prefix = 'MAEU'; // Shipping line code (e.g., Maersk)
    const uniqueNum = Math.floor(1000000 + Math.random() * 9000000).toString();

    setContainer({
      ...container,
      container_id: `${prefix}${uniqueNum}`,
    });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      backdrop="static"
      className="container-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {existingContainer ? 'Edit Container' : 'Create New Container'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="basic" title="Basic Information">
            <Form noValidate validated={validated}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="container-id">
                    <Form.Label>Container ID</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="container_id"
                        value={container.container_id}
                        onChange={handleChange}
                        placeholder="ABCD1234567"
                        required
                        isInvalid={!!errors.container_id}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={generateContainerId}
                        title="Generate Container ID"
                      >
                        <i className="fas fa-magic"></i>
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.container_id ||
                          'Valid container ID is required'}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Standard format: 4 letters followed by 7 numbers
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="container-type">
                    <Form.Label>Container Type</Form.Label>
                    <Form.Select
                      name="type"
                      value={container.type}
                      onChange={handleChange}
                      required
                    >
                      {containerTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="container-status">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={container.status}
                      onChange={handleChange}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="container-contents">
                    <Form.Label>Contents</Form.Label>
                    <Form.Control
                      type="text"
                      name="contents"
                      value={container.contents}
                      onChange={handleChange}
                      placeholder="Describe container contents"
                      required
                      isInvalid={!!errors.contents}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contents || 'Please specify container contents'}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="container-priority">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      name="priority"
                      value={container.priority}
                      onChange={handleChange}
                    >
                      {priorityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="container-fill">
                    <Form.Label>
                      Fill Percentage: {container.fill_percentage}%
                    </Form.Label>
                    <Form.Range
                      name="fill_percentage"
                      value={container.fill_percentage}
                      onChange={handleChange}
                      min="0"
                      max="100"
                    />
                    <div className="progress">
                      <div
                        className={`progress-bar ${
                          container.fill_percentage > 90
                            ? 'bg-danger'
                            : container.fill_percentage > 75
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        role="progressbar"
                        style={{ width: `${container.fill_percentage}%` }}
                        aria-valuenow={container.fill_percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Tab>

          <Tab eventKey="location" title="Pickup Location">
            <Form noValidate validated={validated}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="container-major-hub">
                    <Form.Label>Major Hub</Form.Label>
                    <Form.Select
                      name="major_hub"
                      value={container.major_hub}
                      onChange={handleChange}
                      isInvalid={!!errors.major_hub}
                    >
                      <option value="">Select Major Hub</option>
                      {majorHubs.map((hub) => (
                        <option key={hub.value} value={hub.value}>
                          {hub.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.major_hub}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="container-hub">
                    <Form.Label>Hub</Form.Label>
                    <Form.Select
                      name="hub"
                      value={container.hub}
                      onChange={handleChange}
                      disabled={!container.major_hub}
                      isInvalid={!!errors.hub}
                    >
                      <option value="">Select Hub</option>
                      {hubOptions.map((hub) => (
                        <option key={hub.value} value={hub.value}>
                          {hub.label}
                        </option>
                      ))}
                    </Form.Select>
                    {!container.major_hub && (
                      <Form.Text className="text-muted">
                        Select a major hub first
                      </Form.Text>
                    )}
                    <Form.Control.Feedback type="invalid">
                      {errors.hub}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Pickup Location</Form.Label>
                    <MapPicker
                      mode="pickup"
                      height="300px"
                      initialPosition={{ lat: 20.2961, lng: 85.8245 }}
                      markers={{
                        pickup:
                          container.pickup_lat && container.pickup_lng
                            ? {
                                lat: parseFloat(container.pickup_lat),
                                lng: parseFloat(container.pickup_lng),
                              }
                            : null,
                      }}
                      onPickupChange={handlePickupLocationChange}
                    />
                    {errors.pickup_coordinates && (
                      <div className="text-danger small mt-1">
                        {errors.pickup_coordinates}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Tab>

          <Tab eventKey="dropoff" title="Drop-off Location">
            <Form noValidate validated={validated}>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Drop-off Location</Form.Label>
                    <MapPicker
                      mode="drop"
                      height="300px"
                      initialPosition={{ lat: 18.5204, lng: 73.8567 }}
                      markers={{
                        drop:
                          container.drop_lat && container.drop_lng
                            ? {
                                lat: parseFloat(container.drop_lat),
                                lng: parseFloat(container.drop_lng),
                              }
                            : null,
                      }}
                      onDropChange={handleDropLocationChange}
                    />
                    {errors.drop_coordinates && (
                      <div className="text-danger small mt-1">
                        {errors.drop_coordinates}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Drop-off Latitude</Form.Label>
                    <Form.Control
                      type="text"
                      value={container.drop_lat || ''}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Drop-off Longitude</Form.Label>
                    <Form.Control
                      type="text"
                      value={container.drop_lng || ''}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant={activeTab === 'dropoff' ? 'success' : 'primary'}
          onClick={
            activeTab === 'dropoff'
              ? handleSubmit
              : () =>
                  setActiveTab(activeTab === 'basic' ? 'location' : 'dropoff')
          }
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <span
              className="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {activeTab === 'dropoff'
            ? existingContainer
              ? 'Update Container'
              : 'Create Container'
            : 'Next'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateContainerModal;
