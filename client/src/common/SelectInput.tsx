import React from "react";

interface SelectInputProps {
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: string; name: string }[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
  placeHolder?: string;
  labelClass?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
  className,
  disabled,
  required,
  placeHolder = "-- Select an option --",
  labelClass = "",
}) => {
  return (
    <div className="">
      {label && (
        <label
          htmlFor={value}
          className={`block text-sm font-medium text-start text-gray-300 mb-2 ${labelClass}`}>
          {required && <span className="text-primary">* </span>}
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full rounded-lg bg-gcs-dark border border-gray-700 px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}>
        <option>{placeHolder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.id} className="text-sm">
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
