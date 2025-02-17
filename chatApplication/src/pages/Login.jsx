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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login to Your Account</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Login
          </button>
        </form>

        <p style={styles.redirectLink}>
          Don't have an account? <a href="/signup" style={styles.loginLink}>Sign Up</a>
        </p>

        {message && <p style={styles.errorMessage}>{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
const styles = {
  container: {
    backgroundColor: "#1f2937",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "1.5rem",
  },
  card: {
    backgroundColor: "#2d3748",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "1rem",
    color:"white"
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    color: "#fff",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#3182ce",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#2b6cb0",
  },
  redirectLink: {
    textAlign: "center",
    fontSize: "14px",
    color: "#bbb",
    marginTop: "15px",
  },
  loginLink: {
    color: "#63b3ed",
    textDecoration: "none",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginTop: "20px",
  },
};