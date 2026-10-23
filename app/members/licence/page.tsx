import { redirect } from 'next/navigation'

/** Old members “Renew your licence” hub (licence + Direct Debit cards). Removed — renew goes straight to the form. */
export default function MembersLicenceRedirect() {
  redirect('/join/apply-licence?reason=renewal')
}
