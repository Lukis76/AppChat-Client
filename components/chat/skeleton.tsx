import type { FC } from 'react'

interface SkeletonProps {
  cont?: number
  width?: string
  height?: string
}

export const SkeletonConversationList: FC<SkeletonProps> = ({ cont }) => {
  // const
  return (
    <div className='flex flex-col justify-start items-center p-2 gap-2 animate-pulse bg-zinc-800 w-full h-full rounded-lg'>
      {[...Array(cont)].map((_, i) => (
        <div
          key={i}
          className='animate-pulse bg-zinc-600 w-full h-12 rounded-md flex flex-row justify-start items-center p-2'
        >
          <span className='bg-zinc-700 animate-pulse w-10 h-10 rounded-full'></span>
        </div>
      ))}
    </div>
  )
}

export const SkeletonMsgsList: FC<SkeletonProps> = ({ cont, height }) => {
  // const
  return (
    <div
      className='flex flex-col justify-end items-baseline p-2 pb-12 gap-2 animate-pulse  w-full rounded-lg h-full
    '
    >
      <span className=' flex w-72 h-8 rounded-md bg-zinc-600 self-end'></span>
      <span className=' flex w-72 h-8 rounded-md bg-zinc-600 self-start'></span>
      <span className=' flex w-72 h-8 rounded-md bg-zinc-600 self-end'></span>
      <span className=' flex w-72 h-8 rounded-md bg-zinc-600 self-end'></span>
      <span className=' flex w-72 h-8 rounded-md bg-zinc-600 self-start'></span>
      <span className=' flex w-72 h-8 rounded-md bg-zinc-600 self-start'></span>
      <span className=' flex w-72 h-8 rounded-md bg-zinc-600 self-end'></span>
      <span className=' flex w-72 h-8 rounded-md bg-zinc-600 self-start'></span>
      <span className=' flex w-72 h-8 rounded-md bg-zinc-600 self-start'></span>
      <span className=' flex w-72 h-8 rounded-md bg-zinc-600 self-end'></span>
    </div>
  )
}
