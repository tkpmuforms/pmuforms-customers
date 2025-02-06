import React, { useState, useEffect } from "react";
import "./contactUs.scss";
import { sendMessage } from "../../services/services";
import { Toast } from "../../utils/toast/Toast";
import useAuth from "../../context/useAuth";
import { GoBackSvg } from "../../assets/svgs/DashboardSvg";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  console.log(user, isAuthenticated);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        email: user?.email || "",
        firstName: user?.info?.client_name || user?.name || "",
      }));
    }
  }, [user, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendMessage(formData);
      setFormData({
        email: isAuthenticated ? formData.email : "",
        firstName: isAuthenticated ? formData.firstName : "",
        subject: "",
        message: "",
      });

      Toast("success", "Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      Toast("error", "Error sending message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-us">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
        onClick={() => navigate(-1)}
      >
        <GoBackSvg />
        <p>Go back</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            disabled={isAuthenticated} // Disable if autofilled from user
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Enter your first name"
            disabled={isAuthenticated} // Disable if autofilled from user
          />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Enter subject"
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Enter your message"
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
