export default function RoofMark({ className = "w-6 h-4" }) {
  return (
    <svg viewBox="0 0 100 60" fill="none" className={className}>
      <path
        d="M4 40L50 6L96 40"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="square"
      />
    </svg>
  );
}
