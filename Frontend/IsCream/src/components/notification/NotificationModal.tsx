import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { NotifyItem } from "../../types/notification";

interface NotificationModalProps {
  notifications: NotifyItem[];
  onClose: () => void;
  onMarkAsRead: (notifyId: number) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  onClose,
  onMarkAsRead
}) => {
  const navigate = useNavigate();

  // body 스크롤 제어
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleNotificationClick = (notification: NotifyItem) => {
    onMarkAsRead(notification.notifyId);

    if (notification.postId) {
      switch (notification.type) {
        case "NOTIFY_COMMENT":
        case "NOTIFY_LIKE":
          navigate(`/board/detail/${notification.postId}`);
          break;
      }
    } else if (notification.type === "NOTIFY_CHAT") {
      // 여기에 채팅방으로 이동하는 추가 로직 필요
      // 예를 들어, 채팅 목록 페이지로 이동하거나 다른 처리 필요
      navigate("/chat");
    }

    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;

    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16">
      {/* 블러 처리된 배경 */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* 모달 컨테이너 */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md max-h-[80vh] overflow-hidden animate-slideDown z-[101]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 p-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-semibold text-gray-800">알림</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              새로운 알림 {notifications.filter((n) => !n.read).length}개
            </span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 알림 목록 컨테이너 */}
        <div className="overflow-y-auto max-h-[calc(80vh-4rem)]">
          <div className="p-4">
            {notifications.length > 0 ? (
              // 최신 순으로 정렬
              [...notifications]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((notification) => (
                  <div
                    key={notification.notifyId}
                    onClick={() => handleNotificationClick(notification)}
                    className={`group relative p-4 mb-3 rounded-xl cursor-pointer transition-all duration-200
                   ${
                     notification.read
                       ? "bg-gray-50 hover:bg-gray-100"
                       : "bg-blue-50 hover:bg-blue-100"
                   }
                   border border-transparent hover:border-gray-200
                   hover:shadow-md`}
                  >
                    {/* 읽지 않은 알림 표시 */}
                    {!notification.read && (
                      <span className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full" />
                    )}

                    {/* 알림 유형 아이콘 */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full 
                     ${notification.read ? "bg-gray-100" : "bg-blue-100"}`}
                      >
                        {notification.type === "NOTIFY_COMMENT" ? (
                          <svg
                            className="w-4 h-4 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.content}
                        </p>
                        <p className="text-gray-400 text-xs mt-2 flex items-center gap-2">
                          <span>{formatDate(notification.createdAt)}</span>
                          {notification.read && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              읽음
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.035 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p className="text-gray-500">알림이 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
