import "./Topbar.css";
import PersonIcon from "@mui/icons-material/Person";

export default function Topbar() {
  return (
    <div className="topbar-header">
      <div className="topbar-header-inner">
        <div className="topbar-logo">
          <div className="topbar-logo-text">SJSU</div>
          <div className="topbar-logo-subtext">
            <div>SAN JOSE STATE</div>
            <div>UNIVERSITY</div>
          </div>
        </div>
        <div className="topbar-user">
          <PersonIcon />
          <span>John Smith</span>
        </div>
      </div>
    </div>
  );
}
