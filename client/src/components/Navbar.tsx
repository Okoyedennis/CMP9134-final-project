import { Bot, LayoutDashboard, ScrollText, LogOut, User } from "lucide-react";
import { useCookies } from "../hooks/useCookies";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "./Button";

type NavbarProps = {
  active?: "dashboard" | "logs" | "settings";
  onSignOut?: () => void;
  userName?: string;
};

const Navbar = ({
  active = "dashboard",
  userName = "Commander",
}: NavbarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "logs", label: "Logs", icon: ScrollText },
    { key: "users", label: "Users", icon: User },
  ] as const;

  const { removeCookie } = useCookies();
  const navigate = useNavigate();

  const logout = () => {
    setIsLoggedIn(true);
    removeCookie("gcs_token");

    setTimeout(() => {
      navigate("/signin");
    }, 500);
    setIsLoggedIn(false);
  };

  return (
    <header className="border-b border-gray-800 bg-gcs-darker sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-lg text-white">Robot GCS</span>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;

              return (
                <Link
                  to={`/${item.key}`}
                  key={item.key}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
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

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm text-white font-medium">{userName}</span>
            <span className="text-xs text-gray-400">Operator</span>
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
      </div>
    </header>
  );
};

export default Navbar;
