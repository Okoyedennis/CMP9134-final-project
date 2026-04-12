import React, { useState } from "react";
import Button from "./Button";
import TextInput from "../common/TextInput";
import { X } from "lucide-react";
import type { UsersResponse } from "../services/robotApi";
import SelectInput from "../common/SelectInput";
import useAuthApi from "../hooks/useAuthApi";
import { toast } from "react-toastify";
import type { DecodedToken } from "../types";
import { useCookies } from "../hooks/useCookies";
import { jwtDecode } from "jwt-decode";

interface IEditUserModalProps {
  toggleModal: () => void;
  fetchUsers: () => void;
  user: UsersResponse["data"][0] | null;
}

const EditUserModal: React.FC<IEditUserModalProps> = ({
  toggleModal,
  user,
  fetchUsers,
}) => {
  const [forename, setForename] = useState(user ? user.forename : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [role, setRole] = useState(user ? user.role : "");

  const { updateRole, isLoading } = useAuthApi();

  const { getCookie } = useCookies();

  const token: any = getCookie("gcs_token");

  let decodedToken: DecodedToken | null = null;

  if (token) {
    decodedToken = jwtDecode(token);
  }

  const roles = [
    { name: "VIEWER", id: "VIEWER" },
    { name: "COMMANDER", id: "COMMANDER" },
  ];
  console.log(user);

  const handleUpdateRole = async () => {
    if (!user) return;

    const data = { role };

    try {
      const response = await updateRole(user.id, data);

      if (response.data && response.success) {
        toast.success(response.message);
        fetchUsers();
        setTimeout(() => {
          toggleModal();
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-modal_bg backdrop-blur-lg z-[999]">
      <form className="relative top-1/2 left-1/2 w-[350px] md:w-[524px] -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-gray-200 z-10 cursor-pointer transition duration-2000 rounded-[10px] px-[20px] py-[20px] md:px-[30px] md:py-[45px] h-fit ">
        <div className="flex items-end justify-end">
          <X onClick={toggleModal} />
        </div>
        <div className="space-y-5">
          <TextInput
            label="Forename"
            value={forename}
            onChange={setForename}
            placeholder="Enter your forename"
          />
          <TextInput
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
          />

          <SelectInput
            onChange={(e) => setRole(e.target.value)}
            value={role}
            placeHolder="Select"
            options={roles}
            label="Role"
            disabled={
              user?.forename.toLowerCase() === "admin" ||
              decodedToken?.role !== "COMMANDER"
            }
          />

          <Button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 font-semibold disabled:opacity-60"
            onClick={handleUpdateRole}
            isLoading={isLoading}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUserModal;
