import MembershipSignup from './MembershipForm'

// The trial lookup (find your trial in Club Honbu, emailed code) is switched on by setting
// CLUB_HONBU_TRIAL_LOOKUP_URL. While it is unset the form is exactly as before.
export default function Page() {
  return <MembershipSignup trialLookup={!!process.env.CLUB_HONBU_TRIAL_LOOKUP_URL?.trim()} />
}
