import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  BarChart2,
  Flame,
  ChevronLeft,
  ChevronRight,
  Zap
} from "lucide-react";
import "../styles/sidebar.css";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/analytics", icon: BarChart2,       label: "Analytics"  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Zap size={18} color="#fff" />
          </div>
          <span className="logo-text">HabitForge</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <span className="nav-label">Menu</span>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon className="nav-icon" size={18} />
              <span className="nav-text">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / Collapse Toggle */}
        <div className="sidebar-footer">
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>
    </>
  );
}
