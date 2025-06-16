import { Dialog, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditFormSvg } from "../../assets/svgs/DashboardSvg";
import { FIlledFormsSvg } from "../../assets/svgs/filledFormsSvg";
import { ROUTE_PATHS } from "../../routes/routes";
import { getAllFilledFormsForAppointment } from "../../services/services";
import ViewFilledForm from "../viewFilledFormsModal/ViewFilledForms";
import "./filledForms.scss";

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
  const businessUri = localStorage.getItem("businessUri");
  const isArtist = localStorage.getItem("isArtist");

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
    navigate(ROUTE_PATHS.APPOINTMENTS.replace(":businessUri", businessUri));
  };
  const handleGoToDashboard = () => {
    navigate(
      ROUTE_PATHS.CUSTOMER_DASHBOARD.replace(":businessUri", businessUri)
    );
  };
  const handleFillAnotherForm = () => {
    navigate(ROUTE_PATHS.BOOK_APPOINTMENT.replace(":businessUri", businessUri));
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
      {isArtist ? (
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "100%",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            style={{
              backgroundColor: "#F4EAF4",
              color: "#8E2D8E",
              padding: "10px 20px",
              width: "100%",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
            onClick={handleGoToDashboard}
          >
            Go to Dashboard
          </button>
          <button
            style={{
              backgroundColor: "#8E2D8E",
              width: "100%",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
            onClick={handleFillAnotherForm}
          >
            Fill Another Form
          </button>
        </div>
      ) : (
        <button className="complete-button" onClick={handleCompleteForm}>
          View Appointment Forms
        </button>
      )}
      {isModalOpen && selectedForm && (
        <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth={true}>
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: "2px",
              right: "2px",
              cursor: "pointer",
              padding: "10px",
              fontSize: "1.5rem",
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
