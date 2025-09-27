import { CircularProgress, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BookAnAppointmentButtonSvg,
  BookAnAppointmentSvg,
  DeleteAppointmentButtonSvg,
  EditPersonalInformationSvg,
  NoAppointmentsSvg,
  ViewFormButtonSvg,
  ViewPastAppointmentsSvg,
  WarningSvg,
} from "../../assets/svgs/DashboardSvg";
import useAuth from "../../context/useAuth";
import {
  deleteAppointment,
  getAllAppointments,
  getArtistById,
  getAuthenticatedUser,
} from "../../services/services";
import PersonalDetailsForm from "../authpage/authsubfolders/signUp/PersonalDetailsForm";
import "./dashboard.scss";
import { useSnackbar } from "../../context/SnackbarContext";
import SearchPage from "./SearchPage";
import { ROUTE_PATHS } from "../../routes/routes";

const RenderAppointmentCard = ({
  title,
  date,
  formsFilled,
  signed,
  status,
  ViewClick,
  DeleteClick,
}) => {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not available";

  return (
    <div className="appointment-card">
      <div className="appointment-info">
        <h4>{title || "Service not specified"}</h4>
        <p>Date of Appointment: {formattedDate}</p>
        <p>Forms filled: {formsFilled || 0}</p>
        <span className={`status ${status}`}>
          {status === true ? "Forms Completed" : "Forms Not Completed"}
        </span>
      </div>
      <div className="appointment-actions">
        <ViewFormButtonSvg onClick={ViewClick ? ViewClick : () => {}} />
        <Tooltip
          title={signed ? "Signed appointment" : "Delete"}
          placement="top"
          arrow
        >
          <span>
            <DeleteAppointmentButtonSvg
              onClick={!signed && DeleteClick ? DeleteClick : undefined}
              style={{
                pointerEvents: signed ? "none" : "auto",
                cursor: signed ? "not-allowed" : "pointer",
                opacity: signed ? 0.5 : 1,
              }}
            />
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const artistId = localStorage?.getItem("artistId");
  const businessUri = localStorage?.getItem("businessUri");

  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [businessName, setBusinessName] = useState(
    localStorage?.getItem("businessName")
  );
  const userName = localStorage?.getItem("userName");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const { showAlert } = useSnackbar();
  const location = useLocation();

  const isSubscriptionError = (error) => {
    console.error("Checking for subscription error:", error);

    if (
      error?.statusCode === 403 &&
      error?.message?.includes("Artist Subscription Inactive")
    ) {
      return true;
    }

    if (
      error?.response?.status === 403 &&
      (error?.response?.data?.message?.includes(
        "Artist Subscription Inactive"
      ) ||
        error?.response?.data?.error === "Forbidden")
    ) {
      return true;
    }

    if (
      error?.response?.data?.statusCode === 403 &&
      error?.response?.data?.message?.includes("Artist Subscription Inactive")
    ) {
      return true;
    }

    return false;
  };

  const handleSubscriptionError = () => {
    showAlert("error", "Artist Subscription Inactive. Please Subscribe");
    setTimeout(() => {
      logout();
    }, 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [businessRes, appointmentsRes, customerRes] = await Promise.all([
          businessUri ? getArtistById(businessUri) : Promise.resolve(null),
          getAllAppointments(),
          getAuthenticatedUser(),
        ]);

        if (businessUri && !businessRes?.artist) {
          console.error("Error fetching artist, logging out...");
          logout();
          return;
        }

        if (businessRes?.artist?.businessName) {
          localStorage?.setItem(
            "businessName",
            businessRes.artist.businessName
          );
          setBusinessName(businessRes.artist.businessName);
          localStorage?.setItem("artistId", businessRes.artist.userId);

          if (
            customerRes?.user?.artistUri &&
            location?.pathname?.split("/")?.[1] === customerRes?.user?.artistUri
          ) {
            localStorage?.setItem("isArtist", true);
            setIsArtist(true);
          }
        }

        const updatedAppointments = (appointmentsRes?.appointments || []).map(
          (appointment) => ({
            ...appointment,
            filledFormsCount:
              appointment?.filledForms?.filter(
                (form) =>
                  form?.status === "completed" || form?.status === "signed"
              )?.length || 0,
          })
        );
        setAppointments(updatedAppointments);
        const customerInfo = customerRes?.user?.info;

        const hasRequiredInfo =
          customerInfo &&
          customerInfo.client_name &&
          customerInfo.client_name !== "New Customer";

        setShowPersonalInfo(!hasRequiredInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isSubscriptionError(error)) {
          handleSubscriptionError();
          return;
        }
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessUri, logout]);

  const removeAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);

      showAlert("success", "Appointment deleted successfully");
      setAppointments(
        (prev) => prev?.filter((appt) => appt?.id !== appointmentId) || []
      );
    } catch (error) {
      showAlert("error", "Error deleting appointment");
    }
  };

  if (showPersonalInfo) {
    return (
      <PersonalDetailsForm onSubmitClick={() => setShowPersonalInfo(false)} />
    );
  }
  if (!businessUri) {
    return <SearchPage />;
  }

  const hasIncompleteForms = appointments?.some(
    (appointment) => !appointment?.allFormsCompleted
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <CircularProgress size={100} color="#8e2d8e" />
          </div>
        ) : (
          <>
            <header className="dashboard-header">
              <h3>
                Hello,{" "}
                <span>{user?.info?.client_name ?? userName ?? "User"}</span>
              </h3>
              <p>
                Welcome to{" "}
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {businessName || "Business"}
                </span>
              </p>
              {appointments?.length > 0 && hasIncompleteForms && !isArtist ? (
                <div className="alert">
                  <WarningSvg />
                  <p>
                    Please complete all required forms for your upcoming
                    appointment
                  </p>
                </div>
              ) : null}
            </header>
            <div className="actions-section">
              <div
                className="action-card"
                onClick={() =>
                  navigate && artistId && businessUri
                    ? navigate(
                        ROUTE_PATHS.BOOK_APPOINTMENT.replace(
                          ":id",
                          artistId
                        ).replace(":businessUri", businessUri)
                      )
                    : null
                }
              >
                <BookAnAppointmentSvg />
                <div>
                  <h5>
                    {isArtist
                      ? "Start a New Form for a Client"
                      : "Fill Out a New Form"}
                  </h5>
                  <p>
                    {isArtist ? "Start" : "Fill out"} a new form for{" "}
                    {isArtist ? "a client's" : "your"} next appointment by
                    choosing your preferred appointment date and service.
                  </p>
                </div>
              </div>
              {isArtist ? null : (
                <>
                  <div
                    className="action-card"
                    onClick={() =>
                      navigate && businessUri
                        ? navigate(
                            ROUTE_PATHS.APPOINTMENTS.replace(
                              ":businessUri",
                              businessUri
                            )
                          )
                        : null
                    }
                  >
                    <ViewPastAppointmentsSvg />
                    <div>
                      <h5>View All Appointment Forms</h5>
                      <p>
                        Review your previous forms, access details of your
                        previous appointments.
                      </p>
                    </div>
                  </div>
                  <div
                    className="action-card"
                    onClick={() => setShowPersonalInfo(true)}
                  >
                    <EditPersonalInformationSvg />
                    <div>
                      <h5>Update Personal Information</h5>
                      <p>View and edit your personal information easily.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            {isArtist ? null : (
              <section className="appointments-section">
                <h3>Recent Appointment Forms</h3>
                <div className="see-all-appointments">
                  <p
                    onClick={() =>
                      navigate && businessUri
                        ? navigate(
                            ROUTE_PATHS.APPOINTMENTS.replace(
                              ":businessUri",
                              businessUri
                            )
                          )
                        : null
                    }
                  >
                    View All
                  </p>
                </div>
                <div className="appointments-list">
                  {appointments?.length > 0 ? (
                    appointments
                      ?.reverse()
                      ?.slice(0, 3)
                      ?.map((appointment, index) => (
                        <RenderAppointmentCard
                          key={index}
                          title={appointment?.serviceDetails
                            ?.map((service) => service?.service)
                            ?.join(", ")}
                          date={appointment?.date}
                          signed={appointment?.signed}
                          formsFilled={appointment?.filledFormsCount || 0}
                          status={appointment?.allFormsCompleted}
                          ViewClick={() =>
                            navigate && appointment?.id && businessUri
                              ? navigate(
                                  ROUTE_PATHS.APPOINTMENT_DETAILS.replace(
                                    ":id",
                                    appointment.id
                                  ).replace(":businessUri", businessUri)
                                )
                              : null
                          }
                          DeleteClick={() => removeAppointment(appointment?.id)}
                        />
                      ))
                  ) : (
                    <div className="no-appointments">
                      <NoAppointmentsSvg />
                      <p>You have no upcoming appointments</p>
                      <BookAnAppointmentButtonSvg
                        onClick={() =>
                          navigate && artistId
                            ? navigate(
                                ROUTE_PATHS.BOOK_APPOINTMENT.replace(
                                  ":id",
                                  artistId
                                )
                              )
                            : null
                        }
                        style={{ cursor: "pointer", marginTop: "1rem" }}
                      />
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
