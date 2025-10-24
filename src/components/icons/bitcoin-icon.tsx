import * as React from "react";

export const BitcoinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.333 7.5h5a2.5 2.5 0 010 5h-5a2.5 2.5 0 000 5h5a2.5 2.5 0 000-5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M12 5v2.5m0 10V20m-3.333-15v2.5m6.666 0v2.5m-6.666 10V20m6.666 0V20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
