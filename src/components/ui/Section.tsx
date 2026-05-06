import { getSections } from "@/lib/data/sections";

/**
 * Server component wrapper that reads section visibility config
 * and applies data-hidden attribute for the preview system.
 */
export default function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const sections = getSections();
  const config = sections.find((s) => s.id === id);
  const hidden = config ? !config.visible : false;

  return (
    <div data-hidden={hidden ? "true" : undefined} data-section-id={id} className={className}>
      {children}
    </div>
  );
}
