import { draftMode } from "next/headers";
import { getSections } from "@/lib/data/sections";

/**
 * Server component wrapper that reads section visibility config.
 * Hidden sections are not rendered for visitors; in admin preview (draft mode)
 * they are kept with data-hidden so the preview styles can flag them.
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

  if (hidden && !(await draftMode()).isEnabled) return null;

  return (
    <div data-hidden={hidden ? "true" : undefined} data-section-id={id} className={className}>
      {children}
    </div>
  );
}
