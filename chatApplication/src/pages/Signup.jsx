import { useState } from "react";
import { useNavigate } from "react-router-dom";



const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:30001/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Signup successful! Redirecting...");
        setTimeout(() => navigate("/login"), 500);
      } else {
        setMessage(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={styles.input} />
          </div>
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        <p style={styles.redirectLink}>
          Already have an account? <a href="/login" style={styles.loginLink}>Login</a>
        </p>
        {message && <p style={styles.errorMessage}>{message}</p>}
      </div>
    </div>
  );
};

export default Signup;
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
    color: "white"
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