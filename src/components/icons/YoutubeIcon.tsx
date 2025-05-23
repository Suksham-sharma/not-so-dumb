import React from "react";

const YoutubeIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6 text-gray-600",
}) => (
  <svg
    className={className}
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 10C8 8.89543 8.89543 8 10 8H78C79.1046 8 80 8.89543 80 10V78C80 79.1046 79.1046 80 78 80H10C8.89543 80 8 79.1046 8 78V10ZM12 12V76H76V12H12Z"
      fill="black"
    />
    <path d="M64 60V28H24V60H64Z" fill="#FF0000" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 24H68V64H20V24ZM28 32V56H60V32H28Z"
      fill="#FF0000"
    />
    <path d="M38 52V36L54 44L38 52Z" fill="black" />
  </svg>
);

export default YoutubeIcon;
