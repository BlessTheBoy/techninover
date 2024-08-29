import { SVGProps } from "react";

interface NotesIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
}
export default function NotesIcon({ color, ...props }: NotesIconProps) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color ?? "#65676D"}
      {...props}
    >
      <path d="M6 10.5H30" strokeWidth="2.25" strokeMiterlimit="10" fill="none" />
      <path d="M6 18H30" strokeWidth="2.25" strokeMiterlimit="10" fill="none" />
      <path d="M6 25.5H30" strokeWidth="2.25" strokeMiterlimit="10" fill="none" />
    </svg>
  );
}
