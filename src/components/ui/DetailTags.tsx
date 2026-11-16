export default function DetailTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="mt-10 flex items-center gap-3 flex-wrap">
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-[10px] font-medium tracking-[0.08em] uppercase text-white bg-secondary/80 backdrop-blur-sm px-2.5 py-1 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
