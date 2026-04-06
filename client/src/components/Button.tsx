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
                <div className="animate-spin rounded-full h-[1.5rem] w-[1.5rem] border-b-2 border-white" />
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
