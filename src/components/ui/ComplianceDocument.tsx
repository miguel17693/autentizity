import type { ComplianceDocument as ComplianceDocumentContent } from "@/lib/compliance-content";

interface ComplianceDocumentProps {
  document: ComplianceDocumentContent;
}

export default function ComplianceDocument({ document }: ComplianceDocumentProps) {
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

      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="space-y-12 sm:space-y-16">
          {document.blocks.map((block) => (
            <section key={block.eyebrow} className="rounded-[2rem] bg-white border border-border-light p-6 sm:p-8 lg:p-10 shadow-sm">
              <div className="mb-8 border-b border-border-light pb-5">
                <p className="text-secondary text-xs uppercase tracking-[0.22em] font-medium">
                  {block.eyebrow}
                </p>
                {block.updated ? (
                  <p className="mt-2 text-sm text-text-muted font-light">{block.updated}</p>
                ) : null}
              </div>

              <div className="space-y-8">
                {block.sections.map((section) => (
                  <section key={section.title} className="space-y-3">
                    <h2 className="font-serif text-xl sm:text-2xl text-primary font-light leading-snug">
                      {section.title}
                    </h2>

                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="text-sm sm:text-base leading-7 text-text-body font-light">
                        {paragraph}
                      </p>
                    ))}

                    {section.items ? (
                      <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-7 text-text-body font-light marker:text-secondary">
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}

                    {section.closingParagraphs?.map((paragraph) => (
                      <p key={paragraph} className="text-sm sm:text-base leading-7 text-text-body font-light">
                        {paragraph}
                      </p>
                    ))}
                  </section>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
