import React, { useEffect, useState } from "react";
import "./dashboard.scss";
import { useNavigate } from "react-router-dom";
import {
  getAppointmentsForClient,
  getCustomer,
  getFilledFormsForCustomer,
  updateAppointment,
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
import { Toast } from "../../utils/toast/Toast";

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
  const [pastAppointments, setPastAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [forms, setForms] = useState([]);
  const [clientName, setClientName] = useState("");
  const [personalInfoComplete, setPersonalInfoComplete] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const userID = localStorage.getItem("userId");
  const businesName = localStorage.getItem("businessName");
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

  const deleteAppointments = (appointmentId) => {
    setPastAppointments((prev) =>
      prev.filter((element) => element.data.id !== appointmentId)
    );
    setUpcomingAppointments((prev) =>
      prev.filter((element) => element.data.id !== appointmentId)
    );
    updateAppointment(appointmentId, { deleted: true })
      .then(() => {
        Toast("success", "Appointment deleted successfully");
      })
      .catch((error) => {
        Toast("error", "Error deleting appointment");
      });
  };

  if (showPersonalInfo) {
    return <PersonalDetailsForm onSubmitClick={setShowPersonalInfo(false)} />;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h3>
            Hello, <span>{clientName}</span> Welcome back.
          </h3>
          <p>Welcome to {businesName}</p>
          <div className="alert">
            <WarningSvg />
            <p>
              Please complete all required forms for your upcoming appointment
            </p>
          </div>
        </header>

        <div className="actions-section">
          <div
            className="action-card"
            onClick={() => navigate("/book-appointments")}
          >
            <BookAnAppointmentSvg />
            <div>
              <h5>Book an Appointment</h5>
              <p>
                Easily book your next appointment by selecting a service and
                preferred time.
              </p>
            </div>
          </div>
          <div
            className="action-card"
            onClick={() => navigate("/appointments")}
          >
            <ViewPastAppointmentsSvg />
            <div>
              <h5>View Past Appointments</h5>
              <p>
                Review your appointment history, access details of your previous
                appointments.
              </p>
            </div>
          </div>
          <div
            className="action-card"
            onClick={() => setShowPersonalInfo(true)}
          >
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
            <a href="/appointments">See All Appointments</a>
          </div>
          <div className="appointments-list">
            {appointments?.map((appointment, index) => (
              <RenderAppointmentCard
                key={index}
                title={appointment.title}
                date={appointment.date}
                formsFilled={appointment.formsFilled}
                status={appointment.status}
                DeleteClick={deleteAppointments}
              />
            ))}
            {appointments.length === 0 && (
              <div className="no-appointments">
                <NoAppointmentsSvg />
                <p>You have no upcoming appointments</p>
                <BookAnAppointmentButtonSvg
                  onClick={() => navigate("/book-appointments")}
                  style={{ cursor: "pointer", marginTop: "1rem" }}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
