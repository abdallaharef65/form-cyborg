/* eslint-disable */
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  CFormInput,
  CFormSelect,
  CButton,
  CListGroupItem,
  CListGroup,
  CRow,
  CCol,
  CFormCheck,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from "@coreui/react";
import Joi from "joi";
import ItemCard from "../../components/ItemCard/ItemCard";
import DropZone from "../../components/DropZone/DropZone";
import { addData } from "../../helper/index";
// validation Schema
const schema = Joi.object({
  formTitle: Joi.string().min(8).max(30).required().messages({
    "string.empty": "Form Title is required",
    "string.min": "Form Title must be at least 8 characters",
    "string.max": "Form Title must be at most 30 characters",
  }),
  fields: Joi.array().items(
    Joi.object({
      id: Joi.number().required(),
      title: Joi.string().required().messages({
        "string.empty": "Field is required",
      }),
      required: Joi.boolean().required(),
      uniqueId: Joi.number().required(),
      field: Joi.object({
        name: Joi.string().required(),
        label: Joi.string().required(),
        type: Joi.string().required(),
        options: Joi.alternatives().conditional("type", {
          is: "dropdown",
          then: Joi.array()
            .min(1)
            .items(
              Joi.object({
                label: Joi.string().required(),
                value: Joi.any().required(),
              })
            )
            .messages({
              "array.min": "At least one option is required for dropdown",
            }),
          otherwise: Joi.optional(),
        }),
      }).required(),
    })
  ),
  arrLength: Joi.array().min(1).messages({
    "array.min": "At least one field is required",
  }),
});

// fields for the form builder
const initialDataField = [
  {
    id: 2,
    title: "",
    required: true,
    field: { name: "Text", label: "Text", type: "text" },
  },
  {
    id: 1,
    title: "",
    required: true,
    field: { name: "Email", label: "Email", type: "email" },
  },

  {
    id: 3,
    title: "",
    required: true,
    field: {
      name: "dropdown",
      label: "Drop down",
      type: "dropdown",
      options: [],
    },
  },
  {
    id: 4,
    title: "",
    required: true,
    field: { name: "date", label: "Date", type: "date" },
  },
];

