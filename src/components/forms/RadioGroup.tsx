import React from "react";

interface Option {
  value: string | number;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: Option[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  label?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ name, options, value, onChange, label }) => {
  return (
    <div className="mb-4">
      {label && (
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      )}
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange?.(opt.value)}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
