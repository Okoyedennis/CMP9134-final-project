import React from "react";
import TextInput from "../common/TextInput";
import { X } from "lucide-react";
import type { DecodedToken } from "../types";
import { formatDate, formatTime } from "../common/Utils";

interface IUserModalProps {
  toggleUserModal: () => void;
  decodedToken: DecodedToken | null;
}

const UserModal: React.FC<IUserModalProps> = ({
  toggleUserModal,
  decodedToken,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-modal_bg backdrop-blur-lg z-[999]">
      <form className="relative top-1/2 left-1/2 w-[350px] md:w-[524px] -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-gray-200 z-10 cursor-pointer transition duration-2000 rounded-[10px] px-[20px] py-[20px] md:px-[30px] md:py-[45px] h-fit shadow-shadow1">
        <div className="flex items-end justify-end">
          <X onClick={toggleUserModal} />
        </div>
        <div className="space-y-5">
          <TextInput
            label="Forename"
            value={decodedToken?.forename || ""}
            onChange={() => {}}
            placeholder=""
            disabled
            className="capitalize"
          />
          <TextInput
            label="Email"
            value={decodedToken?.email || ""}
            onChange={() => {}}
            placeholder=""
            disabled
          />
          <TextInput
            label="Role"
            value={decodedToken?.role || ""}
            onChange={() => {}}
            placeholder=""
            disabled
          />
          <TextInput
            label="Date & Time Created"
            value={`${formatDate(decodedToken?.createdAt || "")}, ${formatTime(decodedToken?.createdAt || "")}`}
            onChange={() => {}}
            placeholder=""
            disabled
          />
          <TextInput
            label="User ID"
            value={decodedToken?.userId || ""}
            onChange={() => {}}
            placeholder=""
            disabled
          />
        </div>
      </form>
    </div>
  );
};

export default UserModal;
