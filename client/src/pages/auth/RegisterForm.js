
import { useState } from "react";
import '../css/RegisterForm.css';


export default function RegisterForm() {
    const [formData, setformdata] = useState(
        {
            userName: "",
            userEmail: "",
            userPassword: "",
            userPhone: "",
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformdata((prev) => ({
            ...prev,
            [name]: value,
        }));

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('before hitting API');
        try {
            const response = await fetch(`${process.env.BASE_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: formData.userName,
                    userEmail: formData.userEmail,
                    userPassword: formData.userPassword,
                    userPhone: formData.userPhone
                }),
            });
            const result = await response.json();
            if (response.ok) {
                alert("Form submitted successfully");
            }
            setformdata(result);
        } catch (error) {
            console.error('Error registering node:', error);
        }
    }
    return (
        <div className='register-form-wrapper'>
            <h2>Registeration Form</h2>
            <form className='register-form' onSubmit={handleSubmit}>
                <input type='text' name='userName' placeholder='Your Name' className='userName' onChange={handleChange} autoComplete='true' />
                <input type='email' name='userEmail' placeholder='Your Email' required className='userEmail' onChange={handleChange} autoComplete='true' />
                <input type='password' name='userPassword' placeholder='Password' className='userPassword' onChange={handleChange} required />
                <input type='tel' name='userPhone' placeholder='Phone (XXXX-XXXXXXX)' className='userPhone' onChange={handleChange} required autoComplete='true' pattern='[0-9]{4}-[0-9]{7}' />
                <button type='submit' className='register-btn'>Register Now</button>
            </form>
        </div>
    );
}