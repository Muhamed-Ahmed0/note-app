/* eslint-disable react/prop-types */
import "./searchbar.css";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
export default function SearchBar({
  value,
  onChange,
  handleSearch,
  onClearsearch,
}) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search Notes..."
        value={value}
        onChange={onChange}
        className="mt-6"
      />
      {value && <IoMdClose onClick={onClearsearch} className="del-search" />}
      <FaSearch onClick={handleSearch} className="search-icon" />
    </div>
  );
}
