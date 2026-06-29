
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoticeComponents from "../components/noticComponents";

export default function RegisterForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [notice, setNotice] = useState(
        {
            type: "",
            message: ""
        }
    );
    const [formData, setformdata] = useState(
        {
            userName: "",
            userEmail: "",
            userPassword: "",
            userPhone: "",
        }
    );

    //redirect to homepage if already logged in
    useEffect(() => {
        const token = document.cookie.split(';').find(row => row.startsWith('token='));
        if(token){
            navigate('/homepage');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformdata((prev) => ({
            ...prev,
            [name]: value,
        }));
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
        // when i start typing in input fields, labels moves up slightly and font size should be small
    const handleFocus = (e) => {
        const label = e.target.parentElement.querySelector("label");
        if (label) {
            label.style.transform = "translateY(-25px)";
            label.style.fontSize = "12px";
        }
    };
    const handleBlur = (e) => {
        if (e.target.value === "") {
            const label = e.target.parentElement.querySelector("label");
            if (label) {
                label.style.transform = "translateY(-50%)";
                label.style.fontSize = "16px";
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        //form validation
        // if (!formData.user_name || !formData.user_mail || !formData.user_password || !formData.user_phone) {
        //     alert("Please fill all the fields");
        //     return;
        // }



        //email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.userEmail)) {
            document.getElementById("emailError").textContent = "Please enter a valid email address";
            document.getElementById("emailError").style.opacity = "1";
            document.getElementById("emailError").style.translate = "0";
            document.getElementById("emailError").style.borderColor = "red";
            setIsLoading(false);
            return;
        }
        else{
            document.getElementById("emailError").style.opacity = "0";
            document.getElementById("emailError").style.translate = "0";
        }
        //username length
        if (formData.userName.length < 5) {
            document.getElementById("userNameError").textContent = "Username must be at least 5 characters long";
            document.getElementById("userNameError").style.opacity = "1";
            document.getElementById("userNameError").style.translate = "0";
            document.getElementById("userNameError").style.outlineColor = "red";
            setIsLoading(false);
            return;
        }
        else{
            document.getElementById("userNameError").style.opacity = "0";
            document.getElementById("userNameError").style.translate = "0";
        }

        //phone format validation
        const phoneRegex = /^[0-9]{11}$/;
        if (!phoneRegex.test(formData.userPhone)) {
            document.getElementById("phoneError").textContent = "Please enter a valid phone number in the format XXXXXXXXXXX";
            document.getElementById("phoneError").style.opacity = "1";
            document.getElementById("phoneError").style.translate = "0";
            document.getElementById("phoneError").style.outlineColor = "red";
            setIsLoading(false);
            return;
        }
        else{
            document.getElementById("phoneError").style.opacity = "0";
            document.getElementById("phoneError").style.translate = "0";
        }
        //minimum length of password and only must mix of letters and numbers and 1 cacpital and 1 special character
        if (formData.userPassword.length < 6) {
            document.getElementById("passwordError").textContent = "Password must be at least 6 characters long";
            document.getElementById("passwordError").style.opacity = "1";
            document.getElementById("passwordError").style.translate = "0";
            document.getElementById("passwordError").style.outlineColor = "red";
            setIsLoading(false);
            return;
        }
        else{
            document.getElementById("passwordError").   style.opacity = "0";
            document.getElementById("passwordError").style.translate = "0";
        }
        if (!/^[a-zA-Z0-9]+$/.test(formData.userPassword)) {
            if (!/[A-Z]/.test(formData.userPassword)) {
                document.getElementById("passwordError").textContent = "Password must contain at least one capital letter";
                document.getElementById("passwordError").style.opacity = "1";
                document.getElementById("passwordError").style.translate = "0";
                document.getElementById("passwordError").style.outlineColor = "red";
                setIsLoading(false);
                return;
            }
            if (!/[0-9]/.test(formData.userPassword)) {
                document.getElementById("passwordError").textContent = "Password must contain at least one number";
                document.getElementById("passwordError").style.opacity = "1";
                document.getElementById("passwordError").style.translate = "0";
                document.getElementById("passwordError").style.outlineColor = "red";
                setIsLoading(false);
                return;
            }
            if (!/[!@#$%^&*]/.test(formData.userPassword)) {
                document.getElementById("passwordError").textContent = "Password must contain at least one special character";
                document.getElementById("passwordError").style.opacity = "1";
                document.getElementById("passwordError").style.translate = "0";
                document.getElementById("passwordError").style.outlineColor = "red";
                setIsLoading(false);
                return;
            }
            document.getElementById("passwordError").textContent = "Password must contain only letters and numbers and 1 cacpital and 1 special character";
            document.getElementById("passwordError").style.opacity = "1";
            document.getElementById("passwordError").style.translate = "0";
            document.getElementById("passwordError").style.outlineColor = "red";
            setIsLoading(false);
            return;
        }
        else{
            document.getElementById("passwordError").style.opacity = "0";
            document.getElementById("passwordError").style.translate = "0";
        }

        //phone number must contain only digits
        if (!/^[0-9]+$/.test(formData.userPhone)) {
            document.getElementById("phoneError").textContent = "Phone number must contain only digits";
            document.getElementById("phoneError").style.opacity = "1";
            document.getElementById("phoneError").style.translate = "0";
            document.getElementById("phoneError").style.outlineColor = "red";
            setIsLoading(false);
            return;
        }else{
            document.getElementById("phoneError").style.opacity = "0";
            document.getElementById("phoneError").style.translate = "0";
        } 
        try {
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_name: formData.userName,
                    user_mail: formData.userEmail,
                    user_password: formData.userPassword,
                    user_phone: formData.userPhone
                }),
            });
            const result = await response.json();
            if (response.ok) {
                setNotice({
                    type: "success",
                    message: result.message
                });
                setformdata({
                    userName: "",
                    userEmail: "",
                    userPassword: "",
                    userPhone: "",
                });
                setTimeout(()=>{
                    navigate('/login');  
                },2000);
            }else if(result.status === 'error'){
                setNotice({
                    type: "error",
                    message: result.message
                });
            }else if(result.status === 'unauthorize'){
                setNotice({
                    type: "error",
                    message: result.message
                });
            }else if(result.status === 'internal_server_error'){
                setNotice({
                    type: "warning",
                    message: result.message
                });
            }
        } catch (error) {
            setNotice({
                type: "warning",
                message: error.message
            });
            console.error('Error registering node:', error);
        } finally{
            setIsLoading(false);
        }
    }
    return (
        <div className="w-full max-w-[420px] lg:max-w-[750px]  my-20 mx-4">
            <div className="relative bg-[#e0e5ec] rounded-[30px] px-10 py-[50px] transition-all duration-300 shadow-[20px_20px_60px_rgb(190,195,207),-20px_-20px_60px_rgb(255,255,255)]">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 rounded-full bg-[#e0e5ec] transition-all duration-300 shadow-[8px_8px_20px_rgb(190,195,207),-8px_-8px_20px_rgb(255,255,255),inset_0_0_0_rgb(190,195,207),inset_0_0_0_rgb(255,255,255)] hover:shadow-[4px_4px_10px_rgb(190,195,207),-4px_-4px_10px_rgb(255,255,255),4px_4px_10px_rgb(190,195,207)_inset,-4px_-4px_10px_rgb(255,255,255)_inset]">
                        <div className="w-10 h-10 flex items-center justify-center text-[#6c7293]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                    </div>
                    <NoticeComponents notice={notice} setNotice={setNotice} />
                    <h2 className="text-[#3d4468] text-[2rem] font-semibold mb-2">Create Account</h2>
                    <p className="text-[#9499b7] text-[15px] font-normal">Please create an account to continue</p>
                </div>
                <form className="register-form" onSubmit={handleSubmit}>
                    {/* //Email input box */}
                    <div className="mb-7 relative">
                        <div className="relative bg-[#e0e5ec] rounded-[15px] transition-all duration-300 shadow-[inset_8px_8px_16px_rgb(190,195,207),inset_-8px_-8px_16px_rgb(255,255,255)] hover:shadow-[4px_4px_10px_rgb(190,195,207),-4px_-4px_10px_rgb(255,255,255),4px_4px_10px_rgb(190,195,207)_inset,-4px_-4px_10px_rgb(255,255,255)_inset] ">
                            <input type="text" id="userEmail" name="userEmail" required="" autocomplete="email" placeholder=" " onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} className="w-full bg-transparent border-0 outline-none text-[#3d4468] text-[16px] font-medium py-5 pl-[55px] pr-6 transition-all duration-300" />
                            <label htmlFor="userEmail" className="absolute left-[55px] top-1/2 -translate-y-1/2 text-[#9499b7] text-[16px] font-normal pointer-events-none transition-all duration-300" >Email address</label>
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9499b7] transition-all duration-300">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </div>
                        </div>
                        <span className="emailerror text-[#ff3b5c] text-[12px] font-medium mt-2 ml-5 opacity-0 -translate-y-2.5 transition-all duration-300" id="emailError">Email address is required</span>
                    </div>

                    {/* //Username input box */}
                    <div className="mb-7 relative">
                        <div className="relative bg-[#e0e5ec] rounded-[15px] transition-all duration-300 shadow-[inset_8px_8px_16px_rgb(190,195,207),inset_-8px_-8px_16px_rgb(255,255,255)] hover:shadow-[4px_4px_10px_rgb(190,195,207),-4px_-4px_10px_rgb(255,255,255),4px_4px_10px_rgb(190,195,207)_inset,-4px_-4px_10px_rgb(255,255,255)_inset]">
                            <input type="text" id="userName" name="userName" required="" placeholder=" " onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} className="w-full bg-transparent border-0 outline-none text-[#3d4468] text-[16px] font-medium py-5 pl-[55px] pr-6 transition-all duration-300" />
                            <label className="absolute left-[55px] top-1/2 -translate-y-1/2 text-[#9499b7] text-[16px] font-normal pointer-events-none transition-all duration-300" for="userName" >Username</label>
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9499b7] transition-all duration-300">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                        </div>
                        <span className="usererror text-[#ff3b5c] text-[12px] font-medium mt-2 ml-5 opacity-0 -translate-y-2.5 transition-all duration-300" id="userNameError">Username is required</span>
                    </div>
                    {/* Phone Number input box */}
                    <div className="mb-7 relative">
                        <div className="relative bg-[#e0e5ec] rounded-[15px] transition-all duration-300 shadow-[inset_8px_8px_16px_rgb(190,195,207),inset_-8px_-8px_16px_rgb(255,255,255)] hover:shadow-[4px_4px_10px_rgb(190,195,207),-4px_-4px_10px_rgb(255,255,255),4px_4px_10px_rgb(190,195,207)_inset,-4px_-4px_10px_rgb(255,255,255)_inset]">
                            <input  type="text" id="userPhone" name="userPhone" required="" autocomplete="phone" placeholder=" " onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} className="w-full bg-transparent border-0 outline-none text-[#3d4468] text-[16px] font-medium py-5 pl-[55px] pr-6 transition-all duration-300"/>
                            <label className="absolute left-[55px] top-1/2 -translate-y-1/2 text-[#9499b7] text-[16px] font-normal pointer-events-none transition-all duration-300" for="userPhone">Phone Number</label>
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9499b7] transition-all duration-300">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6.06-6.06 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-.85a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                            </div>
                        </div>
                        <span className=" text-[#ff3b5c] text-[12px] font-medium mt-2 ml-5 opacity-0 -translate-y-2.5 transition-all duration-300" id="phoneError">Phone number is required</span>
                    </div>

                    {/* Password input box */}
                    <div className="mb-7 relative">
                        <div className="relative bg-[#e0e5ec] rounded-[15px] transition-all duration-300 shadow-[inset_8px_8px_16px_rgb(190,195,207),inset_-8px_-8px_16px_rgb(255,255,255)] hover:shadow-[4px_4px_10px_rgb(190,195,207),-4px_-4px_10px_rgb(255,255,255),4px_4px_10px_rgb(190,195,207)_inset,-4px_-4px_10px_rgb(255,255,255)_inset]">
                            <input  type="password" id="userPassword" name="userPassword" required="" autocomplete="current-password" placeholder=" " onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}  className="w-full bg-transparent border-0 outline-none text-[#3d4468] text-[16px] font-medium py-5 pl-[55px] pr-6 transition-all duration-300"/>
                            <label className="absolute left-[55px] top-1/2 -translate-y-1/2 text-[#9499b7] text-[16px] font-normal pointer-events-none transition-all duration-300" for="password">Password</label>
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9499b7] transition-all duration-300">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                                </svg>
                            </div>
                            <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9499b7] transition-all duration-300 password-toggle neu-toggle" onClick={handlePasswordToggle} id="passwordToggle" aria-label="Toggle password visibility">                                
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path></svg>
                            </button>   
                        </div>
                        <span  className=" text-[#ff3b5c] text-[12px] font-medium mt-2 ml-5 opacity-0 -translate-y-2.5 transition-all duration-300" id="passwordError"></span>
                    </div>
                    <button type="submit" className="w-full text-[#3d4468] text-[16px] font-semibold cursor-pointer relative mb-7 bg-[#e0e5ec] border-0 rounded-[15px] px-8 py-[18px] overflow-hidden transition-all duration-300 shadow-[8px_8px_20px_rgb(190,195,207),-8px_-8px_20px_rgb(255,255,255)] hover:shadow-[4px_4px_10px_rgb(190,195,207),-4px_-4px_10px_rgb(255,255,255),4px_4px_10px_rgb(190,195,207)_inset,-4px_-4px_10px_rgb(255,255,255)_inset]" onSubmit={handleSubmit}>
                        {isLoading ? (
                            <>
                            <span className="spinner"></span>
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>
                <div className="flex items-center my-7 gap-4">
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[rgb(190,195,207)] to-transparent"></div>
                    <span className="text-[#9499b7] text-[13px] font-medium uppercase tracking-[1px]">or continue with</span>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[rgb(190,195,207)] to-transparent"></div>
                </div>
                <div className="flex justify-center mb-7 gap-4">
                    <button type="button" className="social-btn w-[50px] h-[50px] cursor-pointer flex items-center justify-center text-[#6c7293] bg-[#e0e5ec] border-0 rounded-[15px] transition-all duration-300 shadow-[6px_6px_15px_rgb(190,195,207),-6px_-6px_15px_rgb(255,255,255)] hover:shadow-[4px_4px_10px_rgb(190,195,207),-4px_-4px_10px_rgb(255,255,255),4px_4px_10px_rgb(190,195,207)_inset,-4px_-4px_10px_rgb(255,255,255)_inset]">
                        <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
                        </svg>
                    </button>
                    <button type="button" className="social-btn w-[50px] h-[50px] cursor-pointer flex items-center justify-center text-[#6c7293] bg-[#e0e5ec] border-0 rounded-[15px] transition-all duration-300 shadow-[6px_6px_15px_rgb(190,195,207),-6px_-6px_15px_rgb(255,255,255)] hover:shadow-[4px_4px_10px_rgb(190,195,207),-4px_-4px_10px_rgb(255,255,255),4px_4px_10px_rgb(190,195,207)_inset,-4px_-4px_10px_rgb(255,255,255)_inset]">
                        <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                        </svg>
                    </button>
                    <button type="button" className="social-btn w-[50px] h-[50px] cursor-pointer flex items-center justify-center text-[#6c7293] bg-[#e0e5ec] border-0 rounded-[15px] transition-all duration-300 shadow-[6px_6px_15px_rgb(190,195,207),-6px_-6px_15px_rgb(255,255,255)] hover:shadow-[4px_4px_10px_rgb(190,195,207),-4px_-4px_10px_rgb(255,255,255),4px_4px_10px_rgb(190,195,207)_inset,-4px_-4px_10px_rgb(255,255,255)_inset]">
                        <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                        </svg>
                    </button>
                </div>
                <div className="text-center">
                    <p className="text-[#9499b7] text-[14px]">Already have an account? <a className="text-[#6c7293] font-semibold no-underline transition-colors duration-300 hover:text-[#3d4468]" href="/login">Sign in</a></p>
                </div>
                <div className="hidden text-center opacity-0 translate-y-5 p-10 transition-all duration-500" id="successMessage">
                    <div className="sw-20 h-20 flex items-center justify-center mx-auto mb-5 text-[#00c896] bg-[#e0e5ec] rounded-full transition-all duration-300 shadow-[8px_8px_20px_rgb(190,195,207),-8px_-8px_20px_rgb(255,255,255),inset_0_0_0_rgb(190,195,207),inset_0_0_0_rgb(255,255,255)]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h3 className="text-[#3d4468] text-[1.5rem] mb-2">Success!</h3>
                    <p className="text-[#9499b7] text-[14px]">Redirecting to your dashboard...</p>
                </div>
            </div>
        </div>
    );
}