import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'legal@slicenspice.co.uk';
  const contactAddress = import.meta.env.VITE_CONTACT_ADDRESS || '104 Woodfired Alley, Gastronomy Plaza, London, W1D 1AL, UK';

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden flex flex-col">
      <Helmet>
        <title>Terms of Service | Slice 'n Spice</title>
        <meta name="description" content="Review the Terms of Service for Slice 'n Spice, covering our ordering policies, allergen information (Natasha's Law), and liability." />
      </Helmet>

      <Navbar />

      <main className="flex-grow pt-32 pb-24 max-w-4xl mx-auto px-6 w-full">
        <div className="space-y-10">
          <div className="space-y-4 border-b border-white/10 pb-8">
            <p className="text-amber-400 font-bold uppercase tracking-widest text-sm">Legal</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
            <p className="text-white/50 text-sm">Last Updated: {new Date().toLocaleDateString('en-GB')}</p>
          </div>

          <div className="prose prose-invert prose-amber max-w-none text-white/70 space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
              <p>
                These Terms of Service govern your use of the Slice 'n Spice website and food delivery services. 
                By placing an order with us, you agree to be bound by these terms. 
                Our business operates as a cloud kitchen based in London, United Kingdom.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Orders and Delivery</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Acceptance:</strong> All orders are subject to acceptance and availability. We reserve the right to refuse an order for any reason.</li>
                <li><strong>Delivery Times:</strong> Estimated delivery times are provided as a guide only. We cannot guarantee exact delivery times due to factors outside our control (e.g., traffic, severe weather).</li>
                <li><strong>Cancellations:</strong> You may cancel your order up to the point where food preparation begins. Once preparation has started, orders cannot be cancelled or refunded.</li>
              </ul>
            </section>

            <section className="space-y-4 bg-amber-400/5 border border-amber-400/20 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-amber-400">3. Allergens and Dietary Requirements</h2>
              <p>
                Food safety is our top priority. We adhere to the <strong>UK Food Standards Agency</strong> guidelines and <strong>Natasha's Law (PPDS)</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-white/80">
                <li>
                  <strong>14 Major Allergens:</strong> Our kitchen handles ingredients containing peanuts, tree nuts, milk, eggs, gluten, sesame, soy, fish, crustaceans, molluscs, celery, mustard, lupin, and sulphites.
                </li>
                <li>
                  <strong>Cross-Contamination:</strong> While we have stringent Hazard Analysis and Critical Control Point (HACCP) protocols in place to prevent cross-contamination, we operate a busy commercial kitchen. Therefore, we <em>cannot guarantee</em> that any dish is 100% free from trace allergens.
                </li>
                <li>
                  <strong>Customer Responsibility:</strong> You <strong>must</strong> inform us of any allergies or dietary requirements before placing your order. Please add this information to the order notes or contact us directly.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Food Safety and Hygiene</h2>
              <p>
                As a registered food business operating in London, we are subject to regular inspections by local Environmental Health Officers. 
                We maintain strict hygiene and temperature control standards. If you are ever unsatisfied with the quality or safety of your food, 
                please contact us immediately upon delivery so we can investigate and rectify the issue.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Slice 'n Spice shall not be liable for any indirect, incidental, or consequential damages arising from the use of our service. 
                Nothing in these terms limits our liability for death or personal injury arising from our negligence, or for fraud or fraudulent misrepresentation, 
                in accordance with UK law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Governing Law</h2>
              <p>
                These Terms of Service and any dispute or claim arising out of or in connection with them shall be governed by and construed 
                in accordance with the law of <strong>England and Wales</strong>. The courts of England and Wales shall have exclusive jurisdiction.
              </p>
            </section>

            <section className="space-y-4 border-t border-white/10 pt-8 mt-12">
              <h2 className="text-2xl font-bold text-white">Contact Us</h2>
              <p>
                For any questions regarding these Terms of Service, please contact our support team:
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
