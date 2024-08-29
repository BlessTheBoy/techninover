import { SVGProps } from "react";

interface CalendarIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

export default function CalendarIcon({ color, ...props }: CalendarIconProps) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      stroke={color ?? "#65676D"}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.75 6H6V15.75H15.75V6Z"
        strokeWidth="2.25"
        strokeMiterlimit="10"
        fill="none"
      />
      <path
        d="M30.75 6H21V15.75H30.75V6Z"
        strokeWidth="2.25"
        strokeMiterlimit="10"
        fill="none"
      />
      <path
        d="M15.75 21H6V30.75H15.75V21Z"
        strokeWidth="2.25"
        strokeMiterlimit="10"
        fill="none"
      />
      <path
        d="M30.75 21H21V30.75H30.75V21Z"
        strokeWidth="2.25"
        strokeMiterlimit="10"
        fill="none"
      />
    </svg>
  );
}
