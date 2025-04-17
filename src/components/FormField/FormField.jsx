/* eslint-disable */
import React from "react";
import { Controller } from "react-hook-form";
import { CFormInput } from "@coreui/react";

const FormField = ({ field, control, item, commonFields, selecteField }) => {
  const { name, label, type } = field;

  return (
    <div style={{ marginBottom: "1rem" }}>
      {/* label */}
      <div htmlFor={name} style={{ display: "block", fontWeight: "bold" }}>
        {label}
      </div>

      {/*Render common fields (title input + required checkbox) */}
      {commonFields}

      {/*controller to bind input */}
      <Controller
        name={name}
        disabled
        control={control}
        defaultValue=""
        render={({ field }) => {
          if (type === "text" || type === "email") {
            return (
              <>
                <span className="text-danger">
                  {item.error?.title?.[0] || ""}
                </span>
                <CFormInput
                  {...field}
                  type={type}
                  id={name}
                  style={{ width: "100%", padding: "8px" }}
                />
              </>
            );
          } else if (type === "dropdown") {
            return (
              <>
                {selecteField}
                <span className="text-danger">
                  {item.error?.["field.options"] || ""}
                </span>
              </>
            );
          } else if (type === "date") {
            return (
              <>
                <span className="text-danger">
                  {item.error?.title?.[0] || ""}
                </span>
                <CFormInput
                  disabled
                  type="date"
                  style={{ width: "100%", padding: "8px" }}
                />
              </>
            );
          }
          // Default render for any other types
          else {
            return (
              <>
                <span className="text-danger">
                  {item.error?.title?.[0] || ""}
                </span>
                <CFormInput {...field} type="text" id={name} />
              </>
            );
          }
        }}
      />
    </div>
  );
};

export default FormField;
