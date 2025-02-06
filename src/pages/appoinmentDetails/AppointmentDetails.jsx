import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EditFormSvg, GoBackSvg } from "../../assets/svgs/DashboardSvg";
import {
  getAllFilledFormsForAppointment,
  getAppointmentById,
  getArtistServices,
  getFormsForAppointMentById,
} from "../../services/services";
import "./appointmentsdetails.scss";
import { Dialog, Typography } from "@mui/material";
import ViewFilledForm from "../viewFilledFormsModal/ViewFilledForms";
import dayjs from "dayjs";

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

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [services, setServices] = useState([]);
  const [appointMent, setAppointMent] = useState({});
  const [filledForms, setFilledForms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const artisId = localStorage.getItem("artistId");

  useEffect(() => {
    const fetchAllFilledFormsForAppointment = async () => {
      try {
        const res = await getAllFilledFormsForAppointment(id);
        setFilledForms(res?.filledForms || []);
      } catch (error) {
        console.error("Error fetching filled appointment:", error);
      }
    };

    const fetchAllFormsForAppointment = async () => {
      try {
        const res = await getFormsForAppointMentById(id);
        setForms(res?.forms || []);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    const fetchServices = async (artistId) => {
      try {
        const response = await getArtistServices(artistId);
        setServices(response?.services || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchAppointment = async () => {
      try {
        const res = await getAppointmentById(id);
        setAppointMent(res?.appointment || {});
      } catch (error) {
        console.error("Error fetching appointment:", error);
      }
    };

    if (id) {
      fetchAllFilledFormsForAppointment();
      fetchAllFormsForAppointment();
      fetchServices(artisId);
      fetchAppointment();
    }
  }, [id, artisId]);

  const getServiceTitle = (serviceIds) => {
    if (!serviceIds || !services.length) return "Appointment";
    const serviceNames = services
      .filter((service) => serviceIds.includes(service.id))
      .map((service) => service.service);

    return serviceNames.length > 0 ? serviceNames.join(", ") : "Appointment";
  };

  const getFormStatus = (formId) => {
    const filledForm = filledForms.find(
      (filledForm) => filledForm.formTemplateId === formId
    );
    return filledForm?.status || "incomplete";
  };

  const handleViewForm = (form) => {
    setSelectedForm(form);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
  };

  return (
    <div>
      <div className="form">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer",
            padding: "0 20px",
            marginBottom: "20px",
          }}
          onClick={() => navigate("/dashboard")}
        >
          <GoBackSvg />
          <p>Go back to dashboard</p>
        </div>

        <div className="appointment-info">
          <div className="info-item">
            <span className="info-title">Appointment Date:</span>
            <span className="info-value">
              {dayjs(appointMent?.date).format("MM-DD-YYYY") || "N/A"}
            </span>
          </div>
          <div className="info-item">
            <span className="info-title">Services Received:</span>
            <span className="info-value">
              {getServiceTitle(appointMent?.services) || "N/A"}
            </span>
          </div>
        </div>
        <div className="form-list">
          {forms.length > 0 ? (
            forms.map((form) => (
              <RenderFormsCard
                key={form.id}
                title={form.title || "Untitled Form"}
                status={getFormStatus(form.id)}
                onEditClick={() =>
                  navigate(
                    `/forms/appointment/${appointMent?.id}?formId=${form.id}`
                  )
                }
                onViewClick={() => handleViewForm(form)}
              />
            ))
          ) : (
            <p>No appointment details available.</p>
          )}
        </div>
      </div>
      {isModalOpen && selectedForm && (
        <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth={true}>
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: "0",
              right: "0",
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
