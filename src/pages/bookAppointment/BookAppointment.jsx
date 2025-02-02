import { Checkbox, CircularProgress } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookAppointment, getArtistServices } from "../../services/services";
import { Toast } from "../../utils/toast/Toast";
import "./bookAppointment.scss";
import { GoBackSvg } from "../../assets/svgs/DashboardSvg";
import dayjs from "dayjs";

const BookAppointment = () => {
  const param = useParams();
  const artistId = param.artistId || localStorage.getItem("artistId");

  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingServices, setFetchingServices] = useState(true);

  useEffect(() => {
    // Fetch artist and services
    setFetchingServices(true);
    getArtistServices(artistId)
      .then((res) => {
        setServices(res?.services);
      })
      .catch((error) => {
        Toast("error", "Failed to load services");
        console.error("Error fetching services:", error);
      })
      .finally(() => {
        setFetchingServices(false);
      });
  }, [artistId]);

  // Toggle service selection
  const handleServiceChange = (service) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(service)
        ? prevSelected.filter((s) => s !== service)
        : [...prevSelected, service]
    );
  };

  // Continue button handler
  const handleContinue = async () => {
    // Validate input
    if (!appointmentDate) {
      Toast("error", "Please select an appointment date.");
      return;
    }
    if (selectedServices.length === 0) {
      Toast("error", "Please select at least one service.");
      return;
    }

    const appointment = {
      appointmentDate: new Date(appointmentDate),
      artistId: artistId,
      services: selectedServices.map((service) => service.id),
    };

    try {
      setLoading(true);
      // Save appointment to the backend
      await bookAppointment(appointment).then((res) => {
        Toast("success", "Appointment created successfully");
        navigate(`/forms/appointment/${res?.appointment?.id}`);
      });
    } catch (error) {
      Toast("error", "Error creating the appointment");
      console.error("Error creating the appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <div className="go-back" onClick={() => navigate("/dashboard")}>
          <GoBackSvg />
          <p>Go back to dashboard</p>
        </div>
        <div className="book-appointment-page">
          <h1>Book an Appointment</h1>
          <p className="description">
            Important: Don’t wait until the day of your appointment. Some of
            this information must be filled out a few days in advance.
          </p>

          {fetchingServices ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={50} color="#8e2d8e" />
            </div>
          ) : (
            <>
              <div className="form-group">
                <p htmlFor="appointment-date">
                  What's the date of your upcoming appointment(s)?*
                </p>
                <div className="date-picker">
                  <DatePicker
                    value={appointmentDate}
                    shouldDisableDate={(date) =>
                      date.startOf("day").isBefore(dayjs().startOf("day"))
                    }
                    onChange={(newValue) => setAppointmentDate(newValue)}
                    slotProps={{
                      openPickerIcon: { fontSize: "small" },
                      openPickerButton: { color: "secondary" },
                      textField: {
                        variant: "outlined",
                        color: "secondary",
                        fullWidth: true,
                        size: "small",
                        sx: {
                          "& .MuiInputBase-root": {
                            border: "none",
                            borderRadius: "8px",
                            backgroundColor: "#f8f8f8",
                            boxShadow: "none",
                            padding: "5px 10px",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        },
                      },
                    }}
                    fullWidth
                  />
                </div>
              </div>

              <div className="form-group">
                <p>
                  Select services that you will be getting at your upcoming
                  appointment(s)*
                </p>
                <div className="services-list">
                  {services.map((service) => (
                    <div key={service?.id} className="checkbox-item">
                      <Checkbox
                        sx={{
                          color: "#800080",
                          "&.Mui-checked": {
                            color: "#800080",
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: 20,
                            borderRadius: "4px",
                          },
                        }}
                        checked={selectedServices.includes(service)}
                        onChange={() => handleServiceChange(service)}
                      />
                      <label onClick={() => handleServiceChange(service)}>
                        {service?.service}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="alert-box">
            <p>
              If you have multiple appointments on the same day, select all the
              services for the appointments on that day.
            </p>
          </div>

          <div className="button-group">
            <button className="go-back-button" onClick={() => navigate(-1)}>
              Go Back
            </button>
            <button
              className="continue-button"
              onClick={handleContinue}
              disabled={loading}
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default BookAppointment;
