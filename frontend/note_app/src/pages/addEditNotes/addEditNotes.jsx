/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { MdClose } from "react-icons/md";
import TagInput from "../../components/inputs/tagInput";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstants";

export const AddEditNotes = ({
  onClose,
  type,
  getAllNotes,
  noteData,
  showToastMSG,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [error, setError] = useState(null);
  const [tags, setTags] = useState(noteData?.tags || []);

  // Add new note
  const Addnote = async () => {
    try {
      const response = await axiosInstance.post("/addNote", {
        title,
        content,
        tags,
      });
      if (response.data) {
        console.log(response.data);
        showToastMSG("Note added successfully");
        getAllNotes();
        onClose();
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Edit note
  const Editnote = async () => {
    const noteID = noteData._id;
    if (!noteID) {
      console.log("Note ID not found");
    }
    try {
      const response = await axiosInstance.put("/updateNote/" + noteID, {
        title,
        content,
        tags,
      });
      if (response.data) {
        showToastMSG("Note Updated successfully");
        console.log(response.data);
        getAllNotes();
        onClose();
      }
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        setError(e.response.data.message);
      }
    }
  };

  const handleErrors = () => {
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!content) {
      setError("Content is required");
      return;
    }
    setError("");
    if (type === "edit") {
      Editnote();
    } else {
      Addnote();
    }
  };

  return (
    <div>
      {/* Close Button with onClick handler */}
      <button
        className="relative left-[95%] rounded-full hover:bg-slate-50"
        onClick={onClose} // Added onClick to close the modal
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2 mb-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          placeholder="Go to Gym"
          className="text-2xl text-slate-900 bg-slate-50 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          placeholder="Content"
          rows={5}
          className="text-2xl p-2 text-slate-900 outline-none bg-slate-50 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="font-medium mt-5 p-3 bg-blue-600 text-white w-full mb-5 rounded"
        onClick={handleErrors}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
