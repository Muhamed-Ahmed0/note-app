/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { useState } from "react";
const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue]);
      setInputValue("");
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addNewTag();
    }
  };
  const removeTag = (selectedTag) => {
    setTags(tags.filter((tag) => tag !== selectedTag));
  };
  return (
    <div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-4 items-center mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 rounded px-3 py-1"
            >
              # {tag}
              <button
                onClick={() => {
                  removeTag(tag);
                }}
              >
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inputValue}
          placeholder="Add Tag"
          className="bg-transparent text-md border px-3 py-2 rounded border-black"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={() => {
            addNewTag();
          }}
          className="relative top-2 w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700"
        >
          <MdAdd className="text-3xl text-blue-700 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
