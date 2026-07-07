import React from "react";
import { useState } from "react";
import { User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NoticeComponents from "../../components/noticComponents";


export default function AdminRegister() {
    const [formData, setFormData] = useState({
        user_email: "",
        user_password: "",
        user_role: "admin",
        user_name: ""
    });
    const [notice, setNotice] = useState({
            type: "",
            message: "",
            action: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === "user_email"){
          const username = value.split("@")[0];
          setFormData((prev) => ({
            ...prev,
            user_name: username,
            [name]: value,
          }));
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    
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
        
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.user_email)) {
        if(!document.getElementById('emailErrorBox')){
            const emailError = document.createElement("span");
            emailError.id = "emailErrorBox";
            emailError.className = "text-red-500 text-sm mt-2";
            emailError.innerText = "Please enter a valid email address";
            document.getElementById("emailError").after(emailError);
        }
        setIsLoading(false);
        return;
    }else {
        if(document.getElementById('emailErrorBox')){
            document.getElementById('emailErrorBox').remove();
        }
    }
    if (!/^[a-zA-Z0-9]+$/.test(formData.user_password)) {
        if (!/[A-Z]/.test(formData.user_password)) {
            if(!document.getElementById('passwordErrorBox')){
                const passwordError = document.createElement("span");
                passwordError.id = "passwordErrorBox";
                passwordError.className = "text-red-500 text-sm mt-2";
                passwordError.innerText = "Password must contain at least one capital letter";
                document.getElementById("passwordError").after(passwordError);
            }
            setIsLoading(false);
            return;
        }
        if (!/[0-9]/.test(formData.user_password)) {
            if(!document.getElementById('passwordErrorBox')){
                const passwordError = document.createElement("span");
                passwordError.id = "passwordErrorBox";
                passwordError.className = "text-red-500 text-sm mt-2";
                passwordError.innerText = "Password must contain at least one number";
                document.getElementById("passwordError").after(passwordError);
            }
            setIsLoading(false);
            return;
        }
        if (!/[!@#$%^&*]/.test(formData.user_password)) {
            if(!document.getElementById('passwordErrorBox')){
                const passwordError = document.createElement("span");
                passwordError.id = "passwordErrorBox";
                passwordError.className = "text-red-500 text-sm mt-2";
                passwordError.innerText = "Password must contain at least one special character";
                document.getElementById("passwordError").after(passwordError);
            }
            setIsLoading(false);
            return;
        }
    } else {
        if(document.getElementById('passwordErrorBox')){
            document.getElementById('passwordErrorBox').remove();
        }
    }
        try{
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin-register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.status === "success") {
                setNotice({
                    type: "success",
                    message: data.message + " Click the button below to sign in.",
                    action: <a className="text-blue-600 hover:text-blue-700" href={`/ds-admin/login`}><b><u>Sign In</u></b></a>  
                });
                document.getElementById("box-hide").style.display = "none";
            }else{
                setNotice({
                    type: "error",
                    message: data.message
                });
                setIsLoading(false);
            }
        }catch(error){
            setNotice({
                type: "error",
                message: "Something went wrong"
            });
            setIsLoading(false);
        }
    };

    return(
    <div className="w-full py-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            B
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-800">
            Initial Setup
          </h1>

          <p className="mt-2 text-gray-500">
            Setup your admin account to get started
          </p>
        </div>
        <NoticeComponents notice={notice} setNotice={setNotice} />
        <div id="box-hide">
            {/* Form */}
            <form className="space-y-5">
              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <div id="emailError" className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    placeholder="admin@example.com"
                    className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="user_email"
                    name="user_email"
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

              <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9499b7] transition-all duration-300 password-toggle neu-toggle" onClick={handlePasswordToggle} id="passwordToggle" aria-label="Toggle password visibility">                                
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path></svg>
              </button>
            </div>
            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              onClick={handleSubmit}
            > {
              isLoading ? (
                              <>
                              <span className="spinner"></span>
                              </>
                          ) : (
                              'Sign Up'
                          )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          © 2026 Book Management System
        </div>
      </div>
    </div>
  );
}
