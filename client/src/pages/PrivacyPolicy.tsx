import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'legal@slicenspice.co.uk';
  const contactAddress = import.meta.env.VITE_CONTACT_ADDRESS || '104 Woodfired Alley, Gastronomy Plaza, London, W1D 1AL, UK';

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden flex flex-col">
      <Helmet>
        <title>Privacy Policy | Slice 'n Spice</title>
        <meta name="description" content="Read our UK GDPR compliant privacy policy to understand how we protect and manage your personal data when using the Slice 'n Spice cloud kitchen." />
      </Helmet>

      <Navbar />

      <main className="flex-grow pt-32 pb-24 max-w-4xl mx-auto px-6 w-full">
        <div className="space-y-10">
          <div className="space-y-4 border-b border-white/10 pb-8">
            <p className="text-amber-400 font-bold uppercase tracking-widest text-sm">Legal</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
            <p className="text-white/50 text-sm">Last Updated: {new Date().toLocaleDateString('en-GB')}</p>
          </div>

          <div className="prose prose-invert prose-amber max-w-none text-white/70 space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
              <p>
                Welcome to Slice 'n Spice. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy informs you about how we look after your personal data when you visit our website 
                or use our delivery services, and tells you about your privacy rights and how the law protects you.
              </p>
              <p>
                This policy complies with the <strong>UK General Data Protection Regulation (UK GDPR)</strong> and the 
                <strong> Data Protection Act 2018</strong>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. The Data We Collect About You</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you, which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Financial Data</strong> includes bank account and payment card details (processed securely via our payment providers).</li>
                <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                <li><strong>Profile Data</strong> includes your username and password, purchases or orders made by you, your dietary preferences, and feedback.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. How We Use Your Personal Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Performance of a Contract:</strong> To process and deliver your order, manage payments, fees and charges.</li>
                <li><strong>Legitimate Interests:</strong> To study how customers use our products/services, to develop them, and to grow our business.</li>
                <li><strong>Legal Obligation:</strong> To comply with a legal or regulatory obligation (e.g., maintaining financial records).</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Disclosures of Your Personal Data</h2>
              <p>
                We may share your personal data with external third parties such as:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Delivery partners and couriers to fulfill your orders.</li>
                <li>Service providers acting as processors based in the UK who provide IT and system administration services.</li>
                <li>Professional advisers including lawyers, bankers, auditors, and insurers based in the UK.</li>
              </ul>
              <p>
                We require all third parties to respect the security of your personal data and to treat it in accordance with the law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Data Security & Retention</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorised way, altered, or disclosed.
                We will only retain your personal data for as long as reasonably necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Your Legal Rights</h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
            </section>

            <section className="space-y-4 border-t border-white/10 pt-8 mt-12">
              <h2 className="text-2xl font-bold text-white">Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-2">
                <p><strong>Email:</strong> <a href={`mailto:${contactEmail}`} className="text-amber-400 hover:underline">{contactEmail}</a></p>
                <p><strong>Postal Address:</strong> {contactAddress}</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
