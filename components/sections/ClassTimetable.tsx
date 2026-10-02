import { DOJO_NAMES, type ClassSession } from '@/lib/timetable'

export default function ClassTimetable({ sessions }: { sessions: ClassSession[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/10">
            <th className="text-left py-3 pr-8 font-semibold text-[#111111]">Day</th>
            <th className="text-left py-3 pr-8 font-semibold text-[#111111]">Time</th>
            <th className="text-left py-3 pr-8 font-semibold text-[#111111]">Dojo</th>
            <th className="text-left py-3 font-semibold text-[#111111]">Class</th>
          </tr>
        </thead>
        <tbody className="text-gray-500">
          {sessions.map((s) => (
            <tr key={s.id} className="border-b border-black/5">
              <td className="py-3 pr-8 font-medium text-[#111111]">{s.day}</td>
              <td className="py-3 pr-8 whitespace-nowrap">{s.time}</td>
              <td className="py-3 pr-8">{DOJO_NAMES[s.dojo]}</td>
              <td className="py-3">{s.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
