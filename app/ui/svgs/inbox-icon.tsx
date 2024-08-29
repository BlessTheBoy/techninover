import { SVGProps } from "react";

interface InboxIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
}
export default function InboxIcon({ color, ...props }: InboxIconProps) {
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
      <path
        d="M31.5 11.205H3.75V30H31.5V11.205Z"
        strokeWidth="2.25"
        strokeMiterlimit="10"
        fill="none"
      />
      <path
        d="M23.73 17.595H11.52V23.61H23.73V17.595Z"
        strokeWidth="2.25"
        strokeMiterlimit="10"
        fill="none"
      />
      <path
        d="M11.625 11.205V5.25H23.625V11.205"
        strokeWidth="2.25"
        strokeMiterlimit="10"
        fill="none"
      />
    </svg>
  );
}
