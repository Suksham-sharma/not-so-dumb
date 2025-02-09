import React from "react";

interface FormInputProps {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  error?: string;
  register: any;
  name: string;
}

export default function FormInput({
  label,
  id,
  type,
  placeholder,
  error,
  register,
  name,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-lg font-bold text-black mb-2">
        {label}
      </label>
      <input
        {...register(name)}
        type={type}
        id={id}
        className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:translate-x-[3px] focus:translate-y-[3px] focus:shadow-none"
        placeholder={placeholder}
        autoComplete="off"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
