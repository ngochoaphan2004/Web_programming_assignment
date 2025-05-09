"use client";

import { useEffect, useState } from "react";
import axiosConfig from '../../../axiosConfig';

const QuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [showFeedback, setShowFeedback] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const QUESTIONS_PER_PAGE = 5;
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "" });
  const [newAnswer, setNewAnswer] = useState({});
  const [message, setMessage] = useState("");
  const [showAskQuestion, setShowAskQuestion] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [showUserContent, setShowUserContent] = useState(true);
  const [confirmation, setConfirmation] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const offset = page - 1;
        const response = await axiosConfig.get(`question?offset=${offset}`);
        setQuestions(response.data);
        setHasMore(response.data.length === QUESTIONS_PER_PAGE);
        console.log("Questions fetched:", response.data);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Lỗi khi lấy câu hỏi:", error);
        setMessage("Không thể tải danh sách câu hỏi. Vui lòng thử lại.");
        setShowAlert(true);
      }
    };

    fetchQuestions();
  }, [page]);

  useEffect(() => {
    const fetchUserContentAndRole = async () => {
      setIsLoading(true);
      try {
        const userRes = await axiosConfig.get('user/now', { withCredentials: true });
        console.log("User data from /user/now:", userRes.data);

        const isAuthenticatedStatus = userRes.data.success && userRes.data.data;
        setIsAuthenticated(isAuthenticatedStatus);

        if (isAuthenticatedStatus) {
          const isAdminStatus = userRes.data.data.role === 1;
          setIsAdmin(isAdminStatus);
          console.log("isAdmin set to:", isAdminStatus);

          const [questionsRes, answersRes] = await Promise.all([
            axiosConfig.get('user/questions', { withCredentials: true }),
            axiosConfig.get('user/answers', { withCredentials: true }),
          ]);
          setUserQuestions(questionsRes.data);
          setUserAnswers(answersRes.data);
        } else {
          setUserQuestions([]);
          setUserAnswers([]);
          console.log("User not authenticated, skipping user content fetch");
        }
      } catch (error) {
        console.error("Lỗi khi lấy nội dung người dùng hoặc vai trò:", error);
        setIsAuthenticated(false);
        setUserQuestions([]);
        setUserAnswers([]);
        setMessage("Vui lòng đăng nhập để xem nội dung của bạn.");
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserContentAndRole();
  }, []);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isAuthenticated) {
      setMessage("Vui lòng đăng nhập để đặt câu hỏi!");
      setShowAlert(true);
      return;
    }

    if (!newQuestion.title || !newQuestion.content) {
      setMessage("Vui lòng nhập đầy đủ tiêu đề và nội dung câu hỏi!");
      setShowAlert(true);
      return;
    }

    try {
      const response = await axiosConfig.post(
        'question/create',
        {
          title: newQuestion.title,
          content: newQuestion.content,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      if (response.data.success) {
        setNewQuestion({ title: "", content: "" });
        setPage(1);
        const offset = 0;
        const questionResponse = await axiosConfig.get(`question?offset=${offset}`);
        setQuestions(questionResponse.data);
        setShowAskQuestion(false);
        if (isAuthenticated) {
          const userQuestionsRes = await axiosConfig.get('user/questions', { withCredentials: true });
          setUserQuestions(userQuestionsRes.data);
        }
        window.scrollTo(0, 0);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi gửi câu hỏi. Vui lòng thử lại.";
      setMessage(errorMessage);
      setShowAlert(true);
      console.error("Lỗi khi gửi câu hỏi:", error);
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    setMessage("");

    if (!isAuthenticated) {
      setMessage("Vui lòng đăng nhập để trả lời câu hỏi!");
      setShowAlert(true);
      return;
    }

    const content = newAnswer[questionId] || "";
    if (!content) {
      setMessage("Vui lòng nhập nội dung câu trả lời!");
      setShowAlert(true);
      return;
    }

    try {
      const response = await axiosConfig.post(
        'answer/create',
        {
          question_id: questionId,
          content,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      if (response.data.success) {
        setNewAnswer((prev) => ({ ...prev, [questionId]: "" }));
        const offset = page - 1;
        const questionResponse = await axiosConfig.get(`question?offset=${offset}`);
        setQuestions(questionResponse.data);
        if (isAuthenticated) {
          const userAnswersRes = await axiosConfig.get('user/answers', { withCredentials: true });
          setUserAnswers(userAnswersRes.data);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi gửi câu trả lời. Vui lòng thử lại.";
      setMessage(errorMessage);
      setShowAlert(true);
      console.error("Lỗi khi gửi câu trả lời:", error);
    }
  };

  const handleEditQuestion = async (questionId) => {
    if (!isAuthenticated) {
      setMessage("Vui lòng đăng nhập để chỉnh sửa câu hỏi!");
      setShowAlert(true);
      return;
    }

    if (!editingQuestion?.title || !editingQuestion?.content) {
      setMessage("Vui lòng nhập đầy đủ tiêu đề và nội dung câu hỏi!");
      setShowAlert(true);
      return;
    }

    try {
      const response = await axiosConfig.put(
        `question/${questionId}`,
        {
          question_id: questionId,
          title: editingQuestion.title,
          content: editingQuestion.content,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(response.data.message);
      if (response.data.success) {
        setEditingQuestion(null);
        const [questionsRes, userQuestionsRes] = await Promise.all([
          axiosConfig.get(`question?offset=${page - 1}`),
          isAuthenticated
            ? axiosConfig.get('user/questions', { withCredentials: true })
            : Promise.resolve({ data: [] }),
        ]);
        setQuestions(questionsRes.data);
        setUserQuestions(userQuestionsRes.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi chỉnh sửa câu hỏi. Vui lòng thử lại.";
      setMessage(errorMessage);
      setShowAlert(true);
      console.error("Lỗi khi chỉnh sửa câu hỏi:", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!isAuthenticated) {
      setMessage("Vui lòng đăng nhập để xóa câu hỏi!");
      setShowAlert(true);
      return;
    }

    try {
      const response = await axiosConfig.delete(`question/${questionId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        data: { question_id: questionId },
      });
      setMessage(response.data.message);
      if (response.data.success) {
        const [questionsRes, userQuestionsRes] = await Promise.all([
          axiosConfig.get(`question?offset=${page - 1}`),
          isAuthenticated
            ? axiosConfig.get('user/questions', { withCredentials: true })
            : Promise.resolve({ data: [] }),
        ]);
        setQuestions(questionsRes.data);
        setUserQuestions(userQuestionsRes.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi xóa câu hỏi. Vui lòng thử lại.";
      setMessage(errorMessage);
      setShowAlert(true);
      console.error("Lỗi khi xóa câu hỏi:", error);
    }
  };

  const handleEditAnswer = async (answerId) => {
    if (!isAuthenticated) {
      setMessage("Vui lòng đăng nhập để chỉnh sửa câu trả lời!");
      setShowAlert(true);
      return;
    }

    if (!editingAnswer?.content) {
      setMessage("Vui lòng nhập nội dung câu trả lời!");
      setShowAlert(true);
      return;
    }

    try {
      const response = await axiosConfig.put(
        `answer/${answerId}`,
        {
          answer_id: answerId,
          content: editingAnswer.content,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(response.data.message);
      if (response.data.success) {
        setEditingAnswer(null);
        const [questionsRes, userAnswersRes] = await Promise.all([
          axiosConfig.get(`question?offset=${page - 1}`),
          isAuthenticated
            ? axiosConfig.get('user/answers', { withCredentials: true })
            : Promise.resolve({ data: [] }),
        ]);
        setQuestions(questionsRes.data);
        setUserAnswers(userAnswersRes.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi chỉnh sửa câu trả lời. Vui lòng thử lại.";
      setMessage(errorMessage);
      setShowAlert(true);
      console.error("Lỗi khi chỉnh sửa câu trả lời:", error);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!isAuthenticated) {
      setMessage("Vui lòng đăng nhập để xóa câu trả lời!");
      setShowAlert(true);
      return;
    }

    try {
      const response = await axiosConfig.delete(`answer/${answerId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        data: { answer_id: answerId },
      });
      setMessage(response.data.message);
      if (response.data.success) {
        const [questionsRes, userAnswersRes] = await Promise.all([
          axiosConfig.get(`question?offset=${page - 1}`),
          isAuthenticated
            ? axiosConfig.get('user/answers', { withCredentials: true })
            : Promise.resolve({ data: [] }),
        ]);
        setQuestions(questionsRes.data);
        setUserAnswers(userAnswersRes.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi xóa câu trả lời. Vui lòng thử lại.";
      setMessage(errorMessage);
      setShowAlert(true);
      console.error("Lỗi khi xóa câu trả lời:", error);
    }
  };

  const confirmAction = async () => {
    if (!confirmation) return;

    const { action, id, data } = confirmation;
    if (action === 'editQuestion') {
      setEditingQuestion(data);
    } else if (action === 'deleteQuestion') {
      await handleDeleteQuestion(id);
    } else if (action === 'editAnswer') {
      setEditingAnswer(data);
    } else if (action === 'deleteAnswer') {
      await handleDeleteAnswer(id);
    }
    setConfirmation(null);
  };

  const cancelAction = () => {
    setConfirmation(null);
  };

  const toggleFeedback = (questionId) => {
    setShowFeedback((prevId) => (prevId === questionId ? null : questionId));
  };

  const toggleAskQuestion = () => {
    if (!isAuthenticated) {
      setMessage("Vui lòng đăng nhập để đặt câu hỏi!");
      setShowAlert(true);
      return;
    }
    setShowAskQuestion((prev) => !prev);
  };

  const toggleUserContent = () => {
    if (!isAuthenticated) {
      setMessage("Vui lòng đăng nhập để xem nội dung của bạn!");
      setShowAlert(true);
      return;
    }
    setShowUserContent((prev) => !prev);
  };

  const closeAlert = () => {
    setShowAlert(false);
    setMessage("");
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        closeAlert();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <p className="text-center text-gray-600">Đang tải...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
            <p
              className={`text-center ${
                message.includes("thành công") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
            <button
              onClick={closeAlert}
              className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {confirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
            <p className="text-center text-gray-800">
              {confirmation.action.includes('edit')
                ? "Bạn có chắc muốn chỉnh sửa nội dung này?"
                : "Bạn có chắc muốn xóa nội dung này? Hành động này không thể hoàn tác."}
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={confirmAction}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-200"
              >
                Xác nhận
              </button>
              <button
                onClick={cancelAction}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-200"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl !font-thin mb-6 w-full text-center my-5">HỎI ĐÁP</h1>
      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((q) => (
            <div
              key={q.question_id}
              className="group border rounded-lg p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300 relative"
            >
              <h3 className="font-bold text-2xl text-gray-800">{q.title}</h3>
              <p className="text-gray-600 text-lg mt-2">{q.content}</p>
              <p className="text-base text-gray-700 mt-1">Người hỏi: {q.name}</p>
              <p className="text-xs text-gray-400">{q.created_at}</p>

              {isAdmin && (
                <button
                  onClick={() =>
                    setConfirmation({
                      action: 'deleteQuestion',
                      id: q.question_id,
                    })
                  }
                  className="absolute top-4 right-4 bg-transparent border border-red-500 text-red-500 px-4 py-2 rounded group-hover:opacity-100 hover:bg-[#f5f5f5] hover:shadow-md transition-all duration-200 z-10"
                >
                  Xóa
                </button>
              )}

              <button
                onClick={() => toggleFeedback(q.question_id)}
                className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 focus:outline-none transition-all duration-200"
              >
                <span className="mr-2">
                  {showFeedback === q.question_id ? "Ẩn câu trả lời" : "Xem câu trả lời"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform ${showFeedback === q.question_id ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showFeedback === q.question_id && (
                <div className="mt-4 text-gray-700 space-y-2">
                  {q.answers?.length > 0 ? (
                    q.answers.map((a) => (
                      <div
                        key={a.id}
                        className="group border p-3 rounded-md bg-gray-50 relative"
                      >
                        <p className="font-medium">{a.name}</p>
                        <p>{a.content}</p>
                        <p className="text-xs text-gray-400">{a.created_at}</p>
                        {isAdmin && (
                          <button
                            onClick={() =>
                              setConfirmation({
                                action: 'deleteAnswer',
                                id: a.id,
                              })
                            }
                            className="absolute top-4 right-4 bg-transparent border border-red-500 text-red-500 px-4 py-2 rounded group-hover:opacity-100 hover:bg-[#f5f5f5] hover:shadow-md transition-all duration-200 z-10"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>Chưa có câu trả lời nào cho câu hỏi này.</p>
                  )}
                </div>
              )}

              <div className="mt-6">
                {isAuthenticated ? (
                  <>
                    <textarea
                      rows={3}
                      placeholder="Nhập câu trả lời của bạn..."
                      className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      value={newAnswer[q.question_id] || ""}
                      onChange={(e) =>
                        setNewAnswer((prev) => ({
                          ...prev,
                          [q.question_id]: e.target.value,
                        }))
                      }
                    ></textarea>
                    <button
                      onClick={() => handleAnswerSubmit(q.question_id)}
                      className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-all duration-200"
                    >
                      Gửi câu trả lời
                    </button>
                  </>
                ) : (
                  <p className="text-red-600">
                    Vui lòng <a href="/sign-in" className="underline">đăng nhập</a> để trả lời câu hỏi.
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Không có câu hỏi nào.</p>
        )}
      </div>

      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-40"
        >
          Trang trước
        </button>
        <span>Trang {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore}
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-40"
        >
          Trang sau
        </button>
      </div>

      <section className="mt-16">
        {isAuthenticated ? (
          <button
            onClick={toggleAskQuestion}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition-all duration-200"
          >
            {showAskQuestion ? "Ẩn biểu mẫu" : "Đặt câu hỏi"}
          </button>
        ) : (
          <p className="text-red-600">
            Vui lòng <a href="/sign-in" className="underline">đăng nhập</a> để đặt câu hỏi.
          </p>
        )}
        {showAskQuestion && isAuthenticated && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Tiêu chí đặt câu hỏi</h2>
            <ul className="list-disc list-inside mb-8 text-gray-700 space-y-2">
              <li>Nêu rõ vấn đề bạn đang gặp phải.</li>
              <li>Cung cấp thông tin cần thiết như mã nguồn, dữ liệu, thông báo lỗi.</li>
              <li>Tránh đặt những câu hỏi quá chung chung.</li>
              <li>Giữ thái độ lịch sự, tôn trọng người trả lời.</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-4">Gửi câu hỏi của bạn</h2>
            <form onSubmit={handleAskQuestion} className="space-y-4">
              <input
                type="text"
                placeholder="Tiêu đề câu hỏi"
                className="w-full border p-3 rounded"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              />
              <textarea
                rows={4}
                placeholder="Nội dung câu hỏi"
                className="w-full border p-3 rounded"
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
              ></textarea>
              <button
                type="submit"
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
              >
                Gửi câu hỏi
              </button>
            </form>
          </div>
        )}
      </section>

      {isAuthenticated && (
        <section className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Câu hỏi và câu trả lời của bạn
            </h2>
            <button
              onClick={toggleUserContent}
              className="bg-transparent border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition-all duration-200"
            >
              {showUserContent ? "Ẩn nội dung" : "Hiện nội dung"}
            </button>
          </div>

          {showUserContent && (
            <>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Câu hỏi của bạn
                </h3>
                {userQuestions.length > 0 ? (
                  userQuestions.map((q) => (
                    <div
                      key={q.question_id}
                      className="border rounded-lg p-6 mb-4 bg-white shadow-md"
                    >
                      {editingQuestion?.question_id === q.question_id ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleEditQuestion(q.question_id);
                          }}
                          className="space-y-4"
                        >
                          <input
                            type="text"
                            className="w-full border p-3 rounded"
                            value={editingQuestion.title}
                            onChange={(e) =>
                              setEditingQuestion({
                                ...editingQuestion,
                                title: e.target.value,
                              })
                            }
                          />
                          <textarea
                            rows={4}
                            className="w-full border p-3 rounded"
                            value={editingQuestion.content}
                            onChange={(e) =>
                              setEditingQuestion({
                                ...editingQuestion,
                                content: e.target.value,
                              })
                            }
                          ></textarea>
                          <div className="flex space-x-2">
                            <button
                              type="submit"
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                              Lưu chỉnh sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingQuestion(null)}
                              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                              Hủy
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <h4 className="font-bold text-lg text-gray-800">{q.title}</h4>
                          <p className="text-gray-600 mt-2">{q.content}</p>
                          <p className="text-xs text-gray-400 mt-1">{q.created_at}</p>
                          <div className="flex space-x-2 mt-4">
                            <button
                              onClick={() =>
                                setConfirmation({
                                  action: 'editQuestion',
                                  id: q.question_id,
                                  data: {
                                    question_id: q.question_id,
                                    title: q.title,
                                    content: q.content,
                                  },
                                })
                              }
                              className="bg-transparent border border-yellow-500 text-yellow-500 px-4 py-2 rounded hover:bg-yellow-500 hover:text-white transition-all duration-200"
                            >
                              Chỉnh sửa
                            </button>
                            <button
                              onClick={() =>
                                setConfirmation({
                                  action: 'deleteQuestion',
                                  id: q.question_id,
                                })
                              }
                              className="bg-transparent border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-all duration-200"
                            >
                              Xóa
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Bạn chưa đặt câu hỏi nào.</p>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Câu trả lời của bạn
                </h3>
                {userAnswers.length > 0 ? (
                  userAnswers.map((a) => (
                    <div
                      key={a.id}
                      className="border rounded-lg p-6 mb-4 bg-white shadow-md"
                    >
                      {editingAnswer?.id === a.id ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleEditAnswer(a.id);
                          }}
                          className="space-y-4"
                        >
                          <textarea
                            rows={3}
                            className="w-full border p-3 rounded"
                            value={editingAnswer.content}
                            onChange={(e) =>
                              setEditingAnswer({
                                ...editingAnswer,
                                content: e.target.value,
                              })
                            }
                          ></textarea>
                          <div className="flex space-x-2">
                            <button
                              type="submit"
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                              Lưu chỉnh sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingAnswer(null)}
                              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                              Hủy
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="mb-4">
                            <h4 className="font-bold text-lg text-gray-800">
                              Câu hỏi: {a.question_title}
                            </h4>
                            <p className="text-gray-600 mt-2">{a.question_content}</p>
                          </div>
                          <p className="text-gray-600 font-medium">Câu trả lời của bạn:</p>
                          <p className="text-gray-600">{a.content}</p>
                          <p className="text-xs text-gray-400 mt-1">{a.created_at}</p>
                          <div className="flex space-x-2 mt-4">
                            <button
                              onClick={() =>
                                setConfirmation({
                                  action: 'editAnswer',
                                  id: a.id,
                                  data: { id: a.id, content: a.content },
                                })
                              }
                              className="bg-transparent border border-yellow-500 text-yellow-500 px-4 py-2 rounded hover:bg-yellow-500 hover:text-white transition-all duration-200"
                            >
                              Chỉnh sửa
                            </button>
                            <button
                              onClick={() =>
                                setConfirmation({
                                  action: 'deleteAnswer',
                                  id: a.id,
                                })
                              }
                              className="bg-transparent border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-all duration-200"
                            >
                              Xóa
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Bạn chưa trả lời câu hỏi nào.</p>
                )}
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
};

export default QuestionPage;