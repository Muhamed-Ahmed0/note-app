/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { useEffect } from "react";

const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    if (isShown) {
      const timeoutId = setTimeout(() => {
        onClose(); // Close the toast after 3 seconds
      }, 3000);

      return () => {
        clearTimeout(timeoutId); // Cleanup on unmount or when isShown changes
      };
    }
  }, [isShown, onClose]);

  return (
    <div
      className={`absolute top-20 right-6 transition-all duration-300 ${
        isShown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`min-w-full bg-white border shadow-2xl rounded-md after:w-[5px] after:h-full ${
          type === "delete" ? "after:bg-red-500" : "after:bg-green-500"
        } after:absolute after:left-0 after:top-0 after:rounded-l-lg`}
      >
        <div className="flex items-center gap-3 py-2 px-4">
          <div
            className={`h-10 w-10 flex items-center justify-center rounded-full bg-green-100 ${
              type === "delete" ? "text-red-50" : "text-green-50"
            }`}
          >
            {type === "delete" ? (
              <MdDeleteOutline className="text-xl text-red-500" />
            ) : (
              <LuCheck className="text-xl text-green-500" />
            )}
          </div>
          <p className="text-md text-slate-800">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
