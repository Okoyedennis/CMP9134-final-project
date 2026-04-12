type TextInputProps = {
  label: string;
  type?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const TextInput = ({
  label,
  type = "text",
  className,
  value,
  onChange,
  placeholder,
  disabled,
}: TextInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-start text-gray-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg bg-gcs-dark border border-gray-700 px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        disabled={disabled}
      />
    </div>
  );
};

export default TextInput;
