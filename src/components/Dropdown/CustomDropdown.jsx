import { useEffect, useRef, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import "./CustomDropdown.css";

export default function CustomDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`custom-dropdown ${className}`} ref={wrapperRef}>
      {label && <label className="custom-dropdown-label">{label}</label>}

      <button
        type="button"
        className={`custom-dropdown-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}>
        <span>{value || placeholder}</span>
        <KeyboardArrowDownIcon className={`custom-dropdown-arrow ${open ? "open" : ""}`} />
      </button>

      {open && (
        <div className="custom-dropdown-menu">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              className={`custom-dropdown-option ${value === option ? "selected" : ""}`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
