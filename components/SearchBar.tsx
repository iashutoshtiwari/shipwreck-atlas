'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  resultCount: number
  totalCount: number
}

export function SearchBar({ value, onChange, resultCount, totalCount }: SearchBarProps) {
  return (
    <div className='w-full min-w-0 sm:w-100'>
      <label htmlFor='wreck-search' className='sr-only'>
        Search shipwrecks
      </label>
      <div className='relative'>
        <Search
          className='pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'
          aria-hidden='true'
        />
        <Input
          id='wreck-search'
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder='Search name, year, cause, type...'
          className='h-11 rounded-2xl border-border/70 bg-card/78 pl-10 shadow-xs backdrop-blur-xs'
          aria-label='Search shipwrecks'
        />
      </div>
      <p className='mt-1.5 pl-1 text-xs text-muted-foreground' aria-live='polite'>
        Showing {resultCount} of {totalCount} wrecks
      </p>
    </div>
  )
}
