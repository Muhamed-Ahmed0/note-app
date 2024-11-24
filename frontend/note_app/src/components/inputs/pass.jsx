/* eslint-disable react/prop-types */
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function PassInput({ value, onChange, placeholder }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="relative mb-4">
      <input
        type={isPasswordVisible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        className="w-[350px] h-14 p-4 rounded-lg bg-beige border-2 border-gray-500 text-lg focus:outline-none"
      />
      <span
        onClick={togglePasswordVisibility}
        role="button"
        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
        className="absolute bottom-3 right-8 transform -translate-y-1/2 cursor-pointer"
      >
        {isPasswordVisible ? (
          <AiOutlineEyeInvisible size={27} />
        ) : (
          <AiOutlineEye size={27} />
        )}
      </span>
    </div>
  );
}
