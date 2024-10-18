import React, { useEffect, useState } from "react";
import "./bookAppointment.scss";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { Checkbox } from "@mui/material";
import {
  createAppointment,
  getArtist,
  getServicesForArtistWithId,
} from "../../firebase/firebaseServices";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

const BookAppointment = () => {
  const artistId = "jsb0kVT5ToNX5Q87H1tsglkDIh12";
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [formError, setFormError] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    getArtist(artistId).then((artist) => {
      setCompanyName(artist.businessName);
    });
    getServicesForArtistWithId(artistId).then((services) => {
      console.log(services);
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

    const appointmentId = uuidv4(); // Generate unique appointment ID
    const appointment = {
      appointmentDate,
      id: appointmentId,
      artistId,
      services: selectedServices,
      userId: currentUser().uid,
    };

    try {
      await createAppointment(appointment);
      navigate(
        `/forms/services/${selectedServices}/artist/${artistId}/appointment/${appointmentId}`
      );
    } catch (error) {
      setFormError("Error creating the appointment. Please try again.");
      console.error(error);
    }
  };

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
              onChange={(newValue) => newValue}
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
                  {...{ service }}
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
                <label htmlFor={service}>{service?.service}</label>
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
          <button className="go-back-button">Go Back</button>
          <button className="continue-button">Continue</button>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default BookAppointment;
