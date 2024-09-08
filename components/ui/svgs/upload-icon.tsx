import React from "react";

export default function UploadIcon({ dark }: { dark?: boolean }) {
  return (
    <svg
      width="47"
      height="46"
      viewBox="0 0 47 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3.5"
        y="3"
        width="40"
        height="40"
        rx="20"
        fill="#F2F4F7"
        className="dark:fill-[#121212]"
      />
      <rect
        x="3.5"
        y="3"
        width="40"
        height="40"
        rx="20"
        stroke="#F9FAFB"
        strokeWidth="6"
        className="dark:stroke-[#171717]"
      />
      <g clipPath="url(#clip0_2001_556)">
        <path
          d="M26.8335 26.3334L23.5002 23M23.5002 23L20.1669 26.3334M23.5002 23V30.5M30.4919 28.325C31.3047 27.8819 31.9467 27.1808 32.3168 26.3322C32.6868 25.4837 32.7637 24.5361 32.5354 23.6389C32.307 22.7418 31.7865 21.9463 31.0558 21.3779C30.3251 20.8095 29.4259 20.5006 28.5002 20.5H27.4502C27.198 19.5244 26.7278 18.6186 26.0752 17.8509C25.4225 17.0831 24.6042 16.4732 23.682 16.0672C22.7597 15.6612 21.7573 15.4695 20.7503 15.5066C19.7433 15.5437 18.7578 15.8086 17.8679 16.2814C16.9779 16.7542 16.2068 17.4226 15.6124 18.2363C15.018 19.0501 14.6158 19.988 14.436 20.9795C14.2563 21.9711 14.3036 22.9905 14.5746 23.9611C14.8455 24.9317 15.3329 25.8282 16.0002 26.5834"
          stroke="#475467"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2001_556">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(13.5 13)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
