import React from "react";
import { EditFormSvg } from "../../assets/svgs/DashboardSvg";
import "./appointmentsdetails.scss";

const RenderAppointmentCard = ({
  title,
  date,
  formsFilled,
  status,
  ViewClick,
  DeleteClick,
}) => {
  return (
    <div className="form-card">
      <div className="form-info">
        <h4>{title}</h4>
        <p>Date of Appointment: {date}</p>
        <p>Forms filled: {formsFilled}</p>
        <span className={`status ${status}`}>
          {status === "completed" ? "Forms Completed" : "Forms Not Completed"}
        </span>
      </div>
      <div className="form-actions">
        <EditFormSvg onClick={ViewClick} />
      </div>
    </div>
  );
};

const AppointmentDetails = () => {
  const forms = [
    {
      title: "Lash Extension",
      date: "12th August, 2021",
      formsFilled: 3,
      status: "completed",
    },
    {
      title: "Brow Shaping",
      date: "15th August, 2021",
      formsFilled: 2,
      status: "not-completed",
    },
    {
      title: "Facial Treatment",
      date: "20th August, 2021",
      formsFilled: 4,
      status: "completed",
    },
  ];
  return (
    <div>
      <div className="form">
        Go back to dashboard
        <h3>Appointent Date</h3>
        <h3>Services Received</h3>
        <div className="form-list">
          {forms?.map((appointment, index) => (
            <RenderAppointmentCard
              key={index}
              title={appointment.title}
              date={appointment.date}
              formsFilled={appointment.formsFilled}
              status={appointment.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
