import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Public asset path. Keep this provider-neutral so images work on Preview and any host. */
export function img(path: string, _w: number, _h?: number) {
  return path
}
