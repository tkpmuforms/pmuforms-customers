import React from "react";
import "./allappointments.scss";
import {
  BookAnAppointmentButtonSvg,
  DeleteAppointmentButtonSvg,
  NoAppointmentsSvg,
  ViewFormButtonSvg,
} from "../../assets/svgs/DashboardSvg";

const RenderAppointmentCard = ({
  title,
  date,
  formsFilled,
  status,
  ViewClick,
  DeleteClick,
}) => {
  return (
    <div className="appointment-card">
      <div className="appointment-info">
        <h4>{title}</h4>
        <p>Date of Appointment: {date}</p>
        <p>Forms filled: {formsFilled}</p>
        <span className={`status ${status}`}>
          {status === "completed" ? "Forms Completed" : "Forms Not Completed"}
        </span>
      </div>
      <div className="appointment-actions">
        <ViewFormButtonSvg onClick={ViewClick} />
        <DeleteAppointmentButtonSvg onClick={DeleteClick} />
      </div>
    </div>
  );
};

const AllAppointments = () => {
  const appointments = [
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
    <div className="appointments">
      Go back to dashboard
      <h3>All Appointments</h3>
      <div className="appointments-list">
        {appointments?.map((appointment, index) => (
          <RenderAppointmentCard
            key={index}
            title={appointment.title}
            date={appointment.date}
            formsFilled={appointment.formsFilled}
            status={appointment.status}
          />
        ))}
        {appointments.length === 0 && (
          <div className="no-appointments">
            <NoAppointmentsSvg />
            <p>You have no upcoming appointments</p>
            <BookAnAppointmentButtonSvg />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
