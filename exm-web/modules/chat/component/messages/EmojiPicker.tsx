import React, { useEffect, useRef, useState } from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

type Props = {
  emojiHandler: (emojiData: any) => void
}

const EmojiPicker = ({ emojiHandler }: Props) => {
  const emojiRef = useRef<HTMLDivElement>(null)
  const [showEmoji, setShowEmoji] = useState(false)

  useEffect(() => {
    const handleOutSideClick = (event: any) => {
      if (showEmoji && !emojiRef.current?.contains(event.target)) {
        setShowEmoji(!showEmoji)
      }
    }

    window.addEventListener("click", handleOutSideClick)

    return () => {
      window.removeEventListener("click", handleOutSideClick)
    }
  }, [showEmoji])

  return (
    <div ref={emojiRef} className='flex justify-center'>
      {showEmoji && (
        <div className="absolute bottom-16 right-0 z-10">
          <Picker
            data={data}
            onEmojiSelect={emojiHandler}
            previewPosition="none"
            searchPosition="none"
            theme="light"
          />
        </div>
      )}
      <button onClick={() => setShowEmoji(!showEmoji)} className="text-[20px]">
        🙂
      </button>
    </div>
  )
}

export default EmojiPicker
