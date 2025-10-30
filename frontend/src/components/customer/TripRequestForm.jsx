import React, { useState } from "react";
import FormField from "./FormField";
import SuccessMessage from "./SuccessMessage";

function TripRequestForm() {
  const [formData, setFormData] = useState({ name: "", destination: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send data to backend here
    setSubmitted(true);
  };

  if (submitted) return <SuccessMessage />;

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
      <FormField label="Name" name="name" value={formData.name} onChange={handleChange} />
      <FormField label="Destination" name="destination" value={formData.destination} onChange={handleChange} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
        Submit
      </button>
    </form>
  );
}

export default TripRequestForm;
