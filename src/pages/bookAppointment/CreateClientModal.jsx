import { useState } from "react";
import { Modal, TextField, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./createClientModal.scss";

const CreateClientModal = ({ open, onClose, onCreateClient, loading }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (value) => {
    setPhone(value || "");

    // Validate phone number if provided
    if (value && !isValidPhoneNumber(value)) {
      setPhoneError("Please enter a valid phone number");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    // Final validation check
    if (phone && !isValidPhoneNumber(phone)) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    onCreateClient({
      name: name.trim(),
      email: email.trim() || null,
      phone: phone || null, // Already in E.164 format
    });
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPhoneError("");
    onClose();
  };

  // Modal style
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 400,
    bgcolor: "background.paper",
    borderRadius: "12px",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-customer-modal"
      aria-describedby="modal-to-create-new-customer"
    >
      <Box sx={modalStyle}>
        <div className="modal-header">
          <h2>Create New Client</h2>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className="modal-content">
          <TextField
            autoFocus
            margin="dense"
            id="customer-name"
            label="Customer Name*"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="customer-email"
            label="Customer Email (Optional)"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <div className="phone-input-container">
            <PhoneInput
              id="customer-phone"
              placeholder="Customer Phone Number (Optional)"
              value={phone}
              onChange={handlePhoneChange}
              defaultCountry="US"
              international
              countryCallingCodeEditable={false}
              className={`phone-input ${phoneError ? "error" : ""}`}
            />
            {phoneError && <div className="phone-error">{phoneError}</div>}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="go-back-button"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="continue-button"
              onClick={handleSubmit}
              disabled={loading || !name.trim() || !!phoneError}
            >
              {loading ? "Creating..." : "Create Customer"}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateClientModal;
