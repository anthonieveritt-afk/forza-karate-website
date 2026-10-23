import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/privacy-policy',
  title: 'Privacy Policy',
  description: 'Privacy policy for Forza Karate Club — how we collect, use, and protect your personal data.',
})

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
          <p className="text-gray-500">Last updated: October 2026</p>
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

            <div id="dojo-dash">
              <h2 className="text-xl font-bold text-[#111111] mb-3">9. Dojo Dash game leaderboard</h2>
              <p className="mb-3">
                Dojo Dash is our free karate game. When you finish a run, your score can go on a shared
                leaderboard so you can see how you compare with other players. Here is exactly what that involves.
              </p>
              <p className="font-semibold text-[#111111] mb-1">What we store</p>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                <li>The nickname you choose (up to 12 characters)</li>
                <li>Your score, your time, the belt you reached and the game mode (for example the daily challenge)</li>
                <li>The date the score was saved</li>
                <li>A scrambled code that lets the device that saved the score remove it again (see &quot;Removing a score&quot; below)</li>
              </ul>
              <p className="mb-3">
                That is all. We do not ask for or store your real name, email address, age, school, location,
                photo, device or browser details. We do not use the leaderboard for advertising or to build a
                profile of you.
              </p>
              <p className="font-semibold text-[#111111] mb-1">Please don&apos;t use your real name</p>
              <p className="mb-3">
                The leaderboard is public, so anyone playing the game can see the nicknames on it. Please pick a
                made-up nickname, not your real name. Children should never use their real name. Nicknames are
                checked automatically, and ones that contain rude words, website addresses or long numbers are
                not accepted.
              </p>
              <p className="font-semibold text-[#111111] mb-1">Why we store it</p>
              <p className="mb-3">
                Only to show the shared leaderboard in the game. Our lawful basis is legitimate interests: running a
                fun, safe game for our club and visitors. We keep what we collect to the minimum needed for that,
                and we have considered the ICO&apos;s Children&apos;s Code (Age Appropriate Design Code) in how it works.
              </p>
              <p className="font-semibold text-[#111111] mb-1">Where it is stored</p>
              <p className="mb-3">
                Leaderboard entries are stored by our service provider Upstash (through our website host, Vercel)
                on servers in London, UK. To stop people flooding the leaderboard, we limit how often scores can be
                saved. To do this we briefly keep a scrambled, one-way code made from your internet connection. It
                is deleted after 60 seconds, and we never store or log your actual internet address.
              </p>
              <p className="font-semibold text-[#111111] mb-1">How long we keep it</p>
              <p className="mb-3">
                Daily challenge scores are deleted after 14 days. Other scores are deleted after 12 months, and we
                may reset the leaderboards sooner, for example at the start of a new season. Each leaderboard only
                keeps its top 50 scores, so lower scores drop off sooner.
              </p>
              <p className="font-semibold text-[#111111] mb-1">Saving on your own device</p>
              <p className="mb-3">
                The game also saves your scores, badges and progress in your browser on your own device, together
                with a private removal code for each score you put on the shared leaderboard. This stays on your
                device, we cannot see it, and you can remove it by clearing your browser&apos;s site data.
              </p>
              <p className="font-semibold text-[#111111] mb-1">Removing a score</p>
              <p className="mb-3">You can have a leaderboard score removed in two ways:</p>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                <li>
                  <strong>Straight away, in the game:</strong> on the device that saved the score, tap{' '}
                  <strong>🗑 My scores</strong> and then <strong>Remove my score</strong>. It is deleted at once. This works
                  because the game keeps a private removal code on that device. We only keep a scrambled version of the
                  code, so nobody else can use it.
                </li>
                <li>
                  <strong>Using our form:</strong> if you saved the score on another device or have cleared your browser,
                  use the{' '}
                  <a href="/games/dojo-dash/remove" className="text-[#dc2626] hover:underline">request removal form</a>.
                  It only asks for the nickname, the game mode and roughly when the score was saved, plus an optional
                  tick if you are a parent or carer asking for a child. It does not ask for your name or contact details.
                </li>
              </ul>
              <p className="mb-3">
                We process form requests within 2 working days, and always within one month. We remove every matching
                score and keep a short record of what we removed and when (the nickname, game mode, score and date),
                which is deleted after 12 months.
              </p>
              <p>
                You can still email{' '}
                <a href="mailto:sensei.everitt@forzakarate.co.uk" className="text-[#dc2626] hover:underline">sensei.everitt@forzakarate.co.uk</a>{' '}
                if you prefer, or if the form is not working. A parent or carer can ask on a child&apos;s behalf.
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
