import { AnimatePresence, motion } from "motion/react"
import { FaCheckCircle, FaExclamationCircle, FaQuestionCircle } from 'react-icons/fa'; // Import các icon

export default function ConfirmCustom({ isComfirm, isSuccessful, isError, handleCancelConfirm, handleConfirmSubmit }) {
    let content;
    let color;
    let icon;
    let buttonColor;
    let cancelButtonColor;

    // Chọn nội dung, màu sắc, icon và màu của button tương ứng với từng trạng thái
    if (isComfirm) {
        content = "Bạn có chắc chắn thay đổi?";
        color = "text-gray-500";
        icon = <FaQuestionCircle className="text-gray-500 text-3xl" />;
        buttonColor = "bg-blue-600 hover:bg-blue-700 text-white"; // Màu nút xác nhận
        cancelButtonColor = "bg-gray-200 hover:bg-gray-300 text-gray-700"; // Màu nút huỷ
    } else if (isSuccessful) {
        content = "Thay đổi thành công";
        color = "text-green-500";
        icon = <FaCheckCircle className="text-green-500 text-3xl" />;
        buttonColor = "bg-green-600 hover:bg-green-700 text-white"; // Màu nút xác nhận
        cancelButtonColor = "bg-gray-200 hover:bg-gray-300 text-gray-700"; // Màu nút huỷ
    } else if (isError) {
        content = "Lỗi";
        color = "text-red-500";
        icon = <FaExclamationCircle className="text-red-500 text-3xl" />;
        buttonColor = "bg-red-600 hover:bg-red-700 text-white"; // Màu nút xác nhận
        cancelButtonColor = "bg-gray-200 hover:bg-gray-300 text-gray-700"; // Màu nút huỷ
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div
                initial={{
                    opacity: 0,
                    y: 100,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    y: -100,
                }}
                transition={{
                    duration: 0.2,
                }}
                className="bg-white p-6 rounded-xl shadow-lg w-80 sm:w-96 md:w-104 lg:w-1/3 xl:w-1/4"
            >
                <div className={`flex justify-center mb-4 ${color}`}>
                    {icon}
                </div>
                <p className={`text-center text-md font-semibold mb-6 ${color}`}>
                    {content}
                </p>
                <div className="flex gap-4 w-full justify-center">
                    <button
                        onClick={handleCancelConfirm}
                        className={`px-4 py-2 !rounded-lg ${cancelButtonColor} text-sm font-medium transition`}
                    >
                        Huỷ
                    </button>
                    {(isComfirm) && (
                        <button
                            onClick={handleConfirmSubmit}
                            className={`px-4 py-2 !rounded-lg ${buttonColor} text-sm font-medium transition`}
                        >
                            Xác nhận
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
