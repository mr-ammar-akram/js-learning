import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import NoticeComponents from "../components/noticComponents";

import '../../index.css';

export default function LoginForm() {

    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(true);
    const [cookie, setCookie, removeCookie] = useCookies();
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
            navigate("/homepage");
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        user_email_phone:"",
        user_password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    //password toggle button icon change
    const handlePasswordToggle = () => {
        const passwordInput = document.getElementById("user_password");
        const passwordToggle = document.getElementById("passwordToggle");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            passwordToggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        } else {
            passwordInput.type = "password";
            passwordToggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path></svg>`;
        }
    };

    
    //onchecked opacity and scale of svg is 1
    const handleCheckboxClick = () => {
        const svg = document.getElementById("checkboxSvg");
        setIsChecked(!isChecked);
        updateCheckBoxStyles(svg,isChecked);
    };
    const updateCheckBoxStyles = (svg, isChecked) => {
        if (isChecked) {
            svg.style.opacity = "1";
            svg.style.transform = "scale(1)";
        } else {
            svg.style.opacity = "0";
            svg.style.transform = "scale(0)";
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
        //make suree fields are not empty
        if (!formData.user_email_phone || !formData.user_password) {
            //Show error message on the emailPhoneError and error_box class with red color
            document.getElementsByClassName("emailPhoneError")[0].style.opacity = "1";
            document.getElementsByClassName("emailPhoneError")[0].style.transform = "translateY(-25px)";
            document.getElementsByClassName("error_box")[0].style.opacity = "1";
            document.getElementsByClassName("error_box")[0].style.transform = "translateY(-25px)";
            return;
        }else{
            //remove the error message on the emailPhoneError and error_box class with red color
            document.getElementsByClassName("emailPhoneError")[0].style.opacity = "0";
            document.getElementsByClassName("emailPhoneError")[0].style.transform = "translateY(0)";
            document.getElementsByClassName("error_box")[0].style.opacity = "0";
            document.getElementsByClassName("error_box")[0].style.transform = "translateY(0)";
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_email_phone: formData.user_email_phone,
                    user_password: formData.user_password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                //set token to cookies for session
                const token = data.data.token;
                //if checked cookies maxAge = 2h else 15 min
                const maxAge = isChecked ? 3600 : 7200;
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
                setTimeout(()=>{
                    navigate('/homepage');  
                },2000);
                }else{
                    if(data.status === 'unauthorize'){
                        setNotice({
                            type: "error",
                            message: data.message
                        });
                    }
                    else if(data.status === 'error'){
                        setNotice({
                            type: "error",
                            message: data.message
                        });
                    }else if(data.status === 'internal_server_error'){
                        setNotice({
                            type: "warning",
                            message: data.message
                        });
                    }
            }    
        } catch (error) {
            console.error("Error logging in:", error);
            setNotice({
                type: "error",
                message: error.message
            });
        } finally{
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[420px] lg:max-w-[750px]  my-20 mx-4">
            <div className="relative bg-[#e0e5ec] rounded-[30px] px-10 py-[50px] transition-all duration-300 shadow-[20px_20px_60px_rgb(190,195,207),-20px_-20px_60px_rgb(255,255,255)]">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 rounded-full bg-[#e0e5ec] transition-all duration-300 shadow-[8px_8px_20px_rgb(190,195,207),-8px_-8px_20px_rgb(255,255,255),inset_0_0_0_rgb(190,195,207),inset_0_0_0_rgb(255,255,255)] hover:shadow-[4px_4px_10px_rgb(190,195,207),-4px_-4px_10px_rgb(255,255,255),4px_4px_10px_rgb(190,195,207)_inset,-4px_-4px_10px_rgb(255,255,255)_inset]">
                        <div className="w-10 h-10 flex items-center justify-center text-[#6c7293]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                    </div>
                    <NoticeComponents notice={notice} setNotice={setNotice} />
                    <h2 className="text-[#3d4468] text-[2rem] font-semibold mb-2">Welcome back</h2>
                    <p className="text-[#9499b7] text-[15px] font-normal">Please sign in to continue</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="mb-7 relative">
                        <div className="relative bg-[#e0e5ec] rounded-[15px] transition-all duration-300 shadow-[inset_8px_8px_16px_rgb(190,195,207),inset_-8px_-8px_16px_rgb(255,255,255)] hover:shadow-[4px_4px_10px_rgb(190,195,207),-4px_-4px_10px_rgb(255,255,255),4px_4px_10px_rgb(190,195,207)_inset,-4px_-4px_10px_rgb(255,255,255)_inset]">
                            <input id="userEmailPhone" name="user_email_phone" required="" placeholder=" " onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} className="w-full bg-transparent border-0 outline-none text-[#3d4468] text-[16px] font-medium py-5 pl-[55px] pr-6 transition-all duration-300"/>
                            <label className="absolute left-[55px] top-1/2 -translate-y-1/2 text-[#9499b7] text-[16px] font-normal pointer-events-none transition-all duration-300" htmlFor="email">Email address / Phone</label>
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9499b7] transition-all duration-300">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                        </div>
                        <span className="emailPhoneError text-[#ff3b5c] text-[12px] font-medium mt-2 ml-5 opacity-0 -translate-y-2.5 transition-all duration-300">Email address/Phone is required</span>
                    </div>
                    <div className="mb-7 relative">
                        <div className="relative bg-[#e0e5ec] rounded-[15px] transition-all duration-300 shadow-[inset_8px_8px_16px_rgb(190,195,207),inset_-8px_-8px_16px_rgb(255,255,255)] hover:shadow-[4px_4px_10px_rgb(190,195,207),-4px_-4px_10px_rgb(255,255,255),4px_4px_10px_rgb(190,195,207)_inset,-4px_-4px_10px_rgb(255,255,255)_inset]">
                            <input  type="password" id="user_password" name="user_password" required="" autoComplete="current-password" placeholder=" " onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} className="w-full bg-transparent border-0 outline-none text-[#3d4468] text-[16px] font-medium py-5 pl-[55px] pr-6 transition-all duration-300" />
                            <label className="absolute left-[55px] top-1/2 -translate-y-1/2 text-[#9499b7] text-[16px] font-normal pointer-events-none transition-all duration-300" htmlFor="password">Password</label>
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9499b7] transition-all duration-300">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                                </svg>
                            </div>
                            <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9499b7] transition-all duration-300 password-toggle neu-toggle" onClick={handlePasswordToggle} id="passwordToggle" aria-label="Toggle password visibility">                                
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path></svg>
                            </button>
                        </div>
                        <span  className="error_box text-[#ff3b5c] text-[12px] font-medium mt-2 ml-5 opacity-0 -translate-y-2.5 transition-all duration-300" id="passwordError">Password is required</span>
                    </div>
                    <div className="flex justify-between items-center mb-[35px] flex-wrap gap-4">
                        <div className="remember-wrapper">
                            <input type="checkbox" id="remember" name="remember" onChange={handleCheckboxClick} className="hidden" />
                            <label htmlFor="remember"  className="flex items-center cursor-pointer select-none text-[#6c7293] text-[14px] font-medium gap-3">
                                <div className="w-[22px] h-[22px] flex items-center justify-center relative bg-[#e0e5ec] rounded-[6px] overflow-hidden transition-all duration-300 shadow-[3px_3px_8px_rgb(190,195,207),-3px_-3px_8px_rgb(255,255,255)]">
                                    <svg id="checkboxSvg" className="w-3.5 h-3.5 text-[#00c896] opacity-0 scale-0 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="text-[#6c7293] text-[14px] font-medium no-underline transition-colors duration-300 hover:text-[#3d4468]">Forgot password?</a>
                    </div>
                    <button type="submit" className="w-full text-[#3d4468] text-[16px] font-semibold cursor-pointer relative mb-7 bg-[#e0e5ec] border-0 rounded-[15px] px-8 py-[18px] overflow-hidden transition-all duration-300 shadow-[8px_8px_20px_rgb(190,195,207),-8px_-8px_20px_rgb(255,255,255)] hover:shadow-[4px_4px_10px_rgb(190,195,207),-4px_-4px_10px_rgb(255,255,255),4px_4px_10px_rgb(190,195,207)_inset,-4px_-4px_10px_rgb(255,255,255)_inset]">
                        {isLoading ? (
                            <>
                            <span className="spinner"></span>
                            </>
                        ) : (
                            'Sign In'
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
                    <p className="text-[#9499b7] text-[14px]">Don't have an account? <a className="text-[#6c7293] font-semibold no-underline transition-colors duration-300 hover:text-[#3d4468]" href="/register">Sign up</a></p>
                </div>
                <div className="hidden text-center opacity-0 translate-y-5 p-10 transition-all duration-500" id="successMessage">
                    <div className="sw-20 h-20 flex items-center justify-center mx-auto mb-5 text-[#00c896] bg-[#e0e5ec] rounded-full transition-all duration-300 shadow-[8px_8px_20px_rgb(190,195,207),-8px_-8px_20px_rgb(255,255,255),inset_0_0_0_rgb(190,195,207),inset_0_0_0_rgb(255,255,255)]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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