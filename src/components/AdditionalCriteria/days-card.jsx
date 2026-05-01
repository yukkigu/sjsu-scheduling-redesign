import "./days-card.css";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export default function DaysCard({ selectedDays, setSelectedDays }) {
  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };
  return (
    <>
      {daysOfWeek.map((day) => (
        <label key={day} className="class-search-checkbox-item">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={selectedDays.includes(day)}
              onChange={() => toggleDay(day)}
            />
            <span className="checkmark"></span>
            <span>{day}</span>
          </label>
        </label>
      ))}
    </>
  );
}
