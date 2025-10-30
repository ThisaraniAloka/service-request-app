import React from "react";

function FormField({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col text-left">
      <label className="font-semibold">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded p-2"
        required
      />
    </div>
  );
}

export default FormField;
