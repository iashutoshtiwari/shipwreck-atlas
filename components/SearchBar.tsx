'use client'

import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className='w-full min-w-0'>
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
          placeholder='Search wrecks, places, vessels…'
          className='h-11 rounded-md border-border bg-input/70 pl-10 pr-10 shadow-none placeholder:text-muted-foreground/75'
          aria-label='Search shipwrecks'
        />
        {value ? (
          <button
            type='button'
            onClick={() => onChange('')}
            className='absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            aria-label='Clear search'
          >
            <X className='h-3.5 w-3.5' aria-hidden='true' />
          </button>
        ) : null}
      </div>
    </div>
  )
}
