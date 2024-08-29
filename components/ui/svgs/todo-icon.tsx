import { SVGProps } from "react";

interface TodoIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
}
export default function TodoIcon({ color, ...props }: TodoIconProps) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color ?? "#65676D"}
      fill={color ?? "#65676D"}
      {...props}  
    >
      <g clipPath="url(#clip0_14_4255)">
        <path
          d="M31.875 9.75H4.125V30.375H31.875V9.75Z"
          strokeWidth="2.25"
          strokeMiterlimit="10"
          fill="none"
        />
        <path
          d="M9.75 4.5V13.5"
          strokeWidth="2.25"
          strokeMiterlimit="10"
          fill="none"
        />
        <path
          d="M26.25 4.5V13.5"
          strokeWidth="2.25"
          strokeMiterlimit="10"
          fill="none"
        />
        <path d="M12.75 15H6.75V21H12.75V15Z" stroke="none" />
        <path d="M19.5 15H16.5V18H19.5V15Z" stroke="none" />
        <path d="M24.375 15H21.375V18H24.375V15Z" stroke="none" />
        <path d="M29.25 15H26.25V18H29.25V15Z" stroke="none" />
        <path d="M19.5 19.5H16.5V22.5H19.5V19.5Z" stroke="none" />
        <path d="M24.375 19.5H21.375V22.5H24.375V19.5Z" stroke="none" />
        <path d="M29.25 19.5H26.25V22.5H29.25V19.5Z" stroke="none" />
        <path d="M19.5 24H16.5V27H19.5V24Z" stroke="none" />
        <path d="M14.625 24H11.625V27H14.625V24Z" stroke="none" />
        <path d="M9.75 24H6.75V27H9.75V24Z" stroke="none" />
        <path d="M24.375 24H21.375V27H24.375V24Z" stroke="none" />
        <path d="M29.25 24H26.25V27H29.25V24Z" stroke="none" />
      </g>
      <defs>
        <clipPath id="clip0_14_4255">
          <rect
            width="30"
            height="27"
            fill="white"
            transform="translate(3 4.5)"
            stroke="none"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
