import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const Home = () => {
  // Sample container data for demonstration
  const featuredContainers = [
    {
      id: 'C1042',
      type: '40HQ',
      status: 'In Yard',
      location: 'Block A, Row 3, Slot 12',
      arrivalDate: '2025-04-20',
      departureDate: '2025-05-15',
      contents: 'Electronics',
      priority: 'high',
    },
    {
      id: 'C7589',
      type: '20GP',
      status: 'In Transit',
      location: 'En route to yard',
      arrivalDate: '2025-04-26',
      departureDate: '2025-05-10',
      contents: 'Automotive Parts',
      priority: 'medium',
    },
    {
      id: 'C2305',
      type: '40RF',
      status: 'In Yard',
      location: 'Block C, Row 1, Slot 4',
      arrivalDate: '2025-04-18',
      departureDate: '2025-04-29',
      contents: 'Perishable Goods',
      priority: 'urgent',
    },
  ];

  // Sample metrics for the stats section
  const metrics = [
    { number: '98.7%', label: 'Operational Efficiency' },
    { number: '45%', label: 'Cost Reduction' },
    { number: '2.5x', label: 'Throughput Increase' },
    { number: '99.9%', label: 'Location Accuracy' },
  ];

  return (
    <div className="app-container">
      <Header />

      <div className="home-wrapper">
        {/* Hero Section with Glass Morphism Effect */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Container Yard Management System</h1>
            <p className="hero-description">
              Enterprise-grade solution that transforms container yard
              operations with real-time tracking, intelligent space allocation,
              and automated workflow optimization.
            </p>
            <div className="hero-buttons">
              <Link
                to="/register"
                className="btn btn-primary btn-large btn-icon"
              >
                Get Started
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 5L19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link to="/demo" className="btn btn-outline btn-large">
                Watch Demo
              </Link>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="illustration-wrapper">
              <img
                src="https://via.placeholder.com/600x400?text=Container+Yard+Illustration"
                alt="Container Yard Management"
                className="hero-image"
              />
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="metrics-section">
          <div className="metrics-container">
            {metrics.map((metric, index) => (
              <div className="metric-card hover-lift" key={index}>
                <span className="metric-number">{metric.number}</span>
                <span className="metric-label">{metric.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Problems Section */}
        <section className="problems-section">
          <div className="section-header">
            <h2>The Container Yard Challenge</h2>
            <p className="section-description">
              Modern container yards face complex logistics challenges that
              traditional management methods cannot efficiently solve
            </p>
          </div>

          <div className="challenges-grid">
            <div className="challenge-card hover-card">
              <div className="challenge-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
              </div>
              <h3>Container Tracking</h3>
              <p>
                Manually tracking thousands of containers across a yard leads to
                errors, misplacements, and inefficiency in yard operations
              </p>
            </div>

            <div className="challenge-card hover-card">
              <div className="challenge-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3>Resource Allocation</h3>
              <p>
                Suboptimal resource allocation leads to bottlenecks, extended
                wait times, and significantly reduced operational throughput
              </p>
            </div>

            <div className="challenge-card hover-card">
              <div className="challenge-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>Processing Delays</h3>
              <p>
                Paper-based processes and disconnected systems cause significant
                delays in processing arrivals and departures
              </p>
            </div>

            <div className="challenge-card hover-card">
              <div className="challenge-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <h3>Space Optimization</h3>
              <p>
                Ineffective space utilization reduces yard capacity and
                significantly increases overall operational costs
              </p>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="solutions-section">
          <div className="section-header">
            <h2>Enterprise Solution</h2>
            <p className="section-description">
              Our comprehensive management platform brings visibility,
              efficiency, and automation to container yard operations
            </p>
          </div>

          <div className="solutions-content">
            <div className="solutions-image">
              <img
                src="https://via.placeholder.com/600x400?text=Dashboard+Preview"
                alt="System Dashboard"
              />
            </div>

            <div className="solutions-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Real-time Tracking</h3>
                  <p>
                    Know the exact location and status of every container at any
                    time with GPS precision
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Intelligent Stacking</h3>
                  <p>
                    AI-powered container placement algorithms that optimize for
                    accessibility and space
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="5" width="16" height="16" rx="2"></rect>
                    <line x1="16" y1="3" x2="16" y2="7"></line>
                    <line x1="8" y1="3" x2="8" y2="7"></line>
                    <line x1="4" y1="11" x2="20" y2="11"></line>
                    <line x1="10" y1="16" x2="14" y2="16"></line>
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Automated Scheduling</h3>
                  <p>
                    Seamless coordination of arrivals, departures and transfers
                    with minimal manual intervention
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Compliance Management</h3>
                  <p>
                    Automated document processing that ensures regulatory
                    compliance and reduces paperwork
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Containers Section */}
        <section className="containers-section">
          <div className="section-header">
            <h2>Container Management</h2>
            <p className="section-description">
              Monitor and manage every container with detailed tracking and
              status information
            </p>
          </div>

          <div className="container-cards">
            {featuredContainers.map((container) => (
              <div
                key={container.id}
                className={`container-card priority-${container.priority}`}
              >
                <div className="container-header">
                  <h3>{container.id}</h3>
                  <span
                    className={`container-status ${container.status
                      .toLowerCase()
                      .replace(/\s+/g, '-')}`}
                  >
                    {container.status}
                  </span>
                </div>
                <div className="container-body">
                  <div className="container-detail">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{container.type}</span>
                  </div>
                  <div className="container-detail">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{container.location}</span>
                  </div>
                  <div className="container-detail">
                    <span className="detail-label">Arrival:</span>
                    <span className="detail-value">
                      {new Date(container.arrivalDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="container-detail">
                    <span className="detail-label">Departure:</span>
                    <span className="detail-value">
                      {new Date(container.departureDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="container-detail">
                    <span className="detail-label">Contents:</span>
                    <span className="detail-value">{container.contents}</span>
                  </div>
                </div>
                <div className="container-footer">
                  <button className="btn btn-small">View Details</button>
                  <button className="btn btn-small btn-outline">
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="view-all-container">
            <Link to="/containers" className="btn btn-primary btn-icon">
              View All Containers
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="section-header">
            <h2>What Our Clients Say</h2>
            <p className="section-description">
              Trusted by leading logistics and shipping companies worldwide
            </p>
          </div>

          <div className="testimonials-container">
            <div className="testimonial-card hover-lift">
              <div className="testimonial-content">
                <svg
                  className="quote-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 11h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"></path>
                  <path d="M21 11h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"></path>
                  <path d="M10 22h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"></path>
                  <path d="M21 22h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"></path>
                </svg>
                <p>
                  "This system has revolutionized our yard operations. We've
                  reduced container location times by 75% and increased our
                  daily throughput substantially."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <h4>John Doe</h4>
                  <p>Operations Director, Global Shipping Co.</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card hover-lift">
              <div className="testimonial-content">
                <svg
                  className="quote-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 11h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"></path>
                  <path d="M21 11h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"></path>
                  <path d="M10 22h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"></path>
                  <path d="M21 22h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"></path>
                </svg>
                <p>
                  "The analytics capabilities have given us valuable insights
                  into our operations, helping us identify and eliminate
                  inefficiencies we weren't even aware of."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">AS</div>
                <div className="author-info">
                  <h4>Alice Smith</h4>
                  <p>CEO, Logistics Express</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to optimize your container yard?</h2>
            <p>
              Join industry leaders and transform your yard operations with our
              enterprise solution
            </p>
            <Link to="/register" className="btn btn-primary btn-large">
              Start Free 30-Day Trial
            </Link>
            <span className="no-credit-card">No credit card required</span>
          </div>
        </section>

        {/* Footer */}
        <footer className="main-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo-circle gradient-logo">CY</div>
              <div className="brand-group">
                <span className="brand-title">ContainerYard</span>
                <span className="brand-tagline">Management System</span>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                  <li>
                    <Link to="/features">Features</Link>
                  </li>
                  <li>
                    <Link to="/pricing">Pricing</Link>
                  </li>
                  <li>
                    <Link to="/integrations">Integrations</Link>
                  </li>
                  <li>
                    <Link to="/case-studies">Case Studies</Link>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Resources</h4>
                <ul>
                  <li>
                    <Link to="/documentation">Documentation</Link>
                  </li>
                  <li>
                    <Link to="/api">API Reference</Link>
                  </li>
                  <li>
                    <Link to="/guides">Guides</Link>
                  </li>
                  <li>
                    <Link to="/support">Support</Link>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/customers">Customers</Link>
                  </li>
                  <li>
                    <Link to="/careers">Careers</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li>
                    <Link to="/terms">Terms of Service</Link>
                  </li>
                  <li>
                    <Link to="/privacy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/security">Security</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} ContainerYard Management System.
              All rights reserved.
            </p>
            <div className="social-icons">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
