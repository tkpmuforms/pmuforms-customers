import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookAnAppointmentButtonSvg,
  DeleteAppointmentButtonSvg,
  GoBackSvg,
  NoAppointmentsSvg,
  ViewFormButtonSvg,
} from "../../assets/svgs/DashboardSvg";
import {
  deleteAppointment,
  getAllAppointments,
  getArtistServices,
} from "../../services/services";
import { Toast } from "../../utils/toast/Toast";
import "./allappointments.scss";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

const RenderAppointmentCard = ({
  title,
  fullTitle,
  date,
  formsFilled,
  status,
  ViewClick,
  DeleteClick,
}) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="appointment-card">
      <div className="appointment-info">
        <Tooltip title={fullTitle} placement="top">
          <h4 className="truncate-title">{title}</h4>
        </Tooltip>
        <p>Date of Appointment: {formattedDate}</p>
        <p>Forms filled: {formsFilled}</p>
        <span className={`status ${status}`}>
          {status === true ? "Forms Completed" : "Forms Not Completed"}
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
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const artistId = localStorage.getItem("artistId");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = appointments.filter((appointment) => {
      const title = getServiceTitle(
        appointment?.services
      ).fullTitle?.toLowerCase();
      const date = new Date(appointment.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return title.includes(query) || date.includes(query);
    });
    setFilteredAppointments(filtered);
  };
  const fetchServices = async (artistId) => {
    try {
      const response = await getArtistServices(artistId);

      setServices(response?.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const getServiceTitle = (serviceIds) => {
    const serviceNames = services
      .filter((service) => serviceIds.includes(service.id))
      .map((service) => service.service);

    const fullTitle = serviceNames.join(", ");
    let truncatedTitle = fullTitle;

    if (serviceNames.length > 3) {
      truncatedTitle = `${serviceNames.slice(0, 3).join(", ")}...`;
    }

    return { truncatedTitle, fullTitle };
  };

  const fetchAppointments = async (page) => {
    try {
      const response = await getAllAppointments(page, itemsPerPage);
      setAppointments(response?.appointments);
      setMetadata(response?.metadata);
    } catch (error) {
      console.log(error.message);
      Toast("error", "Error fetching appointments.");
    }
  };

  const removeAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);

      Toast("success", "Appointment deleted successfully");
      setAppointments((prev) =>
        prev.filter((appt) => appt.id !== appointmentId)
      );
    } catch (error) {
      Toast("error", "Error deleting appointment");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= metadata.lastPage) {
      setCurrentPage(newPage); // Update current page
    }
  };

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchServices(artistId);
  }, [artistId]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, appointments]);

  return (
    <div className="appointments">
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

      <div className="header-container">
        <h3>All Appointments</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search appointments"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="appointments-list">
        {filteredAppointments?.length > 0 ? (
          filteredAppointments?.map((appointment, index) => (
            <RenderAppointmentCard
              key={index}
              title={getServiceTitle(appointment?.services).truncatedTitle}
              fullTitle={getServiceTitle(appointment?.services).fullTitle}
              date={appointment.date}
              formsFilled={appointment.formsFilled || 0}
              status={appointment.allFormsCompleted}
              ViewClick={() => navigate(`/appointments/${appointment.id}`)}
              DeleteClick={() => removeAppointment(appointment.id)}
            />
          ))
        ) : (
          <div className="no-appointments">
            <NoAppointmentsSvg />
            <p>You have no upcoming appointments</p>
            <BookAnAppointmentButtonSvg
              onClick={() => navigate(`/book-appointments/${artistId}`)}
            />
          </div>
        )}
      </div>

      {metadata && (
        <div
          className="pagination-controls"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <ArrowBack
            onClick={() => handlePageChange(currentPage - 1)}
            style={{
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              color: currentPage === 1 ? "#ddd" : "#000",
              marginRight: "10px",
            }}
          />
          <span>
            Page {currentPage} of {metadata.lastPage}
          </span>
          <ArrowForward
            onClick={() => handlePageChange(currentPage + 1)}
            style={{
              cursor:
                currentPage === metadata.lastPage ? "not-allowed" : "pointer",
              color: currentPage === metadata.lastPage ? "#ddd" : "#000",
              marginLeft: "10px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
