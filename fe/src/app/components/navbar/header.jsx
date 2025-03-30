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
        <header className="mb-5">
            <div className="header-top">
                <div className="container">
                    {props.admin ?
                        <>
                            <div className="logo flex">
                                <a href="/"><img src={props.admin ? "/logo-admin.png" : "/logo.png"} alt="Logo" /></a>
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
                                <a href="/"><img src={props.admin ? "/logo-admin.png" : "/logo.png"} alt="Logo" /></a>
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

                        {!props.authen ?
                            (<div className="flex gap-4">
                                <a href="/sign-in" className="btn px-3 text-[20px]!">Login</a>
                                <a href="/sign-up" className="btn btn-primary rounded px-3 text-[20px]!">Sign Up</a>
                            </div>) :
                            (
                                <div className="dropdown">
                                    <a href="#" id="topbarUserDropdown"
                                        className="user-dropdown d-flex align-items-center dropend dropdown-toggle"
                                        data-bs-toggle="dropdown" aria-expanded="false"
                                        onClick={() => setDropdown(prev => !prev)}>
                                        <div className="avatar avatar-md2">
                                            <img src="/avatar.png" alt="Avatar" />
                                        </div>
                                        <div className="text">
                                            <h6 className="user-dropdown-name">John Ducky</h6>
                                        </div>
                                    </a>
                                    <ul className={`dropdown-menu dropdown-menu-end shadow-lg ${dropdown ? "show" : ""}`} aria-labelledby="topbarUserDropdow"
                                    >
                                        <li><a className="dropdown-item" href="#">My Account</a></li>
                                        <li><a className="dropdown-item" href="#">Settings</a></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" href="auth-login.html">Logout</a></li>
                                    </ul>
                                </div>
                            )
                        }

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