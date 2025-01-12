import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EditFormSvg, GoBackSvg } from "../../assets/svgs/DashboardSvg";
import { getAppointmentById } from "../../services/services";
import "./appointmentsdetails.scss";

const RenderAppointmentCard = ({
  title,
  date,

  status,
  ViewClick,
}) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="form-card">
      <div className="form-info">
        <h4>{title}</h4>
        <p>Date of Appointment: {formattedDate}</p>

        <span className={`status ${status}`}>
          {status === true ? "Forms Completed" : "Forms Not Completed"}
        </span>
      </div>
      <div className="form-actions">
        <EditFormSvg onClick={ViewClick} />
      </div>
    </div>
  );
};

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const businessName = localStorage.getItem("businessName");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await getAppointmentById(id);
        console.log("Fetched appointment:", res);
        setAppointment(res?.appointment || null);
      } catch (error) {
        console.error("Error fetching appointment:", error);
      }
    };

    if (id) {
      fetchAppointment();
    }
  }, [id]);

  return (
    <div>
      <div className="form">
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
        <h3>Appointment Details</h3>
        <div className="form-list">
          {appointment ? (
            <RenderAppointmentCard
              title={`Appointment with Artist ${businessName}`}
              date={appointment.date}
              status={appointment.allFormsCompleted}
              ViewClick={() =>
                // Navigate to the form details page
                console.log(`View appointment ID: ${appointment.id}`)
              }
            />
          ) : (
            <p>No appointment details available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
