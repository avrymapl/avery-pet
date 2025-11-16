interface IconProps {
  className?: string;
}

export default function BookmarkIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
      <path d="M 18,4.5 C 15.514822,4.5002485 13.500248,6.5148216 13.5,9 v 72 c 6.05e-4,3.430911 3.686173,5.599399 6.685547,3.933594 L 45,71.148437 69.814453,84.933594 C 72.813827,86.599399 76.499395,84.430911 76.5,81 V 9 C 76.499752,6.5148216 74.485178,4.5002485 72,4.5 Z" />
    </svg>
  );
}
