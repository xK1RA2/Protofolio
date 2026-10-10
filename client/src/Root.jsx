import { lazy, Suspense } from 'react'
import App from './App.jsx'

// The admin inbox lives at /admin and is a separate chunk, so visitors to the public
// portfolio never download it.
const Admin = lazy(() => import('./admin/Admin.jsx'))

export default function Root() {
  const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin'
  if (!isAdmin) return <App />
  return (
    <Suspense fallback={null}>
      <Admin />
    </Suspense>
  )
}
