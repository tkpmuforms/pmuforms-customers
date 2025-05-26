import { CircularProgress, Dialog, Typography } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditFormSvg, GoBackSvg } from "../../assets/svgs/DashboardSvg";
import {
  getAllFilledFormsForAppointment,
  getAppointmentById,
} from "../../services/services";
import ViewFilledForm from "../viewFilledFormsModal/ViewFilledForms";
import { ROUTE_PATHS } from "../../routes/routes";
import "./appointmentsdetails.scss";

const RenderFormsCard = ({ title, status, onEditClick, onViewClick }) => {
  return (
    <div className="form-card">
      <div className="form-info">
        <h4>{title}</h4>
        <span className={`status ${status}`}>
          {status === "completed" || status === "signed"
            ? "Completed"
            : "Pending"}
        </span>
      </div>
      <div className="form-actions">
        {status === "completed" ? (
          <button className="view-form-button" onClick={onViewClick}>
            View Form
          </button>
        ) : (
          <EditFormSvg onClick={onEditClick} className="edit-form-svg" />
        )}
      </div>
    </div>
  );
};

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointMent, setAppointMent] = useState({});
  const [filledForms, setFilledForms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const businessUri = localStorage.getItem("businessUri");

  useEffect(() => {
    setLoading(true);
    const fetchAppointmentAndForms = async () => {
      try {
        const [appointmentRes, filledFormsRes] = await Promise.all([
          getAppointmentById(id),
          getAllFilledFormsForAppointment(id),
        ]);

        setAppointMent(appointmentRes?.appointment || {});
        setFilledForms(filledFormsRes?.filledForms || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointment or forms:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchAppointmentAndForms();
    }
  }, [id]);

  const handleViewForm = (form) => {
    setSelectedForm(form);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
  };

  const getFormTitle = (filledForm) => {
    // Try direct title first
    if (filledForm.title) return filledForm.title;

    // Try formTemplate title
    if (filledForm.formTemplate?.title) return filledForm.formTemplate.title;

    // Try first section title
    if (filledForm.formTemplate?.sections?.[0]?.title) {
      return filledForm.formTemplate.sections[0].title;
    }

    // Try to find any section with a title
    const sectionWithTitle = filledForm.formTemplate?.sections?.find(
      (section) => section.title
    );
    if (sectionWithTitle) return sectionWithTitle.title;

    return "N/A";
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={100} color="#8e2d8e" />
      </div>
    );
  }

  return (
    <div>
      <div className="form">
        <div
          className="go-back"
          onClick={() =>
            navigate(
              ROUTE_PATHS.CUSTOMER_DASHBOARD.replace(
                ":businessUri",
                businessUri
              )
            )
          }
        >
          <GoBackSvg />
          <p>Go back to dashboard</p>
        </div>

        <div className="appointment-info">
          <div className="info-item">
            <span className="info-title">Appointment Date:</span>
            <span className="info-value">
              {appointMent?.date
                ? dayjs(appointMent.date).format("MM-DD-YYYY")
                : "N/A"}
            </span>
          </div>
          <div className="info-item">
            <span className="info-title">Services Received:</span>
            <span className="info-value">
              {appointMent?.serviceDetails
                ?.map((service) => service.service)
                .join(", ") || "N/A"}
            </span>
          </div>
        </div>

        <div className="form-list">
          {filledForms.length > 0 &&
            filledForms.map((filledForm) => (
              <RenderFormsCard
                key={filledForm.id}
                title={getFormTitle(filledForm)}
                status={
                  filledForm.status === "completed" ||
                  filledForm.status === "signed"
                    ? "completed"
                    : "incomplete"
                }
                onViewClick={() => handleViewForm(filledForm.formTemplate)}
                onEditClick={() =>
                  navigate(
                    ROUTE_PATHS.DYNAMIC_FORMS.replace(
                      ":appointmentId",
                      id
                    ).replace(":businessUri", businessUri) +
                      `?formId=${filledForm.formTemplateId}`
                  )
                }
              />
            ))}
        </div>
      </div>

      {isModalOpen && selectedForm && (
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
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
              formTemplateId={selectedForm.id}
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

export default AppointmentDetails;
