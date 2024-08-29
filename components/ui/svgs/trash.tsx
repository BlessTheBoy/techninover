import React, { SVGProps } from 'react'
interface TrashProps extends SVGProps<SVGSVGElement> {
  color?: string;
}
export default function Trash({ color, ...props }: TrashProps) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      stroke={color ?? "#667085"}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.5 13H12.1667M12.1667 13H25.5M12.1667 13V24.6666C12.1667 25.1087 12.3423 25.5326 12.6548 25.8451C12.9674 26.1577 13.3913 26.3333 13.8333 26.3333H22.1667C22.6087 26.3333 23.0326 26.1577 23.3452 25.8451C23.6577 25.5326 23.8333 25.1087 23.8333 24.6666V13H12.1667ZM14.6667 13V11.3333C14.6667 10.8913 14.8423 10.4673 15.1548 10.1548C15.4674 9.84222 15.8913 9.66663 16.3333 9.66663H19.6667C20.1087 9.66663 20.5326 9.84222 20.8452 10.1548C21.1577 10.4673 21.3333 10.8913 21.3333 11.3333V13M16.3333 17.1666V22.1666M19.6667 17.1666V22.1666"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>
  );
}
