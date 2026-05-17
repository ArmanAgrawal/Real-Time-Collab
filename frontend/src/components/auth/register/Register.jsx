import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/slices/AuthSlice";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './register.css'
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await dispatch(
      registerUser({
        email: form.email,
        username: form.username,
        password: form.password,
        password2: form.confirmPassword,
        first_name: form.first_name,
        last_name: form.last_name,
        
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      alert("Registration successful");
      navigate("/login");
    }
  };

  return (  
  <div className="register-page">
    <div className="register-card">
      <h2 className="register-title">Register</h2>

      <form onSubmit={handleSubmit} className="register-form">
        <input
          className="register-input"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
        />

        <input
          className="register-input"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
        />

        <input
          className="register-input"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          className="register-input"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          className="register-input"
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          className="register-input"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button className="register-btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        {error && (
          <p className="register-error">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
        )}

        <p className="register-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  </div>
);
};

export default Register;
