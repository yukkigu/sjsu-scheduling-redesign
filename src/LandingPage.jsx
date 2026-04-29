import { useNavigate } from "react-router-dom";

import "./LandingPage.css";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import ListAltIcon from "@mui/icons-material/ListAlt";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function LandingPage() {
  const navigate = useNavigate();

  const classes = [
    {
      name: "User Interface Design",
      time: "TuTh 3:00pm - 4:15pm",
      location: "MacQuarrie Hall 223",
    },
    {
      name: "Topics in Cloud Computing",
      time: "TuTh 1:00pm - 2:15pm",
      location: "MacQuarrie Hall 443",
    },
    {
      name: "Biometrics in AI",
      time: "MoWe 10:00am - 11:15am",
      location: "Sweeney Hall 212",
    },
  ];

  const quickLinks = [
    "Class Search",
    "MySchedule",
    "Add/Drop Class",
    "My Academics",
    "Order Official Transcript",
  ];

  const statusItems = [
    { icon: <MailIcon />, label: "1 Unread Messages" },
    { icon: <LockIcon />, label: "No Holds" },
    { icon: <ListAltIcon />, label: "2 To Do" },
    { icon: <NotificationsIcon />, label: "1 Other Indicators" },
  ];

  return (
    <div className="landing-page">
      <Topbar />
      <main className="landing-layout">
        <Sidebar activeItem="Student Center" />

        <section className="landing-content">
          <div className="landing-shell">
            <h1 className="landing-title">John Smith's Student Center</h1>

            <div className="landing-status-row">
              {statusItems.map((item) => (
                <div key={item.label} className="landing-status-pill">
                  <span className="landing-status-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <section className="landing-academics-panel">
              <h2 className="landing-section-title">Academics</h2>

              <div className="landing-academics-grid">
                <div className="landing-schedule-card">
                  <div className="landing-schedule-header">
                    <div>Class</div>
                    <div>Time</div>
                    <div>Location</div>
                  </div>

                  <div className="landing-schedule-body">
                    {classes.map((course) => (
                      <div key={course.name} className="landing-schedule-row">
                        <div>{course.name}</div>
                        <div>{course.time}</div>
                        <div>{course.location}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="landing-links-card">
                  {quickLinks.map((link) => (
                    <button
                      key={link}
                      className="landing-link-item"
                      onClick={() => {
                        if (link === "Class Search") {
                          navigate("/class-search");
                        }
                      }}>
                      <span>{link}</span>
                      <ChevronRightIcon />
                    </button>
                  ))}
                </div>
              </div>

              <button className="landing-cart-button">
                <ShoppingCartIcon />
                <span>Enrollment Shopping Cart</span>
              </button>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
