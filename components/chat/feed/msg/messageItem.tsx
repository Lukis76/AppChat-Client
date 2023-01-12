import type { FC } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { MsgFE } from 'types'

interface MessageItemProps {
  msg: MsgFE
  sendByMe: boolean
}

export const MessageItem: FC<MessageItemProps> = ({ msg, sendByMe }) => {
  return (
    <>
      {sendByMe ? (
        <div className='flex flex-col px-4 py-0.5 my-1 self-end gap-1 max-w-[80%]'>
          <span className='flex flex-row justify-start items-center self-end gap-1 text-zinc-200 font-medium'>
            {msg?.sender?.username}
            <span className='text-xs text-zinc-100'>{'-'}</span>
            <ReactTimeAgo
              date={Number(new Date(msg.createdAt))}
              timeStyle={'twitter'}
              className='text-xs text-zinc-300'
            />
          </span>
          <span className='flex self-end px-4 py-0.5 rounded-md bg-blue-500 text-zinc-900'>{msg?.body}</span>
        </div>
      ) : (
        <div className='flex flex-col px-4 py-0.5 my-1  self-start gap-1 max-w-[80%]'>
          <span className='flex flex-row justify-start items-center self-start gap-1 text-zinc-200 font-medium'>
            {msg?.sender?.username}
            <span className='text-xs text-zinc-100'>{'-'}</span>
            <ReactTimeAgo
              date={Number(new Date(msg.createdAt))}
              timeStyle={'twitter'}
              className='text-xs text-zinc-300'
            />
          </span>
          <span className='flex self-start  px-4 py-0.5 rounded-md  bg-zinc-600 text-zinc-100'>{msg?.body}</span>
        </div>
      )}
    </>
  )
}
