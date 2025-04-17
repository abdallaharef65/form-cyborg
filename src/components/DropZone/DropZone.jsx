/* eslint-disable */
import React from "react";
import { useDrop } from "react-dnd";

const DropZone = ({ onDrop, children }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "CARD",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      style={{
        minHeight: 300,
        backgroundColor: isOver ? "#e0ffe0" : "#f0f0f0",
        padding: 16,
        border: "2px dashed #bbb",
        borderRadius: 8,
      }}
    >
      {children}
    </div>
  );
};

export default DropZone;
