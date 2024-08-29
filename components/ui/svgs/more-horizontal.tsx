import { SVGProps } from "react";

interface MoreHorizontalProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

export default function MoreHorizontal({
  color,
  ...props
}: MoreHorizontalProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke={color ?? "#6F6F6F"}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.6667 8.66667C13.0349 8.66667 13.3333 8.36819 13.3333 8C13.3333 7.63181 13.0349 7.33333 12.6667 7.33333C12.2985 7.33333 12 7.63181 12 8C12 8.36819 12.2985 8.66667 12.6667 8.66667Z"
        fill="none"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.00016 8.66667C8.36835 8.66667 8.66683 8.36819 8.66683 8C8.66683 7.63181 8.36835 7.33333 8.00016 7.33333C7.63197 7.33333 7.3335 7.63181 7.3335 8C7.3335 8.36819 7.63197 8.66667 8.00016 8.66667Z"
        fill="none"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33317 8.66667C3.70136 8.66667 3.99984 8.36819 3.99984 8C3.99984 7.63181 3.70136 7.33333 3.33317 7.33333C2.96498 7.33333 2.6665 7.63181 2.6665 8C2.6665 8.36819 2.96498 8.66667 3.33317 8.66667Z"
        fill="none"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
