export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-4 text-gray-400 italic text-center">
      {message}
    </div>
  );
}