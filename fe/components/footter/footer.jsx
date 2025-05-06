import Link from 'next/link';
import { useEffect, useState } from 'react';
import axiosConfig from "@/axiosConfig";

export default function Footter() {
    const [companyInfo, setCompanyInfo] = useState({
        id: "",
        name: "",
        phone: "",
        email: "",
        description: "",
        address: [],
        logo: '/logo.png'
    });

    useEffect(() => {
        async function fetchData() {
            await axiosConfig.get('shop/info')
                .then((response) => {
                    const data = response.data
                    
                    setCompanyInfo({
                        id: data['id'],
                        name: data['name'],
                        email: data['email'],
                        phone: data['phone'],
                        address: data['addresses'],
                        description: data['description'],
                        logo: '/logo.png'
                    })
                })
        }
        fetchData()
    }, [])
    const address = Array.isArray(companyInfo?.address) ? companyInfo.address : [];
    return (
        <>
            <footer>
                <footer className="bg-black text-white px-6 py-8 mt-10">
                    <div className="container">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <p className="font-bold mb-2">Về chúng tôi</p>
                                

<p>Địa chỉ 1: {address[0]?.address || ' '}</p>
<p>Địa chỉ 2: {address[1]?.address || ' '}</p>
{/* 
                                <p>Địa chỉ 1: {companyInfo.address[0]?.address || ' '}</p>
                                <p>Địa chỉ 2: {companyInfo.address[1]?.address || ' '}</p> */}
                                <p>Email: {companyInfo.email || ' '}</p>
                            </div>
                            <div>
                                <p className="font-bold mb-2">Hỗ trợ</p>
                                <p>Chính sách đổi trả</p>
                                <p>Chính sách giao hàng</p>
                            </div>
                            <div>
                                <div className="flex space-x-4 mt-2">
                                    <Link href="/help" className="hover:underline text-blue-400">
                                        Liên hệ với chúng tôi
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </footer>
        </>
    )
}