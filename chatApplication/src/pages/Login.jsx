import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:30001/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const result = await response.json();
      console.log(result);
      const userId = result.userId;
      if (response.ok) {
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/profile", { state: { userId } }), 2000);
      } else {
        setMessage(result.message || "Invalid credentials. Try again.");
      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-heading">Login to Your Account</h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-button">
            Login
          </button>
        </form>

        {/* Signup Redirect */}
        <p className="signup-redirect">
          Don't have an account?{" "}
          <a href="/signup" className="signup-link">Sign Up</a>
        </p>

        {/* Message Display */}
        {message && <p className="error-message">{message}</p>}
      </div>

      {/* Inline CSS */}
      <style>
        {`
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #2d3748;
          }

          .login-card {
            width: 100%;
            max-width: 400px;
            background-color: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .login-heading {
            text-align: center;
            font-size: 24px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 16px;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-group label {
            display: block;
            font-size: 14px;
            color: #4a5568;
          }

          .input-field {
            width: 100%;
            padding: 12px;
            border: 1px solid #cbd5e0;
            border-radius: 4px;
            font-size: 14px;
            color: #2d3748;
            margin-top: 8px;
          }

          .input-field:focus {
            border-color: #63b3ed;
            outline: none;
          }

          .submit-button {
            width: 100%;
            padding: 12px;
            background-color: #3182ce;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
          }

          .submit-button:hover {
            background-color: #2b6cb0;
          }

          .signup-redirect {
            text-align: center;
            font-size: 14px;
            color: #4a5568;
            margin-top: 16px;
          }

          .signup-link {
            color: #3182ce;
            text-decoration: none;
          }

          .signup-link:hover {
            text-decoration: underline;
          }

          .error-message {
            text-align: center;
            margin-top: 12px;
            color: #e53e3e;
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
