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
  deleteAppointment,
  getAllAppointments,
  getArtistById,
  getArtistServices,
  getAuthenticatedUser,
} from "../../services/services";
import { Toast } from "../../utils/toast/Toast";
import PersonalDetailsForm from "../authpage/authsubfolders/signUp/PersonalDetailsForm";
import "./dashboard.scss";
import { CircularProgress } from "@mui/material";
import useAuth from "../../context/useAuth";

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
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [businessName, setBusinessName] = useState(
    localStorage.getItem("businessName")
  );
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loader
      try {
        const [businessRes, appointmentsRes, customerRes, servicesRes] =
          await Promise.all([
            artistId ? getArtistById(artistId) : Promise.resolve(null),
            getAllAppointments(),
            getAuthenticatedUser(),
            artistId ? getArtistServices(artistId) : Promise.resolve(null),
          ]);

        // Update business name
        if (businessRes?.artist?.businessName) {
          localStorage.setItem("businessName", businessRes.artist.businessName);
          setBusinessName(businessRes.artist.businessName);
        }

        // Update appointments
        const appointments = appointmentsRes?.appointments || [];
        setAppointments(appointments);
        categorizeAppointments(appointments);

        // Update personal info visibility
        const customerInfo = customerRes?.user?.info;
        setShowPersonalInfo(!customerInfo);

        // Update services
        setServices(servicesRes?.services || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loader
      }
    };

    fetchData();
  }, [artistId]);

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
            Hello, <span>{user?.name ?? user?.info?.client_name}</span> Welcome
            back.
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
            <p onClick={() => navigate("/appointments")}>
              See All Appointments
            </p>
          </div>
          <div className="appointments-list">
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress size={100} color="#8e2d8e" />
              </div>
            ) : appointments?.length > 0 ? (
              appointments
                .slice(0, 3)
                .map((appointment, index) => (
                  <RenderAppointmentCard
                    key={index}
                    title={getServiceTitle(appointment?.services)}
                    date={appointment?.date}
                    formsFilled={appointment?.formsFilled || 0}
                    status={appointment?.allFormsCompleted}
                    ViewClick={() =>
                      navigate(`/appointments/${appointment.id}`)
                    }
                    DeleteClick={() => deleteAppointments(appointment.id)}
                  />
                ))
            ) : (
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
