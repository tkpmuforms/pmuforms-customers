import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { EditFormSvg } from "../../assets/svgs/DashboardSvg";
import "./appointmentsdetails.scss";
import { getAllFilledFormsForAppointment } from "../../firebase/firebaseServices";

const RenderAppointmentCard = ({
  title,
  date,
  formsFilled,
  status,
  ViewClick,
}) => {
  return (
    <div className="form-card">
      <div className="form-info">
        <h4>{title}</h4>
        <p>Date of Appointment: {date}</p>
        <p>Forms filled: {formsFilled}</p>
        <span className={`status ${status}`}>
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
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const fetchedForms = await getAllFilledFormsForAppointment(id);
        console.log("Fetched forms:", fetchedForms);
        setForms(fetchedForms);
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
        <button onClick={() => window.history.back()}>
          Go back to dashboard
        </button>
        <h3>Appointment Date</h3>
        <h3>Services Received</h3>
        <div className="form-list">
          {forms.length > 0 ? (
            forms.map((form, index) => (
              <RenderAppointmentCard
                key={form.id}
                title={form.title || `Form ${index + 1}`}
                date={
                  new Date(form.date?.seconds * 1000).toLocaleDateString() ||
                  "N/A"
                }
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
