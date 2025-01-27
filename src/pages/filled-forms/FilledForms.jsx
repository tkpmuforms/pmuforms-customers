import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditFormSvg } from "../../assets/svgs/DashboardSvg";
import { FIlledFormsSvg } from "../../assets/svgs/filledFormsSvg";
import { getAllFilledFormsForAppointment } from "../../services/services";
import "./filledForms.scss";

const RenderFormsCard = ({ title, status, ViewClick }) => {
  return (
    <div className="form-card">
      <div className="form-info">
        <h4>{title}</h4>
        <span className={`status ${status}`}>
          {status === "completed" ? "Completed" : "Pending"}
        </span>
      </div>
      <div className="form-actions">
        <EditFormSvg onClick={ViewClick} />
      </div>
    </div>
  );
};

const FilledForms = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filledForms, setFilledForms] = useState([]);

  useEffect(() => {
    const fetchAllFilledFormsForAppointment = async () => {
      try {
        const res = await getAllFilledFormsForAppointment(id);
        setFilledForms(res?.filledForms || []);
      } catch (error) {
        console.error("Error fetching filled appointment:", error);
      }
    };
    fetchAllFilledFormsForAppointment();
  }, [id]);

  const handleCompleteForm = () => {
    navigate(`/appointments`);
  };

  return (
    <div className="filled-form">
      <div className="svg">
        <FIlledFormsSvg />
      </div>

      <div className="form-list">
        {filledForms.length > 0 ? (
          filledForms.map((form) => (
            <RenderFormsCard
              key={form.id}
              title={form.title || "Untitled Form"}
              status={form.status}
              ViewClick={() => console.log("ViewClick", form.id)}
            />
          ))
        ) : (
          <p>No appointment details available.</p>
        )}
      </div>
      <button className="complete-button" onClick={handleCompleteForm}>
        View AppointMents
      </button>
    </div>
  );
};

export default FilledForms;
