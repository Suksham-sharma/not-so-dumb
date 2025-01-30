import React from "react";

const FolderIcon: React.FC<{ className: string }> = ({
  className = "w-6 h-6 text-gray-600",
}) => (
  <svg
    className={className}
    width="96"
    height="96"
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 18H86V86H18V18Z" fill="black" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 18C16 16.8954 16.8954 16 18 16H86C87.1046 16 88 16.8954 88 18V86C88 87.1046 87.1046 88 86 88H18C16.8954 88 16 87.1046 16 86V18ZM20 20V84H84V20H20Z"
      fill="black"
    />
    <path d="M10 10H78V78H10V10Z" fill="white" />
    <path
      fill-rule="evenodd"
      clipRule="evenodd"
      d="M8 10C8 8.89543 8.89543 8 10 8H78C79.1046 8 80 8.89543 80 10V78C80 79.1046 79.1046 80 78 80H10C8.89543 80 8 79.1046 8 78V10ZM12 12V76H76V12H12Z"
      fill="black"
    />
    <path d="M64 59V35H44L40 29H24V59H64Z" fill="black" />
    <path
      fill-rule="evenodd"
      clipRule="evenodd"
      d="M20 25H42.1407L46.1407 31H68V63H20V25ZM28 33V55H60V39H41.8593L37.8593 33H28Z"
      fill="black"
    />
    <path
      fill-rule="evenodd"
      clipRule="evenodd"
      d="M62 41H26V37H62V41Z"
      fill="cyan"
    />
    <path
      fill-rule="evenodd"
      clipRule="evenodd"
      d="M46 49H26V45H46V49Z"
      fill="cyan"
    />
  </svg>
);

export default FolderIcon;
