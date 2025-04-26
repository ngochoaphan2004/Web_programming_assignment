"use client"

import { usePathname } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

const UserNav = [
    { url: "/", title: "Home", elementID: "home" },
    { url: "/sneaker", title: "Sneaker", elementID: "sneaker" },
    { url: "/sandal", title: "Sandal", elementID: "sandal" },
    { url: "/balo", title: "Balo", elementID: "balo" },
    { url: "/all", title: "All", elementID: "all" }
]

const AdminNav = [
    { url: "/admin/accounts", title: "Accounts", elementID: "accounts" },
    { url: "/admin/content", title: "Content", elementID: "content" },
    { url: "/admin/contact", title: "Contact", elementID: "contact" },
    { url: "/admin/products", title: "Products", elementID: "products" },
    { url: "/admin/receipts", title: "Receipts", elementID: "receipts" }
]


export default function Header(props) {
    const [url, setUrl] = useState("");
    const [authenUrl, setAuthenUrl] = useState("");
    const [isOpen, setSecondNB] = useState(true);
    const pathname = usePathname();
    const handleLogout = async () => {
        try {
          const response = await axios.post("http://localhost:80/api/user/logout", {}, {
            withCredentials: true // Để gửi cookie (nếu dùng session PHP)
          });
    
          if (response.data.success) {
            window.location.href = "/";
            // router.push("/");
          } else {
            alert("Logout failed");
          }
        } catch (error) {
          console.error("Logout error:", error);
          alert("An error occurred. Please try again.");
        }
      };
    useEffect(() => {
        if (props.admin) {
            setAuthenUrl(pathname);
        }
        else
            setUrl(pathname);
    }, [])

    const [dropdown, setDropdown] = useState(false)

    useEffect(() => {
        let element = document.getElementById("second-navbar")
        if (isOpen)
            element.style.display = "none"
        else
            element.style.display = "block"
    }, [isOpen])

    return (
        <header className="mb-2">
            <div className="header-top">
                <div className="container">
                    {props.admin ?
                        <>
                            <div className="logo flex">
                                <a className="block">
                                    <img
                                        src="/logo.png"
                                        alt="Logo"
                                        className="!h-6 sm:!h-8 md:!h-10 w-auto max-w-full object-contain"
                                    />
                                </a>
                                <span className="self-end inline-block text-[10px] py-0.5 text-black rounded-md no-underline font-bold">ADMIN</span>
                            </div>

                            <nav className="main-navbar">
                                <div className="container">
                                    <ul>
                                        {AdminNav.map((item, index) => (
                                            <li key={index} id={item.elementID} className={`menu-item ${authenUrl === item.url ? 'active' : ''}`}>
                                                <a href={item.url} className='menu-link'>
                                                    <span>{item.title}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </nav>
                        </>
                        :
                        <>
                            <div className="logo flex">
                                <a href="/" className="block">
                                    <img
                                        src={"/logo.png"}
                                        alt="Logo"
                                        className="!h-6 sm:!h-8 md:!h-10 w-auto max-w-full object-contain"
                                    />
                                </a>
                            </div>
                            <nav className="main-navbar">
                                <div className="container">
                                    <ul>
                                        {UserNav.map((item, index) => (
                                            <li key={index} id={item.elementID} className={`menu-item ${url === item.url ? 'active' : ''}`}>
                                                <a href={item.url} className='menu-link'>
                                                    <span>{item.title}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </nav>
                        </>
                    }


                    <div className="header-top-right">

                        {!props.authen ? (
                            <div className="flex flex-row gap-3 sm:gap-4 items-center">
                                <a
                                    href="/sign-in"
                                    className="text-[10px] sm:text-[16px] md:text-[20px] font-medium hover:underline"
                                >
                                    Login
                                </a>
                                <a
                                    href="/sign-up"
                                    className="bg-blue-600 text-white rounded px-2 py-1 text-[10px] sm:text-[16px] md:text-[20px] font-semibold hover:bg-blue-700 transition"
                                >
                                    Sign Up
                                </a>
                            </div>

                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdown(prev => !prev)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                                        <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="hidden sm:block">
                                        <h6 className="text-base font-medium">{props.user.name == "" ? User : props.user.name}</h6>
                                    </div>
                                </button>

                                {dropdown && (
                                    <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">My Account</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
                                        </li>
                                        <li><hr className="my-1 border-gray-200" /></li>
                                        <li>
                                            <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                            >
                                            Logout
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* <!-- Burger button responsive --> */}
                        <a href="#" className="burger-btn d-block d-xl-none" onClick={() => setSecondNB(prev => !prev)}>
                            <i className="bi bi-justify fs-3"></i>
                        </a>
                    </div>
                </div>

                <nav id="second-navbar" className="main-navbar mt-2 hidden">
                    <div className="container">
                        {props.admin ?
                            <ul>
                                {AdminNav.map((item, index) => (
                                    <li key={index} id={item.elementID} className={`menu-item ${authenUrl === item.url ? 'active' : ''}`}>
                                        <a href={item.url} className='menu-link'>
                                            <span>{item.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            :
                            <ul>
                                {UserNav.map((item, index) => (
                                    <li key={index} id={item.elementID} className={`menu-item ${url === item.url ? 'active' : ''}`}>
                                        <a href={item.url} className='menu-link'>
                                            <span>{item.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        }
                    </div>
                </nav>
            </div>


        </header>
    );
}