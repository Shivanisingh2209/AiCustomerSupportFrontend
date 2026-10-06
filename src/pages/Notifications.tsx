import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  Ticket,
  Clock,
  ArrowLeft,
  Inbox,
} from "lucide-react";
import { getMyNotifications, markNotificationAsRead } from "../services/notificationService";
import type {
  Notification,
} from "../services/notificationService";


const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyNotifications();

      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case "MESSAGE":
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <MessageSquare size={20} />
          </div>
        );

      case "TICKET":
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <Ticket size={20} />
          </div>
        );

      case "STATUS":
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={20} />
          </div>
        );

      default:
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <Bell size={20} />
          </div>
        );
    }
  };

  const formatDate = (date: string) => {
    const notificationDate = new Date(date);

    if (Number.isNaN(notificationDate.getTime())) {
      return "";
    }

    return notificationDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleNotificationClick = async (
    notification: Notification
  ) => {
    try {
      if (!notification.read) {
        await markNotificationAsRead(notification.id);
  
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? { ...item, read: true }
              : item
          )
        );
      }
  
      if (notification.ticketId) {
        navigate(`/tickets/${notification.ticketId}`);
      }
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
  
      if (notification.ticketId) {
        navigate(`/tickets/${notification.ticketId}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Notifications
                </h1>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-purple-600 px-2.5 py-1 text-xs font-semibold text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Stay updated with your tickets and support activity.
              </p>
            </div>
          </div>

          <div className="hidden rounded-xl bg-white p-3 shadow-sm sm:block">
            <Bell className="text-purple-600" size={22} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600" />

            <p className="text-sm text-gray-500">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Inbox className="text-gray-400" size={30} />
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              No notifications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              You will see updates about your tickets, messages, and support
              activity here.
            </p>

            <button
              onClick={() => navigate("/tickets")}
              className="mt-6 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700"
            >
              View My Tickets
            </button>
          </div>
        ) : (
          /* Notification List */
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() =>
                  handleNotificationClick(notification)
                }
                className={`group rounded-2xl border p-4 shadow-sm transition sm:p-5 ${
                  notification.ticketId
                    ? "cursor-pointer hover:-translate-y-px hover:shadow-md"
                    : ""
                } ${
                  !notification.read
                    ? "border-purple-100 bg-purple-50/50"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div className="flex gap-4">

                  {/* Icon */}
                  <div className="shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {notification.type === "MESSAGE"
                            ? "New Message"
                            : notification.type === "STATUS"
                            ? "Ticket Update"
                            : "Notification"}
                        </h3>

                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-purple-600" />
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={13} />
                        {formatDate(notification.createdAt)}
                      </div>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {notification.message}
                    </p>

                    {notification.ticketId && (
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-purple-600">
                        <Ticket size={14} />
                        View ticket
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Notifications;