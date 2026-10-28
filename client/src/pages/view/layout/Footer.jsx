// import React from 'react'
// import { Link } from 'react-router-dom'
// import Logo from "../../assets/logo.png";
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

// export const Footer = () => {
//     return (
//         <div className='w-full h-auto border-t border-gray-200 border-t border-gray-200 bg-white'>
//             <div className='container mx-auto p-8'>
//                 <footer className='text-center'>
//                     <div className="md:hidden block">
//                         <img src={`${process.env.PUBLIC_URL}` + Logo} alt="Logo" className="w-full h-auto" />
//                         {/* Book Store */}
//                         <p>
//                             Your premier destination for academic excellence, professional growth, and general knowledge books.
//                         </p>
//                         <div className="flex justify-center gap-4 mt-4">
//                             <FaFacebook className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
//                             <FaTwitter className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
//                             <FaInstagram className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
//                             <FaLinkedin className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
//                         </div>
//                     </div>
//                     <div className="layout grid md:grid-cols-4 grid-cols-2 py-10 text-center ">
//                         <div className="md:block hidden ">
//                             <img src={`${process.env.PUBLIC_URL}` + Logo} alt="Logo" className="w-full h-auto" />
//                             {/* Book Store */}
//                             <p>
//                                 Your premier destination for academic excellence, professional growth, and general knowledge books.
//                             </p>
//                             <div className="flex justify-center gap-4 mt-4">
//                                 <FaFacebook className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
//                                 <FaTwitter className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
//                                 <FaInstagram className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
//                                 <FaLinkedin className="cursor-pointer text-2xl text-gray-500 hover:text-orange-400" />
//                             </div>
//                         </div>
//                         <div className="flex flex-col w-full items-center mt-5 md:mt-0">
//                             <div className='md:w-[25%] w-full flex flex-col justify-start'>
//                                 <h1 className="text-2xl md:text-left text-center font-bold">AI</h1>
//                                 <ul className="flex flex-col md:text-left text-center gap-3 mt-2">
//                                     <Link to="/" className="cursor-pointer hover:text-orange-400"><li>Home</li></Link>
//                                     <Link to="/blogs" className="cursor-pointer hover:text-orange-400"><li>Blogs</li></Link>
//                                     <Link to="/services" className="cursor-pointer hover:text-orange-400"><li>Services</li></Link>
//                                     <Link to="/contact" className="cursor-pointer hover:text-orange-400"><li>Contact</li></Link>
//                                 </ul>
//                             </div>
//                         </div>
//                         <div className="flex flex-col w-full  items-center mt-5 md:mt-0">
//                             <div className='md:w-[25%] w-full flex flex-col justify-start'>
//                                 <h1 className="text-2xl md:text-left text-center font-bold">Learing</h1>
//                                 <ul className="flex flex-col md:text-left text-center gap-3 mt-2">
//                                     <Link to="/" className="cursor-pointer hover:text-orange-400"><li>Home</li></Link>
//                                     <Link to="/blogs" className="cursor-pointer hover:text-orange-400"><li>Blogs</li></Link>
//                                     <Link to="/services" className="cursor-pointer hover:text-orange-400"><li>Services</li></Link>
//                                     <Link to="/contact" className="cursor-pointer hover:text-orange-400"><li>Contact</li></Link>
//                                 </ul>
//                             </div>
//                         </div>
//                         <div className="flex flex-col w-full  items-center mt-5 md:mt-0">
//                             <div className='md:w-[25%] w-full flex flex-col justify-start'>
//                                 <h1 className="text-2xl md:text-left text-center font-bold">MyBrand</h1>
//                                 <ul className="flex flex-col md:text-left text-center gap-3 mt-2">
//                                     <li><Link to="/" className="cursor-pointer hover:text-orange-400">Home</Link></li>
//                                     <li><Link to="/blogs" className="cursor-pointer hover:text-orange-400">Blogs</Link></li>
//                                     <li><Link to="/services" className="cursor-pointer hover:text-orange-400">Services</Link></li>
//                                     <li><Link to="/contact" className="cursor-pointer hover:text-orange-400">Contact</Link></li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                     <p className='text-gray-500'>© 2026 Knowledge Area. All rights reserved.</p>
//                 </footer>
//             </div>
//         </div>
//     )
// }
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Logo from "../../assets/logo.png";

/* Static data lives outside the component so it is created once.
   TODO: replace each "#" with your real social profile URL. */
const SOCIALS = [
  { label: "Facebook", href: "#", Icon: FaFacebook },
  { label: "Twitter", href: "#", Icon: FaTwitter },
  { label: "Instagram", href: "#", Icon: FaInstagram },
  { label: "LinkedIn", href: "#", Icon: FaLinkedin },
];

const EXPLORE_LINKS = [
  { to: "/homepage", label: "Home" },
  { to: "/posts", label: "Blogs" },
  { to: "/memberships", label: "Membership" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const linkClass = `w-fit rounded-md transition-colors hover:text-orange-400 ${focusRing}`;

const hasToken = () => document.cookie.split("; ").some((row) => row.startsWith("token="));

export const Footer = () => {
  const isLoggedIn = hasToken();

  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 text-center md:grid-cols-[2fr_1fr_1fr] md:text-left">
          {/* Brand: one block for every screen size (no duplicated mobile/desktop markup) */}
          <div className="flex flex-col items-center gap-4 md:items-start">
            <img src={Logo} alt="Logo" className="h-auto w-40" loading="lazy" />
            <p className="max-w-sm">
              Your premier destination for academic excellence, professional growth, and general
              knowledge books.
            </p>
            <ul className="flex gap-4">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`block rounded-md text-2xl text-slate-400 transition-colors hover:text-orange-400 ${focusRing}`}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Explore" className="flex flex-col items-center gap-3 md:items-start">
            <h2 className="text-lg font-bold text-white">Explore</h2>
            {EXPLORE_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Account" className="flex flex-col items-center gap-3 md:items-start">
            <h2 className="text-lg font-bold text-white">Account</h2>
            <Link to={isLoggedIn ? "/my-account" : "/login"} className={linkClass}>
              {isLoggedIn ? "My Account" : "Login/Register"}
            </Link>
          </nav>
        </div>

        <p className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Knowledge Area. All rights reserved.
        </p>
      </div>
    </footer>
  );
};