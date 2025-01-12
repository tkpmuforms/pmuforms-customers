import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookAnAppointmentButtonSvg,
  DeleteAppointmentButtonSvg,
  GoBackSvg,
  NoAppointmentsSvg,
  ViewFormButtonSvg,
} from "../../assets/svgs/DashboardSvg";
import { deleteAppointment, getAllAppointments } from "../../services/services";
import { Toast } from "../../utils/toast/Toast";
import "./allappointments.scss";

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

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const artistId = localStorage.getItem("artistId");

  useEffect(() => {
    if (userId) {
      fetchAppointments(userId);
    }
  }, [userId]);

  const fetchAppointments = async () => {
    try {
      const response = await getAllAppointments();
      console.log("Fetched appointments:", response);
      setAppointments(response?.appointments);
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

      <h3>All Appointments</h3>
      <div className="appointments-list">
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <RenderAppointmentCard
              key={index}
              title={appointment.title || "Appointment"}
              date={appointment.date}
              formsFilled={appointment.formsFilled || 0}
              status={appointment.status || "pending"}
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
    </div>
  );
};

export default AllAppointments;
