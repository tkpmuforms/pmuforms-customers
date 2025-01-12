import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookAnAppointmentButtonSvg,
  BookAnAppointmentSvg,
  DeleteAppointmentButtonSvg,
  EditPersonalInformationSvg,
  NoAppointmentsSvg,
  ViewFormButtonSvg,
  ViewPastAppointmentsSvg,
  WarningSvg,
} from "../../assets/svgs/DashboardSvg";
import {
  getAllFormsForServices,
  getFilledFormsForCustomer,
} from "../../firebase/firebaseServices";
import {
  deleteAppointment,
  getAllAppointments,
  getArtistById,
  getArtistServices,
  getAuthenticatedUser,
} from "../../services/services";
import { Toast } from "../../utils/toast/Toast";
import PersonalDetailsForm from "../authpage/signUp/PersonalDetailsForm";
import "./dashboard.scss";

const RenderAppointmentCard = ({
  title,
  date,
  formsFilled,
  status,
  ViewClick,
  DeleteClick,
}) => {
  // Correctly parse the ISO date string
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  console.log(status);
  return (
    <div className="appointment-card">
      <div className="appointment-info">
        <h4>{title}</h4>
        <p>Date of Appointment: {formattedDate}</p>
        <p>Forms filled: {formsFilled}</p>
        <span className={`status ${status}`}>
          {status === "true" ? "Forms Completed" : "Forms Not Completed"}
        </span>
      </div>
      <div className="appointment-actions">
        <ViewFormButtonSvg onClick={ViewClick} />
        <DeleteAppointmentButtonSvg onClick={DeleteClick} />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const params = useParams();
  const artistId = params.artistId || localStorage.getItem("artistId");
  const [appointments, setAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [forms, setForms] = useState([]);
  const [clientName, setClientName] = useState("");
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const userId = localStorage.getItem("userId");
  const [businessName, setBusinessName] = useState(
    localStorage.getItem("businessName")
  );
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!businessName) {
      fetchAndStoreBusinessName(artistId);
    }
    fetchAppointments(userId);
    fetchForms(userId);
    checkPersonalInformation(userId);
    fetchFormsForServices(services);
    if (artistId) {
      fetchServices(artistId);
    }
  }, [userId, artistId]);

  const fetchAndStoreBusinessName = async (artistId) => {
    try {
      const artist = await getArtistById(artistId);
      console.log("business name", artist.businessName);
      localStorage.setItem("businessName", artist.businessName);
      setBusinessName(artist.businessName);
    } catch (error) {
      console.error("Error fetching business name:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await getAllAppointments();
      console.log("appointments", response);
      setAppointments(response?.appointments);
      categorizeAppointments(response);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
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
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  const fetchServices = async (artistId) => {
    try {
      const response = await getArtistServices(artistId);
      console.log("services", response);
      setServices(response?.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const checkPersonalInformation = async () => {
    try {
      const customer = await getAuthenticatedUser();
      console.log("customer", customer);
      console.log("customer info", customer?.info);
      console.log("user", customer?.user);

      setClientName(customer?.user?.info?.client_name);
      if (customer && customer?.user?.info) {
        setShowPersonalInfo(false);
      } else {
        setShowPersonalInfo(true);
      }
    } catch (error) {
      console.error("Error checking personal information:", error);
    }
  };

  const getServiceTitle = (serviceIds) => {
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

    deleteAppointment(appointmentId)
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
    } catch (error) {
      console.error("Error fetching forms for services:", error);
    }
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
          <p>Welcome to {businessName}</p>
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
            onClick={() => navigate(`/book-appointments/${artistId}`)}
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
                status={appointment?.allFormsCompleted}
                ViewClick={() => navigate(`/appointments/${appointment.id}`)}
                DeleteClick={() => deleteAppointments(appointment.id)}
              />
            ))}
            {appointments.length === 0 && (
              <div className="no-appointments">
                <NoAppointmentsSvg />
                <p>You have no upcoming appointments</p>
                <BookAnAppointmentButtonSvg
                  onClick={() => navigate(`/book-appointments/${artistId}`)}
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
