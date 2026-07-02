
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import '../css/Homepage.css';

export default function RegisterForm(){
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies();
    const [token, setToken] = useState(null);

    useEffect(() => {
        //get token value
        const token = document.cookie
        .split('; ')
        .find(row => row.startsWith(`token=`))
        ?.split('=')[1];
        if (token != null) {
            setToken(token);
        }else{
            navigate('/login');
        }
    }, []);

    // logout function
    const logoutUser = () => {
        removeCookie('token',{ path: '/' });
        navigate('/login');
    };

    return (

        <div className='w-full'>

            {/* <!-- NAVBAR --> */}
            <header className="navbar">
            <h1>MyBrand</h1>
            <nav className="nav-links">
                <a href="/homepage">Home</a>
                <a href="#">About</a>
                <a href="#">Services</a>
                <a href="#">Contact</a>
            </nav>
            {token ? (
                <span className='register-button' onClick={logoutUser}>Logout</span>
            ) : (
                <a href='/register' className='register-button'>Register</a>
            )}
            </header>

            {/* <!-- HERO --> */}
            <section className="hero">
            <div className="overlay">
            <div className="hero-text">
                <h2 className='text-3xl font-bold text-blue-600'>Build Something Amazing</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Create modern websites easily.</p>
                <button>Get Started</button>
            </div>
            </div>
            </section>

            {/* <!-- FEATURES --> */}
            <section className="features">
            <h2>Our Features</h2>
            <div className="feature-grid">
                <div className="feature">
                <h3>Fast</h3>
                <p>Optimized for speed and performance.</p>
                </div>
                <div className="feature">
                <h3>Responsive</h3>
                <p>Looks great on all devices.</p>
                </div>
                <div className="feature">
                <h3>Modern</h3>
                <p>Clean and minimal design approach.</p>
                </div>
            </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
            <p>© 2026 MyBrand. All rights reserved.</p>
            </footer>

        </div>
    );
}