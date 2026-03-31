type WordmarkProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-[42px]",
};

export default function Wordmark({ size = "md", className = "" }: WordmarkProps) {
  return (
    <span className={`font-display text-white leading-none tracking-tight ${sizes[size]} ${className}`}>
      Hex<em className="italic text-red">a</em>drine
    </span>
  );
}
