import React, { useEffect, useState } from "react";
import "./allappointments.scss";
import {
  BookAnAppointmentButtonSvg,
  DeleteAppointmentButtonSvg,
  GoBackSvg,
  NoAppointmentsSvg,
  ViewFormButtonSvg,
} from "../../assets/svgs/DashboardSvg";
import { useNavigate } from "react-router-dom";
import {
  getAppointmentsForClient,
  updateAppointment,
} from "../../firebase/firebaseServices";
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

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchAppointments(userId);
    }
  }, [userId]);

  const fetchAppointments = async (userId) => {
    try {
      const response = await getAppointmentsForClient(userId);
      console.log("Fetched appointments:", response);
      setAppointments(response);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      await updateAppointment(appointmentId, { deleted: true });
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
      <p>
        <GoBackSvg onClick={() => navigate("/dashboard")} />
        Go back to dashboard
      </p>

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
              DeleteClick={() => deleteAppointment(appointment.id)}
            />
          ))
        ) : (
          <div className="no-appointments">
            <NoAppointmentsSvg />
            <p>You have no upcoming appointments</p>
            <BookAnAppointmentButtonSvg
              onClick={() => navigate("/book-appointments")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
