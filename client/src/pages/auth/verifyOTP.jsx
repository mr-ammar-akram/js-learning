import React, { useState, useRef, useEffect } from "react";
import NoticeComponents from "../components/noticComponents";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";

const OtpVerification = () => {
  const OTP_LENGTH = 6;
  const navigate = useNavigate();
  const [setCookie, removeCookie] = useCookies();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);
  const [notice, setNotice] = useState(
    {
      type: "",
      message: ""
    }
  );

  const location = useLocation();
  const { user_id, user_email, user_name, token } = location.state;
  const inputRefs = useRef([]);

  useEffect(() => {
    const otpToken = decodeURIComponent(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("otp_token="))
        ?.split("=")[1] || ""
    );

    if (!otpToken) {
      setExpired(true);
      setTimeLeft(0);
      return;
    }

    const currentTime = Date.now();
    const expiryTime = Date.parse(otpToken);
    const seconds = Math.max(0, Math.floor((expiryTime - currentTime) / 1000));

    setTimeLeft(seconds);

    // Check if already expired
    if (seconds <= 0) {
      setExpired(true);
      removeCookie("otp_token", { path: "/" });
      return;
    }

    setExpired(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          removeCookie("otp_token", { path: "/" });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [expired, removeCookie]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case "Backspace":
        if (!otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        } else {
          const newOtp = [...otp];
          newOtp[index] = "";
          setOtp(newOtp);
        }
        break;

      case "ArrowRight":
        if (index < OTP_LENGTH - 1) {
          inputRefs.current[index + 1]?.focus();
        }
        break;

      case "ArrowLeft":
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;

      default:
        break;
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    const newOtp = [...otp];

    pastedData.split("").forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);

    const nextIndex =
      pastedData.length < OTP_LENGTH
        ? pastedData.length
        : OTP_LENGTH - 1;

    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const code = otp.join("");

      if (code.length !== OTP_LENGTH) {
        setNotice({
          type: "error",
          message: "Please enter complete OTP",
        });
        return;
      }
      const response = await fetch(`${process.env.REACT_APP_HOST_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: Number(code)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotice({
          type: "success",
          message: data.message,
        });
        const isLoggedin = document.cookie
          .split("; ")
          .find((row) => row.startsWith("is_logged_in="))
          ?.split("=")[1] || ""
        if (isLoggedin === "true") {
          removeCookie("is_logged_in", { path: "/" });
          removeCookie("otp_token", { path: "/" });
          setCookie("token", token, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            secure: true,
            sameSite: "Lax",
          });
          setTimeout(() => {
            navigate("/homepage", {
              state: {
                user_id: data.data.user_id
              }
            });
          }, 2000);
        } else {
          navigate("/login");
        }
      } else {
        setNotice({
          type: "error",
          message: data.message,
        });
      }
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleResend = async () => {
    setLoading(true);
    const response = await fetch(`${process.env.REACT_APP_HOST_URL}/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: user_email,
        user_name: user_name,
        user_id: user_id
      }),
    });
    const data = await response.json();
    if (response.ok) {
      const expiryAfterTime = data.data.expired_at;
      const currentTime = Date.now();
      const diff = Date.parse(expiryAfterTime) - currentTime;
      const seconds = Math.floor(diff / 1000);
      setTimeLeft(seconds);
      //set cookie 
      setCookie("otp_token", expiryAfterTime, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        sameSite: "Lax",
      });
      setExpired(false);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setNotice({
        type: "success",
        message: data.message,
      });
      setTimeout(() => {
        setNotice({
          type: "",
          message: "",
        });
      }, 3000);
    } else {
      setNotice({
        type: "error",
        message: data.message,
      });
    }
    setLoading(false);
  };
  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="h-full w-[730px] rounded-[16px] bg-gray-100">
      <div className="flex flex-col gap-4 py-16 px-6 items-center justify-center">
        <NoticeComponents notice={notice} setNotice={setNotice} />
        <h1 className="text-2xl font-bold">Verify</h1>
        <p className="text-gray-500 text-center">Hello <b>{user_name + ","}</b> Your code has been sent to your registered email at : <b>{user_email}</b></p>
        <div className="flex justify-center my-4 space-x-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <div>
          <button
            onClick={handleVerify}
            className="w-full w-1/4 px-4 py-2 bg-orange-400 text-white rounded-md"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
        </div>
        <p className="text-gray-500 mt-4 text-sm">Didn't receive a code?
          {expired && <button onClick={handleResend} className="text-orange-400 ml-2 cursor-pointer hover:underline"> Resend Code</button>}
        </p>
        {/* Timer */}
        {!expired && (
          <p className="text- mt-1 text-sm">Resend code in:
            <span className="font-bold"><span className="w-12 h-12 text-center text-md"> {minutes}</span>:<span className="w-12 h-12 text-center text-md">{seconds}</span></span>
          </p>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;