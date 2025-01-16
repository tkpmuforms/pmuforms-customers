import React, { useState } from "react";
import "./contactUs.scss";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = `https://mc.us21.list-manage.com/subscribe/form-post-json?u=9922d1f13111b8dcaa8677d50&id=36c82a9445&popup=true&EMAIL=${formData.email}&FNAME=${formData.firstName}&SUBJECT=${formData.subject}&MESSAGE=${formData.message}&c=?`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setResponseMessage("Your message has been sent successfully!");
      } else {
        setResponseMessage(
          "There was an issue sending your message. Please try again."
        );
      }
    } catch (error) {
      setResponseMessage("There was an error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-us">
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
            placeholder="Enter your message"
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default ContactUs;
