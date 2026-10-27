import { Briefcase, FileWarning, GraduationCap, Home, Plane, Users } from 'lucide-react'
import type { VisaService } from '@/data/fixtures'

const map = { graduation: GraduationCap, briefcase: Briefcase, plane: Plane, home: Home, users: Users, file: FileWarning }

export function ServiceIcon({ name, className }: { name: VisaService['icon']; className?: string }) {
  const Icon = map[name]
  return <Icon className={className} />
}
