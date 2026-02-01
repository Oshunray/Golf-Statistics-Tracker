import { signUp, login, logOut, saveUserProfile} from "./auth";
import { useState } from "react";

export function SignUpButton({ closeSignUp, loginFromSignUp }) {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    dob: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    setLoading(true);

    try {
      if (!profile.email || !profile.password) {
        throw new Error("Email and password are required.");
      }

      const userCredential = await signUp(profile.email, profile.password);
      const user = userCredential.user;
      const { password, ...profileWithoutPassword } = profile;

      await saveUserProfile(user.uid, {
        ...profileWithoutPassword,
        rounds: []
      });

      closeSignUp();
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-modal">
      <div>
        <h2>Sign Up</h2>

        <label>First Name</label>
        <input
          type="text"
          value={profile.firstName}
          onChange={(e) =>
            setProfile({ ...profile, firstName: e.target.value })
          }
        />

        <label>Last Name</label>
        <input
          type="text"
          value={profile.lastName}
          onChange={(e) =>
            setProfile({ ...profile, lastName: e.target.value })
          }
        />

        <label>Username</label>
        <input
          type="text"
          value={profile.username}
          onChange={(e) =>
            setProfile({ ...profile, username: e.target.value })
          }
        />

        <label>Date of Birth</label>
        <input
          type="date"
          value={profile.dob}
          onChange={(e) =>
            setProfile({ ...profile, dob: e.target.value })
          }
        />

        <label>Email</label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) =>
            setProfile({ ...profile, email: e.target.value })
          }
        />

        <label>Password</label>
        <input
          type="password"
          value={profile.password}
          onChange={(e) =>
            setProfile({ ...profile, password: e.target.value })
          }
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={closeSignUp} disabled={loading}>
          Cancel
        </button>
        <button onClick={handleSave} disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <button onClick={loginFromSignUp}>Already have an account? Log In</button>
      </div>
    </div>
  );
}

export function LoginButton({closeLogin, signUpFromLogin}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    
    try {
      await login(email, password);
      closeLogin();
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal">
      <div>
        <h2>Log In</h2>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={closeLogin} disabled={loading}>
          Cancel
        </button>
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging In..." : "Log In"}
        </button>

        <button onClick={signUpFromLogin}>Don't have an account? Sign Up</button>
      </div>
    </div>
  );
}

export function LogOutUser({closeLogOut}) {
  const handleLogOut = async () => {
    try {
      await logOut();
      console.log("User logged out");
      closeLogOut();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="logout-modal">
      <div>
        <h3>Are you sure you want to log out?</h3>
        <button onClick={handleLogOut}>Log Out</button>
        <button onClick={closeLogOut}>Cancel</button>
      </div>
    </div>
  );
}