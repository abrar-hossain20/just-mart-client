import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";
import { AuthContext } from "../context/AuthContext";
import { buildAuthHeaders } from "../utils/authHeaders";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingBag,
  FaUserShield,
  FaTrash,
} from "react-icons/fa";

const LIST_BATCH_SIZE = 15;
const TABLE_ROW_HEIGHT = 56;
const TABLE_HEADER_HEIGHT = 48;
const TABLE_SCROLL_MAX_HEIGHT =
  TABLE_HEADER_HEIGHT + LIST_BATCH_SIZE * TABLE_ROW_HEIGHT;

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchAdminData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const authHeaders = await buildAuthHeaders(user);

      const [statsRes, usersRes, productsRes, ordersRes] = await Promise.all([
        fetch(API_ENDPOINTS.ADMIN_STATS, { headers: authHeaders }),
        fetch(API_ENDPOINTS.ADMIN_USERS, { headers: authHeaders }),
        fetch(API_ENDPOINTS.ADMIN_PRODUCTS, { headers: authHeaders }),
        fetch(API_ENDPOINTS.ADMIN_ORDERS, { headers: authHeaders }),
      ]);

      if (!statsRes.ok || !usersRes.ok || !productsRes.ok || !ordersRes.ok) {
        throw new Error("Failed to fetch admin dashboard data");
      }

      const [statsData, usersData, productsData, ordersData] =
        await Promise.all([
          statsRes.json(),
          usersRes.json(),
          productsRes.json(),
          ordersRes.json(),
        ]);

      setStats(statsData);
      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Admin dashboard load error:", error);
      toast.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleRoleChange = async (targetUser, nextRole) => {
    if (!targetUser?._id || targetUser.role === nextRole) return;

    try {
      setUpdatingRoleId(targetUser._id);
      const authHeaders = await buildAuthHeaders(user, {
        "Content-Type": "application/json",
      });

      const response = await fetch(
        API_ENDPOINTS.ADMIN_USER_ROLE(targetUser._id),
        {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify({ role: nextRole }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      toast.success("User role updated");
      setUsers((prev) =>
        prev.map((item) =>
          item._id === targetUser._id ? { ...item, role: nextRole } : item,
        ),
      );
    } catch (error) {
      console.error("Role update error:", error);
      toast.error(error.message || "Failed to update role");
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!product?._id) return;

    try {
      setDeletingProductId(product._id);
      const authHeaders = await buildAuthHeaders(user);
      const response = await fetch(
        API_ENDPOINTS.ADMIN_PRODUCT_BY_ID(product._id),
        {
          method: "DELETE",
          headers: authHeaders,
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((item) => item._id !== product._id));
      setStats((prev) =>
        prev
          ? {
              ...prev,
              totalProducts: Math.max((prev.totalProducts || 1) - 1, 0),
            }
          : prev,
      );
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error(error.message || "Failed to delete product");
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleOrderStatusChange = async (order, nextStatus) => {
    if (!order?._id || order.status === nextStatus) return;

    try {
      setUpdatingOrderId(order._id);

      const authHeaders = await buildAuthHeaders(user, {
        "Content-Type": "application/json",
      });

      const response = await fetch(
        API_ENDPOINTS.ADMIN_ORDER_STATUS(order._id),
        {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify({ status: nextStatus }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      toast.success("Order status updated");

      setOrders((prev) => {
        const nextOrders = prev.map((item) =>
          item._id === order._id ? { ...item, status: nextStatus } : item,
        );

        setStats((prevStats) => {
          if (!prevStats) return prevStats;

          return {
            ...prevStats,
            pendingOrders: nextOrders.filter(
              (item) => item.status === "Pending",
            ).length,
          };
        });

        return nextOrders;
      });
    } catch (error) {
      console.error("Order status update error:", error);
      toast.error(error.message || "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <FaUsers className="text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      title: "Total Admins",
      value: stats?.totalAdmins || 0,
      icon: <FaUserShield className="text-purple-600" />,
      bg: "bg-purple-100",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: <FaBoxOpen className="text-emerald-600" />,
      bg: "bg-emerald-100",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <FaShoppingBag className="text-orange-600" />,
      bg: "bg-orange-100",
    },
  ];

  const visibleOrders = orders;
  const visibleProducts = products;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage users, products and core platform data
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div key={card.title} className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center text-2xl`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Users Management
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Role
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Joined
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item._id} className="border-t border-gray-100">
                    <td className="px-5 py-3 text-gray-800">
                      {item.name || "N/A"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{item.email}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.role || "user"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={item.role || "user"}
                        onChange={(e) => handleRoleChange(item, e.target.value)}
                        disabled={updatingRoleId === item._id}
                        className="border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-6 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Orders Management
            </h2>
          </div>
          <div
            className="overflow-x-auto overflow-y-auto"
            style={{ maxHeight: `${TABLE_SCROLL_MAX_HEIGHT}px` }}
          >
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Order ID
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Buyer
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Amount
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Items
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((item) => (
                  <tr key={item._id} className="border-t border-gray-100">
                    <td className="px-5 py-3 font-semibold text-gray-800">
                      #{item._id?.slice(-8)?.toUpperCase()}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {item.buyerName || item.buyerEmail || "N/A"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      ৳{Number(item.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {item.items?.length || 0}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={item.status || "Pending"}
                        onChange={(e) =>
                          handleOrderStatusChange(item, e.target.value)
                        }
                        disabled={updatingOrderId === item._id}
                        className="border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {item.orderDate
                        ? new Date(item.orderDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-6 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Products Management
            </h2>
          </div>
          <div
            className="overflow-x-auto overflow-y-auto"
            style={{ maxHeight: `${TABLE_SCROLL_MAX_HEIGHT}px` }}
          >
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Title
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Seller
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Price
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Posted
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((item) => (
                  <tr key={item._id} className="border-t border-gray-100">
                    <td className="px-5 py-3 text-gray-800">{item.title}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {item.sellerName || item.sellerEmail || "N/A"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      ৳{Number(item.price || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {item.datePosted
                        ? new Date(item.datePosted).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDeleteProduct(item)}
                        disabled={deletingProductId === item._id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 disabled:opacity-60"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-6 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
