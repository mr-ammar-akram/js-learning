import React from 'react'
import { Link } from 'react-router-dom'
import Logo from "../../assets/logo.png";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export const Footer = () => {
    return (
        <div className='w-full h-auto border-t border-gray-200 border-t border-gray-200 bg-white'>
            <div className='container mx-auto p-8'>
                <footer className='text-center'>
                    <div className="md:hidden block">
                        <img src={`${process.env.PUBLIC_URL}` + Logo} alt="Logo" className="w-full h-auto" />
                        {/* Book Store */}
                        <p>
                            Your premier destination for academic excellence, professional growth, and general knowledge books.
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                            <FaFacebook className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
                            <FaTwitter className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
                            <FaInstagram className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
                            <FaLinkedin className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
                        </div>
                    </div>
                    <div className="layout grid md:grid-cols-4 grid-cols-2 py-10 text-center ">
                        <div className="md:block hidden ">
                            <img src={`${process.env.PUBLIC_URL}` + Logo} alt="Logo" className="w-full h-auto" />
                            {/* Book Store */}
                            <p>
                                Your premier destination for academic excellence, professional growth, and general knowledge books.
                            </p>
                            <div className="flex justify-center gap-4 mt-4">
                                <FaFacebook className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
                                <FaTwitter className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
                                <FaInstagram className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
                                <FaLinkedin className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
                            </div>
                        </div>
                        <div className="flex flex-col w-full items-center mt-5 md:mt-0">
                            <div className='md:w-[25%] w-full flex flex-col justify-start'>
                                <h1 className="text-2xl md:text-left text-center font-bold">AI</h1>
                                <ul className="flex flex-col md:text-left text-center gap-3 mt-2">
                                    <Link to="/" className="cursor-pointer hover:text-orange-400"><li>Home</li></Link>
                                    <Link to="/blogs" className="cursor-pointer hover:text-orange-400"><li>Blogs</li></Link>
                                    <Link to="/services" className="cursor-pointer hover:text-orange-400"><li>Services</li></Link>
                                    <Link to="/contact" className="cursor-pointer hover:text-orange-400"><li>Contact</li></Link>
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col w-full  items-center mt-5 md:mt-0">
                            <div className='md:w-[25%] w-full flex flex-col justify-start'>
                                <h1 className="text-2xl md:text-left text-center font-bold">Learing</h1>
                                <ul className="flex flex-col md:text-left text-center gap-3 mt-2">
                                    <Link to="/" className="cursor-pointer hover:text-orange-400"><li>Home</li></Link>
                                    <Link to="/blogs" className="cursor-pointer hover:text-orange-400"><li>Blogs</li></Link>
                                    <Link to="/services" className="cursor-pointer hover:text-orange-400"><li>Services</li></Link>
                                    <Link to="/contact" className="cursor-pointer hover:text-orange-400"><li>Contact</li></Link>
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col w-full  items-center mt-5 md:mt-0">
                            <div className='md:w-[25%] w-full flex flex-col justify-start'>
                                <h1 className="text-2xl md:text-left text-center font-bold">MyBrand</h1>
                                <ul className="flex flex-col md:text-left text-center gap-3 mt-2">
                                    <li><Link to="/" className="cursor-pointer hover:text-orange-400">Home</Link></li>
                                    <li><Link to="/blogs" className="cursor-pointer hover:text-orange-400">Blogs</Link></li>
                                    <li><Link to="/services" className="cursor-pointer hover:text-orange-400">Services</Link></li>
                                    <li><Link to="/contact" className="cursor-pointer hover:text-orange-400">Contact</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <p className='text-gray-500'>© 2026 Knowledge Area. All rights reserved.</p>
                </footer>
            </div>
        </div>
    )
}