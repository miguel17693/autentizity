import { getSections } from "@/lib/data/sections";

/**
 * Server component wrapper that reads section visibility config
 * and applies data-hidden attribute for the preview system.
 */
export default async function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  let hidden = false;
  try {
    const sections = await getSections();
    const config = sections.find((s) => s.id === id);
    hidden = config ? !config.visible : false;
  } catch {
    // DB not available — default to visible
    hidden = false;
  }

  return (
    <div data-hidden={hidden ? "true" : undefined} data-section-id={id} className={className}>
      {children}
    </div>
  );
}
