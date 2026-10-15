import React, { useMemo, useState } from "react";
import * as Icons from "lucide-react";

export default function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const iconNames = useMemo(() => {
    return Object.keys(Icons)
      .filter(
        (name) =>
          !name.endsWith("Icon") &&
          name !== "LucideProvider" &&
          /^[A-Z]/.test(name)
      )
      .sort();
  }, []);

  const filteredIcons = iconNames.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const SelectedIcon = value ? Icons[value] : null;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 15px",
          border: "1px solid #ccc",
          borderRadius: 8,
          background: "#fff",
          cursor: "pointer",
        }}
      >
        {SelectedIcon && <SelectedIcon size={20} />}
        {value || "Choose Icon"}
      </button>

      {/* Popup */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            width: 500,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 10,
            boxShadow: "0 10px 25px rgba(0,0,0,.15)",
            padding: 15,
            zIndex: 999,
          }}
        >
          {/* Search */}
          <input
            type="text"
            placeholder="Search icon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ddd",
              marginBottom: 15,
              outline: "none",
            }}
          />

          {/* Icons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(50px,1fr))",
              gap: 10,
              maxHeight: 350,
              overflowY: "auto",
            }}
          >
            {filteredIcons.map((name) => {
              const Icon = Icons[name];

              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                    setSearch("");
                  }}
                  style={{
                    border:
                      value === name
                        ? "2px solid #2563eb"
                        : "1px solid #ddd",
                    background:
                      value === name ? "#eff6ff" : "#fff",
                    borderRadius: 8,
                    padding: 10,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      value === name ? "#eff6ff" : "#fff";
                  }}
                >
                  <Icon size={22} />
                </button>
              );
            })}
          </div>

          {filteredIcons.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 20,
                color: "#888",
              }}
            >
              No icons found
            </div>
          )}
        </div>
      )}
    </div>
  );
}