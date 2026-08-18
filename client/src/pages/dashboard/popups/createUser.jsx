import { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';

export default function CreateUser({ onValueReturn, onSetNotice }) {
    const [loader, setLoader] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [phoneError, setPhoneError] = useState(false);
    const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        full_name: "",
        user_name: "",
        user_email: "",
        user_password: "",
        user_phone: "",
        user_role: ""
    });

    useEffect(() => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.user_email)) {
            setEmailError(true);
            setEmailErrorMessage("Please enter a valid email address");
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }
        // Password Validation
        switch (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.user_password)) {
            case !/[A-Z]/.test(formData.user_password):
                setPasswordError(true);
                setPasswordErrorMessage("Password must contain at least one capital letter");
                break;
            case !/[0-9]/.test(formData.user_password):
                setPasswordError(true);
                setPasswordErrorMessage("Password must contain at least one number");
                break;
            case !/[!@#$%^&*.?/_]/.test(formData.user_password):
                setPasswordError(true);
                setPasswordErrorMessage("Password must contain at least one special character");
                break;
            case formData.user_password.length < 6:
                setPasswordError(true);
                setPasswordErrorMessage("Password must be at least 6 characters long");
                break;
            default:
                setPasswordError(false);
                setPasswordErrorMessage("");
                break;
        }
        //phone number must contain only digits
        if (!/^[0-9]{11}$/.test(formData.user_phone)) {
            setPhoneError(true);
            setPhoneErrorMessage("Phone number must contain only 11 digits");
        } else {
            setPhoneError(false);
            setPhoneErrorMessage("");
        }
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "user_email") {
            const username = value.split("@")[0];
            setFormData({
                ...formData,
                user_name: username,
                [name]: value,
            });
        }
        else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

    };

    //password toggle button icon change
    const handlePasswordToggle = () => {
        const passwordInput = document.getElementById("userPassword");
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
        if (emailError || passwordError || phoneError) {
            if (emailError) {
                if (!document.getElementById('emailErrorBox')) {
                    const emailError = document.createElement("span");
                    emailError.id = "emailErrorBox";
                    emailError.className = "text-red-500 text-sm mt-2";
                    emailError.innerText = emailErrorMessage;
                    document.getElementById("emailError").after(emailError);
                }
            } else {
                if (document.getElementById('emailErrorBox')) {
                    document.getElementById("emailErrorBox").remove();
                }
            }
            if (passwordError) {
                if (!document.getElementById('passwordErrorBox')) {
                    const passwordError = document.createElement("span");
                    passwordError.id = "passwordErrorBox";
                    passwordError.className = "text-red-500 text-sm mt-2";
                    document.getElementById("passwordError").after(passwordError);
                }
                document.getElementById("passwordErrorBox").innerText = passwordErrorMessage;
            } else {
                if (document.getElementById('passwordErrorBox')) {
                    document.getElementById("passwordErrorBox").remove();
                }
            }
            if (phoneError) {
                if (!document.getElementById('phoneErrorBox')) {
                    const phoneError = document.createElement("span");
                    phoneError.id = "phoneErrorBox";
                    phoneError.className = "text-red-500 text-sm mt-2";
                    phoneError.innerText = phoneErrorMessage;
                    document.getElementById("phoneError").after(phoneError);
                }
            }
            return;
        } else {
            if (document.getElementById('phoneErrorBox')) {
                document.getElementById("phoneErrorBox").remove();
            }
        }
        try {
            setLoader(true);
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin-register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                onValueReturn(false);
                onSetNotice({
                    type: "success",
                    message: data.message
                })
            } else {
                onSetNotice({
                    type: "error",
                    message: data.message
                })
            }
        } catch (error) {
            onSetNotice({
                type: "error",
                message: error.message
            })
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="relative w-full">
            <Typography variant="h6" component="h2" sx={{ fontWeight: "600", padding: "0 24px" }}>
                Add New User
            </Typography>
            <div className="p-6 w-full">
                <form className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="" className="text-gray-700 font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
                        <input type="text" name="full_name" onChange={handleChange} placeholder="Enter Full Name" className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div id="emailError" className="flex flex-col">
                        <label htmlFor="" className="text-gray-700 font-medium mb-1">Email <span className="text-red-500">*</span></label>
                        <input type="email" name="user_email" onChange={handleChange} placeholder="Enter email" className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div id="passwordError" className="relative flex flex-col">
                        <label htmlFor="" className="text-gray-700 font-medium mb-1">Password <span className="text-red-500">*</span></label>
                        <input id="userPassword" type="password" name="user_password" onChange={handleChange} placeholder="Enter password" className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500" />
                        <button type="button" className="absolute right-5 top-[70%] -translate-y-1/2 w-5 h-5 text-[#9499b7] transition-all duration-300 password-toggle neu-toggle" onClick={handlePasswordToggle} id="passwordToggle" aria-label="Toggle password visibility">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path></svg>
                        </button>
                    </div>
                    <div id="phoneError" className="flex flex-col">
                        <label htmlFor="" className="text-gray-700 font-medium mb-1">Phone <span className="text-red-500">*</span></label>
                        <input type="text" name="user_phone" onChange={handleChange} placeholder="Enter phone" className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="" className="text-gray-700 font-medium mb-1">Role <span className="text-red-500">*</span></label>
                        <select name="user_role" onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500">
                            <option value="">Select Role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" onClick={handleSubmit} className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500">
                        {loader ? (
                            <>
                                <span className="spinner"></span>
                            </>
                        ) : (
                            'Add User'
                        )
                        }
                    </button>
                </form>
            </div>
            {/* <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loader}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            </div> */}
        </div>
    )
}