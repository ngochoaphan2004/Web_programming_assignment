"use client"
import React, { useState, useEffect } from 'react';
import axiosConfig from '../../../axiosConfig';
import '../css.css'
export default function AccountPage() {
  const [sourceList, setSourceList] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState(0);
  const [expandedRows, setExpandedRows] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHelper, setIsHelper] = useState(false);

  const reload = async () => {
    await axiosConfig.get('users').then((res) => {
      if (res.data && res.data.data.length != 0) {
        setSourceList(res.data.data);
        setAccounts(res.data.data)
      }
    }).catch((err) => {
      console.error('Error:', err);
    });
  }

  useEffect(() => {
    reload()
    setIsLoading(false)
  }, []);

  const toggleRow = (account) => {
    if (expandedRows == null) {
      setExpandedRows(account);
    }
    else {
      setExpandedRows(null);
    }
  };

  function sortList() {
    if (sortOption !== 'All') {
      let sOp = parseInt(sortOption);
      setAccounts([...sourceList].filter((a) => a.role == sOp));
    }
    else {
      setAccounts([...sourceList]);
    }
  }

  useEffect(() => {
    sortList()
  }, [sortOption])

  const getRoleClass = (status) => {
    switch (status) {
      case 1:
        return { bg: "bg-green-50", border: "border-green-400", text: "text-green-700" };
      case 2:
        return { bg: "bg-blue-50", border: "border-blue-400", text: "text-blue-700" };
      default:
        return { bg: "bg-red-50", border: "border-red-400", text: "text-red-700" };
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex gap-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Quản lý tài khoản khách hàng</h2>
          <button onClick={() => setIsHelper(prev => !prev)}>
            <i className="bi bi-question-octagon-fill self-center"></i>
          </button>
        </div>
        <div className="flex justify-end font-sans">
          <select
            onChange={(e) => setSortOption(e.target.value)}
            className="align-bottom px-3 py-1 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 hover:shadow-md"
          >
            <option value="All">Tất cả</option>
            <option value='1'>Quản lý</option>
            <option value='2'>Khách hàng</option>
            <option value='0'>Đã khóa</option>
          </select>
        </div>
      </div>

      {isHelper &&
        <div className='overflow-y-auto fade-in'>
          <AdminUserManagementIntro />
        </div>
      }

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full spin"></div>
        </div>
      ) : (
        <>
          {accounts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">#</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Tên</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider min-w-[130px]">User name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider min-w-[130px]">Loại tài khoản</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Ngày tạo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider min-w-[120px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accounts.map((account, index) => {
                    const roleClass = getRoleClass(account.role);

                    return (
                      <tr
                        key={account.id}
                        className={`${roleClass.bg} hover:${roleClass.bg.replace('50', '100')} table-row fade-in`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`flex justify-center min-w-[85px] w-full px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleClass.text} ${roleClass.bg.replace('50', '100')} transition-colors duration-200`}>
                            <span>
                              {account.role === 1 ? "Nhà quản lý" : account.role === 2 ? "Khách hàng" : "Đã khóa"}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(account.created_at).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                          <button
                            onClick={async () => {
                              toggleRow(account)
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors duration-200"
                          >Xem</button>
                          <button
                            onClick={() => deleteFeedback(account.id)}
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
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Chi tiết người dùng</h3>
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
                              <p className="text-gray-800 truncate">{expandedRows.username}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-500">Email</p>
                              <p className="text-gray-800 truncate">{expandedRows.email}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-500">Loại tài khoản</p>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(expandedRows.role).text} ${getRoleClass(expandedRows.role).bg.replace('50', '100')}`}>
                                {expandedRows.role === 1 ? "Nhà quản lý" : expandedRows.role === 2 ? "Khách hàng" : "Đã khóa"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-500">Ngày tạo</p>
                              <p className="text-gray-800 text-xs sm:text-sm">
                                {new Date(expandedRows.created_at).toLocaleString("vi-VN")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-0">
                        <div className="flex justify-center sm:justify-start">
                          <button
                            onClick={() => { }}
                            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 w-full sm:w-auto transition-colors duration-200 ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isAnimating}
                          >
                            Xóa tài khoản
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          {expandedRows.status !== "replied" && (
                            <button
                              onClick={() => {
                                toggleRow(null);
                              }}
                              className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 w-full sm:w-auto transition-colors duration-200"
                              disabled={expandedRows.status === "replied"}
                            >
                              Lưu thông tin
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
            <p className="text-gray-500 text-center py-8 fade-in">Không có tài khoản nào trong hệ thống</p>
          )}
        </>
      )}
    </div>
  );
}




const AdminUserManagementIntro = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm">
      <p className="text-sm text-gray-700">
        Trang này dành riêng cho <span className="font-medium text-blue-700">quản trị viên</span> để thực hiện các thao tác:
      </p>
      <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
        <li>Xem thông tin chi tiết của từng người dùng</li>
        <li>Reset mật khẩu trong trường hợp người dùng bị quên hoặc cần hỗ trợ</li>
        <li>Khóa hoặc mở khóa tài khoản để đảm bảo an toàn hệ thống</li>
        <li>Theo dõi trạng thái hoạt động và quyền truy cập của người dùng</li>
      </ul>
      <p className="text-xs text-gray-500 mt-3">
        ⚠️ Chỉ quản trị viên mới có quyền truy cập và sử dụng các chức năng này.
      </p>
    </div>
  );
};