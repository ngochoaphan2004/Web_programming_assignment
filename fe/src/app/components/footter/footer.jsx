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
                                <p className="font-bold mb-2">Liên hệ với chúng tôi</p>
                                <div className="flex space-x-4 mt-2">
                                    <a href="#">
                                        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" className="w-6 h-6" alt="fb" />
                                    </a>
                                    <a href="#">
                                        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" className="w-6 h-6" alt="ig" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </footer>
        </>
    )
}