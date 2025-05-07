"use client";

import { useState, useEffect } from 'react';
import axiosConfig from '@/axiosConfig';
import { AnimatePresence } from 'framer-motion';
import ConfirmCustom from '../../../../components/comfirm/comfirm1';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        password: false,
        newPassword: false,
        confirmPassword: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleShowPassword = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setShowError(false);
        setErrorMessage('');

        // Kiểm tra client-side
        if (!formData.password) {
            setErrorMessage('Vui lòng nhập mật khẩu hiện tại.');
            setShowError(true);
            setIsSubmitting(false);
            return;
        }
        if (!formData.newPassword) {
            setErrorMessage('Vui lòng nhập mật khẩu mới.');
            setShowError(true);
            setIsSubmitting(false);
            return;
        }
        if (formData.newPassword === formData.password) {
            setErrorMessage('Mật khẩu mới phải khác mật khẩu hiện tại.');
            setShowError(true);
            setIsSubmitting(false);
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage('Mật khẩu mới và xác nhận không khớp.');
            setShowError(true);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axiosConfig.post('/user/change-password', {
                password: formData.password,
                new_password: formData.newPassword
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.data.success) {
                setShowSuccess(true);
                setFormData({ password: '', newPassword: '', confirmPassword: '' });
                setShowPassword({ password: false, newPassword: false, confirmPassword: false });
            } else {
                setErrorMessage(response.data.message || 'Đổi mật khẩu thất bại.');
                setShowError(true);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
            setShowError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Tự động đóng thông báo lỗi sau 5 giây
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-start">Thay đổi mật khẩu</h2>
            <div className="bg-white rounded-lg p-6 shadow-md max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                        <input
                            type={showPassword.password ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Nhập mật khẩu hiện tại"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => toggleShowPassword('password')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 top-6"
                        >
                            {showPassword.password ? (
                                <FaEyeSlash className="h-5 w-5 text-gray-500" />
                            ) : (
                                <FaEye className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                        <input
                            type={showPassword.newPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Nhập mật khẩu mới"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => toggleShowPassword('newPassword')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 top-6"
                        >
                            {showPassword.newPassword ? (
                                <FaEyeSlash className="h-5 w-5 text-gray-500" />
                            ) : (
                                <FaEye className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                        <input
                            type={showPassword.confirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Xác nhận mật khẩu mới"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => toggleShowPassword('confirmPassword')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 top-6"
                        >
                            {showPassword.confirmPassword ? (
                                <FaEyeSlash className="h-5 w-5 text-gray-500" />
                            ) : (
                                <FaEye className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                    <div className="flex justify-end">
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
                                    Đang xử lý...
                                </span>
                            ) : 'Đổi mật khẩu'}
                        </button>
                    </div>
                </form>
            </div>
            <AnimatePresence mode='wait'>
                {showSuccess && (
                    <ConfirmCustom
                        isSuccessful
                        handleCancelConfirm={() => setShowSuccess(false)}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence mode='wait'>
                {showError && (
                    <ConfirmCustom
                        isError
                        handleCancelConfirm={() => setShowError(false)}
                        errorMessage={errorMessage}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}