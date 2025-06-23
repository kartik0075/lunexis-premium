export default function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-gray-700 animate-pulse rounded ${className}`} />;
}

// Usage:
// <Skeleton className="h-6 w-full mb-2" />