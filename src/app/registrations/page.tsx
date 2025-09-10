import ProtectedRoute from '@/components/ProtectedRoute'
import { RegistrationSelector } from '@/components/RegistrationSelector'

export default function RegistrationsPage() {
  return (
    <ProtectedRoute>
      <RegistrationSelector />
    </ProtectedRoute>
  )
}
