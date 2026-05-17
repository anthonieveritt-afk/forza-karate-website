import type { Metadata } from 'next'
import { Shield, Mail, Phone, FileText, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Safeguarding',
  description: 'Forza Karate Club safeguarding policy — protecting the welfare of children and young people in our care.',
}

const documents = [
  { label: 'FKC Safeguarding Policy – Children (2023)', href: 'https://forzakarate.co.uk/wp-content/uploads/2023/09/Forza-Karate-Club-Safeguarding-Children-Policy-and-Procedures.pdf' },
  { label: 'FKC Safeguarding Policy – Adults (2023)', href: 'https://forzakarate.co.uk/wp-content/uploads/2023/09/Forza-Karate-Club-Safeguarding-Adults-Policy.pdf' },
  { label: 'FKC Safeguarding Statement', href: 'https://forzakarate.co.uk/wp-content/uploads/2023/09/Forza-Karate-Club-Safeguarding-Statement.pdf' },
  { label: 'FKC Safe Practice Policy', href: 'https://forzakarate.co.uk/wp-content/uploads/2023/09/Forza-Karate-Club-Safe-Practice-Policy-2023.pdf' },
  { label: 'FKC Safeguarding Flowchart – Children', href: 'https://forzakarate.co.uk/wp-content/uploads/2023/09/forza-karate-club-safeguarding-flow-chart.png' },
  { label: 'FKC Safeguarding Flowchart – Adults', href: 'https://forzakarate.co.uk/wp-content/uploads/2023/09/forza-karate-club-adult-reporting-flow-chart.docx' },
  { label: 'FKC Code of Conduct – Students', href: 'https://forzakarate.co.uk/wp-content/uploads/2023/09/Forza-Karate-Club-Code-of-conduct-for-students.pdf' },
  { label: 'FKC Code of Conduct – Parents / Carers', href: 'https://forzakarate.co.uk/wp-content/uploads/2023/09/Forza-Karate-Club-Code-of-conduct-for-parents-and-carers.pdf' },
  { label: 'FKC Code of Conduct – Instructors / Coaches / Volunteers', href: 'https://forzakarate.co.uk/wp-content/uploads/2023/09/Forza-Karate-Club-Code-of-conduct-for-Instructors-Coaches-and-Volunteers.pdf' },
]

const localBoards = [
  {
    area: 'Havering Safeguarding',
    contacts: [
      'Monday to Friday (9am–5pm): 01708 433222',
      'Out of hours / weekends: 01708 433999',
    ],
  },
  {
    area: 'Rochford Safeguarding',
    contacts: [
      'Essex County Council Adult Social Care: 0345 603 7630',
      'Out of office hours: 0345 606 1212',
      "RDC's Safeguarding Officer: 01702 546 366",
    ],
  },
  {
    area: 'Basildon Safeguarding',
    contacts: [
      'Essex County Council Children and Families Hub: 0345 603 7627',
    ],
    links: [{ label: 'Essex Effective Support', href: 'https://www.essexeffectivesupport.org.uk/' }],
  },
  {
    area: 'Southend Safeguarding',
    contacts: [
      'MASH — Mon–Thu 9am–5.30pm, Fri 9am–4.30pm: 01702 215007',
      'Emergency Duty Team (out of hours, 365 days): 0345 606 1212',
    ],
  },
]

export default function SafeguardingPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Safeguarding</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Safeguarding</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            The welfare of every child and young person in our club is our highest priority.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-14">

          {/* Our commitment */}
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-4">Our commitment</h2>
            <div className="space-y-4 text-gray-500 leading-relaxed text-sm">
              <p>
                Forza Karate Club (FKC) acknowledges the duty of care to safeguard and promote the welfare of children. FKC are committed to ensuring safeguarding practice reflects statutory responsibilities, government guidance and complies with best practice and local authority requirements.
              </p>
              <p>
                Forza Karate Club are affiliated to the English Karate Federation (EKF) via our association{' '}
                <a href="http://frontierkarateassociation.co.uk/" target="_blank" rel="noopener noreferrer" className="text-[#dc2626] hover:underline font-medium">
                  Frontier Karate Association
                </a>.
              </p>
              <p>As part of our safeguarding policy, FKC will:</p>
              <ul className="space-y-3 pl-4">
                {[
                  'Promote and prioritise the safety and wellbeing of children and young people.',
                  'Ensure that everyone understands their roles and responsibilities in respect of safeguarding and is provided with appropriate learning opportunities to recognise, identify, and respond to signs of abuse, neglect and other safeguarding concerns relating to children and young people.',
                  'Ensure appropriate action is taken in the event of incidents/concerns of abuse and support provided to the individual/s who raise or disclose the concern — ensuring that confidential, detailed, and accurate records of all safeguarding concerns are maintained and securely stored.',
                ].map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-[#dc2626]">{i + 1}</span>
                    </div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Safeguarding Team */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-[#dc2626]" />
              <h2 className="text-2xl font-bold text-[#111111]">Safeguarding Team</h2>
            </div>
            <div className="bg-[#fafaf9] rounded-2xl border border-black/5 p-6">
              <p className="text-xs font-semibold text-[#dc2626] uppercase tracking-wider mb-3">Lead Safeguarding Officer</p>
              <a
                href="mailto:scott.nicholls@forzakarate.co.uk"
                className="flex items-center gap-2 text-sm text-[#111111] hover:text-[#dc2626] transition-colors font-medium"
              >
                <Mail className="h-4 w-4 text-[#dc2626]" />
                scott.nicholls@forzakarate.co.uk
              </a>
              <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                If you have any concerns at all in regards to the welfare or safeguarding of any child please contact the designated Safeguarding Team or the Chief Instructor and they will guide you.
              </p>
            </div>
          </div>

          {/* Safeguarding Documents */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-[#dc2626]" />
              <h2 className="text-2xl font-bold text-[#111111]">Safeguarding Documents</h2>
            </div>
            <div className="divide-y divide-black/5 border border-black/5 rounded-2xl overflow-hidden">
              {documents.map((doc) => (
                <a
                  key={doc.href}
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 px-5 py-3.5 bg-white hover:bg-[#fafaf9] transition-colors group"
                >
                  <span className="text-sm text-[#111111] group-hover:text-[#dc2626] transition-colors">{doc.label}</span>
                  <FileText className="h-4 w-4 text-gray-300 group-hover:text-[#dc2626] flex-shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Local Safeguarding Boards */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-[#dc2626]" />
              <h2 className="text-2xl font-bold text-[#111111]">Local Safeguarding Children's Board</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {localBoards.map((board) => (
                <div key={board.area} className="bg-[#fafaf9] rounded-2xl border border-black/5 p-5">
                  <p className="text-sm font-semibold text-[#111111] mb-3">{board.area}</p>
                  <ul className="space-y-1.5">
                    {board.contacts.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                        <Phone className="h-3 w-3 text-[#dc2626] mt-0.5 flex-shrink-0" />
                        {c}
                      </li>
                    ))}
                    {'links' in board && board.links?.map((l) => (
                      <li key={l.href} className="flex items-start gap-2 text-xs">
                        <FileText className="h-3 w-3 text-[#dc2626] mt-0.5 flex-shrink-0" />
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-[#dc2626] hover:underline">{l.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
