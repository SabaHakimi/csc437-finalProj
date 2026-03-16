import { NavLink } from "react-router-dom";

export default function NavBar({ user, onLogout, darkMode, onToggleDarkMode }) {
  return (
    <header>
      <nav className="nav" aria-label="Primary navigation">
        <div>
          <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <strong>My Pantry</strong>
          </NavLink>
        </div>
        <div className="nav-links">
          {user ? (
            <>
              <NavLink to="/" end>Inventory</NavLink>
              <NavLink to="/recipes">Recipes</NavLink>
              <NavLink to="/add">Add Item</NavLink>
              <button type="button" className="nav-link logout-combo" onClick={onLogout} title="Log out">
                <span className="logout-combo-default">Hi, {user.username}!</span>
                <span className="logout-combo-hover">Log out</span>
              </button>
            </>
          ) : (
            <NavLink to="/login">Log in</NavLink>
          )}
          <button
            className="dark-mode-toggle"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>
    </header>
  );
}
