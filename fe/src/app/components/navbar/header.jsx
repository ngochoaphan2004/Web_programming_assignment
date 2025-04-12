"use client"

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// import "../../assets/js/app"
export default function Header(props) {
    const [url, setUrl] = useState("");
    const [authenUrl, setAuthenUrl] = useState("");
    const [isOpen, setSecondNB] = useState(true);
    const pathname = usePathname();
    useEffect(() => {
        if (props.admin)
            setAuthenUrl(pathname);
        else
            setUrl(pathname);
    }, [])

    const [dropdown, setDropdown] = useState(false)

    useEffect(() => {
        let element;
        switch (url) {
            case "/":
                element = document.getElementById('home')
                break;

            case "/sneaker":
                element = document.getElementById('sneaker')
                break;

            case "/sandal":
                element = document.getElementById('sandal')
                break;

            case "/balo":
                element = document.getElementById('balo')
                break;

            case "/all":
                element = document.getElementById('all')
                break;
        }
        if (element)
            element.classList.add("active")
    }, [url])

    useEffect(() => {
        let element;
        switch (authenUrl) {
            case "/admin/pages":
                element = document.getElementById('pages')
                break;

            case "/admin/accounts":
                element = document.getElementById('accounts')
                break;

            case "/admin/products":
                element = document.getElementById('products')
                break;

            case "/admin/receipts":
                element = document.getElementById('receipts')
                break;
        }
        if (element)
            element.classList.add("active")
    }, [authenUrl])

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
                                <a href="/" className="block">
                                    <img
                                        src={props.admin ? "/logo-admin.png" : "/logo.png"}
                                        alt="Logo"
                                        className="!h-6 sm:!h-8 md:!h-10 w-auto max-w-full object-contain"
                                    />
                                </a>
                            </div>

                            <nav className="main-navbar">
                                <div className="container">
                                    <ul>
                                        <li id="pages" className="menu-item">
                                            <a href="/admin/pages" className='menu-link'>
                                                <span>Pages</span>
                                            </a>
                                        </li>

                                        <li id="accounts" className="menu-item">
                                            <a href="/admin/accounts" className='menu-link'>
                                                <span>Accounts</span>
                                            </a>
                                        </li>

                                        <li id="products" className="menu-item">
                                            <a href="/admin/products" className='menu-link'>
                                                <span>Products</span>
                                            </a>
                                        </li>

                                        <li id="receipts" className="menu-item">
                                            <a href="/admin/receipts" className='menu-link'>
                                                <span>Receipts</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </>
                        :
                        <>
                            <div className="logo flex">
                                <a href="/" className="block">
                                    <img
                                        src={props.admin ? "/logo-admin.png" : "/logo.png"}
                                        alt="Logo"
                                        className="!h-6 sm:!h-8 md:!h-10 w-auto max-w-full object-contain"
                                    />
                                </a>
                            </div>
                            <nav className="main-navbar">
                                <div className="container">
                                    <ul>
                                        <li id="home" className="menu-item">
                                            <a href="/" className='menu-link'>
                                                <span>Home</span>
                                            </a>
                                        </li>

                                        <li id="sneaker" className="menu-item">
                                            <a href="/sneaker" className='menu-link'>
                                                <span>Sneaker</span>
                                            </a>
                                        </li>



                                        <li id="sandal" className="menu-item">
                                            <a href="/sandal" className='menu-link'>
                                                <span>Sandal</span>
                                            </a>
                                        </li>



                                        <li id="balo" className="menu-item">
                                            <a href="/balo" className='menu-link'>
                                                <span>Balo</span>
                                            </a>
                                        </li>


                                        <li id="all" className="menu-item">
                                            <a href="/all" className='menu-link'>
                                                <span>All</span>
                                            </a>
                                        </li>


                                    </ul>
                                </div>
                            </nav>
                        </>
                    }


                    <div className="header-top-right">

                        {!props.authen ? (
                            <div className="flex flex-row gap-3 sm:gap-4 items-center sm:items-start">
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
                                        <h6 className="text-base font-medium">John Ducky</h6>
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
                                            <a href="/sign-in" className="block px-4 py-2 text-red-500 hover:bg-gray-100">Logout</a>
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

                <nav id="second-navbar" className="main-navbar mt-2 active hidden">
                    <div className="container">
                        {props.admin ?
                            <ul>
                                <li id="pages" className="menu-item">
                                    <a href="/admin/pages" className='menu-link'>
                                        <span>Pages</span>
                                    </a>
                                </li>

                                <li id="accounts" className="menu-item">
                                    <a href="/admin/accounts" className='menu-link'>
                                        <span>Accounts</span>
                                    </a>
                                </li>

                                <li id="products" className="menu-item">
                                    <a href="/admin/products" className='menu-link'>
                                        <span>Products</span>
                                    </a>
                                </li>

                                <li id="receipts" className="menu-item">
                                    <a href="/admin/receipts" className='menu-link'>
                                        <span>Receipts</span>
                                    </a>
                                </li>
                            </ul>
                            :
                            <ul>
                                <li id="home" className="menu-item">
                                    <a href="/" className='menu-link'>
                                        <span>Home</span>
                                    </a>
                                </li>

                                <li id="sneaker" className="menu-item">
                                    <a href="/sneaker" className='menu-link'>
                                        <span>Sneaker</span>
                                    </a>
                                </li>



                                <li id="sandal" className="menu-item">
                                    <a href="/sandal" className='menu-link'>
                                        <span>Sandal</span>
                                    </a>
                                </li>



                                <li className="menu-item">
                                    <a id="balo" href="/balo" className='menu-link'>
                                        <span>Balo</span>
                                    </a>
                                </li>


                                <li className="menu-item">
                                    <a id="all" href="/all" className='menu-link'>
                                        <span>All</span>
                                    </a>
                                </li>
                            </ul>
                        }
                    </div>
                </nav>
            </div>


        </header>
    );
}