import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useScreenSize } from '@/providers/ScreenSizeProvider'
import { TEmoji } from '@/types'
import { lazy, Suspense, useState } from 'react'

// Lazy load emoji picker to reduce initial bundle size (~500KB)
const EmojiPicker = lazy(() => import('../EmojiPicker'))

export default function EmojiPickerDialog({
  children,
  onEmojiClick
}: {
  children: React.ReactNode
  onEmojiClick?: (emoji: string | TEmoji | undefined) => void
}) {
  const { isSmallScreen } = useScreenSize()
  const [open, setOpen] = useState(false)

  if (isSmallScreen) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <Suspense fallback={<div className="flex items-center justify-center p-4">Loading...</div>}>
            <EmojiPicker
              onEmojiClick={(emoji, e) => {
                e.stopPropagation()
                setOpen(false)
                onEmojiClick?.(emoji)
              }}
            />
          </Suspense>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="p-0 w-fit">
        <Suspense fallback={<div className="flex items-center justify-center p-4">Loading...</div>}>
          <EmojiPicker
            onEmojiClick={(emoji, e) => {
              e.stopPropagation()
              setOpen(false)
              onEmojiClick?.(emoji)
            }}
          />
        </Suspense>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
