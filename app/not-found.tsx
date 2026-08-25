import { Anchor } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className='not-found-page'>
      <span className='brand-mark' aria-hidden='true'>
        <Anchor className='h-4 w-4' />
      </span>
      <p className='eyebrow'>Chart reference 404</p>
      <h1>This passage is not charted</h1>
      <p>The requested location is outside this edition of Shipwreck Atlas.</p>
      <Link href='/'>Return to the atlas</Link>
    </main>
  )
}
