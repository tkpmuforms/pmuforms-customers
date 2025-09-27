import { Checkbox, CircularProgress } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoBackSvg } from "../../assets/svgs/DashboardSvg";
import { useSnackbar } from "../../context/SnackbarContext";
import { ROUTE_PATHS } from "../../routes/routes";
import {
  bookAppointment,
  createClient,
  getArtistServices,
  getMyCustomers,
} from "../../services/services";
import "./bookAppointment.scss";
import CreateClientModal from "./CreateClientModal";
import CustomerSelector from "./CustomerSelector";

dayjs.extend(utc);
dayjs.extend(timezone);

const BookAppointment = () => {
  const param = useParams();
  const artistId = param?.artistId || localStorage?.getItem("artistId");
  const businessUri = localStorage?.getItem("businessUri");
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState(
    dayjs().tz(dayjs.tz.guess()).startOf("day")
  );
  const [loading, setLoading] = useState(false);
  const [fetchingServices, setFetchingServices] = useState(true);
  const { showAlert } = useSnackbar();
  const isArtist = localStorage?.getItem("isArtist");

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);

  const userTimezone = dayjs.tz.guess();

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isArtist) {
        setLoadingCustomers(true);
        try {
          const res = await getMyCustomers(1, 5);
          if (res?.customers) {
            setCustomers(res.customers);
          }
        } catch (error) {
          console.error("Error fetching customers:", error);
          if (showAlert) showAlert("error", "Failed to load customers");
        } finally {
          setLoadingCustomers(false);
        }
      }

      setFetchingServices(true);
      try {
        const res = await getArtistServices(artistId);
        if (res?.services) {
          setServices(res.services);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        if (showAlert) showAlert("error", "Failed to load services");
      } finally {
        setFetchingServices(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleServiceChange = (service) => {
    if (!service) return;

    setSelectedServices((prevSelected) =>
      prevSelected?.includes(service)
        ? prevSelected.filter((s) => s !== service)
        : [...(prevSelected || []), service]
    );
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleCreateCustomer = async (customerData) => {
    if (!customerData?.name) {
      showAlert("error", "Customer name is required");
      return;
    }

    setCreatingCustomer(true);
    try {
      const result = await createClient(customerData);

      if (result?.customer) {
        setCustomers((prevCustomers) => [
          result.customer,
          ...(prevCustomers || []),
        ]);
        setSelectedCustomer(result.customer);
        showAlert("success", "Client created successfully");
        handleCloseCreateModal();
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      showAlert("error", "Failed to create customer");
    } finally {
      setCreatingCustomer(false);
    }
  };

  const handleContinue = async (e) => {
    if (e) e.preventDefault();

    if (!appointmentDate) {
      showAlert("error", "Please select an appointment date.");
      return;
    }
    if ((selectedServices?.length || 0) === 0) {
      showAlert("error", "Please select at least one service.");
      return;
    }
    if (isArtist && !selectedCustomer) {
      showAlert("error", "Please select a client.");
      return;
    }

    const utcAppointmentDate = dayjs(appointmentDate)
      .tz(userTimezone)
      .utc()
      .toISOString();

    const appointment = {
      appointmentDate: utcAppointmentDate,
      artistId: artistId,
      services: selectedServices?.map((service) => service?.id) || [],
      ...(isArtist &&
        selectedCustomer && {
          customerId: selectedCustomer?.customerId ?? selectedCustomer?.id,
        }),
    };

    try {
      setLoading(true);
      await bookAppointment(appointment).then((res) => {
        navigate(
          ROUTE_PATHS.DYNAMIC_FORMS.replace(
            ":businessUri",
            businessUri
          ).replace(":appointmentId", res?.appointment?.id)
        );
      });
    } catch (error) {
      showAlert("error", "Error creating the appointment");
      console.error("Error creating the appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <div className="header-container">
          <div
            className="go-back"
            onClick={(e) => {
              if (e) e.preventDefault();
              navigate(-1);
            }}
          >
            <GoBackSvg />
            <p>Go back to dashboard</p>
          </div>

          {isArtist ? (
            <button
              className="create-customer-button"
              onClick={handleOpenCreateModal}
            >
              Create Customer
            </button>
          ) : null}
        </div>

        <div className="book-appointment-page">
          <h1>
            {isArtist ? "Start a New Form for a Client" : "Fill Out a New Form"}
          </h1>
          <p className="description">
            {isArtist
              ? "Complete an appointment form for a client and review with them on your app."
              : "Important: Don't wait until the day of your appointment. Some of this information must be filled out a few days in advance."}
          </p>

          {fetchingServices ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={50} style={{ color: "#8e2d8e" }} />
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                if (e) e.preventDefault();
                handleContinue(e);
              }}
            >
              {isArtist ? (
                <div className="form-group">
                  <p htmlFor="client-selector">Choose a client*</p>
                  <div className="customer-selector">
                    <CustomerSelector
                      customers={customers || []}
                      onSelect={handleCustomerSelect}
                      value={selectedCustomer}
                      loading={loadingCustomers}
                    />
                  </div>
                </div>
              ) : null}

              <div className="form-group">
                <p htmlFor="appointment-date">
                  {isArtist
                    ? "Appointment Date"
                    : `* What's
                  the date of your upcoming appointment(s)?*`}
                </p>
                <div className="date-picker">
                  <DatePicker
                    value={appointmentDate}
                    shouldDisableDate={(date) =>
                      date
                        ?.startOf("day")
                        ?.isBefore(dayjs().tz(userTimezone).startOf("day"))
                    }
                    onChange={(newValue) => setAppointmentDate(newValue)}
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
                  {services?.map((service) =>
                    service ? (
                      <div key={service?.id} className="checkbox-item">
                        <Checkbox
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
                          checked={selectedServices?.includes(service) || false}
                          onChange={() => handleServiceChange(service)}
                        />
                        <label onClick={() => handleServiceChange(service)}>
                          {service?.service || "Service"}
                        </label>
                      </div>
                    ) : null
                  )}
                </div>
              </div>

              <div className="alert-box">
                <p>
                  If you have multiple appointments on the same day, select all
                  the services for the appointments on that day.
                </p>
              </div>

              <div className="button-group">
                <button
                  type="button"
                  className="go-back-button"
                  onClick={(e) => {
                    if (e) e.preventDefault();
                    navigate(-1);
                  }}
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="continue-button"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Continue"}
                </button>
              </div>
            </form>
          )}
        </div>

        <CreateClientModal
          open={openCreateModal}
          onClose={handleCloseCreateModal}
          onCreateClient={handleCreateCustomer}
          loading={creatingCustomer}
        />
      </div>
    </LocalizationProvider>
  );
};

export default BookAppointment;
