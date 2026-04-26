import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ClassSearchPage.css";
import Sidebar from "./components/Sidebar";
import CustomDropdown from "./components/CustomDropdown";

export default function ClassSearchPage() {
  const navigate = useNavigate();
  const [showAdditionalCriteria, setShowAdditionalCriteria] = useState(false);
  const [activeSchedule, setActiveSchedule] = useState(1);

  const [term, setTerm] = useState("Spring 2025");
  const [subject, setSubject] = useState("");
  const [courseFilterType, setCourseFilterType] = useState("Contains");
  const [courseCareer, setCourseCareer] = useState("");

  const [modeOfInstruction, setModeOfInstruction] = useState("");
  const [classTimeType, setClassTimeType] = useState("Select");
  const [classTimeValue, setClassTimeValue] = useState("");

  const times = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

  const termOptions = ["Spring 2025", "Fall 2026", "Summer 2026", "Spring 2027"];

  const subjectOptions = [
    "Art",
    "Accouting",
    "Aerospace Engineering",
    "Biology",
    "Biomedical",
    "Chemistry",
    "Computer Science",
    "Data Science",
    "Design",
    "Economics",
    "Electrical Engineering",
    "Information Systems",
    "Mathematics",
    "Software Engineering",
  ];

  const courseFilterOptions = ["Select", "Contains", "Is Exactly"];

  const courseCareerOptions = [
    "Undergraduate",
    "Graduate",
    "Postbaccalaureate",
    "Non-credit Extension",
  ];

  const modeOfInstructionOptions = ["Select", "Lecture", "Seminar", "Discussion", "Research"];

  const classTimeTypeOptions = ["Select", "Before", "After", "At Exactly"];

  return (
    <div className="class-search-page">
      <div className="class-search-header">
        <div className="class-search-header-inner">
          <div className="class-search-logo">
            <div className="class-search-logo-main">SJSU</div>
            <div className="class-search-logo-sub">
              <div>SAN JOSE STATE</div>
              <div>UNIVERSITY</div>
            </div>
          </div>
        </div>
      </div>

      <div className="class-search-layout">
        <Sidebar
          activeItem="Academics: Enrollment"
          activeSubtab="Class Search"
          defaultEnrollmentOpen={true}
        />

        <main className="class-search-content">
          <div className="class-search-card">
            <button className="class-search-back-btn" onClick={() => navigate(-1)}>
              Back
            </button>

            <div className="class-search-top-form">
              <div className="class-search-form-grid">
                <label className="class-search-label">Term</label>
                <CustomDropdown
                  options={termOptions}
                  value={term}
                  onChange={setTerm}
                  placeholder="Select Term"
                />

                <label className="class-search-label">Subject</label>
                <CustomDropdown
                  options={subjectOptions}
                  value={subject}
                  onChange={setSubject}
                  placeholder="Select Subject"
                />

                <label className="class-search-label">Course Number Filter</label>
                <div className="class-search-course-filter-wrap">
                  <input className="class-search-course-input" />
                  <CustomDropdown
                    options={courseFilterOptions}
                    value={courseFilterType}
                    onChange={setCourseFilterType}
                    placeholder="Contains"
                  />
                </div>

                <label className="class-search-label">Course Career</label>
                <CustomDropdown
                  options={courseCareerOptions}
                  value={courseCareer}
                  onChange={setCourseCareer}
                  placeholder="Select Course Career"
                />
              </div>
            </div>

            <div className="class-search-criteria-section">
              <button
                className={`class-search-criteria-toggle ${showAdditionalCriteria ? "open" : ""}`}
                onClick={() => setShowAdditionalCriteria((prev) => !prev)}>
                <span className="class-search-criteria-icon">
                  {showAdditionalCriteria ? "▾" : "▸"}
                </span>
                <span>Additional Search Criteria</span>
              </button>

              {showAdditionalCriteria && (
                <div className="class-search-criteria-body">
                  <div className="class-search-criteria-row class-search-days-row">
                    <div className="class-search-criteria-label">Days of the Week</div>

                    <label className="class-search-checkbox-item">
                      <label className="checkbox">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span>Monday</span>
                      </label>
                    </label>
                    <label className="class-search-checkbox-item">
                      <label className="checkbox">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span>Tuesday</span>
                      </label>
                    </label>
                    <label className="class-search-checkbox-item">
                      <label className="checkbox">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span>Wednesday</span>
                      </label>
                    </label>
                    <label className="class-search-checkbox-item">
                      <label className="checkbox">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span>Thursday</span>
                      </label>
                    </label>
                    <label className="class-search-checkbox-item">
                      <label className="checkbox">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span>Friday</span>
                      </label>
                    </label>
                  </div>

                  <div className="class-search-criteria-row class-search-mode-time-row">
                    <label className="class-search-criteria-label">Mode of Instruction</label>
                    <CustomDropdown
                      options={modeOfInstructionOptions}
                      value={modeOfInstruction}
                      onChange={setModeOfInstruction}
                      placeholder="Select Mode of Instruction"
                    />

                    <label className="class-search-criteria-label class-search-time-label">
                      Class Time
                    </label>

                    <CustomDropdown
                      options={classTimeTypeOptions}
                      value={classTimeType}
                      onChange={setClassTimeType}
                      placeholder="Select"
                    />

                    <CustomDropdown
                      options={times}
                      value={classTimeValue}
                      onChange={setClassTimeValue}
                      placeholder="Select class time"
                    />
                  </div>

                  <div className="class-search-criteria-row class-search-instructor-row">
                    <label className="class-search-criteria-label">Instructor Last Name</label>
                    <input className="class-search-instructor-input" placeholder="Search..." />
                  </div>
                </div>
              )}
            </div>

            <div className="class-search-search-row">
              <button className="class-search-search-btn">Search</button>
            </div>

            <div className="class-search-tabs">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  className={activeSchedule === num ? "active" : ""}
                  onClick={() => setActiveSchedule(num)}>
                  Schedule {num}
                </button>
              ))}
            </div>

            <div className="class-search-schedule-shell">
              <div className="class-search-schedule-table-wrap">
                <table className="class-search-schedule-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Monday</th>
                      <th>Tuesday</th>
                      <th>Wednesday</th>
                      <th>Thursday</th>
                      <th>Friday</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 16 }, (_, i) => 7 + i).map((t) => (
                      <tr key={t}>
                        <td>{t}:00</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="class-search-actions">
                <div className="actions-left">
                  <button className="action-btn">Drop Selected</button>
                  <button className="action-btn">Drop All</button>
                </div>

                <div className="actions-right">
                  <button className="action-btn">Checkout Selected</button>
                  <button className="action-btn">Checkout All</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
