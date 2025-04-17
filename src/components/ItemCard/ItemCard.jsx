/* eslint-disable */
import React from "react";
import { useDrag } from "react-dnd";
import FormField from "../FormField/FormField";
import { useForm } from "react-hook-form";
import { CButton } from "@coreui/react";

const ItemCard = ({
  item,
  onDelete,
  removeDeleteButton,
  field,
  commonFields,
  selecteField,
  allowDrag,
}) => {
  const { control } = useForm();
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "CARD",
    item,
    canDrag: allowDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  return (
    <div
      ref={dragRef}
      style={{
        padding: 16,
        margin: "8px 0",
        backgroundColor: isDragging ? "#ccc" : "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: 6,
        cursor: "grab",
        width: "auto",
        position: "relative",
      }}
    >
      <FormField
        item={item}
        commonFields={commonFields}
        selecteField={selecteField}
        field={field}
        control={control}
      />
      {onDelete && !removeDeleteButton && (
        <CButton
          color="primary"
          onClick={(e) => {
            //e.stopPropagation(); // حتى لا يؤثر على السحب
            onDelete();
          }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "white",
            cursor: "pointer",
          }}
        >
          X
        </CButton>
      )}
    </div>
  );
};

export default ItemCard;
