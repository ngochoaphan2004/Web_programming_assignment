"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Thêm useRouter để điều hướng
import '../css.css';
import axiosConfig from '@/axiosConfig';
import ConfirmCustom from '../../../../components/comfirm/comfirm';
import { AnimatePresence, motion } from "motion/react";

export default function CompanyInfoEditor() {
    const router = useRouter(); // Khởi tạo router
    const [companyInfo, setCompanyInfo] = useState({
        id: "",
        name: "",
        phone: "",
        email: "",
        description: "",
        address: [],
        logo: '/logo.png'
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isHelper, setIsHelper] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleOpenConfirm = () => {
        setShowConfirm(true);
    };

    const handleConfirmSubmit = async () => {
        setIsSubmitting(true);

        await axiosConfig.post('shop/info/update', { ...companyInfo }, {
            withCredentials: true,
        })
            .then((response) => {
                console.log(response);
                if (!response.data.success) {
                    setShowError(true);
                    setIsSubmitting(false);
                    return;
                }
                setIsSubmitting(false);
                setShowSuccess(true);
            })
            .catch(() => {
                setShowError(true);
            });
        setShowConfirm(false);
    };

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

    // Hàm điều hướng tới trang /admin/intro
    const handleNavigateToIntro = () => {
        router.push('/admin/intro');
    };

    useEffect(() => {
        async function fetchData() {
            await axiosConfig.get('shop/info')
                .then((response) => {
                    const data = response.data;
                    setCompanyInfo({
                        id: data['id'],
                        name: data['name'],
                        email: data['email'],
                        phone: data['phone'],
                        address: data['addresses'],
                        description: data['description'],
                        logo: '/logo.png'
                    });
                });
        }
        fetchData();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex gap-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-start">Cập nhật thông tin công ty</h2>
                <button onClick={() => setIsHelper(prev => !prev)}>
                    <i className="bi bi-question-octagon-fill self-center"></i>
                </button>
            </div>
            {isHelper &&
                <div className='overflow-y-auto fade-in'>
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
                </div>
            }

            <div className="bg-white rounded-lg">
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
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                name="address1"
                                value={companyInfo.address?.[0]?.address || ''} 
                                onChange={(e) => {
                                    setCompanyInfo(prev => {
                                        const updatedAddress = [...prev.address];
                                        updatedAddress[0] = { id: prev.address[0]?.id || '', address: e.target.value };
                                        return { ...prev, address: updatedAddress };
                                    });
                                }}
                                placeholder="Nhập địa chỉ 1"
                                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="address2"
                                value={companyInfo.address?.[1]?.address || ''}  
                                onChange={(e) => {
                                    setCompanyInfo(prev => {
                                        const updatedAddress = [...prev.address];
                                        updatedAddress[1] = { id: prev.address[1]?.id || '', address: e.target.value };
                                        return { ...prev, address: updatedAddress };
                                    });
                                }}
                                placeholder="Nhập địa chỉ 2"
                                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                <div className="mt-8 flex justify-end gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={() => handleOpenConfirm(true)}
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
                    <button
                        type="button"
                        onClick={handleNavigateToIntro}
                        className="px-6 py-2 rounded text-white font-medium bg-green-600 hover:bg-green-700 transition"
                    >
                        Trang Giới Thiệu
                    </button>
                </div>
                <AnimatePresence mode='wait'>
                    {showConfirm && (<ConfirmCustom isComfirm handleCancelConfirm={() => setShowConfirm(false)} handleConfirmSubmit={handleConfirmSubmit} />)}
                </AnimatePresence>
                <AnimatePresence mode='wait'>
                    {showSuccess && (<ConfirmCustom isSuccessful handleCancelConfirm={() => setShowSuccess(false)} />)}
                </AnimatePresence>
                <AnimatePresence mode='wait'>
                    {showError && (<ConfirmCustom isError handleCancelConfirm={() => setShowError(false)} />)}
                </AnimatePresence>
            </div>
        </div>
    );
}