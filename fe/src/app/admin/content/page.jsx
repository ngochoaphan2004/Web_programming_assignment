"use client";

import { useState } from 'react';

export default function CompanyInfoEditor() {
    const [companyInfo, setCompanyInfo] = useState({
        name: 'Công ty Shoes vietnam',
        address: '123 Đường Lê Lợi, Q.1, TP.HCM',
        phone: '0901234567',
        email: 'support@shoes.com',
        description: 'Công ty chuyên sản xuất và phân phối giày dép chất lượng cao với hơn 10 năm kinh nghiệm trong ngành. Chúng tôi cam kết mang đến những sản phẩm thoải mái, bền đẹp với giá cả hợp lý.',
        logo: '/logo.png'
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Gọi API để lưu thông tin
            console.log('Đang lưu thông tin:', companyInfo);
            alert('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error('Lỗi khi lưu thông tin:', error);
            alert('Có lỗi xảy ra khi lưu thông tin!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Cập nhật thông tin công ty</h1>
            <p className="text-gray-700 text-lg mb-3 bg-gray-100 p-4 rounded-md shadow-sm">
                Trang này cho phép bạn cập nhật thông tin cơ bản của công ty, bao gồm tên, địa chỉ, số điện thoại, email, logo và mô tả chi tiết. Hãy đảm bảo thông tin chính xác để hiển thị tốt nhất trên hệ thống.
            </p>
            <p className="text-gray-600 text-sm mb-3 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                - Điền đầy đủ các trường thông tin bắt buộc.<br />
                - Logo công ty nên có định dạng JPG hoặc PNG và kích thước không vượt quá 2MB.<br />
                - Nhấn "Lưu thay đổi" để cập nhật thông tin.
            </p>
            <p className="text-gray-500 text-xs text-left italic bg-yellow-50 p-2 rounded-md border-l-4 border-yellow-400">
                Lưu ý: Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho mục đích quản lý nội bộ.
            </p>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cột thông tin cơ bản */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty</label>
                            <input
                                type="text"
                                name="name"
                                value={companyInfo.name}
                                onChange={handleInputChange}
                                placeholder="Nhập tên công ty"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                name="address"
                                value={companyInfo.address}
                                onChange={handleInputChange}
                                placeholder="Nhập địa chỉ"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                type="tel"
                                name="phone"
                                value={companyInfo.phone}
                                onChange={handleInputChange}
                                placeholder="Nhập số điện thoại"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={companyInfo.email}
                                onChange={handleInputChange}
                                placeholder="Nhập email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Cột logo và mô tả */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Logo công ty</label>
                            <div className="flex items-start gap-4">
                                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-gray-50">
                                    <img
                                        src={logoPreview || companyInfo.logo}
                                        alt="Logo công ty"
                                        className="max-w-full max-h-full object-contain"
                                        onError={(e) => {
                                            e.target.src = '/images/default-logo.png';
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        id="logo-upload"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className="inline-block px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer transition"
                                    >
                                        Chọn ảnh
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">Định dạng: JPG, PNG (tối đa 2MB)</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu công ty</label>
                            <textarea
                                name="description"
                                value={companyInfo.description}
                                onChange={handleInputChange}
                                rows={5}
                                placeholder="Nhập mô tả về công ty"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 rounded text-white font-medium ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} transition`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang lưu...
                            </span>
                        ) : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
}