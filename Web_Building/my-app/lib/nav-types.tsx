import { Archive, Contact, Palette, Sparkles } from "lucide-react"
import Unabomber from "../public/unabomber.svg"
import Snoo from "../public/snoo.svg"

export type NavIconType = 'reddit' | 'about' | 'arts' | 'archive' | 'essentials' | 'manifesto'

export const iconMap = {
  reddit: Snoo,
  about: Contact,
  arts: Palette,
  archive: Archive,
  essentials: Sparkles,
  manifesto: Unabomber,
}