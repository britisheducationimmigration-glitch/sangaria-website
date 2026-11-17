export type AttendancePreset = 'today' | 'week' | 'month' | 'all' | 'date'
export function attendanceDateWindow(preset: AttendancePreset, today: string, month: string, date: string) {
  if (preset === 'all') return {from:'',to:''}
  if (preset === 'today') return {from:today,to:today}
  if (preset === 'date') return {from:date,to:date}
  if (preset === 'month') {const [y,m]=month.split('-').map(Number);return {from:month+'-01',to:new Date(Date.UTC(y,m,0)).toISOString().slice(0,10)}}
  const end=new Date(today+'T00:00:00Z'),day=end.getUTCDay();end.setUTCDate(end.getUTCDate()-((day+6)%7))
  return {from:end.toISOString().slice(0,10),to:today}
}
