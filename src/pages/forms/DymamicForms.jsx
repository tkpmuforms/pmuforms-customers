import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../context/AuthContext";
import {
  createFilledForm,
  getAllFilledFormsForAppointment,
  getAllFormsForServicesFromFirebase,
  getArtist,
  updateAppointment,
} from "../../firebase/firebaseServices";

const DynamicForms = () => {
  const { serviceIds, artistId, appointmentId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [forms, setForms] = useState([]);
  const [formTemplateNode, setFormTemplateNode] = useState(null);
  const [formTemplateNodes, setFormTemplateNodes] = useState([]);
  const [clientFormGroup, setClientFormGroup] = useState({});
  const [formResponse, setFormResponse] = useState({});
  const [filledOutForms, setFilledOutForms] = useState({});
  const [finishedAllForms, setFinishedAllForms] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageAsDataUrl, setImageAsDataUrl] = useState(null);

  useEffect(() => {
    // Fetch artist and form templates on load
    getArtist(artistId).then((artist) => {
      setCompanyName(artist.businessName);
    });

    fetchForms(serviceIds.split(","));
    getAllFilledFormsForAppointment(appointmentId);
  }, [artistId, serviceIds, appointmentId]);

  const fetchForms = async (serviceIds) => {
    try {
      const fetchedForms = await getAllFormsForServicesFromFirebase(
        serviceIds,
        artistId
      );
      setForms(fetchedForms);
      const linkedList = createFormsLinkedList(fetchedForms);
      setFormTemplateNodes(linkedList);
      setFormTemplateNode(linkedList[0]);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  const createFormsLinkedList = (forms) => {
    // Sort and create linked list of form templates
    const sortedForms = forms.sort((a, b) => a.order - b.order || 0);
    const nodes = sortedForms.map((form, index) => ({
      formTemplate: form,
      next: index < sortedForms.length - 1 ? index + 1 : null,
      previous: index > 0 ? index - 1 : null,
    }));
    return nodes;
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setClientFormGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextForm = () => {
    const nextNode = formTemplateNodes[formTemplateNode.next];
    if (nextNode) {
      setFormTemplateNode(nextNode);
      setFormResponse({});
    }
  };

  const handlePreviousForm = () => {
    const previousNode = formTemplateNodes[formTemplateNode.previous];
    if (previousNode) {
      setFormTemplateNode(previousNode);
      setFormResponse({});
    }
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageAsDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (Object.values(clientFormGroup).some((value) => !value)) {
      setFormError("Please complete all required fields.");
      return;
    }

    setSaving(true);
    const formId = uuidv4();
    const formToSubmit = {
      ...clientFormGroup,
      form_template_id: formTemplateNode.formTemplate.id,
      appointment_id: appointmentId,
      client_id: currentUser().uid,
    };

    if (imageAsDataUrl) {
      formToSubmit.client_image = imageAsDataUrl;
    }

    try {
      await createFilledForm(formToSubmit, formId);
      setFilledOutForms((prev) => ({
        ...prev,
        [formTemplateNode.formTemplate.id]: true,
      }));

      if (Object.keys(filledOutForms).length === formTemplateNodes.length) {
        setFinishedAllForms(true);
        await updateAppointment(appointmentId, { allFormsCompleted: true });
      }

      setSaving(false);
      setSubmitted(false);
      setFormResponse({});
      handleNextForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError("Error submitting form. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="dynamic-forms-page">
      <h1>Fill Out Forms for {companyName}</h1>
      {formError && <div className="error-message">{formError}</div>}
      {formTemplateNode && (
        <div className="form-template">
          <h2>{formTemplateNode.formTemplate.title}</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            {formTemplateNode.formTemplate.sections.map((section) =>
              section.data.map((field) => (
                <div key={field.id} className="form-group">
                  <label htmlFor={field.id}>{field.label}</label>
                  <input
                    type={field.type === "image" ? "file" : "text"}
                    name={field.id}
                    id={field.id}
                    value={clientFormGroup[field.id] || ""}
                    onChange={
                      field.type === "image"
                        ? (e) => handleImageUpload(e.target.files[0])
                        : handleFormChange
                    }
                    required={field.required}
                  />
                </div>
              ))
            )}
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Saving..." : "Submit"}
            </button>
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
        <div className="success-message">All forms completed!</div>
      )}
    </div>
  );
};

export default DynamicForms;
