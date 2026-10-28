// import { useState, useEffect } from 'react';
// import { useNavigate, Link } from "react-router-dom";
// import { MenuIcon } from 'lucide-react';
// import { SidebarMenu } from "./SidebarMenu";
// import Logo from "../../assets/logo.png";
// import Notification from "../../components/Notifications";

// export const Header = () => {
//     const navigate = useNavigate();
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [token, setToken] = useState(null);

//     const handleMenuClick = (value) => {
//         setIsSidebarOpen(value);
//     };
//     const handleToken = () => {
//         const token = document.cookie
//             .split('; ')
//             .find(row => row.startsWith(`token=`))
//             ?.split('=')[1];
//         setToken(token);
//     }
//     useEffect(() => {
//         handleToken();
//     }, []);
//     return (
//         <>
//             <div className="w-full flex h-auto border-b border-gray-200  bg-white">
//                 <div className="w-full flex flex-col">
//                     {isSidebarOpen && <SidebarMenu setIsSidebar={handleMenuClick} />}
//                     <header className="w-full flex items-center justify-center px-4 py-5 md:px-10 md:py-5 ">
//                         <div className="md:w-[80%] w-full flex items-center justify-between">
//                             <div className="flex w-[100%]  items-center justify-between gap-20">
//                                 <img src={`${process.env.PUBLIC_URL}` + Logo} alt="Logo" className="w-[40%] md:w-[20%]  h-auto" />
//                                 <div className="lg:hidden">
//                                     <button className="text-gray-700 hover:text-orange-400 border" onClick={() => handleMenuClick(true)}>
//                                         <MenuIcon size={24} />
//                                     </button>
//                                 </div>
//                                 <ul className="flex w-[60%] hidden lg:flex justify-center items-center gap-10">
//                                     <Link to="/homepage" className="cursor-pointer hover:text-orange-400">Home</Link>
//                                     <Link to="/posts" className="cursor-pointer hover:text-orange-400">Blogs</Link>
//                                     <Link to="/memberships" className="cursor-pointer hover:text-orange-400">Membership</Link>
//                                     <Link to="/services" className="cursor-pointer hover:text-orange-400">Services</Link>
//                                     <Link to="/contact" className="cursor-pointer hover:text-orange-400">Contact</Link>
//                                 </ul>
//                                 <div className="flex items-center justify-center w-[20%] hidden lg:flex items-end justify-end gap-5">
//                                 <Notification />
//                                     {token ? (
//                                         <button
//                                             className="cursor-pointer bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-full"
//                                             onClick={() => navigate('/my-account')}
//                                         >
//                                             My Account
//                                         </button>
//                                     ) : (
//                                         <button
//                                             className="cursor-pointer bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-full"
//                                             onClick={() => navigate('/login')}
//                                         >
//                                             Login/Register
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </header>
//                 </div>
//             </div>
//         </>
//     );
// }
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MenuIcon } from "lucide-react";
import { SidebarMenu } from "./SidebarMenu";
import Logo from "../../assets/logo.png";
import Notification from "../../components/Notifications";

/* Nav items live outside the component so they are created once */
const NAV_LINKS = [
  { to: "/homepage", label: "Home" },
  { to: "/posts", label: "Blogs" },
  { to: "/memberships", label: "Membership" },
  { to: "/services", label: "Services" },
  { to: "/contact-us", label: "Contact" },
];

const readToken = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1] ?? null;

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const navLinkClass = ({ isActive }) =>
  `rounded-md py-1 transition-colors hover:text-orange-400 ${focusRing} ${
    isActive ? "text-orange-400" : "text-slate-300"
  }`;

export const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Read the cookie once on mount (lazy initial state), no extra effect or re-render
  const [token] = useState(readToken);

  return (
    <div className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      {isSidebarOpen && <SidebarMenu setIsSidebar={setIsSidebarOpen} />}

      <header className="flex w-full items-center justify-center px-4 py-4 md:px-10 md:py-5">
        <div className="flex w-full items-center justify-between gap-6 md:w-[80%]">
          <Link to="/homepage" aria-label="Go to homepage" className={`shrink-0 rounded-md ${focusRing}`}>
            <img src={Logo} alt="Logo" className="h-auto w-32 md:w-40" />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {NAV_LINKS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={navLinkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center justify-end gap-5 lg:flex">
            <Notification />
            <Link
              to={token ? "/my-account" : "/login"}
              className={`rounded-full bg-orange-400 px-5 py-2 font-semibold text-slate-950 transition-colors hover:bg-orange-300 ${focusRing}`}
            >
              {token ? "My Account" : "Login/Register"}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen(true)}
            className={`rounded-lg border border-slate-700 p-2 text-slate-200 transition-colors hover:border-orange-400 hover:text-orange-400 lg:hidden ${focusRing}`}
          >
            <MenuIcon size={24} aria-hidden="true" />
          </button>
        </div>
      </header>
    </div>
  );
};