import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { CircularProgress, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookAnAppointmentButtonSvg,
  DeleteAppointmentButtonSvg,
  GoBackSvg,
  NoAppointmentsSvg,
  ViewFormButtonSvg,
} from "../../assets/svgs/DashboardSvg";
import { useSnackbar } from "../../context/SnackbarContext";
import { deleteAppointment, getAllAppointments } from "../../services/services";
import "./allappointments.scss";

const RenderAppointmentCard = ({
  title,
  fullTitle,
  date,
  formsFilled,
  status,
  signed,
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
        <Tooltip
          title={signed ? "Signed appointment" : "Delete"}
          placement="top"
          arrow
        >
          <span>
            <DeleteAppointmentButtonSvg
              onClick={!signed ? DeleteClick : undefined}
              style={{
                pointerEvents: signed ? "none" : "auto",
                cursor: signed ? "not-allowed" : "pointer",
                opacity: signed ? 0.5 : 1,
              }}
            />
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { showAlert } = useSnackbar();
  const navigate = useNavigate();
  const artistId = localStorage.getItem("artistId");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = appointments.filter((appointment) => {
      const title = appointment?.serviceDetails.map(
        (service) => service.service
      );
      const date = new Date(appointment.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return title.includes(query) || date.includes(query);
    });
    setFilteredAppointments(filtered);
  };

  const fetchAppointments = async (page) => {
    setLoading(true);
    try {
      const response = await getAllAppointments(page, itemsPerPage);
      const updatedAppointments = (response?.appointments || []).map(
        (appointment) => ({
          ...appointment,
          filledFormsCount:
            appointment.filledForms?.filter(
              (form) => form.status === "completed" || form.status === "signed"
            ).length || 0,
        })
      );

      setAppointments(updatedAppointments);
      setMetadata(response?.metadata);
    } catch (error) {
      console.error(error.message);

      showAlert("error", "Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  const removeAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);

      setAppointments((prev) =>
        prev.filter((appt) => appt.id !== appointmentId)
      );
    } catch (error) {
      showAlert("error", "Error deleting appointment");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= metadata.lastPage) {
      setCurrentPage(newPage); // Update current page
    }
  };

  useEffect(() => {
    fetchAppointments(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, appointments]);

  return (
    <div className="appointments">
      <div
        className="breadcrumb"
        onClick={() => navigate("/customer/dashboard")}
      >
        <GoBackSvg />
        <p>Go back to dashboard</p>
      </div>

      <div className="header-container">
        <h3>All Appointment Forms</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search appointments"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress size={80} sx={{ color: "#8e2d8e" }} />
        </div>
      ) : (
        <div className="appointments-list">
          {filteredAppointments?.length > 0 ? (
            filteredAppointments?.reverse().map((appointment, index) => (
              <RenderAppointmentCard
                key={index}
                title={
                  appointment?.serviceDetails.map((service) => service.service)
                    .length > 3
                    ? appointment?.serviceDetails
                        .map((service) => service.service)
                        .slice(0, 3)
                        .join(", ") + "..."
                    : appointment?.serviceDetails
                        .map((service) => service.service)
                        .join(", ")
                }
                fullTitle={appointment?.serviceDetails
                  .map((service) => service.service)
                  .join(", ")}
                date={appointment?.date}
                signed={appointment?.signed}
                formsFilled={appointment.filledFormsCount || 0}
                status={appointment.allFormsCompleted}
                ViewClick={() =>
                  navigate(`/customer/appointments/${appointment.id}`)
                }
                DeleteClick={() => removeAppointment(appointment.id)}
              />
            ))
          ) : (
            <div className="no-appointments">
              <NoAppointmentsSvg />
              <p>You have no upcoming appointments</p>
              <BookAnAppointmentButtonSvg
                onClick={() =>
                  navigate(`/customer/book-appointments/${artistId}`)
                }
              />
            </div>
          )}
        </div>
      )}

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
