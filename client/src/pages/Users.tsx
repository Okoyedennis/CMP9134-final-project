import Navbar from "../components/Navbar";
import { User, UserPen } from "lucide-react";
import type { UsersResponse } from "../services/robotApi";
import { useEffect, useState } from "react";
import EditUserModal from "../components/EditUserModal";
import useAuthApi from "../hooks/useAuthApi";
import PageHelmet from "../components/PageHelmet";

const Users = () => {
  const [users, setUsers] = useState<UsersResponse | null>(null);
  const [user, setUser] = useState<UsersResponse["data"][0] | null>(null);
  const { getUsers, isLoading } = useAuthApi();
  const [showModal, setShowModal] = useState(false);

  const toggleModal = (user?: UsersResponse["data"][0]) => {
    if (user) {
      setUser(user);
    }
    setShowModal(!showModal);
  };

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      <PageHelmet
        title="User Management | Robot GCS"
        description="Manage users and their permissions."
      />
      <div className=" min-h-screen bg-gcs-dark text-gray-100 app_container">
        <Navbar active="users" />
        <main className="container mx-auto px-4 py-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-500" />
            User Management
          </h2>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
              <p className="mt-2 text-gray-300">Loading users...</p>
            </div>
          ) : (
            <>
              {users?.data.length === 0 ? (
                <div className="gcs-card">
                  <p className="text-gray-400 text-center">
                    No users available.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <table className="min-w-full text-sm text-left text-gray-300">
                      <thead className="bg-gray-800 text-gray-200">
                        <tr>
                          <th className="px-4 py-3 font-semibold">S/N</th>
                          <th className="px-4 py-3 font-semibold">Forename</th>
                          <th className="px-4 py-3 font-semibold">Email</th>
                          <th className="px-4 py-3 font-semibold">Role</th>
                          <th className="px-4 py-3 font-semibold">Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users?.data.map((user, index) => (
                          <tr
                            key={user.id}
                            className={
                              index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                            }>
                            <td className="px-4 py-3 border-t border-gray-700">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 border-t border-gray-700 capitalize">
                              {user.forename}
                            </td>
                            <td className="px-4 py-3 border-t border-gray-700">
                              {user.email}
                            </td>
                            <td className="px-4 py-3 border-t border-gray-700">
                              {user.role}
                            </td>
                            <td className="px-4 py-3 border-t border-gray-700">
                              <UserPen
                                onClick={() => toggleModal(user)}
                                className="cursor-pointer"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </main>
        {showModal && (
          <EditUserModal
            toggleModal={toggleModal}
            user={user}
            fetchUsers={fetchUsers}
          />
        )}
      </div>
    </>
  );
};

export default Users;
