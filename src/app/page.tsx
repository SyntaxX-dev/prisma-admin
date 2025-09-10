import LoginForm from '@/components/LoginForm'
import AuthRedirect from '@/components/AuthRedirect'

export default function Home() {
  return (
    <>
      <AuthRedirect />
      <LoginForm />
    </>
  )
}
