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

const RenderFormsCard = ({ title, status, ViewClick }) => {
  return (
    <div className="form-card">
      <div className="form-info">
        <h4>{title}</h4>
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
  const [forms, setForms] = useState([]);
  const [services, setServices] = useState([]);
  const [appointMent, setAppointMent] = useState({});
  const [filledForms, setFilledForms] = useState([]);
  const artisId = localStorage.getItem("artistId");

  useEffect(() => {
    const fetchAllFilledFormsForAppointment = async () => {
      try {
        const res = await getAllFilledFormsForAppointment(id);
        console.log("Fetched filled appointment:", res);
        setFilledForms(res?.appointment || []);
      } catch (error) {
        console.error("Error fetching filled appointment:", error);
      }
    };

    const fetchAllFormsForAppointment = async () => {
      try {
        const res = await getFormsForAppointMentById(id);
        console.log("Fetched appointment forms:", res);
        setForms(res?.forms || []);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    const fetchServices = async (artistId) => {
      try {
        const response = await getArtistServices(artistId);
        console.log("Fetched services:", response);
        setServices(response?.services || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchAppointment = async () => {
      try {
        const res = await getAppointmentById(id);
        console.log("Fetched appointment:", res);
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
    if (!serviceIds || !services) return "Appointment";
    const serviceNames = services
      .filter((service) => serviceIds.includes(service.id))
      .map((service) => service.service);
    return serviceNames.join(", ") || "Appointment";
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
            <span className="info-value">{appointMent?.date || "N/A"}</span>
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
                status={form.allFormsCompleted || false}
                ViewClick={() =>
                  navigate(`/forms/appointment/${appointMent?.id}`)
                }
              />
            ))
          ) : (
            <p>No appointment details available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
