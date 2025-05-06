import "./LoginForm.css";
import { useState } from "react";
import { useUser } from "@/utils/UserContext";

function LoginForm() {
  const { login, setIsSigningUp } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    login(username, password);
  }

  return (
    <div className="pokedex-login-shell">
      <div className="pokedex-login-screen">
        <h2>Trainer Login</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <input type="submit" hidden />
        </form>
      </div>
      <div className="login-buttons">
        <button type="submit" onClick={handleSubmit}>
          Start
        </button>
        <br />
        <span>Don't have a user?</span>
        <br />
        <span
          onClick={() => {
            setIsSigningUp(true);
          }}
        >
          Sign up
        </span>
      </div>
    </div>
  );
}

export default LoginForm;
