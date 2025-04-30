export const upload = ({ fill = "#D6E0FF" }: { fill?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="18"
      fill="none"
      viewBox="0 0 20 18"
    >
      <path
        fill={fill}
        fillRule="evenodd"
        d="M5 18a5 5 0 0 1-5-5v-3a1 1 0 0 1 2 0v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3a1 1 0 0 1 2 0v3a5 5 0 0 1-5 5z"
        clipRule="evenodd"
      ></path>
      <path
        fill={fill}
        fillRule="evenodd"
        d="M5.285 6.1a1 1 0 0 1 .016-1.415l4.5-4.4a1 1 0 0 1 1.398 0l4.5 4.4a1 1 0 1 1-1.398 1.43L11.5 3.376V12a1 1 0 1 1-2 0V3.376L6.7 6.115a1 1 0 0 1-1.415-.016z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};
