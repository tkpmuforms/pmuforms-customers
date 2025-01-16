import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  // updateAppointment,
  createFilledForm,
  getArtistById,
  getFormsForAppointMentById,
  getRootTemplateForm,
  // uploadImage,
  // updateUser,
  // createRelationship,
} from "../../services/services";
import {
  updateAppointment,
  uploadImage,
} from "../../firebase/firebaseServices";
// import { Webcam } from "react-webcam";

const FormInputTypes = {
  TEXT: "text",
  CHECKBOX: "checkbox",
  IMAGE: "image",
  DATE: "date",
  // Add other input types as needed
};

const DynamicForms = () => {
  const { serviceIds, artistId, appointmentId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const webcamRef = useRef(null);

  // State management
  const [forms, setForms] = useState([]);
  const [formTemplateNode, setFormTemplateNode] = useState(null);
  const [formTemplateNodes, setFormTemplateNodes] = useState([]);
  const [clientFormGroup, setClientFormGroup] = useState({});
  const [formResponse, setFormResponse] = useState({});
  const [filledOutForms, setFilledOutForms] = useState({});
  const [finishedAllForms, setFinishedAllForms] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [artist, setArtist] = useState(null);

  // UI states
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [imageAsDataUrl, setImageAsDataUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [cameraNotAvailable, setCameraNotAvailable] = useState(false);

  useEffect(() => {
    const initializeForms = async () => {
      try {
        // Get artist information
        const artistData = await getArtistById(artistId);
        setCompanyName(artistData.businessName);
        setArtist(artistData);

        // Get forms
        if (serviceIds) {
          const fetchedForms = await getRootTemplateForm();
          const filteredForms = fetchedForms.filter((form) =>
            form.services.some((service) =>
              serviceIds.split(",").includes(service.toString())
            )
          );
          setForms(filteredForms);

          // Create linked list structure
          const linkedList = createFormsLinkedList(filteredForms);
          setFormTemplateNodes(linkedList);
          setFormTemplateNode(linkedList[0]);
        }

        // Get filled forms for appointment
        const filledForms = await getFormsForAppointMentById(appointmentId);
        const filledFormsMap = {};
        filledForms.forEach((form) => {
          filledFormsMap[form.form_template_id] = true;
          if (form.form_template_id === formTemplateNode?.formTemplate.id) {
            setFormResponse(form.data);
            setImageUrl(form.data.client_image);
          }
        });
        setFilledOutForms(filledFormsMap);
      } catch (error) {
        console.error("Error initializing forms:", error);
        setFormError("Error loading forms. Please try again.");
      }
    };

    initializeForms();
  }, [artistId, serviceIds, appointmentId]);

  const createFormsLinkedList = (forms) => {
    const sortedForms = forms.sort((a, b) => {
      if (a.order === null && b.order === null) return 0;
      if (a.order === null) return 1;
      if (b.order === null) return -1;
      return a.order - b.order;
    });

    return sortedForms.map((form, index) => ({
      formTemplate: form,
      next: index < sortedForms.length - 1 ? index + 1 : null,
      previous: index > 0 ? index - 1 : null,
      location: index + 1,
    }));
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setClientFormGroup((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNextForm = () => {
    if (formTemplateNode?.next !== null) {
      const nextNode = formTemplateNodes[formTemplateNode.next];
      setFormTemplateNode(nextNode);
      setFormResponse({});
      setImageUrl(undefined);
      setImageAsDataUrl(undefined);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousForm = () => {
    if (formTemplateNode?.previous !== null) {
      const prevNode = formTemplateNodes[formTemplateNode.previous];
      setFormTemplateNode(prevNode);
      setFormResponse({});
      window.scrollTo(0, 0);
    }
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageAsDataUrl(imageSrc);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageAsDataUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    // Check required fields
    const hasEmptyRequired = formTemplateNode.formTemplate.sections.some(
      (section) =>
        section.fields?.some(
          (field) => field.required && !clientFormGroup[field.id]
        )
    );

    if (hasEmptyRequired) {
      setFormError("Please complete all required fields.");
      return false;
    }

    // Check image requirement
    const hasImageField = formTemplateNode.formTemplate.sections.some(
      (section) =>
        section.fields?.some((field) => field.type === FormInputTypes.IMAGE)
    );

    if (hasImageField && !imageAsDataUrl && !imageUrl) {
      setFormError("Please add an image");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (!validateForm()) {
      setTimeout(() => setFormError(""), 6000);
      return;
    }

    setSaving(true);

    try {
      let imageDownloadUrl = imageUrl;
      if (imageAsDataUrl) {
        imageDownloadUrl = await uploadImage(artist.uid, imageAsDataUrl);
      }

      const formToSubmit = {
        ...clientFormGroup,
        client_image: imageDownloadUrl,
        form_template_id: formTemplateNode.formTemplate.id,
        appointment_id: appointmentId,
        client_id: currentUser?.uid,
      };

      // Remove undefined values
      Object.keys(formToSubmit).forEach(
        (key) => formToSubmit[key] === undefined && delete formToSubmit[key]
      );

      await createFilledForm(formToSubmit);

      // Update user and create relationship
      // await updateUser(artistId, currentUser.uid);
      // await createRelationship(artistId, currentUser.uid);

      setFilledOutForms((prev) => ({
        ...prev,
        [formTemplateNode.formTemplate.id]: true,
      }));

      // Check if all forms are completed
      const completedFormsCount = Object.keys(filledOutForms).length + 1;
      if (completedFormsCount === formTemplateNodes.length) {
        setFinishedAllForms(true);
        await updateAppointment(appointmentId, { allFormsCompleted: true });
      }

      setSaving(false);
      setFinished(true);
      handleNextForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError("Error submitting form. Please try again.");
      setSaving(false);
    }
  };

  const renderFormField = (field) => {
    switch (field.type) {
      case FormInputTypes.IMAGE:
        return (
          <div className="image-capture">
            {/* {!cameraNotAvailable && (
              <>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  onUserMediaError={() => setCameraNotAvailable(true)}
                />
                <button onClick={captureImage}>Capture Photo</button>
              </>
            )} */}
            {(cameraNotAvailable || true) && (
              <input type="file" accept="image/*" onChange={handleFileUpload} />
            )}
            {(imageAsDataUrl || imageUrl) && (
              <img
                src={imageAsDataUrl || imageUrl}
                alt="Captured"
                className="preview-image"
              />
            )}
          </div>
        );
      case FormInputTypes.CHECKBOX:
        return (
          <input
            type="checkbox"
            name={field.id}
            id={field.id}
            checked={clientFormGroup[field.id] || false}
            onChange={handleFormChange}
            required={field.required}
          />
        );
      default:
        return (
          <input
            type={field.type || "text"}
            name={field.id}
            id={field.id}
            value={clientFormGroup[field.id] || ""}
            onChange={handleFormChange}
            required={field.required}
            min={
              field.type === "date"
                ? new Date().toISOString().split("T")[0]
                : undefined
            }
          />
        );
    }
  };

  return (
    <div className="dynamic-forms-container">
      <h1>{companyName}</h1>
      {formError && <div className="error-message">{formError}</div>}

      {formTemplateNode && (
        <div className="form-template">
          <h2>{formTemplateNode.formTemplate.title}</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            {formTemplateNode.formTemplate.sections.map(
              (section, sectionIndex) => (
                <div key={sectionIndex} className="form-section">
                  <h3>{section.title}</h3>
                  {section.fields?.map((field) => (
                    <div key={field.id} className="form-group">
                      <label htmlFor={field.id}>{field.label}</label>
                      {renderFormField(field)}
                    </div>
                  ))}
                </div>
              )
            )}

            <div className="form-actions">
              <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="navigation-buttons">
        <button
          className="previous-button"
          onClick={handlePreviousForm}
          disabled={!formTemplateNode?.previous}
        >
          Previous
        </button>
        <button
          className="next-button"
          onClick={handleNextForm}
          disabled={!formTemplateNode?.next}
        >
          Next
        </button>
      </div>

      {finishedAllForms && (
        <div className="success-message">All forms completed successfully!</div>
      )}
    </div>
  );
};

export default DynamicForms;
