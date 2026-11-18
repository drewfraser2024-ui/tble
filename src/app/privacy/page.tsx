import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Tble',
  description: 'Privacy Policy for Tble - Let\'s Table It',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-text-lo mb-8">Last updated: April 9, 2026</p>

      <div className="space-y-8 text-text-mid leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
          <p>
            Welcome to Tble It. We are committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>

          <h3 className="font-semibold text-white mt-4 mb-2">Account Information</h3>
          <p>When you create an account, we collect:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email address</li>
            <li>Display name</li>
            <li>Password (stored securely and encrypted)</li>
            <li>Account role (user or business owner)</li>
          </ul>

          <h3 className="font-semibold text-white mt-4 mb-2">User-Generated Content</h3>
          <p>When you use our platform, we collect content you choose to provide, including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Reviews and ratings of businesses</li>
            <li>Comments on reviews</li>
            <li>Photos uploaded with reviews</li>
            <li>Business owner responses to reviews</li>
          </ul>

          <h3 className="font-semibold text-white mt-4 mb-2">Business Submissions</h3>
          <p>When you submit a business to our platform, we collect:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Business name, category, and description</li>
            <li>Business address and geographic coordinates</li>
            <li>Phone number and website (if provided)</li>
            <li>Your name and email as the submitter</li>
          </ul>

          <h3 className="font-semibold text-white mt-4 mb-2">Automatically Collected Information</h3>
          <p>
            We use cookies to manage authentication sessions and keep you signed in. We do not use
            tracking cookies or third-party analytics services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Create and manage your account</li>
            <li>Display your reviews, ratings, and comments on the platform</li>
            <li>Enable business owners to respond to reviews</li>
            <li>Process and display business submissions</li>
            <li>Maintain and improve the platform</li>
            <li>Communicate with you about your account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Voice-to-Text Feature</h2>
          <p>
            Our platform offers an optional voice-to-text feature for writing reviews. This feature
            uses your browser&apos;s built-in Web Speech API. Audio is processed locally on your
            device and is not sent to or stored on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Data Storage and Security</h2>
          <p>
            Your data is stored securely using Supabase, which provides encrypted database storage
            and file hosting. We implement row-level security policies to ensure users can only
            access and modify their own data. Uploaded images are stored in secure cloud storage.
          </p>
          <p className="mt-2">
            While we take reasonable measures to protect your information, no method of transmission
            over the Internet or electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Sharing of Information</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. Your reviews,
            ratings, and comments are publicly visible on the platform under your display name. We
            may share information in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>To comply with legal obligations or respond to lawful requests</li>
            <li>To protect our rights, privacy, safety, or property</li>
            <li>With service providers who assist in operating the platform (e.g., hosting and database services)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Cookies</h2>
          <p>
            We use essential cookies solely for authentication and session management. These cookies
            are necessary for the platform to function and cannot be disabled. We do not use
            advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your account and associated data</li>
            <li>Withdraw consent for data processing where applicable</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, please contact us at the email address provided below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">9. Children&apos;s Privacy</h2>
          <p>
            Our platform is not intended for children under the age of 13. We do not knowingly
            collect personal information from children under 13. If we become aware that we have
            collected such information, we will take steps to delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot;
            date. Your continued use of the platform after any changes constitutes acceptance of the
            updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please
            contact us at:
          </p>
          <p className="mt-2 font-semibold text-turquoise">support@tble.app</p>
        </section>
      </div>
    </div>
  );
}
