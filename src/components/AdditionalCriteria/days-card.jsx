import "./days-card.css";

export default function DaysCard() {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return (
    <>
      {daysOfWeek.map((day) => (
        <label className="class-search-checkbox-item checkbox">
          <input type="checkbox" />
          <span className="checkmark"></span>
          <span>{day}</span>
        </label>
      ))}
    </>
  );
}
