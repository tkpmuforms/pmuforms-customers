import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EditFormSvg, GoBackSvg } from "../../assets/svgs/DashboardSvg";
import { getFormsForAppointMentById } from "../../services/services";
import "./appointmentsdetails.scss";

const RenderAppointmentCard = ({
  title,
  type,
  date,
  formsFilled,
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
        <p>Forms filled: {formsFilled}</p>
        <span className={`status ${false}`}>
          {status === "completed" ? "Forms Completed" : "Forms Not Completed"}
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
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await getFormsForAppointMentById(id);
        console.log("Fetched forms:", res);
        setForms(res?.forms);
      } catch (error) {
        console.error("Error fetching forms for appointment:", error);
      }
    };

    if (id) {
      fetchForms();
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
        <h3>Appointment Date</h3>
        <h3>Services Received</h3>
        <div className="form-list">
          {forms.length > 0 ? (
            forms.map((form, index) => (
              <RenderAppointmentCard
                key={form.id}
                title={form.title || "Untitled Form"}
                createdAt={form.createdAt || "N/A"}
                type={form.type || "Unknown"}
                formsFilled={form.formsFilled || 0}
                status={form.status || "incomplete"}
                ViewClick={() => console.log(`View form with ID: ${form.id}`)}
              />
            ))
          ) : (
            <p>No forms found for this appointment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
