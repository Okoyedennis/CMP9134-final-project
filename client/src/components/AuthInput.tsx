type AuthInputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const AuthInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: AuthInputProps) => {
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
        className="w-full rounded-lg bg-gcs-dark border border-gray-700 px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default AuthInput;
