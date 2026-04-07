const privacyContent = {
  title: "Privacy Policy",
  effectiveDate: "2026.01.01",
  company: "Crown Standard Cleaning",
  intro: [
    "Crown Standard Cleaning (\"Company\", \"we\", \"us\", or \"our\") respects your privacy and is committed to protecting it through this Privacy Policy.",
    "This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (the \"App\"). Please read this policy carefully. If you do not agree with the terms, do not use the App.",
  ],
  sections: [
    {
      heading: "1. Information We Collect",
      paragraphs: ["We may collect the following types of information:"],
      items: [
        "Personal Information: Name, email address, phone number, billing and payment information, and account login credentials.",
        "Usage Data: Device type and operating system, IP address, app usage patterns and interactions, and log data or crash reports.",
        "Location Data: Real-time or approximate location, if enabled by the user.",
        "Service Information: Booking details, cleaning preferences, and communication between users and service providers.",
      ],
    },
    {
      heading: "2. How We Use Your Information",
      paragraphs: ["We use the collected information to:"],
      items: [
        "Provide, operate, and maintain the App.",
        "Process bookings and payments.",
        "Connect users with cleaning service providers.",
        "Improve our services and user experience.",
        "Communicate with users, including updates, promotions, and support.",
        "Detect and prevent fraud or unauthorized activity.",
        "Comply with legal obligations.",
      ],
    },
    {
      heading: "3. Sharing Your Information",
      paragraphs: ["We may share your information in the following situations:"],
      items: [
        "Service Providers: We may share your data with third-party vendors that help us operate the App, such as payment processors, hosting providers, and analytics services.",
        "Cleaning Professionals / Businesses: User information may be shared with cleaning service providers to fulfill bookings.",
        "Legal Requirements: We may disclose your information if required by law or in response to valid legal requests.",
        "Business Transfers: If we are involved in a merger, sale, or acquisition, your information may be transferred.",
        "With Your Consent: We may share your data for other purposes with your explicit consent.",
      ],
    },
    {
      heading: "4. Data Retention",
      paragraphs: ["We retain your information only as long as necessary to:"],
      items: [
        "Provide services.",
        "Comply with legal obligations.",
        "Resolve disputes.",
        "Enforce agreements.",
      ],
    },
    {
      heading: "5. Data Security",
      paragraphs: [
        "We implement reasonable administrative, technical, and physical safeguards to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure.",
      ],
    },
    {
      heading: "6. Your Privacy Rights",
      paragraphs: [
        "Depending on your location, you may have the right to:",
      ],
      items: [
        "Access the personal data we hold about you.",
        "Request correction of inaccurate data.",
        "Request deletion of your data.",
        "Withdraw consent for data processing.",
        "Request information about how your data is used.",
      ],
      note: "To exercise these rights, contact us at: contact@crownstandard.ca",
    },
    {
      heading: "7. Third-Party Services",
      paragraphs: [
        "The App may contain links to third-party websites or services. We are not responsible for their privacy practices. We encourage you to review their privacy policies.",
      ],
    },
    {
      heading: "8. Children's Privacy",
      paragraphs: [
        "Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children.",
      ],
    },
    {
      heading: "9. International Data Transfers",
      paragraphs: [
        "Your information may be transferred to and processed in countries outside of your jurisdiction, including where data protection laws may differ.",
      ],
    },
    {
      heading: "10. Changes to This Privacy Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. We will notify users of any changes by updating the effective date. Continued use of the App after changes constitutes acceptance.",
      ],
    },
    {
      heading: "11. Contact Us",
      paragraphs: [
        "If you have any questions about this Privacy Policy, please contact us:",
        "Crown Standard Cleaning",
        "Email: contact@crownstandard.ca",
      ],
    },
  ],
  closing:
    "By using the App, you acknowledge that you have read and understood this Privacy Policy.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-white py-12 md:py-16">
      <div className="container 3xl:max-w-[980px]">
        <article className="rounded-2xl border border-[#E7DFD1] bg-[#FCFBF8] p-6 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b9903c]">
            Legal
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            {privacyContent.title}
          </h1>
          <p className="mt-2 text-base font-medium text-gray-700">
            {privacyContent.company}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Effective Date: {privacyContent.effectiveDate}
          </p>

          <div className="mt-8 space-y-5 text-sm leading-7 text-gray-700 md:text-base">
            {privacyContent.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 space-y-8 border-t border-[#E7DFD1] pt-8">
            {privacyContent.sections.map((section) => (
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
                  <p className="text-sm leading-7 text-gray-700 md:text-base">
                    {section.note}
                  </p>
                )}
              </section>
            ))}
          </div>

          <p className="mt-10 border-t border-[#E7DFD1] pt-6 text-sm leading-7 text-gray-600 md:text-base">
            {privacyContent.closing}
          </p>
        </article>
      </div>
    </main>
  );
}
