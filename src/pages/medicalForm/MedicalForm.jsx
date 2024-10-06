import React, { useState } from "react";
import "./medicalForm.scss";
import { Checkbox, TextField, Button } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

const MedicalForm = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [personalHistory, setPersonalHistory] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [others, setOthers] = useState("");

  const personalQuestions = [
    "Do you regularly sun bathe or use tanning salons?",
    "Did you take any blood thinner like Aspirin or drink alcohol in the last 24 hours?",
  ];

  const medicalConditions = [
    "High Blood Pressure",
    "History of MRSA",
    "Botox",
    "Forehead/Brow Lift",
    "Easy Bleeding",
    "Facelift",
    "Alcoholism",
    "Abnormal Heart Condition",
    "Chemical Peel",
    "Brow Lash Tinting",
    "Autoimmune Disorder",
    "Oily Skin",
    "Accutane or acne treatment",
  ];

  const allergyConditions = [
    "Tetracaine",
    "Derma Caine",
    "Benzyl Alcohol",
    "Carbopol",
    "Lecithin",
    "Propylene Glycol",
    "Vitamin E Acetate",
    "Food",
    "Animal Protein",
    "Aspirin",
    "Lidocaine",
    "Hydrocortisone",
    "Hydroquinone or skin bleaching agents",
  ];

  const handleCheckboxChange = (item, setState) => {
    setState((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="medical-form-page">
        <div className="header">
          <Button className="back-button">Go back to dashboard</Button>
          <h2>Form 1 of 3</h2>
          <p className="subtitle">
            Carefully read and complete the form below, then click "Submit"
          </p>
        </div>

        <div className="form-section">
          <h3>Client Information & Medical History</h3>
          <p className="description">
            In order to provide you with the most appropriate treatment, we need
            you to complete the following questionnaire. All information is
            strictly confidential.
          </p>

          <h4>Personal History</h4>
          <TextField
            label="Upload png or jpg"
            type="file"
            fullWidth
            size="small"
            color="secondary"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <p className="small-note">
            These pictures will not be shared with anyone other than the artist
            and/or employees. This helps us to plan your treatment/procedure.
          </p>

          {personalQuestions.map((question, index) => (
            <div key={index} className="checkbox-group">
              <Checkbox
                checked={personalHistory.includes(question)}
                onChange={() =>
                  handleCheckboxChange(question, setPersonalHistory)
                }
                color="secondary"
              />
              <label>{question}</label>
            </div>
          ))}

          <h4>Medical History</h4>
          {medicalConditions.map((condition, index) => (
            <div key={index} className="checkbox-group">
              <Checkbox
                checked={medicalHistory.includes(condition)}
                onChange={() =>
                  handleCheckboxChange(condition, setMedicalHistory)
                }
                color="secondary"
              />
              <label>{condition}</label>
            </div>
          ))}

          <h4>Have you ever had an allergic reaction?</h4>
          {allergyConditions.map((allergy, index) => (
            <div key={index} className="checkbox-group">
              <Checkbox
                checked={allergies.includes(allergy)}
                onChange={() => handleCheckboxChange(allergy, setAllergies)}
                color="secondary"
              />
              <label>{allergy}</label>
            </div>
          ))}
          <TextField
            label="Other Allergies"
            variant="outlined"
            color="secondary"
            fullWidth
            size="small"
            value={others}
            onChange={(e) => setOthers(e.target.value)}
            multiline
          />

          <h4>History</h4>
          <div className="checkbox-group">
            <Checkbox color="secondary" />
            <label>Are you pregnant or trying to become pregnant?</label>
          </div>
          <div className="checkbox-group">
            <Checkbox color="secondary" />
            <label>Are you breastfeeding?</label>
          </div>
          <div className="checkbox-group">
            <Checkbox color="secondary" />
            <label>Are you using contraception?</label>
          </div>

          <TextField
            label="Signature (Full Name)"
            variant="outlined"
            color="secondary"
            fullWidth
            size="small"
            sx={{
              background: "whitesmokes",
            }}
          />

          <DatePicker
            value={selectedDate}
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
            onChange={(newValue) => setSelectedDate(newValue)}
            fullWidth
          />

          <div className="button-group">
            <Button variant="outlined" className="back-button">
              Go Back
            </Button>
            <Button variant="contained" className="submit-button">
              Submit Form
            </Button>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default MedicalForm;
