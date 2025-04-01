import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditFormSvg } from "../../assets/svgs/DashboardSvg";
import { FIlledFormsSvg } from "../../assets/svgs/filledFormsSvg";
import { getAllFilledFormsForAppointment } from "../../services/services";
import "./filledForms.scss";
import ViewFilledForm from "../viewFilledFormsModal/ViewFilledForms";
import { Dialog, Typography } from "@mui/material";

const RenderFormsCard = ({ title, status, onEditClick, onViewClick }) => {
  return (
    <div className="form-card">
      <div className="form-info">
        <h4>{title}</h4>
        <span className={`status ${status}`}>
          {status === "completed" ? "Completed" : "Pending"}
        </span>
      </div>
      <div className="form-actions">
        {status === "completed" ? (
          <button className="view-form-button" onClick={onViewClick}>
            View Form
          </button>
        ) : (
          <EditFormSvg onClick={onEditClick} />
        )}
      </div>
    </div>
  );
};

const FilledForms = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filledForms, setFilledForms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
  };

  const handleViewForm = (form) => {
    setSelectedForm(form);
    setIsModalOpen(true);
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
              title={form.title || ""}
              status={form.status}
              onViewClick={() => handleViewForm(form)}
            />
          ))
        ) : (
          <p>No appointment details available.</p>
        )}
      </div>
      <button className="complete-button" onClick={handleCompleteForm}>
        View Appointments
      </button>
      {isModalOpen && selectedForm && (
        <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth={true}>
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: "5px",
              right: "5px",
              cursor: "pointer",
              padding: "10px",
              fontSize: "2.5rem",
            }}
            onClick={handleCloseModal}
          >
            &times;
          </div>
          {selectedForm ? (
            <ViewFilledForm
              formTemplateId={selectedForm.formTemplateId}
              appointmentId={id}
            />
          ) : (
            <Typography variant="body2" color="error">
              No form selected. Please try again.
            </Typography>
          )}
        </Dialog>
      )}
    </div>
  );
};

export default FilledForms;
