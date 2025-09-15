import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, className, ...props }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 ${className}`}
        {...props}
      />
      {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  );
};

export default Checkbox;
