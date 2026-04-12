import {
  Bot,
  LayoutDashboard,
  ScrollText,
  LogOut,
  User,
  ChartNoAxesColumn,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useCookies } from "../hooks/useCookies";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "./Button";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "../types";
import UserModal from "./UserModal";

type NavbarProps = {
  active?: "dashboard" | "logs" | "users" | "lidar";
};

const Navbar = ({ active = "dashboard" }: NavbarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const { getCookie, removeCookie } = useCookies();
  const navigate = useNavigate();

  const token = getCookie("gcs_token");
  let decodedToken: DecodedToken | null = null;

  if (token) {
    decodedToken = jwtDecode(token);
  }

  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      role: Boolean(decodedToken),
    },
    {
      key: "lidar",
      label: "Lidar Summary",
      icon: ChartNoAxesColumn,
      role: Boolean(decodedToken),
    },
    {
      key: "logs",
      label: "Logs",
      icon: ScrollText,
      role: Boolean(decodedToken && decodedToken.role === "COMMANDER"),
    },
    {
      key: "users",
      label: "Users",
      icon: Users,
      role: Boolean(decodedToken && decodedToken.role === "COMMANDER"),
    },
  ] as const;

  const logout = () => {
    setIsLoggedIn(true);

    setTimeout(() => {
      removeCookie("gcs_token");
      navigate("/signin");
    }, 500);
  };

  const toggleUserModal = () => {
    setShowUserModal(!showUserModal);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gcs-darker shadow-shadow2">
        <div className="container mx-auto px-4">
          <div className="h-[74px] flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-blue-500" />
                <span className="font-bold text-lg text-white">Robot GCS</span>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-2">
                {navItems.map((item) => {
                  if (!item.role) return null;

                  const Icon = item.icon;
                  const isActive = active === item.key;

                  return (
                    <Link
                      to={`/${item.key}`}
                      key={item.key}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition outline-none ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}>
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Desktop right side */}
            <div className="hidden lg:flex items-center gap-3">
              <div
                className="flex flex-row items-center gap-2 text-right cursor-pointer"
                onClick={() => toggleUserModal()}>
                <div className="flex flex-col">
                  <span className="text-sm text-white font-medium capitalize">
                    {decodedToken?.forename || ""}
                  </span>
                  <span className="text-xs text-gray-400">
                    {decodedToken?.role || ""}
                  </span>
                </div>
                <User className="w-6 h-6 text-gray-400" />
              </div>

              <Button
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition w-[8rem]"
                onClick={logout}
                isLoading={isLoggedIn}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-gray-800 transition"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle menu">
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="lg:hidden pb-4">
              <div className="border-t border-gray-800 pt-4 flex flex-col gap-2">
                <div
                  className="flex items-center gap-2 px-2 pb-3"
                  onClick={() => {
                    setIsMenuOpen(false);
                    toggleUserModal();
                  }}>
                  <User className="w-5 h-5 text-gray-400" />
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium capitalize">
                      {decodedToken?.forename || ""}
                    </span>
                    <span className="text-xs text-gray-400">
                      {decodedToken?.role || ""}
                    </span>
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    if (!item.role) return null;

                    const Icon = item.icon;
                    const isActive = active === item.key;

                    return (
                      <Link
                        to={`/${item.key}`}
                        key={item.key}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition outline-none ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}>
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <Button
                  type="button"
                  className="mt-2 flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition w-full"
                  onClick={logout}
                  isLoading={isLoggedIn}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>
      {showUserModal && (
        <UserModal
          toggleUserModal={toggleUserModal}
          decodedToken={decodedToken}
        />
      )}
    </>
  );
};

export default Navbar;
