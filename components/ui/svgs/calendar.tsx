import React, { SVGProps } from 'react'

export default function Calendar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="#1A1919"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.8335 1.99996H13.1668V0.666626H11.8335V1.99996H5.16683V0.666626H3.8335V1.99996H3.16683C2.4335 1.99996 1.8335 2.59996 1.8335 3.33329V14C1.8335 14.7333 2.4335 15.3333 3.16683 15.3333H13.8335C14.5668 15.3333 15.1668 14.7333 15.1668 14V3.33329C15.1668 2.59996 14.5668 1.99996 13.8335 1.99996ZM13.8335 14H3.16683V5.33329H13.8335V14Z"
      />
    </svg>
  );
}
