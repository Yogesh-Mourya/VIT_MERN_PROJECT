import { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(
        (user) =>
          user.username.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/user?user=true");
      setUsers(response.data.users);
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong.");
      console.error("Error fetching users", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/user/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      toast.success("User deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong.");
      console.error("Error deleting user", error);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await api.put(`/user/${id}`, { role: newRole });
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );
      toast.success("Role updated successfully.");
    } catch (error) {
      console.error("Error updating role", error);
      toast.error(error.response?.data?.error || "Something went wrong.");
    }
  };

  const getRoleBadge = (role) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    switch (role) {
      case "admin":
        return `${base} bg-red-100 text-red-700`;
      case "vendor":
        return `${base} bg-yellow-100 text-yellow-700`;
      default:
        return `${base} bg-green-100 text-green-700`;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">
        User Management
      </h1>

      <input
        type="text"
        placeholder="🔍 Search by username or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full text-black md:w-1/2 p-3 mb-6 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
      />

      <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Username
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={getRoleBadge(user.role)}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <div className="flex gap-5 justify-center items-center">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                        className="border-gray-300 text-gray-700 rounded-md p-1 text-sm shadow-sm"
                      >
                        <option value="">Update Role</option>
                        <option value="User">User</option>
                        <option value="Vendor">Vendor</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-white text-xs px-4 py-1 rounded-full shadow-md hover:from-red-600 hover:to-red-800 hover:scale-105 transition-all duration-300"
                        title="Delete User"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
