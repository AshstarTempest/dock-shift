import React, { useState, useEffect } from 'react';
import '../styles/App.css';

const MajorHubs = () => {
  // State for storing the hub data
  const [hubs, setHubs] = useState([]);
  // State for the selected hub
  const [selectedHub, setSelectedHub] = useState(null);
  // State for sub-hubs in the selected state
  const [subHubs, setSubHubs] = useState([]);
  // State for the selected sub-hub
  const [selectedSubHub, setSelectedSubHub] = useState(null);
  // State for loading status
  const [loading, setLoading] = useState(true);

  // Indian states and cities data
  const indianHubsData = [
    {
      state: 'Andhra Pradesh',
      city: 'Vijayawada',
      coordinates: { lat: 16.504347, lng: 80.645843 },
    },
    {
      state: 'Arunachal Pradesh',
      city: 'Itanagar',
      coordinates: { lat: 27.091086, lng: 93.596806 },
    },
    {
      state: 'Assam',
      city: 'Guwahati',
      coordinates: { lat: 26.135341, lng: 91.735217 },
    },
    {
      state: 'Bihar',
      city: 'Patna',
      coordinates: { lat: 25.587789, lng: 85.142771 },
    },
    {
      state: 'Chhattisgarh',
      city: 'Raipur',
      coordinates: { lat: 21.241661, lng: 81.638798 },
    },
    {
      state: 'Goa',
      city: 'Panaji',
      coordinates: { lat: 15.482654, lng: 73.833124 },
    },
    {
      state: 'Gujarat',
      city: 'Ahmedabad',
      coordinates: { lat: 23.030405, lng: 72.562137 },
    },
    {
      state: 'Haryana',
      city: 'Gurugram',
      coordinates: { lat: 28.465335, lng: 77.025125 },
    },
    {
      state: 'Himachal Pradesh',
      city: 'Shimla',
      coordinates: { lat: 31.106605, lng: 77.180773 },
    },
    {
      state: 'Jharkhand',
      city: 'Ranchi',
      coordinates: { lat: 23.348013, lng: 85.314384 },
    },
    {
      state: 'Karnataka',
      city: 'Bengaluru',
      coordinates: { lat: 12.97365, lng: 77.590186 },
    },
    {
      state: 'Kerala',
      city: 'Kochi',
      coordinates: { lat: 9.929815, lng: 76.277007 },
    },
    {
      state: 'Madhya Pradesh',
      city: 'Indore',
      coordinates: { lat: 22.714174, lng: 75.854346 },
    },
    {
      state: 'Maharashtra',
      city: 'Mumbai',
      coordinates: { lat: 19.069646, lng: 72.880307 },
    },
    {
      state: 'Manipur',
      city: 'Imphal',
      coordinates: { lat: 24.813476, lng: 93.944452 },
    },
    {
      state: 'Meghalaya',
      city: 'Shillong',
      coordinates: { lat: 25.578503, lng: 91.891416 },
    },
    {
      state: 'Mizoram',
      city: 'Aizawl',
      coordinates: { lat: 23.73101, lng: 92.711071 },
    },
    {
      state: 'Nagaland',
      city: 'Dimapur',
      coordinates: { lat: 25.896172, lng: 93.718831 },
    },
    {
      state: 'Odisha',
      city: 'Bhubaneswar',
      coordinates: { lat: 20.297132, lng: 85.830375 },
    },
    {
      state: 'Punjab',
      city: 'Ludhiana',
      coordinates: { lat: 30.90374, lng: 75.857833 },
    },
    {
      state: 'Rajasthan',
      city: 'Jaipur',
      coordinates: { lat: 26.921195, lng: 75.784667 },
    },
    {
      state: 'Sikkim',
      city: 'Gangtok',
      coordinates: { lat: 27.324654, lng: 88.613151 },
    },
    {
      state: 'Tamil Nadu',
      city: 'Chennai',
      coordinates: { lat: 13.084113, lng: 80.267506 },
    },
    {
      state: 'Telangana',
      city: 'Hyderabad',
      coordinates: { lat: 17.379828, lng: 78.489978 },
    },
    {
      state: 'Tripura',
      city: 'Agartala',
      coordinates: { lat: 23.835036, lng: 91.278077 },
    },
    {
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      coordinates: { lat: 26.84023, lng: 80.950943 },
    },
    {
      state: 'Uttarakhand',
      city: 'Dehradun',
      coordinates: { lat: 30.319949, lng: 78.032139 },
    },
    {
      state: 'West Bengal',
      city: 'Kolkata',
      coordinates: { lat: 22.565836, lng: 88.363023 },
    },
    {
      state: 'Delhi',
      city: 'New Delhi',
      coordinates: { lat: 28.613407, lng: 77.216016 },
    },
    {
      state: 'Jammu and Kashmir',
      city: 'Srinagar',
      coordinates: { lat: 34.08646, lng: 74.800107 },
    },
    {
      state: 'Ladakh',
      city: 'Leh',
      coordinates: { lat: 34.162043, lng: 77.577688 },
    },
  ];

  // Sub-hubs data (more detailed locations within states)
  const subHubsData = [
    {
      state: 'West Bengal',
      city: 'Kolkata',
      coordinates: { lat: 22.572912, lng: 88.361454 },
    },
    {
      state: 'West Bengal',
      city: 'Howrah',
      coordinates: { lat: 22.587306, lng: 88.258067 },
    },
    {
      state: 'West Bengal',
      city: 'Durgapur',
      coordinates: { lat: 23.521529, lng: 87.305634 },
    },
    {
      state: 'West Bengal',
      city: 'Asansol',
      coordinates: { lat: 23.669562, lng: 86.943659 },
    },
    {
      state: 'West Bengal',
      city: 'Siliguri',
      coordinates: { lat: 26.726044, lng: 88.394222 },
    },
    {
      state: 'West Bengal',
      city: 'Darjeeling',
      coordinates: { lat: 27.044137, lng: 88.269625 },
    },
    {
      state: 'West Bengal',
      city: 'Kharagpur',
      coordinates: { lat: 22.349619, lng: 87.236139 },
    },
    {
      state: 'West Bengal',
      city: 'Haldia',
      coordinates: { lat: 22.064258, lng: 88.11926 },
    },
    {
      state: 'West Bengal',
      city: 'Malda',
      coordinates: { lat: 25.017916, lng: 88.139606 },
    },
    {
      state: 'West Bengal',
      city: 'Bardhaman',
      coordinates: { lat: 23.232716, lng: 87.85383 },
    },
    {
      state: 'Odisha',
      city: 'Bhubaneswar',
      coordinates: { lat: 20.286648, lng: 85.819319 },
    },
    {
      state: 'Odisha',
      city: 'Cuttack',
      coordinates: { lat: 20.471047, lng: 85.87992 },
    },
    {
      state: 'Odisha',
      city: 'Rourkela',
      coordinates: { lat: 22.258521, lng: 84.847716 },
    },
    {
      state: 'Odisha',
      city: 'Sambalpur',
      coordinates: { lat: 21.464943, lng: 83.977969 },
    },
    {
      state: 'Odisha',
      city: 'Berhampur',
      coordinates: { lat: 19.315731, lng: 84.792629 },
    },
    {
      state: 'Odisha',
      city: 'Puri',
      coordinates: { lat: 19.810011, lng: 85.827176 },
    },
    {
      state: 'Odisha',
      city: 'Balasore',
      coordinates: { lat: 21.494781, lng: 86.941383 },
    },
    {
      state: 'Odisha',
      city: 'Jharsuguda',
      coordinates: { lat: 21.861882, lng: 84.015541 },
    },
    {
      state: 'Odisha',
      city: 'Angul',
      coordinates: { lat: 20.848924, lng: 85.106252 },
    },
    {
      state: 'Odisha',
      city: 'Baripada',
      coordinates: { lat: 21.928826, lng: 86.733417 },
    },
    {
      state: 'Maharashtra',
      city: 'Mumbai',
      coordinates: { lat: 19.073313, lng: 72.873124 },
    },
    {
      state: 'Maharashtra',
      city: 'Pune',
      coordinates: { lat: 18.526, lng: 73.862396 },
    },
    {
      state: 'Maharashtra',
      city: 'Nagpur',
      coordinates: { lat: 21.15335, lng: 79.095673 },
    },
    {
      state: 'Maharashtra',
      city: 'Nashik',
      coordinates: { lat: 20.005171, lng: 73.795204 },
    },
    {
      state: 'Maharashtra',
      city: 'Thane',
      coordinates: { lat: 19.226139, lng: 72.988056 },
    },
    {
      state: 'Maharashtra',
      city: 'Aurangabad',
      coordinates: { lat: 19.877461, lng: 75.350927 },
    },
    {
      state: 'Maharashtra',
      city: 'Solapur',
      coordinates: { lat: 17.65678, lng: 75.907452 },
    },
    {
      state: 'Maharashtra',
      city: 'Amravati',
      coordinates: { lat: 20.933012, lng: 77.774769 },
    },
    {
      state: 'Maharashtra',
      city: 'Kolhapur',
      coordinates: { lat: 16.699147, lng: 74.235303 },
    },
    {
      state: 'Maharashtra',
      city: 'Navi Mumbai',
      coordinates: { lat: 19.033618, lng: 73.035662 },
    },
  ];

  // Load the hub data when the component mounts
  useEffect(() => {
    setHubs(indianHubsData);
    setLoading(false);
  }, []);

  // Handle hub selection
  const handleHubSelection = (e) => {
    const hubCity = e.target.value;
    if (hubCity) {
      const hub = hubs.find((hub) => hub.city === hubCity);
      setSelectedHub(hub);

      // Find sub-hubs in the same state
      const stateSubHubs = subHubsData.filter(
        (subHub) => subHub.state === hub.state
      );
      setSubHubs(stateSubHubs);
      setSelectedSubHub(null); // Reset selected sub-hub
    } else {
      setSelectedHub(null);
      setSubHubs([]);
      setSelectedSubHub(null);
    }
  };

  // Handle sub-hub selection
  const handleSubHubSelection = (e) => {
    const subHubCity = e.target.value;
    if (subHubCity) {
      const subHub = subHubs.find((hub) => hub.city === subHubCity);
      setSelectedSubHub(subHub);
    } else {
      setSelectedSubHub(null);
    }
  };

  // Format coordinates for display
  const formatCoordinates = (coordinates) => {
    if (!coordinates) return '';
    return `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`;
  };

  return (
    <div className="major-hubs-container">
      <div className="major-hubs-header">
        <h1>Major Indian City Hubs</h1>
        <p>
          Select a city to view its location details, coordinates, and sub-hubs
        </p>
      </div>

      <div className="major-hubs-content">
        {loading ? (
          <div className="loading">Loading hub data...</div>
        ) : (
          <>
            <div className="hub-selector">
              <label htmlFor="hubDropdown">Select Major City Hub:</label>
              <select
                id="hubDropdown"
                className="hub-dropdown"
                onChange={handleHubSelection}
                defaultValue=""
              >
                <option value="">-- Select a Major Hub --</option>
                {hubs.map((hub) => (
                  <option key={`${hub.state}-${hub.city}`} value={hub.city}>
                    {hub.city}, {hub.state}
                  </option>
                ))}
              </select>
            </div>

            {selectedHub && (
              <div className="hub-details">
                <h2>
                  {selectedHub.city}, {selectedHub.state}
                </h2>
                <div className="hub-info">
                  <div className="info-item">
                    <span className="info-label">State:</span>
                    <span className="info-value">{selectedHub.state}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">City:</span>
                    <span className="info-value">{selectedHub.city}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Coordinates:</span>
                    <span className="info-value">
                      {formatCoordinates(selectedHub.coordinates)}
                    </span>
                  </div>
                </div>

                <div className="coordinates-display">
                  <h3>Coordinates</h3>
                  <div className="coordinate-box">
                    <div className="coordinate-item">
                      <span className="coordinate-label">Latitude:</span>
                      <span className="coordinate-value">
                        {selectedHub.coordinates.lat.toFixed(6)}
                      </span>
                    </div>
                    <div className="coordinate-item">
                      <span className="coordinate-label">Longitude:</span>
                      <span className="coordinate-value">
                        {selectedHub.coordinates.lng.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-hubs section */}
                {subHubs.length > 0 && (
                  <div className="sub-hubs-section">
                    <h3>Sub-Hubs in {selectedHub.state}</h3>
                    <div className="sub-hub-selector">
                      <label htmlFor="subHubDropdown">Select Sub-Hub:</label>
                      <select
                        id="subHubDropdown"
                        className="hub-dropdown"
                        onChange={handleSubHubSelection}
                        defaultValue=""
                      >
                        <option value="">-- Select a Sub-Hub --</option>
                        {subHubs.map((subHub) => (
                          <option
                            key={`sub-${subHub.state}-${subHub.city}`}
                            value={subHub.city}
                          >
                            {subHub.city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedSubHub && (
                      <div className="sub-hub-details">
                        <h4>{selectedSubHub.city} Details</h4>
                        <div className="hub-info">
                          <div className="info-item">
                            <span className="info-label">City:</span>
                            <span className="info-value">
                              {selectedSubHub.city}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Coordinates:</span>
                            <span className="info-value">
                              {formatCoordinates(selectedSubHub.coordinates)}
                            </span>
                          </div>
                        </div>

                        <div className="coordinates-display">
                          <h4>Precise Coordinates</h4>
                          <div className="coordinate-box">
                            <div className="coordinate-item">
                              <span className="coordinate-label">
                                Latitude:
                              </span>
                              <span className="coordinate-value">
                                {selectedSubHub.coordinates.lat.toFixed(6)}
                              </span>
                            </div>
                            <div className="coordinate-item">
                              <span className="coordinate-label">
                                Longitude:
                              </span>
                              <span className="coordinate-value">
                                {selectedSubHub.coordinates.lng.toFixed(6)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MajorHubs;
