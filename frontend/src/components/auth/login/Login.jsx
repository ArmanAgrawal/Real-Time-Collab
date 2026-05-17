import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/slices/AuthSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLoginBtn from "../GoogleLoginBtn";
import "./login.css";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(loginUser({ email, password }));

    if (res.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="login-input"
            placeholder="Email"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="login-error">{JSON.stringify(error)}</p>}

        <hr />

        <h3 className="google-title">Login with Google</h3>
        <GoogleLoginBtn />
      </div>
    </div>
  );
};

export default Login;