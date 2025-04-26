"use client"
import React, { useState, useEffect } from 'react';
import axiosConfig from '../../../axiosConfig';

import '../css.css'

export default function CustomerFeedbackManager() {
    const [sourceList, setSourceList] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOption, setSortOption] = useState("latest");
    const [expandedRows, setExpandedRows] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const reload = () => {
        axiosConfig.get('contacts').then((res) => {
            if (res.data && res.data.length != 0) {
                setSourceList(res.data);
                setFeedbacks([...res.data].sort((a, b) => { return new Date(b.created_at) - new Date(a.created_at); }))
            }
        }).catch((err) => {
            console.error('Error:', err);
        });
    }

    useEffect(() => {
        reload()
        setIsLoading(false)
    }, []);

    const chaneLocalStatus = (id, newStatus) => {
        setFeedbacks(prev =>
            prev.map(item =>
                item.id === id ? { ...item, status: newStatus } : item
            )
        );
        setSourceList(prev =>
            prev.map(item =>
                item.id === id ? { ...item, status: newStatus } : item
            )
        );
    };

    const updateStatus = async (id, newstatus) => {
        await axiosConfig.put('/contacts',{
            id: id, status: newstatus
        }).then((res)=>{
            if(! res.data.error){
                chaneLocalStatus(id, newstatus)
            }
        }).catch((err)=>{
            if (err.response) {
                console.error('Server Error:', err.response.status, err.response.data);
            } else if (err.request) {
                console.error('No Response:', err.request);
            } else {
                console.error('Request Error:', err.message);
            }
        })
    }

    const deleteFeedback = async (id) => {
        if (confirm("Bạn chắc chắn muốn xóa phản hồi này?")) {
            setIsAnimating(true);
            await axiosConfig.delete(`contacts?id=${id}`).then((res) => {
                if (!res.data.error) {
                    toggleRow(null)
                    reload()
                }
            }).catch((err) => {
                if (err.response) {
                    console.error('Server Error:', err.response.status, err.response.data);
                } else if (err.request) {
                    console.error('No Response:', err.request);
                } else {
                    console.error('Request Error:', err.message);
                }
            }).finally(() => {
                setIsAnimating(false);
            });
        }
    };

    const toggleRow = (feedback) => {
        if (expandedRows == null) {
            setExpandedRows(feedback);
        }
        else {
            setExpandedRows(null);
        }
    };

    function sortList() {
        if (sortOption === "latest" || sortOption === "oldest") {
            setFeedbacks([...sourceList].sort((a, b) => {
                switch (sortOption) {
                    case "latest":
                        return new Date(b.created_at) - new Date(a.created_at);
                    case "oldest":
                        return new Date(a.created_at) - new Date(b.created_at);
                    default:
                        return 0;
                }
            }));
        } else {
            setFeedbacks([...sourceList].filter((a) => a.status == sortOption))
        }
    }

    useEffect(() => {
        sortList()
    }, [sortOption])

    const getStatusClass = (status) => {
        switch (status) {
            case "pending":
                return { bg: "bg-red-50", border: "border-red-400", text: "text-red-700" };
            case "read":
                return { bg: "bg-yellow-50", border: "border-yellow-400", text: "text-yellow-700" };
            case "replied":
                return { bg: "bg-green-50", border: "border-green-400", text: "text-green-700" };
            default:
                return { bg: "bg-gray-50", border: "border-gray-400", text: "text-gray-700" };
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Quản lý phản hồi khách hàng</h2>
                <div className="flex justify-end font-sans">
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="align-bottom px-3 py-1 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 hover:shadow-md"
                    >
                        <option value="latest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="pending">Chưa đọc</option>
                        <option value="read">Đã đọc</option>
                        <option value="replied">Đã phản hồi</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full spin"></div>
                </div>
            ) : (
                <>
                    {feedbacks.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">#</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Tên</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Email</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Trạng thái</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Ngày gửi</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider min-w-[120px]">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {feedbacks.map((feedback, index) => {
                                        const statusClass = getStatusClass(feedback.status);

                                        return (
                                            <tr 
                                                key={feedback.id} 
                                                className={`${statusClass.bg} hover:${statusClass.bg.replace('50', '100')} table-row fade-in`}
                                                style={{ animationDelay: `${index * 0.05}s` }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{feedback.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`flex justify-center min-w-[85px] w-full px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass.text} ${statusClass.bg.replace('50', '100')} transition-colors duration-200`}>
                                                        <span>
                                                            {feedback.status === "pending" ? "Chưa đọc" :
                                                                feedback.status === "read" ? "Đã đọc" :
                                                                    feedback.status === "replied" ? "Đã phản hồi" : feedback.status}
                                                        </span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(feedback.created_at).toLocaleString("vi-VN")}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                                    <button
                                                        onClick={async() => {
                                                            if(feedback.status !== "replied"){
                                                                await updateStatus(feedback.id, 'read')
                                                                feedback.status = "read"
                                                            }
                                                            toggleRow(feedback)
                                                        }}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors duration-200"
                                                    >Xem</button>
                                                    <button
                                                        onClick={() => deleteFeedback(feedback.id)}
                                                        className={`text-red-600 hover:text-red-900 transition-colors duration-200 ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={isAnimating}
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {expandedRows !== null && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                                    <div className="bg-white rounded-lg w-full max-w-2xl md:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto slide-in">
                                        <div className="p-4 sm:p-6">
                                            <div className="flex flex-row justify-between gap-4 mb-4 sm:mb-6">
                                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Chi tiết phản hồi</h3>
                                                <button
                                                    onClick={() => toggleRow(expandedRows)}
                                                    className="self-start sm:self-start text-black hover:text-gray-700 h-fit transition-colors duration-200"
                                                >
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4 sm:mb-6">
                                                <div className="flex-1 space-y-2 sm:space-y-0">
                                                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-sm">
                                                        <div>
                                                            <p className="font-medium text-gray-500">Tên</p>
                                                            <p className="text-gray-800 truncate">{expandedRows.name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-500">Email</p>
                                                            <p className="text-gray-800 truncate">{expandedRows.email}</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-500">Trạng thái</p>
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(expandedRows.status).text} ${getStatusClass(expandedRows.status).bg.replace('50', '100')}`}>
                                                                {expandedRows.status === "pending" ? "Chưa đọc" :
                                                                    expandedRows.status === "read" ? "Đã đọc" :
                                                                        expandedRows.status === "replied" ? "Đã phản hồi" : expandedRows.status}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-500">Ngày gửi</p>
                                                            <p className="text-gray-800 text-xs sm:text-sm">
                                                                {new Date(expandedRows.created_at).toLocaleString("vi-VN")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 sm:space-y-6">
                                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-sm">
                                                    <h5 className="font-medium text-sm text-gray-800 mb-2">Nội dung góp ý:</h5>
                                                    <p className="whitespace-pre-line text-gray-700 text-sm sm:text-base">
                                                        {expandedRows.message}
                                                    </p>
                                                </div>

                                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-emerald-200 transition-all duration-200 hover:shadow-sm">
                                                    <label className="block text-sm font-medium text-emerald-800 mb-2">
                                                        Phản hồi của cửa hàng:
                                                    </label>
                                                    <textarea
                                                        defaultValue={expandedRows.answer || ""}
                                                        onChange={(e) => {
                                                            setExpandedRows(prev => ({ ...prev, answer: e.target.value }))
                                                        }}
                                                        className="w-full p-2 sm:p-3 rounded-md border border-emerald-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-100 disabled:text-gray-500 text-sm sm:text-base transition-all duration-200"
                                                        rows={4}
                                                        placeholder="Nhập phản hồi tại đây..."
                                                        disabled={expandedRows.status === "replied"}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-0">
                                                <div className="flex justify-center sm:justify-start">
                                                    <button
                                                        onClick={() => deleteFeedback(expandedRows.id)}
                                                        className={`px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 w-full sm:w-auto transition-colors duration-200 ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={isAnimating}
                                                    >
                                                        Xóa phản hồi
                                                    </button>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                                    {expandedRows.status === "read" && (
                                                        <button
                                                            onClick={() => {
                                                                updateStatus(expandedRows.id, 'pending');
                                                                toggleRow(null);
                                                            }}
                                                            className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 w-full sm:w-auto transition-colors duration-200"
                                                        >
                                                            Đánh dấu chưa đọc
                                                        </button>
                                                    )}
                                                    {expandedRows.status !== "replied" && (
                                                        <button
                                                            onClick={() => {
                                                                axiosConfig.post('contacts/answer', {
                                                                    id: expandedRows.id,
                                                                    answer: expandedRows.answer
                                                                }
                                                                ).then((res) => {
                                                                    if (!res.data.error) {
                                                                        chaneLocalStatus(expandedRows.id, 'replied');
                                                                        toggleRow(null);
                                                                    }
                                                                }).catch((err) => {
                                                                    if (err.response) {
                                                                        console.error('Server Error:', err.response.status, err.response.data);
                                                                    } else if (err.request) {
                                                                        console.error('No Response:', err.request);
                                                                    } else {
                                                                        console.error('Request Error:', err.message);
                                                                    }
                                                                });
                                                            }}
                                                            className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 w-full sm:w-auto transition-colors duration-200"
                                                            disabled={expandedRows.status === "replied"}
                                                        >
                                                            Lưu phản hồi
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8 fade-in">Không có phản hồi nào</p>
                    )}
                </>
            )}
        </div>
    );
}