function BuilderPage() {
  const [initialField, setInitialField] = useState(initialDataField);
  const [currentFormFiled, setCurrentFormFiled] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [newOptions, setNewOptions] = useState({});
  const [toast, setToast] = useState([]);
  // dragging field in drop zone
  const handleDrop = (item) => {
    const newItem = { ...item, uniqueId: Date.now() };
    setCurrentFormFiled((prev) => [...prev, newItem]);
  };

  // Delete from current form
  const handleDeleteFromCurrentFormFiled = (uniqueId) => {
    setCurrentFormFiled((prev) =>
      prev.filter((item) => item.uniqueId !== uniqueId)
    );
  };

  // Update required checkbox value
  const handleFormCheckChange = (id, value) => {
    const updated = currentFormFiled.map((item) =>
      item.uniqueId === id ? { ...item, required: value } : item
    );
    setCurrentFormFiled(updated);
  };

  // Update title value
  const handleTitleChange = (id, value) => {
    const updated = currentFormFiled.map((item) =>
      item.uniqueId === id ? { ...item, title: value } : item
    );
    setCurrentFormFiled(updated);
  };

  // Render common fields (title input + required checkbox)
  const commonFields = (item) => (
    <>
      <CFormCheck
        label="Is required"
        checked={item.required}
        onChange={(e) => handleFormCheckChange(item.uniqueId, e.target.checked)}
      />
      <CFormInput
        placeholder="Field name"
        required
        value={item.title}
        onChange={(e) => handleTitleChange(item.uniqueId, e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <span className="text-danger">{item.error?.error || ""}</span>
    </>
  );

  // Render dropdown select field with options
  const selecteField = (item) => (
    <>
      <span className="text-danger">
        {item.error?.title ? item.error.title[0] : ""}
      </span>
      <CFormSelect disabled>
        <option value="">-- Select --</option>
        {item.field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </CFormSelect>

      {/* Add new dropdown option */}
      <CRow className="mt-3">
        <CCol xs={8}>
          <CFormInput
            id={item.uniqueId}
            placeholder="New option"
            value={newOptions[item.uniqueId] || ""}
            onChange={(e) =>
              setNewOptions((prev) => ({
                ...prev,
                [e.target.id]: e.target.value,
              }))
            }
          />
        </CCol>
        <CCol xs={4}>
          <CButton
            style={{
              color: "white",
            }}
            color="primary"
            onClick={() =>
              handleAddOption(item.uniqueId, newOptions[item.uniqueId])
            }
          >
            Add
          </CButton>
        </CCol>
      </CRow>

      {/* Current options list */}
      <h6 className="mt-4">Current options</h6>
      <CListGroup>
        {item.field.options?.map((opt) => (
          <CListGroupItem
            key={opt.value}
            className="d-flex justify-content-between align-items-center"
          >
            {opt.label}
            <CButton
              style={{
                color: "white",
              }}
              color="danger"
              size="sm"
              onClick={() => handleDeleteOption(item.uniqueId, opt.value)}
            >
              Delete
            </CButton>
          </CListGroupItem>
        ))}
      </CListGroup>
    </>
  );

  // Add option to dropdown field
  const handleAddOption = (itemId, newOption) => {
    if (!newOption.trim()) return;
    setCurrentFormFiled((prev) =>
      prev.map((item) => {
        if (item.uniqueId === itemId) {
          const updatedOptions = [
            ...item.field.options,
            {
              label: newOption,
              value: (item.field.options.length + 1).toString(),
            },
          ];
          return { ...item, field: { ...item.field, options: updatedOptions } };
        }
        return item;
      })
    );
  };

  // Delete option from dropdown field
  const handleDeleteOption = (itemId, optionValue) => {
    setCurrentFormFiled((prev) =>
      prev.map((item) => {
        if (item.uniqueId === itemId) {
          const updatedOptions = item.field.options?.filter(
            (opt) => opt.value !== optionValue
          );
          return { ...item, field: { ...item.field, options: updatedOptions } };
        }
        return item;
      })
    );
  };

  // Save form and validate data
  const handleSaveForm = async () => {
    setTitleError("");
    setFieldError("");

    const cleanedFields = currentFormFiled.map(({ error, ...rest }) => rest);
    const formData = {
      formTitle,
      fields: cleanedFields,
      arrLength: currentFormFiled,
    };

    const { error } = schema.validate(formData, { abortEarly: false });
    const result = [...formData.fields];

    if (error) {
      // Match each error with its corresponding field.
      result.forEach((item) => (item.error = {}));
      error.details.forEach((err) => {
        const [field, index, ...restPath] = err.path;
        if (field === "fields") {
          const key = restPath.join(".") || "global";
          if (!result[index].error) result[index].error = {};
          result[index].error[key] = [err.message];
        } else if (field === "formTitle") {
          setTitleError(err.message);
        } else if (field === "arrLength") {
          setFieldError(err.message);
        }
      });

      setCurrentFormFiled(result);
    } else {
      setCurrentFormFiled(result);
      const transformedData = transformFormData(result, formTitle);

      try {
        const response = await addData(transformedData);
        setToast([
          <CToast key={new Date().getTime()} color="success" visible>
            <CToastHeader closeButton>Success</CToastHeader>
            <CToastBody>Data saved successfully!</CToastBody>
          </CToast>,
        ]);
        setTimeout(() => {
          setCurrentFormFiled([]);
          setFormTitle("");
        }, 2000);

        console.log("Data saved successfully!:", response.data);
      } catch (error) {
        setToast([
          <CToast key={new Date().getTime()} color="danger" visible>
            <CToastHeader closeButton>Failure</CToastHeader>
            <CToastBody>
              An error occurred while sending the data: {error.message}
            </CToastBody>
          </CToast>,
        ]);
        console.error("An error occurred while sending the data:", error);
      }
    }
  };

  // DB format
  const transformFormData = (formData, formTitle) => ({
    title: formTitle,
    fields: formData.map((item) => {
      const { type, options } = item.field;
      const field = {
        label: item.title,
        name: item.title.replace(/\s+/g, ""),
        type,
        required: item.required,
      };
      if (type === "dropdown") {
        field.options = options.map((opt) => opt.label);
      }
      return field;
    }),
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", gap: 40, padding: 40 }}>
        {/* Field List */}
        <div style={{ width: "350px" }}>
          <h2>Field</h2>
          {initialField.map((item) => (
            <ItemCard
              key={item.id}
              allowDrag={true}
              item={item}
              field={item.field}
              removeDeleteButton={true}
              selecteField={
                <CFormSelect disabled style={{ width: "100%", padding: "8px" }}>
                  <option value="">Select an option</option>
                </CFormSelect>
              }
            />
          ))}
        </div>

        {/* Form Builder */}
        <div style={{ width: "800px" }}>
          <h2>Form</h2>
          <DropZone onDrop={handleDrop}>
            <CRow className="mt-3">
              <CCol xs={3}>
                <h4>
                  Form Title <span className="text-danger">*</span>
                </h4>
              </CCol>
              <CCol xs={9}>
                <CFormInput
                  placeholder="Form Title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
                <span className="text-danger">{titleError}</span>
              </CCol>
            </CRow>

            {currentFormFiled.map((item) => (
              <ItemCard
                key={item.uniqueId}
                allowDrag={false}
                item={item}
                field={item.field}
                onDelete={() => handleDeleteFromCurrentFormFiled(item.uniqueId)}
                removeDeleteButton={false}
                commonFields={commonFields(item)}
                selecteField={selecteField(item)}
              />
            ))}

            <CRow>
              <span className="text-danger">{fieldError}</span>
            </CRow>

            <CRow className="mt-3">
              <CCol xs={2}>
                <CButton
                  style={{
                    color: "white",
                  }}
                  color="primary"
                  onClick={handleSaveForm}
                >
                  Save
                </CButton>
              </CCol>
            </CRow>
            {/* */}
          </DropZone>
          <div className="mt-1 mb-3">
            <CToaster position="top-end">{toast}</CToaster>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default BuilderPage;
