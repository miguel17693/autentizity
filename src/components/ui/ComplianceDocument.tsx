import type { ComplianceDocument as ComplianceDocumentContent } from "@/lib/compliance-content";

interface ComplianceDocumentProps {
  document: ComplianceDocumentContent;
}

const MIN_SECTIONS_FOR_INDEX = 6;

const bodyText = "text-[15px] sm:text-base leading-[1.7] text-text-body";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ComplianceDocument({ document }: ComplianceDocumentProps) {
  const multipleBlocks = document.blocks.length > 1;

  return (
    <article className="bg-surface text-text-body">
      <section className="bg-primary py-14 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <p className="text-secondary text-xs sm:text-sm uppercase tracking-[0.28em] font-medium mb-4">
            Compliance
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-light tracking-[-0.02em] leading-tight">
            {document.title}
          </h1>
          <p className="mt-5 text-white/70 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {document.description}
          </p>
          {document.downloadHref ? (
            <a
              href={document.downloadHref}
              className="inline-flex mt-7 rounded-full border border-white/25 px-5 py-2.5 text-sm text-white/85 hover:bg-white hover:text-primary transition-colors"
            >
              Descargar documento original
            </a>
          ) : null}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="space-y-10 sm:space-y-16">
          {document.blocks.map((block, blockIndex) => {
            const idPrefix = multipleBlocks ? `${blockIndex + 1}-` : "";
            const sections = block.sections.map((section) => ({
              ...section,
              id: `${idPrefix}${slugify(section.title)}`,
            }));

            return (
              <section
                key={block.eyebrow}
                className="rounded-[1.5rem] sm:rounded-[2rem] bg-white border border-border-light px-5 py-7 sm:p-10 lg:px-16 lg:py-14 shadow-sm"
              >
                <div className="max-w-[68ch] mx-auto">
                  <header className="border-b border-border-light pb-6">
                    <p className="text-secondary text-xs uppercase tracking-[0.22em] font-medium">
                      {block.eyebrow}
                    </p>
                    {block.updated ? (
                      <p className="mt-2 text-sm leading-relaxed text-text-muted">{block.updated}</p>
                    ) : null}
                  </header>

                  {sections.length >= MIN_SECTIONS_FOR_INDEX ? (
                    <nav aria-label={`Índice · ${block.eyebrow}`} className="mt-8 rounded-2xl bg-surface px-5 py-5 sm:px-6">
                      <p className="text-primary text-xs uppercase tracking-[0.18em] font-medium">Índice</p>
                      <ol className="mt-3 sm:columns-2 gap-x-8 text-sm leading-snug">
                        {sections.map((section) => (
                          <li key={section.id} className="break-inside-avoid py-[3px]">
                            <a
                              href={`#${section.id}`}
                              className="text-text-secondary hover:text-secondary transition-colors"
                            >
                              {section.title}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  ) : null}

                  <div className="mt-10 space-y-10 sm:space-y-12">
                    {sections.map((section) => (
                      <section key={section.id} id={section.id} className="scroll-mt-28">
                        <h2 className="font-serif text-xl sm:text-[1.625rem] text-primary font-normal leading-tight tracking-[-0.01em]">
                          {section.title}
                        </h2>

                        <div className="mt-4 space-y-4">
                          {section.paragraphs?.map((paragraph) => (
                            <p key={paragraph} className={bodyText}>
                              {paragraph}
                            </p>
                          ))}

                          {section.items ? (
                            <ul className={`list-disc pl-6 space-y-1.5 marker:text-secondary ${bodyText}`}>
                              {section.items.map((item) => (
                                <li key={item} className="pl-1">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ) : null}

                          {section.closingParagraphs?.map((paragraph) => (
                            <p key={paragraph} className={bodyText}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </article>
  );
}
