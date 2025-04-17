/* eslint-disable */
import React, { useState } from "react";
import {
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CFormLabel,
  CToaster,
  CToast,
  CToastBody,
  CToastHeader,
} from "@coreui/react";
import { useForm, Controller } from "react-hook-form";
import myData from "./JsonRendererPage.json";
import { addData } from "../../helper/index";
const RendererPage = () => {
  const [selectedFormIndex, setSelectedFormIndex] = useState(null);
  const [toast, setToast] = useState([]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const handleFormChange = (e) => {
    const selectedIndex =
      e.target.value !== "" ? parseInt(e.target.value) : null;
    setSelectedFormIndex(selectedIndex);
    reset(); // Clear form values on form change
  };

  const onSubmit = async (data) => {
    try {
      const response = await addData(data);
      setToast([
        ...toast,
        <CToast color="success" visible>
          <CToastHeader closeButton>Success</CToastHeader>
          <CToastBody>Data sent successfully</CToastBody>
        </CToast>,
      ]);
      reset(); // Clear form values on form change
      console.log("Form Submitted:", response.data);
    } catch (error) {
      setToast([
        ...toast,
        <CToast color="danger" visible>
          <CToastHeader closeButton>Error</CToastHeader>
          <CToastBody>Failed to send data</CToastBody>
        </CToast>,
      ]);
      console.error("Error:", error);
    }
  };

  const currentForm =
    selectedFormIndex !== null ? myData[selectedFormIndex] : null;

  return (
    <div className="p-4">
      <CRow className="mb-4">
        <CCol md={6}>
          <CFormLabel>Select a Form</CFormLabel>
          <CFormSelect onChange={handleFormChange}>
            <option value="">-- Select --</option>
            {myData.map((form, index) => (
              <option key={index} value={index}>
                {form.title}
              </option>
            ))}
          </CFormSelect>
        </CCol>
      </CRow>

      {currentForm && (
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-3">{currentForm.title}</h4>
          <CRow>
            {currentForm.fields.map((field, idx) => (
              <CCol md={6} key={idx} className="mb-3">
                <CFormLabel>
                  {field.label}
                  {field.required && <span className="text-danger"> *</span>}
                </CFormLabel>

                <Controller
                  key={`${selectedFormIndex}-${field.name}`}
                  name={field.name}
                  control={control}
                  defaultValue=""
                  rules={{
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                  }}
                  render={({ field: controllerField }) =>
                    field.type === "dropdown" ? (
                      <CFormSelect {...controllerField}>
                        <option value="">Select {field.label}</option>
                        {field.options.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </CFormSelect>
                    ) : (
                      <CFormInput type={field.type} {...controllerField} />
                    )
                  }
                />
                {errors[field.name] && (
                  <small className="text-danger">
                    {errors[field.name].message}
                  </small>
                )}
              </CCol>
            ))}
          </CRow>

          <CButton type="submit" color="primary">
            Submit
          </CButton>
        </CForm>
      )}

      <div className="mt-5">
        <CToaster position="top-end">{toast}</CToaster>
      </div>
    </div>
  );
};

export default RendererPage;
