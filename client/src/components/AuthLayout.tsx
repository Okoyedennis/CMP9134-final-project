import { Bot } from "lucide-react";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gcs-dark text-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gcs-darker w-[25rem] border border-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center flex items-center justify-center w-full flex-col mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-400 mt-2 text-sm">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
