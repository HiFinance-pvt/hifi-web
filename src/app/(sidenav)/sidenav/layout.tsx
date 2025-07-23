import React from 'react'

type Props = {
    children: React.ReactNode
}

const layout = ({children}: Props) => {
  return (
    <div className='max-w-2xl h-full p-3 bg-gray-300'>
        {children}
    </div>
  )
}

export default layout