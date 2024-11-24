/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { getInitials } from "../../../utils/helper";
import "./profileInfo.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProfileInfo({ userinfo }) {
  const navigate = useNavigate();
  useEffect(() => {
    console.log(userinfo);
  }, []);
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div id="profileInfo">
      <div className="tu">{getInitials(userinfo?.username)}</div>
      <div className="comp">
        <h5>{userinfo?.username}</h5>
        <br></br>
        <button id="logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
