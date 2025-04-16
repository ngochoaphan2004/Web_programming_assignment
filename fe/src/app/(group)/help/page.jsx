"use client"
import React, { useState } from 'react';

const HelpPage = () => {
    const [isOpenBH, setIsOpenBH] = useState(false);
    const [isOpenBH1, setIsOpenBH1] = useState(false);
    const [isOpenBH2, setIsOpenBH2] = useState(false);
    const [isOpenTH, setIsOpenTH] = useState(false);
    const [isOpenTH1, setIsOpenTH1] = useState(false);
    const [isOpenTH2, setIsOpenTH2] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }
        if (!formData.message.trim()) newErrors.message = 'Vui lòng nhập nội dung';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            // Simulate API call
            setTimeout(() => {
                console.log('Form submitted:', formData);
                setIsSubmitting(false);
                setSubmitSuccess(true);
                setFormData({ name: '', email: '', phone: '', message: '' });
            }, 1500);
        }
    };

    const requests = [
        {
            id: 1,
            title: "Yêu cầu đổi size giày",
            user: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            createdAt: "2023-05-15T10:30:00",
            status: "answered", // answered, pending
            responseTime: "2023-05-15T14:45:00",
            content: "Tôi muốn đổi từ size 38 sang size 39 vì giày hơi chật"
        },
        {
            id: 2,
            title: "Hỏi về chính sách bảo hành",
            user: "Trần Thị B",
            email: "tranthib@example.com",
            createdAt: "2023-05-16T09:15:00",
            status: "pending",
            responseTime: null,
            content: "Sản phẩm bị bong đế sau 2 tháng sử dụng có được bảo hành không?"
        },
        {
            id: 3,
            title: "Khiếu nại giao hàng trễ",
            user: "Lê Văn C",
            email: "levanc@example.com",
            createdAt: "2023-05-14T15:20:00",
            status: "answered",
            responseTime: "2023-05-15T08:10:00",
            content: "Đơn hàng #1234 đã quá hạn giao hàng 3 ngày"
        }
    ];

    const [selectedRequest, setSelectedRequest] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="font-sans  px-4 py-6">
            {/* Tiêu đề chính */}
            <h1 className="text-3xl !font-thin mb-6 w-full text-center my-5">GET HELP</h1>

            {/* Phần câu hỏi thường gặp */}
            <div className="mb-8">
                <h3 className="font-bold mb-2">Các câu hỏi thường gặp</h3>

                <div className="border-t border-gray-300 mb-4"></div>

                {/* Chính sách */}
                <button className='w-full justify-items-start flex' onClick={() => {
                    setIsOpenBH(prev => !prev)
                    setIsOpenBH1(false)
                    setIsOpenBH2(false)
                }}>
                    <h4 className="font-semibold">Chính sách</h4>
                    <div className='flex-1' />
                    <img
                        src="arrow-down.png"
                        className="w-4 h-4 transition-transform duration-300"
                    />
                </button>
                <ul
                    className={`space-y-1 mb-1 overflow-hidden transition-all duration-300 ease-in-out ${isOpenBH ? '' : 'max-h-0'
                        }`}
                >
                    <li className="text-sm"><a onClick={() => { setIsOpenBH1(prev => !prev) }}>Giày được bảo hành không</a></li>
                    {isOpenBH1 && (
                        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
                            <div className="flex items-start mb-4">
                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-gray-700">
                                    <strong>Có</strong>, tất cả sản phẩm giày tại cửa hàng chúng tôi đều được
                                    <span className="font-semibold text-blue-600"> bảo hành chính hãng từ 3 đến 12 tháng</span>
                                    (tùy loại sản phẩm và thương hiệu).
                                </p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-800 mb-2">📌 Lưu ý:</h4>
                                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                                    <li>Xuất trình hóa đơn mua hàng hoặc mã vận đơn khi yêu cầu bảo hành</li>
                                    <li>Thời gian xử lý: 3-7 ngày làm việc</li>
                                </ul>
                            </div>
                        </div>
                    )}


                    <li className="text-sm"><a onClick={() => { setIsOpenBH2(prev => !prev) }}>Những trường hợp nào không được bảo hành?</a></li>
                    {isOpenBH2 && (
                        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
                            <div className="mb-6 pl-9">
                                <h3 className="font-semibold text-lg text-gray-800 mb-2">Phạm vi bảo hành bao gồm:</h3>
                                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                    <li>Lỗi kỹ thuật từ nhà sản xuất (đứt chỉ, bong tróc đế, hỏng khóa/kéo...)</li>
                                    <li>Biến dạng giày do vật liệu không đạt chuẩn</li>
                                    <li>Hư hỏng trong quá trình sử dụng bình thường</li>
                                </ul>
                            </div>

                            <div className="mb-6 pl-9">
                                <h3 className="font-semibold text-lg text-gray-800 mb-2">Không áp dụng bảo hành nếu:</h3>
                                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✖</span>
                                        Giày bị hư hỏng do tai nạn, va đập mạnh
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✖</span>
                                        Sử dụng sai mục đích (dùng đi mưa với giày không chống nước...)
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-500 mr-2">✖</span>
                                        Tự ý sửa chữa hoặc bảo quản không đúng cách
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </ul>

                <div className="border-t border-gray-300 mb-4"></div>

                {/* Trả hàng */}
                <button className='w-full justify-items-start flex' onClick={() => {
                    setIsOpenTH(prev => !prev)
                    setIsOpenTH1(false)
                    setIsOpenTH2(false)
                }}>
                    <h4 className="font-semibold">Trả hàng</h4>
                    <div className='flex-1' />
                    <img
                        src="arrow-down.png"
                        className="w-4 h-4 transition-transform duration-300"
                    />
                </button>
                <ul
                    className={`space-y-1 mb-1 overflow-hidden transition-all duration-300 ease-in-out ${isOpenTH ? '' : 'max-h-0'
                        }`}
                >
                    <li className="text-sm"><a onClick={() => { setIsOpenTH1(prev => !prev) }}>Chính sách trả hàng như thế nào?</a></li>
                    {isOpenTH1 && (
                        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
                            <div className="mb-6">
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>Hoàn 100% giá trị đơn hàng bằng hình thức thanh toán ban đầu</li>
                                    <li>Thời gian xử lý: <span className="font-semibold">3-5 ngày làm việc</span> sau khi nhận được hàng</li>
                                    <li>Áp dụng phí 10% giá trị đơn với trường hợp đổi size/ màu</li>
                                </ul>
                            </div>

                            {/* Lưu ý quan trọng */}
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-medium text-yellow-800">Lưu ý quan trọng</h4>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <p>
                                                • Không áp dụng trả hàng với sản phẩm sale trên 50%<br />
                                                • Sản phẩm custom (in/ thêu theo yêu cầu) không được đổi trả<br />
                                                • Chỉ áp dụng 1 lần đổi/trả cho mỗi đơn hàng
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <li className="text-sm"><a onClick={() => { setIsOpenTH2(prev => !prev) }}>Làm sao để trả hàng?</a></li>
                    {isOpenTH2 && (
                        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Điều kiện trả hàng
                                </h3>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>Sản phẩm còn nguyên tem, hộp, không dơ bẩn hoặc trầy xước</li>
                                    <li>Chưa qua sử dụng và còn đầy đủ phụ kiện đi kèm</li>
                                    <li>Thời hạn: Trong vòng <span className="font-semibold">7 ngày</span> kể từ ngày nhận hàng</li>
                                    <li>Kèm hóa đơn mua hàng hoặc email xác nhận đơn hàng</li>
                                </ul>
                            </div>

                            {/* Các bước trả hàng */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    Các bước trả hàng
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">1</div>
                                        <p className="text-gray-700">
                                            <strong>Liên hệ bộ phận CSKH</strong> qua hotline hoặc email
                                        </p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">2</div>
                                        <p className="text-gray-700">
                                            <strong>Đóng gói sản phẩm</strong> nguyên trạng với đầy đủ hộp, phụ kiện
                                        </p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">3</div>
                                        <p className="text-gray-700">
                                            <strong>Gửi hàng về địa chỉ:</strong>
                                            <ul className='list-disc'>
                                                <li><strong>Địa chỉ 1:</strong> 268 Lý Thường Kiệt, Phường 14, Quận 10 , Thành phố Hồ Chí Minh , Việt Nam</li>
                                                <li><strong>Địa chỉ 2:</strong> Khu đô thị Đại học Quốc gia Thành phố Hồ Chí Minh, Phường Đông Hòa, Thành phố Dĩ An, Bình Dương</li>
                                            </ul>
                                            <br />
                                            <span className="text-sm text-gray-500">(Chi phí vận chuyển đổi trả do khách hàng chịu trách nhiệm)</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </ul>

                <div className="border-t border-gray-300 mb-4"></div>
            </div>

            {/* Liên hệ */}
            <div>
                <h3 className="font-bold mb-1">Liên hệ chúng tôi</h3>
                <div className="border-t border-gray-300 mb-4"></div>

                <div className="max-w-3xl mx-auto py-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Danh sách yêu cầu</h2>

                    {/* Danh sách yêu cầu */}
                    <div className="divide-y divide-gray-200">
                        {requests.map((request) => (
                            <div
                                key={request.id}
                                className="px-3 py-1 md:p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm sm:text-md font-medium text-gray-800 truncate mb-1">
                                            {request.title}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500  mb-1">
                                            {formatDate(request.createdAt)}
                                        </p>
                                    </div>

                                    <div className="flex flex-row-reverse sm:flex-row justify-between sm:justify-normal items-center sm:ml-4 gap-2 sm:gap-3">
                                        <button
                                            onClick={() => setSelectedRequest(request)}
                                            className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium whitespace-nowrap"
                                        >
                                            Xem chi tiết
                                        </button>

                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${request.status === 'answered'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {request.status === 'answered' ? 'Đã trả lời' : 'Chờ xử lý'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Modal xem chi tiết */}
                    {selectedRequest && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {selectedRequest.title}
                                        </h3>
                                        <button
                                            onClick={() => setSelectedRequest(null)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Ngày gửi:</p>
                                            <p className="text-sm text-gray-800">
                                                {formatDate(selectedRequest.createdAt)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">Trạng thái:</p>
                                            <p className="text-sm text-gray-800">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedRequest.status === 'answered'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {selectedRequest.status === 'answered' ? 'Đã trả lời' : 'Chờ xử lý'}
                                                </span>
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">Nội dung:</p>
                                            <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                                                {selectedRequest.content}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">Trả lời:</p>
                                            <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                                                {selectedRequest.content}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                                        <button
                                            onClick={() => setSelectedRequest(null)}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Đóng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div>
                        {/* Thông báo thành công */}
                        {submitSuccess && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start">
                                <svg className="flex-shrink-0 w-5 h-5 text-emerald-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h3 className="text-sm font-medium text-emerald-800">Thành công!</h3>
                                    <p className="mt-1 text-sm text-emerald-700">Gửi thông tin thành công! Chúng tôi sẽ liên hệ lại trong 24h.</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field */}
                            <div className="space-y-1.5">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Họ và tên <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`block w-full px-4 py-2.5 rounded-lg border ${errors.name ? 'border-rose-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500'} placeholder-gray-400 transition-colors`}
                                        placeholder="Nguyễn Văn A"
                                    />
                                    {errors.name && (
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="h-5 w-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                {errors.name && <p className="text-sm text-rose-600">{errors.name}</p>}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`block w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-rose-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500'} placeholder-gray-400 transition-colors`}
                                        placeholder="example@email.com"
                                    />
                                    {errors.email && (
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="h-5 w-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                {errors.email && <p className="text-sm text-rose-600">{errors.email}</p>}
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-1.5">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Số điện thoại <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`block w-full px-4 py-2.5 rounded-lg border ${errors.phone ? 'border-rose-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500'} placeholder-gray-400 transition-colors`}
                                        placeholder="0987 654 321"
                                    />
                                    {errors.phone && (
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="h-5 w-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                {errors.phone && <p className="text-sm text-rose-600">{errors.phone}</p>}
                            </div>

                            {/* Message Field */}
                            <div className="space-y-1.5">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Nội dung <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={`block w-full px-4 py-2.5 rounded-lg border ${errors.message ? 'border-rose-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500'} placeholder-gray-400 transition-colors`}
                                    placeholder="Xin vui lòng nhập nội dung liên hệ..."
                                />
                                {errors.message && <p className="text-sm text-rose-600">{errors.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2 w-full flex !justify-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`rounded w-[30vw] py-3 px-4 rounded-lg font-medium text-white shadow-sm transition-colors ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang xử lý...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            Gửi liên hệ
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                Bằng cách gửi thông tin, bạn đồng ý với{' '}
                                <strong>
                                    Chính sách bảo mật
                                </strong>{' '}
                                của chúng tôi
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;