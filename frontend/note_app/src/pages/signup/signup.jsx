/* eslint-disable no-unused-vars */
import { useState } from "react";
import library from "../../assets/library.jpg";
import { valEmail } from "../../utils/helper";
import PassInput from "../../components/inputs/pass";
import axiosInstance from "../../utils/axiosInstants";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handlesignup = async (e) => {
    e.preventDefault();
    console.log("Email entered:", email);
    console.log("Is email valid?", valEmail(email));

    if (!valEmail(email)) {
      setError("Invalid email");
      return;
    } else if (!password) {
      setError("Password is required");
      return;
    } else if (!username) {
      setError("Username is required");
      return;
    } else {
      setError("");

      // SIGNUP API CALL
      try {
        const response = await axiosInstance.post("/create-account", {
          username: username,
          email: email,
          password: password,
        });
        console.log("API Response:", response.data); // Log the full response

        if (response.data && response.data.error) {
          setError(response.data.message);
        }
        if (response.data && response.data.accessToken) {
          console.log("Token:", response.data.accessToken);
          localStorage.setItem("token", response.data.accessToken);
          navigate("/login");
        }
        console.log("Signup successful");
      } catch (error) {
        console.error("Signup error:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError("Unexpected error occurred: " + error.message);
        } else {
          setError("Unexpected error occurred");
        }
      }
    }
  };

  return (
    <div className="flex flex-row-reverse h-screen">
      {/* Left Image Section */}
      <img
        src={library}
        alt="library"
        className="w-1/2 h-full object-cover brightness-50 rounded-l-[80px] animate-slideInRight hidden md:block"
      />

      {/* Right Form Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-full p-8 bg-beige animate-slideInLeft">
        <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

        {/* Username Input */}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          type="text"
          className="mb-4 w-[350px] h-14 p-4 bg-beige border-2 border-gray-400 rounded-lg text-lg focus:outline-none"
        />

        {/* Email Input */}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="mb-4 w-[350px] h-14 p-4 bg-beige border-2 border-gray-400 rounded-lg text-lg focus:outline-none"
        />

        {/* Password Input using PassInput Component */}
        <PassInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Signup Button */}
        <button
          onClick={handlesignup}
          className="w-[350px] h-[55px] mt-6 bg-[#d2b48c] hover:bg-[#d89338] text-white font-bold rounded-lg cursor-pointer"
        >
          Sign Up
        </button>

        {/* Redirect to Login */}
        <p className="mt-6 text-lg">
          Already have an account?{" "}
          <a href="/login" className="font-extrabold text-blue-600 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
