import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({
  activeItem = "Student Center",
  activeSubtab = "",
  defaultEnrollmentOpen = false,
}) {
  const navigate = useNavigate();
  const [showEnrollmentMenu, setShowEnrollmentMenu] = useState(defaultEnrollmentOpen);

  const navItems = [
    "Student Center",
    "View My Messages",
    "Holds",
    "To Do List",
    "Make a Payment",
    "Academics: Enrollment",
    "Academics: Records",
    "Finances",
    "Admissions",
    "Personal Information",
    "Alert-SJSU",
    "Other",
    "Logout",
  ];

  const enrollmentSubtabs = ["Enrollment Date", "Add/Drop Classes", "My Schedule"];

  const handleNavClick = (item) => {
    if (item === "Student Center") {
      navigate("/");
      return;
    }

    if (item === "Academics: Enrollment") {
      setShowEnrollmentMenu((prev) => !prev);
    }
  };

  const handleSubtabClick = (subtab) => {
    if (subtab === "Add/Drop Classes") {
      navigate("/class-search");
    }
    if (subtab === "My Schedule") {
      navigate("/my-schedule");
    }
  };

  return (
    <aside className="app-sidebar">
      {navItems.map((item) => {
        const isEnrollment = item === "Academics: Enrollment";
        const isActive = activeItem === item;

        return (
          <div key={item} className="app-sidebar-group">
            <button
              className={`app-sidebar-item ${isActive ? "active" : ""} ${
                isEnrollment ? "expandable" : ""
              }`}
              onClick={() => handleNavClick(item)}>
              <span>{item}</span>
              {isEnrollment && (
                <span className={`app-sidebar-caret ${showEnrollmentMenu ? "open" : ""}`}>▾</span>
              )}
            </button>

            {isEnrollment && showEnrollmentMenu && (
              <div className="app-sidebar-subnav">
                {enrollmentSubtabs.map((subtab) => (
                  <button
                    key={subtab}
                    className={`app-sidebar-subitem ${activeSubtab === subtab ? "active" : ""}`}
                    onClick={() => handleSubtabClick(subtab)}>
                    {subtab}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
