import React, { useState } from "react";
import "./bookAppointment.scss";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { Checkbox } from "@mui/material";

const BookAppointment = () => {
  const [value, setValue] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const services = [
    "BB Glow",
    "Dry Needling",
    "Micro Needling",
    "Plasma Skin Tightening",
    "Tattoo Removal",
    "Areola Reconstruction",
  ];

  const handleServiceChange = (service) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(service)
        ? prevSelected.filter((s) => s !== service)
        : [...prevSelected, service]
    );
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
              value={value}
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
              onChange={(newValue) => setValue(newValue)}
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
              <div key={service} className="checkbox-item">
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
                <label htmlFor={service}>{service}</label>
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
