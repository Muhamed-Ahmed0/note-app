/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import moment from "moment";
import "./noteCard.css";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";
export default function NoteCard({
  title,
  date,
  tags,
  content,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) {
  return (
    <div className="card">
      <div className="cont">
        <div className="head">
          <h6>{title}</h6>
          <br></br>
          <span>{moment(date).format("Do MMM YYYY")}</span>
        </div>
        <MdOutlinePushPin
          onClick={onPinNote}
          className={`icon ${isPinned ? "text-blue-500" : ""}`}
          id="pin"
        />
      </div>
      <p>{content?.slice(0, 60)}</p>
      <div className="foot">
        <div>{tags.map((tag) => `#${tag} `)}</div>
        <div>
          <MdCreate onClick={onEdit} className="icon" id="edit" />
          <MdDelete onClick={onDelete} className="icon" id="delete" />
        </div>
      </div>
    </div>
  );
}
