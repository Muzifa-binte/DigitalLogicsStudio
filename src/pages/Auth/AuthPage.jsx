import React from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../Home/Navbar";
import Footer from "../Home/Footer";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getInitialForm(mode) {
  if (mode === "signup") {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  }

  return {
    email: "",
    password: "",
  };
}

function validateForm(mode, values) {
  if (mode === "signup") {
    if (!values.name.trim()) {
      return "Please enter your full name.";
    }

    if (values.name.trim().length < 2) {
      return "Name must be at least 2 characters long.";
    }
  }

  if (!values.email.trim()) {
    return "Please enter your email address.";
  }

  if (!emailPattern.test(values.email.trim())) {
    return "Please enter a valid email address.";
  }

  if (!values.password) {
    return "Please enter your password.";
  }

  if (values.password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (mode === "signup" && values.password !== values.confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
}

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const [formValues, setFormValues] = React.useState(() => getInitialForm(mode));
  const [formError, setFormError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const { isAuthenticated, isLoading, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  if (!isLoading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm(mode, formValues);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignup) {
        const registeredUser = await register({
          name: formValues.name.trim(),
          email: formValues.email.trim().toLowerCase(),
          password: formValues.password,
        });
        navigate(redirectTo, {
          replace: true,
          state: {
            authMessage: `Welcome, ${registeredUser.name}. Your account has been created successfully.`,
          },
        });
      } else {
        const loggedInUser = await login({
          email: formValues.email.trim().toLowerCase(),
          password: formValues.password,
        });
        navigate(redirectTo, {
          replace: true,
          state: {
            authMessage: `Welcome back, ${loggedInUser.name}.`,
          },
        });
      }
    } catch (error) {
      if (!error.response) {
        setFormError(
          "Cannot reach the backend server right now. Make sure the backend is running on port 5000.",
        );
      } else {
        setFormError(
          error.response?.data?.message ||
            `Unable to ${isSignup ? "create your account" : "log you in"} right now.`,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-shell">
      <div className="grid-background" />
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <main className="auth-main">
        <section className="auth-panel">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>{isSignup ? "Sign Up" : "Login"}</h2>
              <p>
                {isSignup
                  ? "Create an account using your name, email, and password."
                  : "Enter your email and password to access your account."}
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {isSignup && (
                <label className="auth-field">
                  <span>Full Name</span>
                  <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    autoComplete="name"
                    placeholder="Muhammad Saad"
                  />
                </label>
              )}

              <label className="auth-field">
                <span>Email Address</span>
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </label>

              <label className="auth-field">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  placeholder="At least 8 characters"
                />
              </label>

              {isSignup && (
                <label className="auth-field">
                  <span>Confirm Password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                  />
                </label>
              )}

              {formError ? <p className="auth-error">{formError}</p> : null}

              <button
                type="submit"
                className="auth-submit"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting
                  ? isSignup
                    ? "Creating account..."
                    : "Logging in..."
                  : isSignup
                    ? "Create Account"
                    : "Login"}
              </button>
            </form>

            <p className="auth-switch-copy">
              {isSignup ? "Already have an account?" : "Need an account?"}{" "}
              <Link to={isSignup ? "/login" : "/signup"}>
                {isSignup ? "Login here" : "Sign up here"}
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
