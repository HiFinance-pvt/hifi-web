import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function AgentsLayout({ children }: Props) {
  return (
    <div>
      {children}
    </div>
  )
}
