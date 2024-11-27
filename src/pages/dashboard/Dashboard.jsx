import React, { useEffect, useState } from "react";
import "./dashboard.scss";
import { useNavigate } from "react-router-dom";
import {
  getAppointmentsForClient,
  getCustomer,
  getFilledFormsForCustomer,
  getServicesForArtistWithId,
  getAllFormsForServices,
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
  const formattedDate = new Date(date.seconds * 1000).toLocaleDateString();
  return (
    <div className="appointment-card">
      <div className="appointment-info">
        <h4>{title}</h4>
        <p>Date of Appointment: {formattedDate}</p>
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
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const userId = localStorage.getItem("userId");
  const businesName = localStorage.getItem("businessName");
  const navigate = useNavigate();
  // New state for services
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchAppointments(userId);
    fetchForms(userId);
    checkPersonalInformation(userId);
    fetchFormsForServices(services);
    const artistId = localStorage.getItem("artistId");
    if (artistId) {
      fetchServices(artistId);
    }
  }, [userId]);

  const fetchAppointments = async (userId) => {
    try {
      const response = await getAppointmentsForClient(userId);
      console.log("appointments", response);
      setAppointments(response);
      categorizeAppointments(response);
    } catch (error) {}
  };

  const categorizeAppointments = (appointments) => {
    const now = new Date();
    const past = appointments.filter(
      (appointment) => new Date(appointment.date) < now && !appointment.deleted
    );
    const upcoming = appointments.filter(
      (appointment) => new Date(appointment.date) >= now && !appointment.deleted
    );

    setPastAppointments(past);
    setUpcomingAppointments(upcoming);
  };

  const fetchForms = async (userId) => {
    try {
      const response = await getFilledFormsForCustomer(userId);
      console.log("forms", response);
      setForms(response);
    } catch (error) {}
  };

  const fetchServices = async (artistId) => {
    try {
      const response = await getServicesForArtistWithId(artistId);
      console.log("services", response);
      setServices(response);
    } catch (error) {}
  };

  const checkPersonalInformation = async (userId) => {
    try {
      const customer = await getCustomer(userId);
      console.log("customer", customer);

      setClientName(customer?.info?.client_name);
      if (customer && customer.info) {
        setShowPersonalInfo(false);
        localStorage.setItem("clientName", customer.info.client_name);
        localStorage.setItem("businessName", customer.info.businessName);
      } else {
        setShowPersonalInfo(true);
      }
    } catch (error) {}
  };

  const getServiceTitle = (serviceIds) => {
    // Map service IDs to service names
    const serviceNames = services
      .filter((service) => serviceIds.includes(service.id))
      .map((service) => service.service);
    return serviceNames.join(", ") || "Appointment";
  };

  const deleteAppointments = (appointmentId) => {
    const newPastAppointments = pastAppointments.filter(
      (element) => element.data.id !== appointmentId
    );
    const newUpcomingAppointments = upcomingAppointments.filter(
      (element) => element.data.id !== appointmentId
    );

    setPastAppointments(newPastAppointments);
    setUpcomingAppointments(newUpcomingAppointments);

    updateAppointment(appointmentId, { deleted: true })
      .then(() => {
        Toast("success", "Appointment deleted successfully");
      })
      .catch((error) => {
        Toast("error", "Error deleting appointment");
      });
  };

  const fetchFormsForServices = (services) => {
    try {
      const response = getAllFormsForServices(services);
      console.log("forms for services", response);
      setForms(response);
    } catch (error) {}
  };

  if (showPersonalInfo) {
    return (
      <PersonalDetailsForm onSubmitClick={() => setShowPersonalInfo(false)} />
    );
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
                title={getServiceTitle(appointment?.services)}
                date={appointment?.date}
                formsFilled={appointment?.formsFilled || 0}
                status={appointment?.status}
                ViewClick={() => navigate(`/appointments/${appointment.id}`)}
                DeleteClick={() => deleteAppointments(appointment.id)}
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
