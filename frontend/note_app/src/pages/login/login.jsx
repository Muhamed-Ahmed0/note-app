import { useState } from "react";
import library from "../../assets/library.jpg";
import { valEmail } from "../../utils/helper";
import PassInput from "../../components/inputs/pass";
import axiosInstance from "../../utils/axiosInstants";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Email entered:", email);
    console.log("Is email valid?", valEmail(email));

    if (!valEmail(email)) {
      setError("Invalid email");
      return;
    } else if (!password) {
      setError("Password is required");
      return;
    } else {
      setError("");
      console.log("Login successful!");
      // LOGIN API CALL
      try {
        const response = await axiosInstance.post("/login", {
          email: email,
          password: password,
        });
        console.log("API Response:", response.data || "Nothing returned");
        // Handle successful login
        if (response.data && response.data.accessToken) {
          console.log("Token:", response.data.accessToken);
          localStorage.setItem("token", response.data.accessToken);
          navigate("/");
        }
      } catch (error) {
        console.error("Login error:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          setError("Unexpected error occurred");
        }
      }
    }
  };

  return (
    <div className="flex h-screen">
      <img
        src={library}
        alt="library"
        className="w-1/2 h-full object-cover filter brightness-50 rounded-l-none rounded-r-[80px] opacity-0 animate-slideInLeft"
      />
      <div className="w-1/2 flex flex-col justify-center items-center opacity-0 animate-slideInRight">
        <h1 className="font-bold text-4xl mb-8">Login</h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="mb-4 p-4 rounded-lg h-14 w-[350px] bg-beige border-2 border-gray-500 text-lg"
        />

        <PassInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 mt-4">{error}</p>}

        <input
          type="button"
          value="Login"
          onClick={handleLogin}
          className="mt-6 p-4 rounded-lg h-14 w-[350px] bg-[#d2b48c] hover:bg-[#d89338] text-white font-bold cursor-pointer"
        />

        <p className="mt-6 text-lg">
          Not a member?{" "}
          <a href="/signup" className="font-extrabold text-blue-600 underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
