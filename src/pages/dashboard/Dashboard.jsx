import { CircularProgress, Tooltip } from "@mui/material";
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
import useAuth from "../../context/useAuth";
import {
  deleteAppointment,
  getAllAppointments,
  getArtistById,
  getAuthenticatedUser,
} from "../../services/services";
import PersonalDetailsForm from "../authpage/authsubfolders/signUp/PersonalDetailsForm";
import "./dashboard.scss";
import { useSnackbar } from "../../context/SnackbarContext";
import SearchPage from "./SearchPage";

const RenderAppointmentCard = ({
  title,
  date,
  formsFilled,
  signed,
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
          {status === true ? "Forms Completed" : "Forms Not Completed"}
        </span>
      </div>
      <div className="appointment-actions">
        <ViewFormButtonSvg onClick={ViewClick} />
        <Tooltip
          title={signed ? "Signed appointment" : "Delete"}
          placement="top"
          arrow
        >
          <span>
            <DeleteAppointmentButtonSvg
              onClick={!signed ? DeleteClick : undefined}
              style={{
                pointerEvents: signed ? "none" : "auto",
                cursor: signed ? "not-allowed" : "pointer",
                opacity: signed ? 0.5 : 1,
              }}
            />
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const params = useParams();
  const artistId = localStorage.getItem("artistId");
  const businessUri = params.businessUri || localStorage.getItem("businessUri");
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [businessName, setBusinessName] = useState(
    localStorage.getItem("businessName")
  );
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  // const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const { showAlert } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loader
      try {
        const [businessRes, appointmentsRes, customerRes] = await Promise.all([
          businessUri ? getArtistById(businessUri) : Promise.resolve(null),
          getAllAppointments(),
          getAuthenticatedUser(),
        ]);

        if (businessUri && !businessRes?.artist) {
          console.error("Error fetching artist, logging out...");
          logout();
          return;
        }

        // Update business name
        if (businessRes?.artist?.businessName) {
          localStorage.setItem("businessName", businessRes.artist.businessName);
          setBusinessName(businessRes.artist.businessName);
          localStorage.setItem("artistId", businessRes.artist.userId);
        }

        // Update appointments
        const updatedAppointments = (appointmentsRes?.appointments || []).map(
          (appointment) => ({
            ...appointment,
            filledFormsCount:
              appointment?.filledForms?.filter(
                (form) =>
                  form.status === "completed" || form.status === "signed"
              ).length || 0,
          })
        );
        setAppointments(updatedAppointments);
        const customerInfo = customerRes?.user?.info;
        setShowPersonalInfo(!customerInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessUri, logout]);

  const removeAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);

      showAlert("success", "Appointment deleted successfully");
      setAppointments((prev) =>
        prev.filter((appt) => appt.id !== appointmentId)
      );
    } catch (error) {
      showAlert("error", "Error deleting appointment");
    }
  };

  if (showPersonalInfo) {
    return (
      <PersonalDetailsForm onSubmitClick={() => setShowPersonalInfo(false)} />
    );
  }
  if (!businessUri) {
    return <SearchPage />;
  }

  const hasIncompleteForms = appointments.some(
    (appointment) => !appointment.allFormsCompleted
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h3>
            Hello, <span>{user?.info?.client_name ?? userName}</span>
          </h3>
          <p>
            Welcome to{" "}
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              {businessName}
            </span>
          </p>
          {appointments?.length > 0 && hasIncompleteForms && (
            <div className="alert">
              <WarningSvg />
              <p>
                Please complete all required forms for your upcoming appointment
              </p>
            </div>
          )}
        </header>

        <div className="actions-section">
          <div
            className="action-card"
            onClick={() => navigate(`/customer/book-appointments/${artistId}`)}
          >
            <BookAnAppointmentSvg />
            <div>
              <h5>Fill Out a New Form</h5>
              <p>
                Fill out a new form for your next appointment by choosing your preferred appointment time,
                the service(s), and hit next.
              </p>
            </div>
          </div>
          <div
            className="action-card"
            onClick={() => navigate("/customer/appointments")}
          >
            <ViewPastAppointmentsSvg />
            <div>
              <h5>View All Appointment Forms</h5>
              <p>
                Review your previous forms, access details of your previous
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
              <h5>Update Personal Information</h5>
              <p>View and edit your personal information easily.</p>
            </div>
          </div>
        </div>

        <section className="appointments-section">
          <h3>Recent Appointment Forms</h3>
          <div className="see-all-appointments">
            <p onClick={() => navigate("/customer/appointments")}>
              View All
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
                .reverse()
                .slice(0, 3)
                .map((appointment, index) => (
                  <RenderAppointmentCard
                    key={index}
                    title={appointment?.serviceDetails
                      .map((service) => service.service)
                      .join(", ")}
                    date={appointment?.date}
                    signed={appointment?.signed}
                    formsFilled={appointment?.filledFormsCount || 0}
                    status={appointment?.allFormsCompleted}
                    ViewClick={() =>
                      navigate(`/customer/appointments/${appointment.id}`)
                    }
                    DeleteClick={() => removeAppointment(appointment.id)}
                  />
                ))
            ) : (
              <div className="no-appointments">
                <NoAppointmentsSvg />
                <p>You have no upcoming appointments</p>
                <BookAnAppointmentButtonSvg
                  onClick={() =>
                    navigate(`/customer/book-appointments/${artistId}`)
                  }
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
