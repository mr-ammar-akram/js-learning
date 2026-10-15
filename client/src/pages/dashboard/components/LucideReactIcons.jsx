import React from "react";
import Select from "react-select";
import * as Icons from "lucide-react";

const iconOptions = Object.keys(Icons)
  .filter(
    (name) =>
      !name.endsWith("Icon") && // Remove duplicate aliases
      name !== "LucideProvider" &&
      /^[A-Z]/.test(name)
  )
  .sort()
  .map((name) => ({
    value: name,
    label: name,
  }));


const formatOptionLabel = ({ label }) => {
  const Icon = Icons[label];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <Icon size={18} />
      <span>{label}</span>
    </div>
  );
};

export default function IconSelect({ value, onChange }) {
  return (
    <Select
      options={iconOptions}
      value={iconOptions.find((item) => item.value === value)}
      onChange={(selected) => onChange(selected.value)}
      formatOptionLabel={formatOptionLabel}
      isSearchable
      placeholder="Select an icon..."
      styles={{
        control: (base) => ({
          ...base,
          zIndex: "1000000",
          background: "#fff",
        }),
      }}
    />
  );
}