import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookAnAppointmentButtonSvg,
  DeleteAppointmentButtonSvg,
  GoBackSvg,
  NoAppointmentsSvg,
  ViewFormButtonSvg,
} from "../../assets/svgs/DashboardSvg";
import {
  deleteAppointment,
  getAllAppointments,
  getArtistServices,
} from "../../services/services";
import { Toast } from "../../utils/toast/Toast";
import "./allappointments.scss";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const RenderAppointmentCard = ({
  title,
  date,
  formsFilled,
  status,
  ViewClick,
  DeleteClick,
}) => {
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

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [metadata, setMetadata] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const artistId = localStorage.getItem("artistId");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (userId) {
      fetchAppointments(userId);
    }
    if (artistId) {
      fetchServices(artistId);
    }
  }, [userId]);

  const fetchServices = async (artistId) => {
    try {
      const response = await getArtistServices(artistId);
      console.log("services", response);
      setServices(response?.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const getServiceTitle = (serviceIds) => {
    const serviceNames = services
      .filter((service) => serviceIds.includes(service.id))
      .map((service) => service.service);
    return serviceNames.join(", ") || "Appointment";
  };

  const fetchAppointments = async () => {
    try {
      const response = await getAllAppointments();
      console.log("Fetched appointments:", response);
      setAppointments(response?.appointments);
      setMetadata(response?.metadata);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const removeAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);
      console.log("Appointment deleted successfully");
      Toast("success", "Appointment deleted successfully");
      setAppointments((prev) =>
        prev.filter((appt) => appt.id !== appointmentId)
      );
    } catch (error) {
      Toast("error", "Error deleting appointment");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= metadata.lastPage) {
      setCurrentPage(newPage); // Update current page
    }
  };

  return (
    <div className="appointments">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          cursor: "pointer",
          marginBottom: "20px",
          padding: "10px",
        }}
        onClick={() => navigate("/dashboard")}
      >
        <GoBackSvg />
        <p>Go back to dashboard</p>
      </div>

      <h3>All Appointments ({metadata?.total})</h3>
      <div className="appointments-list">
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <RenderAppointmentCard
              key={index}
              title={getServiceTitle(appointment?.services)}
              date={appointment.date}
              formsFilled={appointment.formsFilled || 0}
              status={appointment.allFormsCompleted}
              ViewClick={() => navigate(`/appointments/${appointment.id}`)}
              DeleteClick={() => removeAppointment(appointment.id)}
            />
          ))
        ) : (
          <div className="no-appointments">
            <NoAppointmentsSvg />
            <p>You have no upcoming appointments</p>
            <BookAnAppointmentButtonSvg
              onClick={() => navigate(`/book-appointments/${artistId}`)}
            />
          </div>
        )}
      </div>

      {metadata && (
        <div
          className="pagination-controls"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <ArrowBack
            onClick={() => handlePageChange(currentPage - 1)}
            style={{
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              color: currentPage === 1 ? "#ddd" : "#000",
              marginRight: "10px",
            }}
          />
          <span>
            Page {currentPage} of {metadata.lastPage}
          </span>
          <ArrowForward
            onClick={() => handlePageChange(currentPage + 1)}
            style={{
              cursor:
                currentPage === metadata.lastPage ? "not-allowed" : "pointer",
              color: currentPage === metadata.lastPage ? "#ddd" : "#000",
              marginLeft: "10px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
