import { useState, useId } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const usernameId = useId();
  const passwordId = useId();

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) return;

    onLogin({ name: username.trim() });
    navigate("/");
  }

  return (
    <main>
      <div className="login-container">
        <h1>Welcome to My Pantry</h1>
        <p className="user-info">Sign in to manage your pantry inventory.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor={usernameId}>Username</label>
          <input
            id={usernameId}
            type="text"
            placeholder="e.g. Tom"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />

          <label htmlFor={passwordId}>Password</label>
          <input
            id={passwordId}
            type="password"
            placeholder="Any password works"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button type="submit">Log In</button>
        </form>
      </div>
    </main>
  );
}
