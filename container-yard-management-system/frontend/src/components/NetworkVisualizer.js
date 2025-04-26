import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Row, Col, Button, Spinner, Badge, Form } from 'react-bootstrap';
import * as d3 from 'd3';
import './NetworkVisualizer.css';

const NetworkVisualizer = () => {
  const [networkData, setNetworkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedView, setSelectedView] = useState('mst'); // 'mst', 'all', 'major'
  const [selectedPath, setSelectedPath] = useState([]);
  const [startHub, setStartHub] = useState('');
  const [endHub, setEndHub] = useState('');
  
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);
  
  // ASCII banner for Enterprise Logistics
  const asciiBanner = `
███████╗███████╗███████╗██████╗ ██╗      ██████╗  ██████╗ 
██╔════╝██╔════╝██╔════╝██╔══██╗██║     ██╔═══██╗██╔════╝ 
███████╗███████╗█████╗  ██████╔╝██║     ██║   ██║██║  ███╗
╚════██║╚════██║██╔══╝  ██╔═══╝ ██║     ██║   ██║██║   ██║
███████║███████║███████╗██║     ███████╗╚██████╔╝╚██████╔╝
╚══════╝╚══════╝╚══════╝╚═╝     ╚══════╝ ╚═════╝  ╚═════╝ 
                                                       
Enterprise Logistics Management System with Emotional AI`;

  // Mock hub data from the ESSPL Logistics system
  const HUB_DATA = `State,City,Latitude,Longitude,Type
Andhra Pradesh,Vijayawada,16.504347,80.645843,major
Arunachal Pradesh,Itanagar,27.091086,93.596806,major
Assam,Guwahati,26.135341,91.735217,major
Bihar,Patna,25.587789,85.142771,major
Chhattisgarh,Raipur,21.241661,81.638798,major
Goa,Panaji,15.482654,73.833124,major
Gujarat,Ahmedabad,23.030405,72.562137,major
Haryana,Gurugram,28.465335,77.025125,major
Himachal Pradesh,Shimla,31.106605,77.180773,major
Jharkhand,Ranchi,23.348013,85.314384,major
Karnataka,Bengaluru,12.97365,77.590186,major
Kerala,Kochi,9.929815,76.277007,major
Madhya Pradesh,Indore,22.714174,75.854346,major
Maharashtra,Mumbai,19.069646,72.880307,major
Manipur,Imphal,24.813476,93.944452,major
Meghalaya,Shillong,25.578503,91.891416,major
Mizoram,Aizawl,23.73101,92.711071,major
Nagaland,Dimapur,25.896172,93.718831,major
Odisha,Bhubaneswar,20.297132,85.830375,major
Punjab,Ludhiana,30.90374,75.857833,major
Rajasthan,Jaipur,26.921195
West Bengal,Asansol,23.669562,86.943659,sub
West Bengal,Siliguri,26.726044,88.394222,sub
West Bengal,Darjeeling,27.044137,88.269625,sub
West Bengal,Kharagpur,22.349619,87.236139,sub
West Bengal,Haldia,22.064258,88.11926,sub
West Bengal,Malda,25.017916,88.139606,sub
West Bengal,Bardhaman,23.232716,87.85383,sub
Odisha,Bhubaneswar,20.286648,85.819319,sub
Odisha,Cuttack,20.471047,85.87992,sub
Odisha,Rourkela,22.258521,84.847716,sub
Odisha,Sambalpur,21.464943,83.977969,sub
Odisha,Berhampur,19.315731,84.792629,sub
Odisha,Puri,19.810011,85.827176,sub
Odisha,Balasore,21.494781,86.941383,sub
Odisha,Jharsuguda,21.861882,84.015541,sub
Odisha,Angul,20.848924,85.106252,sub
Odisha,Baripada,21.928826,86.733417,sub
Maharashtra,Mumbai,19.073313,72.873124,sub
Maharashtra,Pune,18.526,73.862396,sub
Maharashtra,Nagpur,21.15335,79.095673,sub
Maharashtra,Nashik,20.005171,73.795204,sub
Maharashtra,Thane,19.226139,72.988056,sub
Maharashtra,Aurangabad,19.877461,75.350927,sub
Maharashtra,Solapur,17.65678,75.907452,sub
Maharashtra,Amravati,20.933012,77.774769,sub
Maharashtra,Kolhapur,16.699147,74.235303,sub
Maharashtra,Navi Mumbai,19.033618,73.035662,sub`;

  // Parse the hub data
  const parseHubData = useCallback(() => {
    const lines = HUB_DATA.trim().split('\n');
    const headers = lines[0].split(',');
    
    const hubs = lines.slice(1).map(line => {
      const values = line.split(',');
      const hub = {};
      headers.forEach((header, index) => {
        if (header === 'Latitude' || header === 'Longitude') {
          hub[header.toLowerCase()] = parseFloat(values[index]);
        } else {
          hub[header.toLowerCase()] = values[index];
        }
      });
      hub.id = `${hub.state.slice(0, 3)}-${hub.city.slice(0, 5)}`.toUpperCase();
      return hub;
    });
    
    return hubs;
  }, [HUB_DATA]);

  // Generate MST edges (mock implementation since we don't have actual MST algorithm running)
  const generateMockMSTEdges = useCallback((hubs) => {
    const edges = [];
    // Connect major hubs in a spanning tree
    const majorHubs = hubs.filter(h => h.type === 'major');
    
    for (let i = 1; i < majorHubs.length; i++) {
      edges.push({
        source: majorHubs[i-1].id,
        target: majorHubs[i].id,
        distance: calculateHaversineDistance(
          majorHubs[i-1].latitude, majorHubs[i-1].longitude,
          majorHubs[i].latitude, majorHubs[i].longitude
        )
      });
    }
    
    // Connect sub hubs to their closest major hub
    const subHubs = hubs.filter(h => h.type === 'sub');
    subHubs.forEach(subHub => {
      let closestMajor = null;
      let minDistance = Infinity;
      
      majorHubs.forEach(majorHub => {
        const distance = calculateHaversineDistance(
          subHub.latitude, subHub.longitude,
          majorHub.latitude, majorHub.longitude
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestMajor = majorHub;
        }
      });
      
      if (closestMajor) {
        edges.push({
          source: subHub.id,
          target: closestMajor.id,
          distance: minDistance
        });
      }
    });
    
    return edges;
  }, []);
  
  // Haversine distance calculation
  const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  // Find path between two hubs
  const findPath = (start, end, edges) => {
    const graph = {};
    edges.forEach(edge => {
      if (!graph[edge.source]) graph[edge.source] = [];
      if (!graph[edge.target]) graph[edge.target] = [];
      
      graph[edge.source].push({ node: edge.target, distance: edge.distance });
      graph[edge.target].push({ node: edge.source, distance: edge.distance });
    });
    
    // Breadth-first search for simplicity
    const visited = { [start]: null };
    const queue = [start];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (current === end) break;
      
      if (graph[current]) {
        for (const neighbor of graph[current]) {
          if (!visited.hasOwnProperty(neighbor.node)) {
            visited[neighbor.node] = current;
            queue.push(neighbor.node);
          }
        }
      }
    }
    
    // Reconstruct path
    const path = [];
    let current = end;
    
    while (current) {
      path.unshift(current);
      current = visited[current];
    }
    
    return path.length > 1 ? path : [];
  };
  
  // Initialize data on component mount
  useEffect(() => {
    setLoading(true);
    try {
      const hubs = parseHubData();
      const mstEdges = generateMockMSTEdges(hubs);
      
      setNetworkData({
        hubs: hubs,
        edges: mstEdges
      });
      
      // Set default start and end hubs
      if (hubs.length >= 2) {
        setStartHub(hubs.find(h => h.type === 'major')?.id || hubs[0].id);
        setEndHub(hubs.find(h => h.type === 'major' && h.id !== startHub)?.id || hubs[1].id);
      }
      
      setLoading(false);
    } catch (err) {
      setError(`Failed to load network data: ${err.message}`);
      setLoading(false);
    }
  }, [parseHubData, generateMockMSTEdges]);
  
  // Draw network visualization
  useEffect(() => {
    if (!networkData || loading) return;
    
    const width = containerRef.current ? containerRef.current.offsetWidth : 800;
    const height = 600;
    
    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
    
    // Filter nodes and links based on view
    let displayHubs = networkData.hubs;
    if (selectedView === 'major') {
      displayHubs = networkData.hubs.filter(h => h.type === 'major');
    }
    
    const displayedHubIds = new Set(displayHubs.map(h => h.id));
    
    let displayEdges = networkData.edges;
    if (selectedView !== 'all') {
      displayEdges = networkData.edges.filter(e => 
        displayedHubIds.has(e.source) && displayedHubIds.has(e.target)
      );
    }
    
    // Highlight the selected path if it exists
    const pathEdges = [];
    if (selectedPath.length > 1) {
      for (let i = 0; i < selectedPath.length - 1; i++) {
        pathEdges.push({
          source: selectedPath[i],
          target: selectedPath[i + 1]
        });
      }
    }
    
    // Create a projection
    const projection = d3.geoMercator()
      .center([83, 23])  // Center on India
      .scale(1200)
      .translate([width / 2, height / 2]);
    
    // Process nodes with position
    const nodes = displayHubs.map(hub => ({
      id: hub.id,
      name: hub.city,
      state: hub.state,
      type: hub.type,
      x: projection([hub.longitude, hub.latitude])[0],
      y: projection([hub.longitude, hub.latitude])[1]
    }));
    
    // Create node lookup for edge processing
    const nodeById = new Map(nodes.map(node => [node.id, node]));
    
    // Process links with positions
    const links = displayEdges
      .filter(edge => nodeById.has(edge.source) && nodeById.has(edge.target))
      .map(edge => ({
        source: nodeById.get(edge.source),
        target: nodeById.get(edge.target),
        distance: edge.distance
      }));
      
    // Path links
    const highlightLinks = pathEdges
      .filter(edge => nodeById.has(edge.source) && nodeById.has(edge.target))
      .map(edge => ({
        source: nodeById.get(edge.source),
        target: nodeById.get(edge.target)
      }));
    
    // Draw edges
    svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .append("title")
      .text(d => `${d.source.name} ↔ ${d.target.name}: ${d.distance.toFixed(1)}km`);
    
    // Draw highlighted path
    svg.append("g")
      .attr("stroke", "#d32f2f")
      .attr("stroke-opacity", 0.8)
      .selectAll("line")
      .data(highlightLinks)
      .join("line")
      .attr("stroke-width", 3)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke-dasharray", "5,5")
      .attr("marker-end", "url(#arrowhead");
    
    // Define arrow marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#d32f2f");
    
    // Draw nodes
    svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.type === "major" ? 6 : 4)
      .attr("fill", d => {
        if (selectedPath.includes(d.id)) {
          return "#d32f2f";  // Path node
        }
        return d.type === "major" ? "#ef5350" : "#90a4ae";
      })
      .attr("stroke", d => {
        if (selectedPath.includes(d.id)) {
          return "#b71c1c";  // Path node border
        }
        return d.type === "major" ? "#c62828" : "#607d8b";
      })
      .attr("stroke-width", 1.5)
      .on("mouseover", (event, d) => {
        d3.select(tooltipRef.current)
          .style("visibility", "visible")
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`)
          .html(`
            <strong>${d.name}, ${d.state}</strong><br>
            ID: ${d.id}<br>
            Type: ${d.type === 'major' ? 'Major Hub' : 'Sub Hub'}
          `);
      })
      .on("mouseout", () => {
        d3.select(tooltipRef.current)
          .style("visibility", "hidden");
      })
      .on("click", (event, d) => {
        // Select hub as start or end for path finding
        if (event.ctrlKey || event.metaKey) {
          setEndHub(d.id);
        } else {
          setStartHub(d.id);
        }
      });
    
    // Draw labels for major hubs
    svg.append("g")
      .selectAll("text")
      .data(nodes.filter(node => node.type === "major"))
      .join("text")
      .attr("x", d => d.x + 8)
      .attr("y", d => d.y + 3)
      .text(d => d.name)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#333");
      
    // Draw start/end labels
    if (selectedPath.length > 1) {
      const startNode = nodeById.get(selectedPath[0]);
      const endNode = nodeById.get(selectedPath[selectedPath.length - 1]);
      
      svg.append("text")
        .attr("x", startNode.x + 8)
        .attr("y", startNode.y - 8)
        .text("START")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("font-weight", "bold")
        .attr("fill", "#d32f2f");
        
      svg.append("text")
        .attr("x", endNode.x + 8)
        .attr("y", endNode.y - 8)
        .text("END")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("font-weight", "bold")
        .attr("fill", "#d32f2f");
    }
    
  }, [networkData, selectedView, selectedPath, loading]);
  
  // Handle finding path between selected hubs
  const handleFindPath = () => {
    if (!startHub || !endHub || !networkData) return;
    
    const path = findPath(startHub, endHub, networkData.edges);
    setSelectedPath(path);
  };
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading network data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger my-3">
        {error}
      </div>
    );
  }

  return (
    <div className="network-visualizer">
      <div className="enterprise-banner">
        <pre className="mb-0" style={{overflow: 'hidden'}}>{asciiBanner}</pre>
      </div>
      
      <Card className="mb-4 shadow-sm border-0">
        <Card.Header className="bg-danger text-white d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">
              <i className="fas fa-project-diagram me-2"></i>
              Enterprise Logistics Network Visualization
            </h5>
          </div>
          <div>
            <Badge bg="light" text="danger" className="me-2">
              {networkData?.hubs.filter(h => h.type === 'major').length} Major Hubs
            </Badge>
            <Badge bg="light" text="danger">
              {networkData?.hubs.filter(h => h.type === 'sub').length} Sub Hubs
            </Badge>
          </div>
        </Card.Header>
        
        <Card.Body>
          <Row className="mb-3">
            <Col md={6} lg={8}>
              <Form.Group>
                <Form.Label><strong>Network View</strong></Form.Label>
                <div className="d-flex">
                  <Form.Check
                    type="radio"
                    label="Optimal Network (MST)"
                    name="networkView"
                    id="viewMST"
                    checked={selectedView === 'mst'}
                    onChange={() => setSelectedView('mst')}
                    className="me-3"
                  />
                  <Form.Check
                    type="radio"
                    label="Major Hubs Only"
                    name="networkView"
                    id="viewMajor"
                    checked={selectedView === 'major'}
                    onChange={() => setSelectedView('major')}
                    className="me-3"
                  />
                  <Form.Check
                    type="radio"
                    label="All Connections"
                    name="networkView"
                    id="viewAll"
                    checked={selectedView === 'all'}
                    onChange={() => setSelectedView('all')}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label><strong>Starting Hub</strong></Form.Label>
                <Form.Select 
                  value={startHub} 
                  onChange={(e) => setStartHub(e.target.value)}
                >
                  <option value="">Select Starting Hub</option>
                  {networkData?.hubs.map(hub => (
                    <option key={`start-${hub.id}`} value={hub.id}>
                      {hub.city}, {hub.state} ({hub.type === 'major' ? 'Major' : 'Sub'})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label><strong>Destination Hub</strong></Form.Label>
                <Form.Select 
                  value={endHub} 
                  onChange={(e) => setEndHub(e.target.value)}
                >
                  <option value="">Select Destination Hub</option>
                  {networkData?.hubs.map(hub => (
                    <option key={`end-${hub.id}`} value={hub.id}>
                      {hub.city}, {hub.state} ({hub.type === 'major' ? 'Major' : 'Sub'})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={12} lg={4} className="d-flex align-items-end">
              <Button 
                variant="danger" 
                className="mb-3 w-100"
                onClick={handleFindPath}
                disabled={!startHub || !endHub}
              >
                <i className="fas fa-route me-2"></i>
                Find Optimal Route
              </Button>
            </Col>
          </Row>
          
          {selectedPath.length > 0 && (
            <div className="route-info bg-light p-3 mb-3 rounded border">
              <h6 className="mb-2">
                <i className="fas fa-map-signs me-2"></i>
                Optimal Route
              </h6>
              <p className="mb-1">
                <Badge bg="danger" className="me-2">
                  {selectedPath.length} Hubs
                </Badge>
                {selectedPath.join(' → ')}
              </p>
            </div>
          )}
          
          <div className="network-container border rounded bg-light" ref={containerRef}>
            <svg ref={svgRef} className="w-100"></svg>
            <div 
              ref={tooltipRef} 
              className="tooltip bg-white p-2 rounded shadow-sm" 
              style={{
                position: "absolute",
                visibility: "hidden",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "5px",
                zIndex: 1000
              }}
            />
          </div>
          
          <div className="legend mt-3 d-flex">
            <div className="me-4">
              <span className="d-inline-block me-2" style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef5350" }}></span>
              Major Hub
            </div>
            <div className="me-4">
              <span className="d-inline-block me-2" style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#90a4ae" }}></span>
              Sub Hub
            </div>
            <div className="me-4">
              <span className="d-inline-block me-2" style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#d32f2f" }}></span>
              Path Hub
            </div>
            <div>
              <span className="d-inline-block me-2" style={{ width: "20px", height: "2px", backgroundColor: "#d32f2f", position: "relative", top: "-3px" }}></span>
              Optimal Route
            </div>
          </div>
          
          <div className="tips mt-3">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
              Click on a hub to set it as the start point, or Ctrl+Click to set as the destination.
              Hover over hubs and routes for more details.
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NetworkVisualizer;