/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import ProfileInfo from "../Cards/profileInfo/profileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/searchbar";
import { useState, useEffect } from "react";

export default function Navbar({ userInfo, onSearchNote, handleClearSearch }) {
  const style = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 10px",
    height: "10vh",
    backgroundColor: "#f8f8f8",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
  };
  const [searchTerm, setSearchTerm] = useState("");
  const onClearsearch = () => {
    setSearchTerm("");
    handleClearSearch();
  };
  const handleSearch = () => {
    if (searchTerm) {
      onSearchNote(searchTerm);
    }
  };
  const navigate = useNavigate();
  console.log(userInfo);
  return (
    <nav style={style}>
      <h1 className="font-bold text-2xl">Notes App</h1>
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClearsearch={onClearsearch}
        handleSearch={handleSearch}
      />
      <ProfileInfo userinfo={userInfo} />
    </nav>
  );
}
