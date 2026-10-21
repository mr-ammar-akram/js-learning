import React from "react";
import { Mail, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import NoticeComponents from "../../components/noticComponents";
import '../../../index.css';


export default function AdminLogin() {

  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [setCookie] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState({
    type: "",
    message: ""
  });

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith(`token=`))
      ?.split('=')[1];
    if (token != null) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    user_email_phone: "",
    user_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChecked = () => {
    setChecked(!checked);
  }
  //password toggle button icon change
  const handlePasswordToggle = () => {
    const passwordInput = document.getElementById("admin_password");
    const passwordToggle = document.getElementById("passwordToggle");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      passwordToggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    } else {
      passwordInput.type = "password";
      passwordToggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path></svg>`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // email validation
    if (!formData.user_email_phone) {
      if (!document.getElementById("emailErrorBox")) {
        const errorDiv = document.createElement("span");
        errorDiv.className = "text-red-500 text-sm";
        errorDiv.id = "emailErrorBox";
        errorDiv.textContent = "Please enter your email or phone number";
        document.getElementById("emailError").after(errorDiv);
      }
      return;
    } else {
      if (document.getElementById("emailErrorBox")) {
        document.getElementById("emailErrorBox").remove();
      }
    }
    //password validation
    if (!formData.user_password) {
      if (!document.getElementById("passwordErrorBox")) {
        const errorDiv = document.createElement("span");
        errorDiv.className = "text-red-500 text-sm";
        errorDiv.id = "passwordErrorBox";
        errorDiv.textContent = "Please enter your password";
        document.getElementById("passwordError").after(errorDiv);
      }
      return;
    } else {
      if (document.getElementById("passwordErrorBox")) {
        document.getElementById("passwordErrorBox").remove();
      }
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_HOST_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        //set token to cookies for session
        const token = data.data.token;
        //if checked cookies maxAge = 1h else 2h
        const maxAge = checked ? 3600 : 7200;
        setCookie("token", token, {
          path: "/",
          maxAge: maxAge,
          secure: true,
          sameSite: "Lax",
        });
        setNotice({
          type: "success",
          message: data.message
        });
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      } else {
        setNotice({
          type: data.status === 'unauthorize' || data.status === 'error' ? 'error' : 'warning',
          message: data.message
        });
      }
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full py-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
            B
          </div>
          <NoticeComponents notice={notice} setNotice={setNotice} />
          <h1 className="mt-5 text-3xl font-bold text-gray-800">
            Admin Login
          </h1>

          <p className="mt-2 text-gray-500">
            Sign in to access the dashboard
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div id="emailError" className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="admin_email_phone"
                name="user_email_phone"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <div id="passwordError" className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                required
              />

              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                id="admin_password"
                name="user_password"
              />
            </div>

            <button type="button" className="absolute right-5 top-[70%] -translate-y-1/2 w-5 h-5 text-[#9499b7] transition-all duration-300 password-toggle neu-toggle" onClick={handlePasswordToggle} id="passwordToggle" aria-label="Toggle password visibility">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path></svg>
            </button>
          </div>

          {/* Remember */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input onClick={handleChecked} type="checkbox" />
              Remember Me
            </label>

            <button
              type="button"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-orange-500 hover:bg-blue-700 text-white font-semibold transition"
            onClick={handleSubmit}
          > {
              isLoading ? (
                <>
                  <span className="spinner"></span>
                </>
              ) : (
                'Sign In'
              )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          © 2026 Book Management System
        </div>
      </div>
    </div>
  );
}