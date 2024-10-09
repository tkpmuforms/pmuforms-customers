import React, { useEffect, useState } from "react";
import "./dashboard.scss"; // Import the SCSS file for styling
import { useNavigate } from "react-router-dom";
import {
  getAppointmentsForClient,
  getCustomer,
  getFilledFormsForCustomer,
} from "../../firebase/firebaseServices";
import {
  BookAnAppointmentSvg,
  DeleteAppointmentButtonSvg,
  EditPersonalInformationSvg,
  ViewFormButtonSvg,
  ViewPastAppointmentsSvg,
  WarningSvg,
  NoAppointmentsSvg,
  BookAnAppointmentButtonSvg,
} from "../../assets/svgs/DashboardSvg";
import PersonalDetailsForm from "../authpage/signUp/PersonalDetailsForm";

const RenderAppointmentCard = ({
  title,
  date,
  formsFilled,
  status,
  ViewClick,
  DeleteClick,
}) => {
  return (
    <div className="appointment-card">
      <div className="appointment-info">
        <h4>{title}</h4>
        <p>Date of Appointment: {date}</p>
        <p>Forms filled: {formsFilled}</p>
        <span className={`status ${status}`}>
          {status === "completed" ? "Forms Completed" : "Forms Not Completed"}
        </span>
      </div>
      <div className="appointment-actions">
        <ViewFormButtonSvg onClick={ViewClick} />
        <DeleteAppointmentButtonSvg onClick={DeleteClick} />
      </div>
    </div>
  );
};

// Main Dashboard component
const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [forms, setForms] = useState([]);
  const [clientName, setClientName] = useState("");
  const [personalInfoComplete, setPersonalInfoComplete] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const userID = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch appointments and forms for the logged-in user
  useEffect(() => {
    fetchAppointments(userID);
    fetchForms(userID);
    checkPersonalInformation(userID);
  }, [userID]);

  // Fetch user appointments
  const fetchAppointments = async (userID) => {
    try {
      const response = await getAppointmentsForClient(userID);
      setAppointments(response);
      // Check if there are any appointments; if not, show the Personal Information form
      if (response.length === 0) {
        setShowPersonalInfo(true);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Fetch user filled forms
  const fetchForms = async (userID) => {
    try {
      const response = await getFilledFormsForCustomer(userID);
      setForms(response);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  // Check if the user's personal information is complete
  const checkPersonalInformation = async (userID) => {
    try {
      const customer = await getCustomer(userID);
      console.log("Customer info:", customer);
      console.log("Customer name:", customer?.info?.client_name);
      setClientName(customer?.info?.client_name);
      if (customer && customer.info) {
        setPersonalInfoComplete(true);
        setShowPersonalInfo(false);
      } else {
        setPersonalInfoComplete(false);
        setShowPersonalInfo(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  if (showPersonalInfo) {
    return <PersonalDetailsForm />;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h3>
            Hello, <span>{clientName}</span> Welcome back.
          </h3>
          <p>Welcome to Britney Lashes</p>
          <div className="alert">
            <WarningSvg />
            <p>
              Please complete all required forms for your upcoming appointment
            </p>
          </div>
        </header>

        <div className="actions-section">
          <div className="action-card">
            <BookAnAppointmentSvg />
            <div>
              <h5>Book an Appointment</h5>
              <p>
                Easily book your next appointment by selecting a service and
                preferred time.
              </p>
            </div>
          </div>
          <div className="action-card">
            <ViewPastAppointmentsSvg />
            <div>
              <h5>View Past Appointments</h5>
              <p>
                Review your appointment history, access details of your previous
                appointments.
              </p>
            </div>
          </div>
          <div className="action-card">
            <EditPersonalInformationSvg />
            <div>
              <h5>Edit Personal Information</h5>
              <p>View and edit your personal information easily.</p>
            </div>
          </div>
        </div>

        <section className="appointments-section">
          <h3>Upcoming Appointments</h3>
          <div className="see-all-appointments">
            <a href="#">See All Appointments</a>
          </div>
          <div className="appointments-list">
            {appointments?.map((appointment, index) => (
              <RenderAppointmentCard
                key={index}
                title={appointment.title}
                date={appointment.date}
                formsFilled={appointment.formsFilled}
                status={appointment.status}
              />
            ))}
            {appointments.length === 0 && (
              <div className="no-appointments">
                <NoAppointmentsSvg />
                <p>You have no upcoming appointments</p>
                <BookAnAppointmentButtonSvg />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
