import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useProfile } from "./global/UserContext";
import { Header } from "../view/layout/Header";
import { Footer } from "../view/layout/Footer";
// import { X } from "lucide-react";
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import TextareaAutosize from '@mui/material/TextareaAutosize';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';


export default function Checkout(){
    const navigate = useNavigate();
    const [setToken] = useState(null);
    const [userData, setUserData] = useState({});
    const { getProfileImage } = useProfile();
    // const [shippingMethod, setShippingMethod] = useState("");
    
    // const handleShippingMethodChange = (event) => {
    //     setShippingMethod(event.target.value);
    // };

    useEffect(() => {
        const checkToken = async () => {
            //get token value
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith(`token=`))
                    ?.split('=')[1];
                if (token) {
                    const decoded = jwtDecode(token);
                    if (decoded.user_role === "admin") {
                        // user detail 
                        const user_id = decoded.id;
                        const profileImage = await getProfileImage(user_id);
                        if (profileImage) {
                            setUserData(profileImage.data);
                        } else {
                            setUserData(decoded);
                        }
                        setToken(token);
                    } else {
                        navigate('/homepage');
                    }
                } else {
                    navigate('/login');
                }
            }
            checkToken();
        }, [navigate, getProfileImage]);
    
    return(
        <main className="w-full h-auto flex flex-col justify-center items-center bg-gray-100">
            <Header userData={userData} />
            <div className="md:w-[80%] w-full h-full flex flex-col items-center justify-center bg-gray-100 px-4 py-8 md:px-10 md:py-8 ">
                <h1 className="text-3xl text-orange-500 mb-6 font-semibold">Checkout</h1>
                <div className="md:w-[80%] w-full grid grid-cols-1 items-start justify-items-center md:grid-cols-1 gap-4 ">
                    <div className="md:w-[100%] w-full col-span-1 border border-t-8 border-t-orange-500 bg-white rounded-lg shadow-lg p-4">
                        <h2 className="text-xl ml-2 mb-3 font-bold text-gray-900">Service Information</h2>
                        <div className="flex flex-row items-center justify-center mb-10">
                            <img className="w-10 h-10 rounded-lg" src={localStorage.getItem("service_image")} alt="" />
                            <div className="flex flex-row items-start justify-between w-full">
                                <p className="text-sm flex flex-col ml-2 mb-3 font-bold text-gray-900">{localStorage.getItem("service_name")}Service Name<span className="text-xs text-gray-400">{localStorage.getItem("plan_name")} Pro </span></p>
                                <p className="text-sm ml-2 mb-3 font-bold text-gray-900">{localStorage.getItem("service_price")} $1000</p>    
                            </div>
                        </div>
                        <h2 className="text-xl ml-2 mb-3 font-bold text-gray-900">Payment Method</h2>
                        {/* Payment method using Credit Card  */}
                        <div className="flex items-center justify-center bg-orange-50 rounded py-10">
                        <div className="md:w-[40%] w-full flex flex-col items-center justify-center self-center border border-gray-300 bg-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <form action="" className="flex flex-col items-start justify-center w-full">
                                <label className="text-md ml-2 mb-3 font-bold text-gray-900" htmlFor="card">Card Information</label>
                                <div className="flex flex-row gap-4 items-start justify-center flex-wrap w-full">
                                    <div className="w-full flex flex-col items-start justify-center">
                                        <label htmlFor="card" className="text-sm ml-2 font-bold text-gray-900">Card Number</label>
                                        <input type="text" id="card" name="card" placeholder="Card Number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                    <div className="w-full flex flex-col items-start justify-center ">
                                        <label htmlFor="name" className="text-sm ml-2 font-bold text-gray-900">Name on Card</label>
                                        <input type="text" id="name" name="name" placeholder="Name on Card" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                    <div className="w-[46%] flex flex-col items-start justify-center ">
                                        <label htmlFor="expiry" className="text-sm font-bold text-gray-900">Expiry Date</label>
                                        <input type="text" id="expiry" name="expiry" placeholder="MM/YY" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                    <div className="w-[46%] flex flex-col items-start justify-center ">
                                        <label htmlFor="cvv" className="text-sm ml-2 font-bold text-gray-900">CVV</label>
                                        <input type="text" id="cvv" name="cvv" placeholder="CVV" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                    {/* Submit Payment Button */}
                                    <div className="w-full flex flex-col items-start justify-center ">
                                        <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition-colors">Pay Now</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        </div>
                        <div className="flex flex-row items-center justify-center">
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
