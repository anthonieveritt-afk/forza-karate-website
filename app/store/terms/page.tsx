import type { Metadata } from 'next'
import Link from 'next/link'
import StoreHeader from '@/components/store/StoreHeader'

export const metadata: Metadata = {
  title: 'Terms of Sale | Store',
  description: 'Terms of sale for the Forza Karate Club online store: collection at class, cancellations, refunds and faulty items.',
}

// TODO(Anthoni): confirm the legal trading name, VAT status, how long
// uncollected orders are held, and the size exchange policy (marked below).
// Legal note: UK law expects a distance seller to give a geographic address
// and an email address (Consumer Contracts Regulations 2013 Sch. 2;
// E-Commerce Regulations 2002 reg. 6). At Anthoni's request none are shown on
// the site; consider showing them on Stripe receipts and Stripe Checkout
// (Stripe Dashboard → Settings → Public details) instead.

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-xl font-bold text-[#111111]">{title}</h2>
      {children}
    </section>
  )
}

export default function TermsOfSalePage() {
  return (
    <>
      <StoreHeader title="Terms of Sale" intro="Please read these terms before you order. They don’t affect your legal rights." />
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-10 text-gray-600 leading-relaxed">
          <p className="text-sm text-gray-400">Last updated: October 2026</p>

          <Section title="1. Who we are">
            <p>
              The online store is run by Forza Karate Club (“we”, “us”), a karate club with dojos in Rayleigh and Upminster, Essex.
              {/* TODO(Anthoni): add the club's legal trading name here if different. */}
            </p>
            <p>
              If you have a question about an order, please use our <Link href="/store/help" className="text-[#dc2626] hover:underline">customer help page</Link> or speak to your instructor at class.
            </p>
          </Section>

          <Section title="2. Who can order">
            <p>Orders must be placed by a student aged 18 or over, or by the parent or guardian of the student. Most of our students are children, so we ask only for the student’s name and the class where the order will be collected.</p>
          </Section>

          <Section title="3. Your order">
            <p>When you pay, you are offering to buy the items in your basket. A contract is formed when your payment is confirmed and you receive your payment receipt by email.</p>
            <p>If we can’t supply an item (for example, the supplier no longer makes it), we’ll tell you and refund what you paid for it in full.</p>
          </Section>

          <Section title="4. Prices and payment">
            <p>Prices are in pounds sterling and include any VAT that applies. There is no delivery charge, because orders are collected at class.</p>
            <p>
              Payments are taken by Stripe on its secure payment page. Depending on what’s available, you can pay by card, Apple Pay, Google Pay or PayPal.
              Your card details go directly to Stripe and never reach our website or our club systems.
            </p>
          </Section>

          <Section title="5. Collection at class">
            <p>We don’t post orders. You choose the class where you’d like to collect your order, and we’ll bring it there.</p>
            <p>
              Most items are ordered from our suppliers after you pay and are usually ready to collect within 3–4 weeks. We’ll let you know when your order is ready.
              If we can’t have it ready within 30 days of your order, we’ll tell you, and you can choose to wait or cancel for a full refund.
            </p>
            <p>
              If an order isn’t collected within 8 weeks of us telling you it’s ready, we’ll get in touch to arrange collection.
              {/* TODO(Anthoni): confirm how long uncollected orders are held. */}
            </p>
          </Section>

          <Section title="6. Sizes">
            <p>
              Please check the size guide on each product. Gis are sized by height; if you’re between sizes, go up.
              If you’d like a different size, ask us. We’ll try to help if the item is unused and in its original packaging, subject to availability.
              {/* TODO(Anthoni): confirm the size exchange policy. */}
            </p>
          </Section>

          <Section id="cancellation" title="7. Your right to cancel">
            <p>
              You can cancel your order for any reason within <strong>14 days after the day you (or someone you nominate) collect it</strong>.
              You can also cancel at any time before you collect it.
            </p>
            <p>
              To cancel, tell us clearly through our <Link href="/store/help" className="text-[#dc2626] hover:underline">customer help page</Link> or
              tell your instructor at class. You can use the model cancellation form below, but you don’t have to.
            </p>
            <p>
              Please hand the item back at class within 14 days of telling us you’re cancelling. We’ll refund you within 14 days of getting it back,
              using the same payment method you used. If you cancel before collecting, we’ll refund you within 14 days of you telling us.
            </p>
            <p>
              You can check an item as you would in a shop. If it has been used or handled more than that and its value has gone down, we may reduce the refund to reflect this.
            </p>
          </Section>

          <Section id="exceptions" title="8. Items you can’t cancel">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personalised or made-to-order items</strong>, such as embroidered belts and gis with embroidered names or shoulders. These are made to
                your specification, so the right to cancel doesn’t apply once you’ve ordered them.
              </li>
              <li>
                <strong>Mouthguards</strong> once they have been unsealed, for health and hygiene reasons.
              </li>
            </ul>
            <p>This doesn’t affect your rights if an item is faulty (see below).</p>
          </Section>

          <Section title="9. Faulty or incorrect items">
            <p>
              Under the Consumer Rights Act 2015, items must be as described, fit for purpose and of satisfactory quality. If an item is faulty, tell us
              as soon as you can. Within 30 days of collection you can reject it for a full refund. After that, we’ll repair or replace it, or refund you
              if that isn’t possible. This includes personalised items with mistakes we made, such as a misspelt name.
            </p>
          </Section>

          <Section title="10. Your information">
            <p>
              We use the details you give us (the student’s name, the collection class and the payer’s name and email from Stripe) only to process,
              prepare and hand over your order and to keep proper financial records. Payments are handled by Stripe under its own privacy policy.
              See our <Link href="/privacy-policy" className="text-[#dc2626] hover:underline">Privacy Policy</Link> for more.
            </p>
          </Section>

          <Section title="11. The law">
            <p>These terms are governed by the law of England and Wales. Nothing in them affects your legal rights as a consumer.</p>
          </Section>

          <Section id="cancellation-form" title="Model cancellation form">
            <div className="rounded-2xl bg-[#fafaf9] border border-black/5 p-5 text-sm space-y-2">
              <p>(Complete and send this form only if you wish to cancel the contract. Send it through the customer help page or hand it to your instructor at class.)</p>
              <p>To: Forza Karate Club</p>
              <p>I/We hereby give notice that I/We cancel my/our contract of sale of the following goods: …</p>
              <p>Ordered on / collected on: …</p>
              <p>Order reference: …</p>
              <p>Name of consumer(s): …</p>
              <p>Date: …</p>
            </div>
          </Section>
        </div>
      </section>
    </>
  )
}
