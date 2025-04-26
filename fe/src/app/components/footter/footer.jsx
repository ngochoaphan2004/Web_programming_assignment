import Link from 'next/link';


export default function Footter() {
    return (
        <>
            <footer>
                <footer className="bg-black text-white px-6 py-8 mt-10">
                    <div className="container">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <p className="font-bold mb-2">Về chúng tôi</p>
                                <p>Địa chỉ 1: 268 Lý Thường Kiệt, Phường 14, Quận 10 , Thành phố Hồ Chí Minh , Việt Nam</p>
                                <p>Địa chỉ 2:  Khu đô thị Đại học Quốc gia Thành phố Hồ Chí Minh, Phường Đông Hòa, Thành phố Dĩ An, Bình Dương.</p>
                                <p>Email: support@shoes.com</p>
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