import { SVGProps } from "react";

interface PlusProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

export default function Plus({ color, ...props }: PlusProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ?? "#6F6F6F"}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 7.33334V16.6667"
        fill="none"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.3335 12H16.6668"
        fill="none"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
