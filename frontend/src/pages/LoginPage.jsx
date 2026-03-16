import { useState, useId } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const usernameId = useId();
  const passwordId = useId();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setError("");
    try {
      let data;
      if (isRegistering) {
        data = await api.register(username.trim(), password);
      } else {
        data = await api.login(username.trim(), password);
      }
      onLogin(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="login-container">
        <h1>Welcome to My Pantry</h1>
        <p className="user-info">
          {isRegistering ? "Create an account" : "Sign in"} to manage your pantry inventory.
        </p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message" style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
          <label htmlFor={usernameId}>Username</label>
          <input
            id={usernameId}
            type="text"
            placeholder="e.g. Tom"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            disabled={loading}
          />

          <label htmlFor={passwordId}>Password</label>
          <input
            id={passwordId}
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isRegistering ? "new-password" : "current-password"}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : (isRegistering ? "Register" : "Log In")}
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            className="link-button" 
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ background: "none", border: "none", color: "var(--primary-color)", cursor: "pointer", textDecoration: "underline", padding: 0 }}
          >
            {isRegistering ? "Log In" : "Register"}
          </button>
        </p>
      </div>
    </main>
  );
}
