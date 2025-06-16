import { useState } from "react";
import { Modal, TextField, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./createClientModal.scss";

const CreateClientModal = ({ open, onClose, onCreateClient, loading }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreateClient({
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
    });
  };

  const handleClose = () => {
    setName("");
    setEmail("");
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
          <h2>Create New Customer</h2>
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
          <TextField
            margin="dense"
            id="customer-phone"
            label="Customer Phone Number (Optional)"
            type="phone"
            fullWidth
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ mb: 2 }}
          />
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
              disabled={loading || !name.trim()}
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
