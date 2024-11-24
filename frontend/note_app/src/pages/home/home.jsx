/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import NoteCard from "../../components/Cards/NoteCard/noteCard";
import Navbar from "../../components/navBar/navbar";
import { MdAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { AddEditNotes } from "../addEditNotes/addEditNotes";
import "./home.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstants";
import Toast from "../../components/ToastMessage/toast";
import EmptyCard from "../../components/EmptyCard/emptyCard";
import nonoteimg from "../../assets/no-notes-img.png";
import nonsearchimg from "../../assets/no-search-found-image.png";

// Set the app element for accessibility
Modal.setAppElement("#root");

export default function Home() {
  // State to control the Add/Edit Note modal
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShow: false, // Whether the modal is shown
    type: "add", // Mode: add or edit
    data: null, // Data of the note being edited (if applicable)
  });

  // State to control the toast message
  const [showToast, setShowToast] = useState({
    isShown: false, // Whether the toast is visible
    message: "", // Toast message content
    type: "add", // Type of toast: add, edit, or delete
  });

  // State to check if a search is active
  const [isSearch, setIsSearch] = useState(false);

  // State to store logged-in user information
  const [userInfo, setUserInfo] = useState(null);

  // State to store all notes (fetched from the backend)
  const [allNotes, setAllNotes] = useState([]);

  const navigate = useNavigate();

  /**
   * Fetches user information and updates state.
   * Redirects to the login page if authentication fails.
   */
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/getUser");
      if (response.data && response.data.user) {
        console.log(response.data);
      }
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (error.response && error.response.status === 401) {
        localStorage.clear(); // Clear stored data
        navigate("/login"); // Redirect to login
      }
    }
  };

  /**
   * Fetches all notes for the logged-in user.
   * Sorts pinned notes to appear first.
   */
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/getNotes");
      if (response.data) {
        // Sort: Pinned notes first
        const sortedNotes = response.data.sort(
          (a, b) => b.isPinned - a.isPinned
        );
        setAllNotes(sortedNotes);
      }
    } catch (e) {
      console.error("Error fetching notes:", e);
    }
  };

  /**
   * Deletes a specific note.
   * @param {Object} data - The note object to delete.
   */
  const deleteNote = async (data) => {
    const noteID = data._id;
    if (!noteID) {
      console.log("Note ID not found");
      return;
    }
    try {
      const response = await axiosInstance.delete("/deleteNote/" + noteID);
      if (response.data) {
        showToastMSG("Note Deleted successfully", "delete"); // Show success toast
        getAllNotes(); // Refresh notes
        onClose(); // Close modal
      }
    } catch (e) {
      console.error("Error deleting note:", e);
    }
  };

  /**
   * Opens the edit modal with the selected note data.
   * @param {Object} data - The note object to edit.
   */
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShow: true, type: "edit", data });
  };

  /**
   * Searches for notes based on a query string.
   * @param {string} query - The search string.
   */
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/searchNotes/", {
        params: { query },
      });
      if (response.data) {
        setIsSearch(true); // Mark search as active
        setAllNotes(response.data); // Update the displayed notes
      }
    } catch (e) {
      console.error("Error searching notes:", e);
    }
  };

  /**
   * Updates the pinned status of a specific note.
   * @param {Object} noteData - The note object to update.
   */
  const updateIsPinned = async (noteData) => {
    const noteID = noteData._id;
    if (!noteID) {
      console.log("Note ID not found");
      return;
    }
    try {
      const response = await axiosInstance.put(
        "/update-pinned-note/" + noteID,
        {
          isPinned: !noteData.isPinned, // Toggle pinned status
        }
      );
      if (response.data) {
        showToastMSG("Note Updated successfully", "edit"); // Show success toast
        getAllNotes(); // Refresh notes
      }
    } catch (e) {
      console.error("Error updating pinned status:", e);
    }
  };

  /**
   * Clears the search state and fetches all notes again.
   */
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  /**
   * Closes the Add/Edit Note modal.
   */
  const closeModal = () => {
    setOpenAddEditModal({ isShow: false, type: "add", data: null });
  };

  /**
   * Hides the toast message.
   */
  const handleCloseToast = () => {
    setShowToast({ isShown: false, message: "", type: "add" });
  };

  /**
   * Displays a toast message with a specific type and message.
   * @param {string} message - The message to display.
   * @param {string} type - The type of toast (add, edit, delete).
   */
  const showToastMSG = (message, type) => {
    setShowToast({ isShown: true, message, type });
  };

  // Fetch user info and notes when the component is mounted
  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />
      {allNotes.length > 0 ? (
        <div className="container">
          {allNotes
            .sort((a, b) => b.isPinned - a.isPinned) // Sort notes: Pinned ones come first
            .map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                onPinNote={() => {
                  updateIsPinned(item);
                }}
                onDelete={() => {
                  deleteNote(item);
                }}
                onEdit={() => {
                  handleEdit(item);
                }}
                isPinned={item.isPinned}
              />
            ))}
        </div>
      ) : (
        <EmptyCard
          imgSrc={isSearch ? nonsearchimg : nonoteimg}
          message={
            isSearch
              ? "Oops! No notes found"
              : "Start creating your first note! Click the 'Add' button to get started."
          }
        />
      )}
      <button
        className="add"
        onClick={() => {
          setOpenAddEditModal({ isShow: true, type: "add", data: null });
        }}
      >
        <MdAdd />
      </button>

      {/* Modal Implementation */}
      <Modal
        isOpen={openAddEditModal.isShow}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
          content: {
            width: "50%",
            height: "90%",
            marginTop: "2rem",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            margin: "auto",
          },
        }}
        contentLabel="Add or Edit Notes"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={closeModal}
          getAllNotes={getAllNotes}
          showToastMSG={showToastMSG}
        />
      </Modal>
      <Toast
        isShown={showToast.isShown}
        message={showToast.message}
        type={showToast.type}
        onClose={handleCloseToast}
      />
    </>
  );
}
