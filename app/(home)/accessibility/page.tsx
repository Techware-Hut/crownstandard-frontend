import React from "react";

const AccessibilityStatement = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Accessibility Statement</h1>
      <p><strong>Effective Date:</strong> May 1, 2026</p>

      <section style={styles.section}>
        <h2>1. Commitment to Accessibility</h2>
        <p>
          Crown Standard Cleaning is committed to ensuring that our application is
          accessible to all users, including individuals with disabilities. We
          strive to provide an inclusive and user-friendly experience for everyone,
          regardless of ability.
        </p>
      </section>

      <section style={styles.section}>
        <h2>2. Accessibility Features</h2>
        <p>Our application is designed with accessibility in mind and includes:</p>
        <ul>
          <li>Compatibility with screen readers and assistive technologies</li>
          <li>Clear navigation and consistent layouts</li>
          <li>Readable fonts and sufficient color contrast</li>
          <li>Scalable text and responsive design for different devices</li>
        </ul>
        <p>
          We are continuously working to improve accessibility and usability across
          all features of the app.
        </p>
      </section>

      <section style={styles.section}>
        <h2>3. Ongoing Improvements</h2>
        <p>
          Accessibility is an ongoing effort. We regularly review our application
          to identify and address potential barriers. Updates and improvements are
          made to enhance usability for all users.
        </p>
      </section>

      <section style={styles.section}>
        <h2>4. Limitations</h2>
        <p>
          While we strive to ensure full accessibility, some areas of the
          application may not yet be fully optimized. We are actively working to
          address these issues and appreciate your patience as we improve.
        </p>
      </section>

      <section style={styles.section}>
        <h2>5. Feedback and Support</h2>
        <p>
          We welcome feedback on the accessibility of our application. If you
          experience any difficulty accessing content or features, or if you have
          suggestions for improvement, please contact us:
        </p>
        <p>
          <strong>Crown Standard Cleaning</strong><br />
          <a href="mailto:your-email@example.com">
            contact@crownstandard.ca
          </a>
        </p>
        <p>
          We will make reasonable efforts to address your concerns and provide
          alternative access where possible.
        </p>
      </section>

      <section style={styles.section}>
        <h2>6. Compatibility</h2>
        <p>
          Our application is designed to work with modern devices and operating
          systems. For the best experience, we recommend keeping your device and
          app updated to the latest version.
        </p>
      </section>

      <section style={styles.section}>
        <h2>7. Policy Updates</h2>
        <p>
          We may update this Accessibility Statement from time to time to reflect
          improvements or changes. Updates will be posted within the application
          with a revised effective date.
        </p>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    lineHeight: "1.6",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "10px",
  },
  section: {
    marginTop: "20px",
  },
};

export default AccessibilityStatement;