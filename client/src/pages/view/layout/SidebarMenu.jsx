import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import Logo from "../../assets/logo.png";

export const SidebarMenu = ({ setIsSidebar }) => {
    return (
        <div className='border-r border-gray-200 bg-white p-4 w-full h-screen z-50 fixed top-0 left-0'>
            <div className='relative flex items-center justify-between'>
                <h2 className='text-center text-2xl font-bold mb-4'>Menu</h2>
                <button onClick={() => setIsSidebar(false)} className='absolute top-0 right-0'>
                    <XCircle className=' text-red-500 cursor-pointer transition-colors duration-200' />
                </button>
            </div>
            <div className='w-full flex items-center justify-center mb-4'>
                <img src={`${process.env.PUBLIC_URL}` + Logo} alt="Logo" className="w-[60%] md:w-[20%]  h-auto" />
            </div>
            <div className='w-full h-full flex flex-col justify-between'>

                <ul className='flex flex-col gap-2 '>
                    <Link to="/homepage">
                        <li className="hover:text-orange-400 hover:bg-blue-100 border-b border-gray-200 text-center py-3 cursor-pointer transition-colors duration-200">Homepage</li>
                    </Link>
                    <Link to="/posts">
                        <li className="hover:text-orange-400 hover:bg-blue-100 border-b border-gray-200 text-center py-3 cursor-pointer transition-colors duration-200">Blogs</li>
                    </Link>
                    <Link to="/memberships">
                        <li className="hover:text-orange-400 hover:bg-blue-100 border-b border-gray-200 text-center py-3 cursor-pointer transition-colors duration-200">Membership</li>
                    </Link>
                    <Link to="/services">
                        <li className="hover:text-orange-400 hover:bg-blue-100 border-b border-gray-200 text-center py-3 cursor-pointer transition-colors duration-200">Services</li>
                    </Link>
                    <Link to="/contact">
                        <li className="hover:text-orange-400 hover:bg-blue-100 border-b border-gray-200 text-center py-3 cursor-pointer transition-colors duration-200">Contact</li>
                    </Link>
                </ul>
                <div className='flex flex-col gap-2 mb-28'>
                    <ul>
                        <Link to="/login">
                            <li className="hover:text-orange-400 hover:bg-blue-100 border-b border-gray-200 text-center py-3 cursor-pointer transition-colors duration-200">Login</li>
                        </Link>
                        <Link to="/register">
                            <li className="hover:text-orange-400 border-b border-gray-200 text-center py-3 cursor-pointer transition-colors duration-200">Register</li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    );
};
