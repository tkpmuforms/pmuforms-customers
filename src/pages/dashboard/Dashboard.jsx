import React from "react";
import "./dashboard.scss"; // Import the SCSS file for styling

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h2>Hello, Maleek! Welcome back.</h2>
          <p>Welcome to Britney Lashes</p>
          <div className="alert">
            <p>🔔 Please complete all required forms for your upcoming appointment</p>
          </div>
        </header>

        <div className="actions-section">
          <div className="action-card">
            <div className="icon">📅</div>
            <h3>Book an Appointment</h3>
            <p>Easily book your next appointment by selecting a service and preferred time.</p>
          </div>
          <div className="action-card">
            <div className="icon">📄</div>
            <h3>View Past Appointments</h3>
            <p>Review your appointment history, access details of your previous appointments.</p>
          </div>
          <div className="action-card">
            <div className="icon">✏️</div>
            <h3>Edit Personal Information</h3>
            <p>View and edit your personal information easily.</p>
          </div>
        </div>

        <section className="appointments-section">
          <h3>Upcoming Appointments</h3>
          <div className="appointments-list">
            <div className="appointment-card">
              <div className="appointment-info">
                <h4>BB Glow, Dry Needling</h4>
                <p>Date of Appointment: Tuesday, July 25, 2024</p>
                <p>Forms filled: 22/07/2024 22:00</p>
                <span className="status not-completed">Forms Not Completed</span>
              </div>
              <div className="appointment-actions">
                <button className="view-forms-button">View Forms</button>
                <button className="delete-appointment-button">Delete Appointment</button>
              </div>
            </div>

            {/* Repeat for other appointments */}
            <div className="appointment-card">
              <div className="appointment-info">
                <h4>Lipshading</h4>
                <p>Date of Appointment: Tuesday, July 25, 2024</p>
                <p>Forms filled: 22/07/2024 22:00</p>
                <span className="status completed">Forms Completed</span>
              </div>
              <div className="appointment-actions">
                <button className="view-forms-button">View Forms</button>
                <button className="delete-appointment-button">Delete Appointment</button>
              </div>
            </div>

            {/* Add more appointments as needed */}
          </div>
          <div className="see-all-appointments">
            <a href="#">See All Appointments</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
