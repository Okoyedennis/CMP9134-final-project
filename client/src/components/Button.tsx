import React, { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type: "button" | "submit" | "reset";
  className?: string;
  iconClassName?: string;
  children: any;
  disabled?: boolean | any;
  isLoading?: boolean;
  Icon?: string | any;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  onClick,
  className,
  iconClassName,
  disabled,
  isLoading,
  Icon,
}) => {
  return (
    <>
      {Icon ? (
        <div
          className={`px-4 py-2 rounded-[4px] ${
            disabled
              ? "bg-primary opacity-[.7] text-Acc1 cursor-not-allowed"
              : "bg-primary text-white cursor-pointer"
          } font-montserrat flex items-center gap-1 ${className}`}>
          <span className="text-white text-lg">
            <Icon className={`text-white ${iconClassName}`} />
          </span>
          <button type={type} onClick={onClick} disabled={disabled}>
            {children}
          </button>
        </div>
      ) : (
        <>
          {isLoading ? (
            <button
              type={type}
              className={`px-4 py-2 rounded-[4px] ${
                disabled
                  ? "bg-primary opacity-[.7] text-Acc1 cursor-not-allowed text-white"
                  : "bg-primary text-white cursor-pointer"
              } font-montserrat ${className}`}
              disabled>
              <div className="flex items-center justify-center w-full">
                <svg
                  className="animate-spin h-[1.5rem] w-[1.5rem] text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            </button>
          ) : (
            <button
              type={type}
              className={`px-4 py-2 rounded-[4px] ${
                disabled
                  ? "bg-primary opacity-[.7] text-Acc1 cursor-not-allowed text-white"
                  : "bg-primary text-white cursor-pointer"
              } font-montserrat ${className}`}
              onClick={onClick}
              disabled={disabled}>
              {children}
            </button>
          )}
        </>
      )}
    </>
  );
};

export default Button;
