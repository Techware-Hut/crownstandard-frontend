import React from "react";

const accessibilityContent = {
  title: "Accessibility Statement",
  effectiveDate: "2026.05.01",
  company: "Crown Standard Cleaning",
  intro: [
    "Crown Standard Cleaning is committed to ensuring that our application is accessible to all users, including individuals with disabilities.",
    "We strive to provide an inclusive and user-friendly experience for everyone, regardless of ability.",
  ],
  sections: [
    {
      heading: "1. Commitment to Accessibility",
      paragraphs: [
        "Crown Standard Cleaning is committed to ensuring that our application is accessible to all users, including individuals with disabilities. We strive to provide an inclusive and user-friendly experience for everyone, regardless of ability.",
      ],
    },
    {
      heading: "2. Accessibility Features",
      paragraphs: [
        "Our application is designed with accessibility in mind and includes:",
      ],
      items: [
        "Compatibility with screen readers and assistive technologies",
        "Clear navigation and consistent layouts",
        "Readable fonts and sufficient color contrast",
        "Scalable text and responsive design for different devices",
      ],
      note: "We are continuously working to improve accessibility and usability across all features of the app.",
    },
    {
      heading: "3. Ongoing Improvements",
      paragraphs: [
        "Accessibility is an ongoing effort. We regularly review our application to identify and address potential barriers. Updates and improvements are made to enhance usability for all users.",
      ],
    },
    {
      heading: "4. Limitations",
      paragraphs: [
        "While we strive to ensure full accessibility, some areas of the application may not yet be fully optimized. We are actively working to address these issues and appreciate your patience as we improve.",
      ],
    },
    {
      heading: "5. Feedback and Support",
      paragraphs: [
        "We welcome feedback on the accessibility of our application. If you experience any difficulty accessing content or features, or if you have suggestions for improvement, please contact us:",
      ],
      note: "Crown Standard Cleaning\nEmail: [contact@crownstandard.ca](mailto:contact@crownstandard.ca)",
    },
    {
      heading: "6. Compatibility",
      paragraphs: [
        "Our application is designed to work with modern devices and operating systems. For the best experience, we recommend keeping your device and app updated to the latest version.",
      ],
    },
    {
      heading: "7. Policy Updates",
      paragraphs: [
        "We may update this Accessibility Statement from time to time to reflect improvements or changes. Updates will be posted within the application with a revised effective date.",
      ],
    },
  ],
  closing:
    "We will make reasonable efforts to address accessibility concerns and provide alternative access where possible.",
};

export default function AccessibilityStatement() {
  return (
    <main className="bg-white py-12 md:py-16">
      <div className="container 3xl:max-w-[980px]">
        <article className="rounded-2xl border border-[#E7DFD1] bg-[#FCFBF8] p-6 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b9903c]">
            Legal
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            {accessibilityContent.title}
          </h1>

          <p className="mt-2 text-base font-medium text-gray-700">
            {accessibilityContent.company}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Effective Date: {accessibilityContent.effectiveDate}
          </p>

          <div className="mt-8 space-y-5 text-sm leading-7 text-gray-700 md:text-base">
            {accessibilityContent.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 space-y-8 border-t border-[#E7DFD1] pt-8">
            {accessibilityContent.sections.map((section) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                  {section.heading}
                </h2>

                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-7 text-gray-700 md:text-base"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.items && (
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-gray-700 md:text-base">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.note && (
                  <p className="whitespace-pre-line text-sm leading-7 text-gray-700 md:text-base">
                    {section.note}
                  </p>
                )}
              </section>
            ))}
          </div>

          <p className="mt-10 border-t border-[#E7DFD1] pt-6 text-sm leading-7 text-gray-600 md:text-base">
            {accessibilityContent.closing}
          </p>
        </article>
      </div>
    </main>
  );
}
