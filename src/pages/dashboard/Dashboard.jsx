import React from "react";
import "./dashboard.scss"; // Import the SCSS file for styling
import AuthenticatedNavbar from "../../layout/AuthenticatedNavbar";
import {
  BookAnAppointmentSvg,
  DeleteAppointmentButtonSvg,
  EditPersonalInformationSvg,
  ViewFormButtonSvg,
  ViewPastAppointmentsSvg,
  WarningSvg,
  NoAppointmentsSvg,
  BookAnAppointmentButtonSvg,
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

const Dashboard = () => {
  const appointments = [
    // {
    //   title: "Lash Extension",
    //   date: "12th August, 2021",
    //   formsFilled: 3,
    //   status: "completed",
    // },
    // {
    //   title: "Brow Shaping",
    //   date: "15th August, 2021",
    //   formsFilled: 2,
    //   status: "not-completed",
    // },
    // {
    //   title: "Facial Treatment",
    //   date: "20th August, 2021",
    //   formsFilled: 4,
    //   status: "completed",
    // },
  ];

  return (
    <div className="dashboard-page">
      <AuthenticatedNavbar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h3>
            Hello, <span>Maleek! </span>Welcome back.
          </h3>
          <p>Welcome to Britney Lashes</p>
          <div className="alert">
            <WarningSvg />
            <p>
              Please complete all required forms for your upcoming appointment
            </p>
          </div>
        </header>

        <div className="actions-section">
          <div className="action-card">
            <BookAnAppointmentSvg />
            <div>
              <h5>Book an Appointment</h5>
              <p>
                Easily book your next appointment by <br />
                selecting a service and preferred time.
              </p>
            </div>
          </div>
          <div className="action-card">
            <ViewPastAppointmentsSvg />
            <div>
              <h5>View Past Appointments</h5>
              <p>
                Review your appointment history, access <br /> details of your
                previous appointments.
              </p>
            </div>
          </div>
          <div className="action-card">
            <EditPersonalInformationSvg />
            <div>
              <h5>Edit Personal Information</h5>
              <p>View and edit your personal information easily.</p>
            </div>
          </div>
        </div>

        <section className="appointments-section">
          <h3>Upcoming Appointments</h3>
          <div className="see-all-appointments">
            <a href="#">See All Appointments</a>
          </div>
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
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
