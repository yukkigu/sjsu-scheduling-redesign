import "./AdditionalCriteria.css";
import CustomDropdown from "../Dropdown/CustomDropdown";
import DaysCard from "./days-card";

export default function AdditionalCriteria({
  modeOfInstructionOptions,
  modeOfInstruction,
  setModeOfInstruction,
  classTimeTypeOptions,
  classTimeType,
  setClassTimeType,
  times,
  classTimeValue,
  setClassTimeValue,
  selectedDays,
  setSelectedDays,
  instructorLastName,
  setInstructorLastName,
}) {
  return (
    <div className="class-search-criteria-body">
      <div className="class-search-criteria-row class-search-days-row">
        <div className="class-search-criteria-label">Days of the Week</div>
        <DaysCard selectedDays={selectedDays} setSelectedDays={setSelectedDays} />
      </div>

      <div className="class-search-criteria-row class-search-mode-time-row">
        <label className="class-search-criteria-label">Mode of Instruction</label>
        <CustomDropdown
          options={modeOfInstructionOptions}
          value={modeOfInstruction}
          onChange={(value) => setModeOfInstruction(value === "Select" ? "" : value)}
          placeholder="Select Mode of Instruction"
        />

        <label className="class-search-criteria-label class-search-time-label">Class Time</label>

        <CustomDropdown
          options={classTimeTypeOptions}
          value={classTimeType}
          onChange={(value) => setClassTimeType(value === "Select" ? "" : value)}
          placeholder="Select"
        />

        <CustomDropdown
          options={times}
          value={classTimeValue}
          onChange={(value) => setClassTimeValue(value === "Select" ? "" : value)}
          placeholder="Select class time"
        />
      </div>

      <div className="class-search-criteria-row class-search-instructor-row">
        <label className="class-search-criteria-label">Instructor Last Name</label>
        <input
          className="class-search-instructor-input"
          value={instructorLastName}
          onChange={(e) => setInstructorLastName(e.target.value)}
          placeholder="Search..."
        />
      </div>
    </div>
  );
}
