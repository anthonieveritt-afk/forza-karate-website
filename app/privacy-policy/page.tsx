import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Forza Karate Club — how we collect, use, and protect your personal data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Privacy Policy</h1>
          <p className="text-gray-500">Last updated: May 2026</p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10 text-gray-600 text-sm leading-relaxed">

            <div>
              <h2 className="text-xl font-bold text-[#111111] mb-3">1. Who we are</h2>
              <p>
                Forza Karate Club (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates from Rayleigh, Essex and Upminster, East London.
                We are responsible for your personal data as a data controller under UK GDPR.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111111] mb-3">2. Data we collect</h2>
              <p className="mb-3">We may collect the following personal data:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Name and contact information (email address, phone number)</li>
                <li>Children&apos;s names and ages when registering for junior classes</li>
                <li>Payment information (processed securely via GoCardless or Stripe — we do not store card details)</li>
                <li>Training records including belt grades and grading results</li>
                <li>Health or medical information where relevant to safe participation</li>
                <li>Photographs taken at club events (with explicit consent)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111111] mb-3">3. How we use your data</h2>
              <p className="mb-3">We use your data to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Manage your membership and class bookings</li>
                <li>Process membership payments via Direct Debit</li>
                <li>Communicate about classes, gradings, and club events</li>
                <li>Maintain safety records (DBS, first aid, safeguarding)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111111] mb-3">4. Legal basis</h2>
              <p>
                We process your data on the basis of contract (to deliver your membership), legitimate interests
                (club administration and safety), and where required, consent (photography, marketing).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111111] mb-3">5. Data sharing</h2>
              <p className="mb-3">We may share your data with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>FKA (Frontier Karate Association) for affiliation and competition purposes</li>
                <li>Payment processors (GoCardless, Stripe) for billing</li>
                <li>Service providers who help us operate the club (e.g., database hosting)</li>
              </ul>
              <p className="mt-3">We do not sell your data to third parties.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111111] mb-3">6. Data retention</h2>
              <p>
                We retain membership data for as long as your membership is active and for a reasonable
                period thereafter to comply with legal obligations. Payment records are kept for 7 years
                for tax purposes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111111] mb-3">7. Your rights</h2>
              <p className="mb-3">Under UK GDPR, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion (&quot;right to be forgotten&quot;)</li>
                <li>Object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us via the <a href="/contact" className="text-[#dc2626] hover:underline">contact page</a>.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111111] mb-3">8. Cookies</h2>
              <p>
                Our website may use essential cookies to function correctly. We do not use tracking or
                advertising cookies without your consent.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111111] mb-3">9. Complaints</h2>
              <p>
                If you have a concern about how we handle your data, you can contact the ICO (Information
                Commissioner&apos;s Office) at <strong>ico.org.uk</strong> or call 0303 123 1113.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111111] mb-3">10. Changes to this policy</h2>
              <p>
                We may update this policy from time to time. The latest version will always be available
                on this page.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
