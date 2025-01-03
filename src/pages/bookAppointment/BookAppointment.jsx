import { Checkbox } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../context/AuthContext";
import { getArtist } from "../../firebase/firebaseServices";
import { bookAppointment, getArtistServices } from "../../services/services";
import { Toast } from "../../utils/toast/Toast";
import "./bookAppointment.scss";

const BookAppointment = () => {
  const param = useParams();
  const artistId = param.artistId || localStorage.getItem("artistId");
  console.log(artistId);

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [formError, setFormError] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    // Fetch artist and services
    getArtist(artistId).then((artist) => {
      setCompanyName(artist.businessName);
    });
    getArtistServices(artistId).then((services) => {
      setServices(services);
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
      setFormError("Please select an appointment date.");
      return;
    }
    if (selectedServices.length === 0) {
      setFormError(
        "You didn't select any services. Please select at least one service."
      );
      return;
    }

    // Create a new appointment
    const appointmentId = uuidv4();
    const appointment = {
      date: new Date(appointmentDate),
      id: appointmentId,
      artistId: artistId,
      customer_id: currentUser.uid,
      services: selectedServices.map((service) => service.id),
      createdAt:
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
    };

    try {
      // Save appointment to the backend
      console.log("Creating appointment:", appointment);
      await bookAppointment(appointment);
      console.log("Appointment created:", appointment);
      Toast("success", "Appointment created successfully");
      // Navigate to the next screen
      navigate(
        `/forms/services/${selectedServices.map(
          (s) => s.id
        )}/artist/${artistId}/appointment/${appointmentId}`
      );
    } catch (error) {
      Toast("error", "Error creating the appointment");
      console.error("Error creating the appointment:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("artistId", artistId);
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="book-appointment-page">
        <h1>Book an Appointment</h1>
        <p className="description">
          Important: Don’t wait until the day of your appointment. Some of this
          information must be filled out a few days in advance.
        </p>

        <div className="form-group">
          <p htmlFor="appointment-date">
            What's the date of your upcoming appointment(s)?*
          </p>
          <div className="date-picker">
            <DatePicker
              value={appointmentDate}
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
                <label>{service?.service}</label>
              </div>
            ))}
          </div>
        </div>

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
          <button className="continue-button" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default BookAppointment;
