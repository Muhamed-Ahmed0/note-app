/* eslint-disable react/prop-types */
const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-center ">
        <img src={imgSrc} alt="No notes added" className="w-[450px] m-auto" />
        <p className="text-xl font-extrabold -tracking-wide">{message}</p>
      </div>
    </div>
  );
};

export default EmptyCard;
