import { useEffect, useRef, useState, type FormEvent } from 'react'
import { site } from '@/data/site'
import { exportEmployeeRangeReport, getEmployeeRangeReport, recordSalaryPayment, reverseSalaryPayment } from '@/lib/attendance-functions'
import type { EmployeeRecord, EmployeeCycleSummary } from '@/lib/content-types'

type Result = Awaited<ReturnType<typeof getEmployeeRangeReport>>
const money=(amount:number)=>amount.toLocaleString('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2})
const field='min-h-10 rounded-xl border border-[#E4E7EC] bg-white px-3 text-sm'
const button='min-h-10 rounded-xl border border-[#E4E7EC] px-4 py-2 text-sm font-semibold disabled:opacity-50'
export function PayrollLedger({employees,cycles,month,today,onNotice}:{employees:EmployeeRecord[];cycles:EmployeeCycleSummary[];month:string;today:string;onNotice:(message:string)=>void}) {
  const [employeeId,setEmployeeId]=useState(()=>employees.find(e=>e.active)?.id??employees[0]?.id??0)
  const [from,setFrom]=useState(month+'-01'>today?today:month+'-01'),[to,setTo]=useState(()=>{const [y,m]=month.split('-').map(Number);const end=new Date(Date.UTC(y,m,0)).toISOString().slice(0,10);return end<today?end:today})
  const [result,setResult]=useState<Result|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(false),[revision,setRevision]=useState(0)
  const [amount,setAmount]=useState(''),[paidOn,setPaidOn]=useState(today),[method,setMethod]=useState('Cash'),[reference,setReference]=useState(''),[note,setNote]=useState('')
  const key=useRef(''),sequence=useRef(0)
  useEffect(()=>{
    const request=++sequence.current;setResult(current=>current?.employee.id===employeeId?current:null);setError('')
    if(!employeeId||!from||!to||from>to||to>today){setLoading(false);return}
    setLoading(true)
    getEmployeeRangeReport({data:{employeeId,from,to}}).then(value=>{if(request===sequence.current)setResult(value)}).catch(cause=>{if(request===sequence.current)setError(cause instanceof Error?cause.message:'Report failed')}).finally(()=>{if(request===sequence.current)setLoading(false)})
    return()=>{sequence.current++}
  },[employeeId,from,to,today,revision])
  const reportCurrent = Boolean(result && result.employee.id===employeeId && result.report.from===from && result.report.to===to)
  async function save(event:FormEvent){
    event.preventDefault();if(!result||!reportCurrent||busy||loading)return
    if(!window.confirm(`Record ${money(Number(amount))} paid to ${result.employee.name} for ${from} to ${to}? This records a payment already made; it does not transfer money.`))return
    setBusy(true);setError('');key.current ||= crypto.randomUUID()
    try{await recordSalaryPayment({data:{employeeId,from,to,amount:Number(amount),paidOn,method,reference,note,requestKey:key.current}});key.current='';setAmount('');setReference('');setNote('');setRevision(n=>n+1);onNotice('Salary payment recorded.')}
    catch(cause){setError(cause instanceof Error?cause.message:'Payment save failed')}
    finally{setBusy(false)}
  }
  async function reverse(id:number){const reason=window.prompt('Reason for reversing this recorded payment? The original entry is retained.');if(!reason?.trim())return;setBusy(true);try{await reverseSalaryPayment({data:{id,reason}});setRevision(n=>n+1);onNotice('Payment reversed; history retained.')}catch(cause){setError(cause instanceof Error?cause.message:'Reversal failed')}finally{setBusy(false)}}
  async function download(){setBusy(true);try{const file=await exportEmployeeRangeReport({data:{employeeId,from,to}}),bytes=Uint8Array.from(atob(file.base64),c=>c.charCodeAt(0)),url=URL.createObjectURL(new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));const link=document.createElement('a');link.href=url;link.download=file.filename;link.click();URL.revokeObjectURL(url)}catch(cause){setError(cause instanceof Error?cause.message:'Export failed')}finally{setBusy(false)}}
 const selectedEmployee = employees.find(e=>e.id===employeeId)
  const slipPayments = result ? result.payments.filter(p=>!p.voided&&p.from<=to&&p.to>=from).slice(0,8) : []
  return <section id="salary-slip-document" className="space-y-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
    <div><h3 className="text-xl font-bold">Employee salary overview</h3><p className="mt-1 text-sm text-[#667085]">Choose an employee to view their balance through today. Open a section below only when needed.</p></div>
    <div className="flex flex-wrap items-end gap-3"><label className="text-xs font-semibold">Employee<select aria-label="Statement employee" value={employeeId} disabled={busy} onChange={e=>{
      if ((amount || reference || note) && !window.confirm('Discard unsaved payment details before switching employees?')) return
      setEmployeeId(Number(e.target.value));setAmount('');setReference('');setNote('');key.current=''
    }} className={'mt-1 block '+field}>{employees.map(e=><option key={e.id} value={e.id}>{e.name}{e.active?'':' (Archived)'}</option>)}</select></label></div>
    {(!from||!to||from>to||to>today)&&<p role="alert" className="text-sm text-amber-800">Choose a valid period through today.</p>}
    {!result&&!loading&&<details open className="rounded-xl border p-4"><summary className="cursor-pointer font-semibold">Choose report dates</summary><div className="mt-3"><div className="flex flex-wrap items-end gap-3"><label className="text-xs font-semibold">From<input type="date" value={from} max={today} disabled={busy} onChange={e=>setFrom(e.target.value)} className={'mt-1 block '+field}/></label><label className="text-xs font-semibold">To<input type="date" value={to} min={from} max={today} disabled={busy} onChange={e=>setTo(e.target.value)} className={'mt-1 block '+field}/></label><button type="button" disabled={busy||!cycles.some(c=>c.employee.id===employeeId)} onClick={()=>{const cycle=cycles.find(c=>c.employee.id===employeeId);if(cycle){setFrom(cycle.cycleStartDate);setTo(cycle.cycleEndDate>today?today:cycle.cycleEndDate)}}} className={button}>Use selected payroll cycle</button><button type="button" disabled={busy||loading||!reportCurrent} onClick={()=>void download()} className={button}>Download employee Excel sheet</button><button type="button" disabled={busy||loading} onClick={()=>setRevision(n=>n+1)} className={button}>Refresh statement</button></div></div></details>}
    {loading&&<p role="status">Loading attendance and payments...</p>}{error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {result&&result.employee.id===employeeId&&<>
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5">
       <div className="flex flex-wrap items-center justify-between gap-3"><div><h4 className="text-lg font-bold">{result.employee.name}</h4><p className="mt-1 text-xs text-slate-600">Balance through {today} · Since {result.baseline}</p></div><div className="flex flex-wrap gap-2"><button type="button" disabled={busy||loading||!reportCurrent} onClick={()=>window.print()} className={button+' bg-white'}>Print / Save Salary Slip</button><button type="button" disabled={busy||loading} onClick={()=>setRevision(n=>n+1)} className={button+' bg-white'}>Refresh balance</button></div></div>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">{([
          ['Earned',result.throughToday.earned,'text-slate-900'],
          ['Paid',result.throughToday.paid,'text-emerald-700'],
          ['Pending',result.throughToday.pending,'text-amber-800'],
          ['Advance / overpaid',result.throughToday.advance,'text-blue-700'],
        ] as const).map(([label,value,tone])=><div key={label} className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4"><p className="text-xs font-medium text-slate-600">{label}</p><p className={'mt-2 break-words text-xl font-bold tabular-nums sm:text-2xl '+tone}>{money(value)}</p></div>)}</div>
        <p className="mt-3 text-xs leading-relaxed text-slate-600">Based on saved attendance and entered payment records. Past unrecorded payments are not included.</p>
        {result.throughToday.missingOut+result.throughToday.reviewRequired>0&&<p role="status" className="mt-2 rounded-lg bg-amber-100 p-3 text-sm text-amber-900">{result.throughToday.missingOut+result.throughToday.reviewRequired} unresolved shifts: balance is provisional until attendance is corrected.</p>}
      </div>
      <details key={'report-'+employeeId} className="group rounded-xl border border-[#E4E7EC]"><summary className="cursor-pointer rounded-xl p-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#465FFF]">Attendance &amp; date-range report <span className="ml-2 font-normal text-slate-500">{from} – {to}</span></summary><div className="space-y-4 border-t border-[#E4E7EC] p-4">
        <p className="text-xs text-slate-600">Salary uses the full payroll-cycle working-day denominator. Select up to 366 days.</p>
        <div className="flex flex-wrap items-end gap-3"><label className="text-xs font-semibold">From<input type="date" value={from} max={today} disabled={busy} onChange={e=>setFrom(e.target.value)} className={'mt-1 block '+field}/></label><label className="text-xs font-semibold">To<input type="date" value={to} min={from} max={today} disabled={busy} onChange={e=>setTo(e.target.value)} className={'mt-1 block '+field}/></label><button type="button" disabled={busy||!cycles.some(c=>c.employee.id===employeeId)} onClick={()=>{const cycle=cycles.find(c=>c.employee.id===employeeId);if(cycle){setFrom(cycle.cycleStartDate);setTo(cycle.cycleEndDate>today?today:cycle.cycleEndDate)}}} className={button}>Use selected payroll cycle</button><button type="button" disabled={busy||loading||!reportCurrent} onClick={()=>void download()} className={button}>Download employee Excel sheet</button><button type="button" disabled={busy||loading} onClick={()=>setRevision(n=>n+1)} className={button}>Refresh statement</button></div>
      {reportCurrent ? <>
      <div className="grid gap-3 sm:grid-cols-3">{[['Selected range earned',result.report.earned],['Payments fully allocated to range',result.allocatedPaid],['Selected range pending',result.overlappingPayments?'Review payment periods':result.rangePending]].map(([label,value])=><div key={String(label)} className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-600">{label}</p><p className="mt-1 text-xl font-bold">{typeof value==='number'?money(value):value}</p></div>)}</div>
      <p className="text-sm">Payable days: <strong>{result.report.payableDays}</strong> · Net work: <strong>{Math.floor(result.report.workMinutes/60)}h {result.report.workMinutes%60}m</strong> · Missing OUT: {result.report.missingOut} · Review required: {result.report.reviewRequired}</p>
      {(result.report.missingOut>0||result.report.reviewRequired>0)&&<p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Provisional salary: unresolved shifts currently earn zero. Resolve attendance before settling salary.</p>}
      {result.report.partialFinalized&&<p className="text-sm text-amber-800">This range cuts through a finalized cycle. Its partial amount is an estimate; use the complete finalized cycle for settlement.</p>}
      {result.overlappingPayments>0&&<p className="text-sm text-amber-800">{result.overlappingPayments} payments cover periods partly outside this range and are not automatically apportioned. Use the full period or till-date balance before paying again.</p>}

      <details><summary className="cursor-pointer text-sm font-semibold">View daily attendance ({result.report.days.length} days)</summary><div className="mt-3 max-h-80 overflow-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead><tr>{['Date','Status','IN (IST)','OUT (IST)','Net min','Deducted min','Payable','Est. INR'].map(h=><th key={h} className="p-2">{h}</th>)}</tr></thead><tbody>{result.report.days.map(d=><tr key={d.date} className="border-t"><td className="p-2">{d.date}</td><td>{d.status}</td><td>{d.checkIn?new Date(d.checkIn).toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'}):'-'}</td><td>{d.checkOut?new Date(d.checkOut).toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'}):'-'}</td><td>{d.workMinutes}</td><td>{d.deductedMinutes}</td><td>{d.payableDays}</td><td>{d.earned}</td></tr>)}</tbody></table></div><p className="mt-2 text-xs text-slate-500">Daily estimates are rounded; the range total is calculated per payroll cycle. Weekly off/holiday work earns no overtime.</p></details>


      </> : <p role="status" className="text-sm text-slate-600">{error ? 'Report could not be updated. Correct the dates or retry before recording a payment.' : 'Updating the selected date-range report...'}</p>}
      </div></details>
      <details key={'payment-'+employeeId} className="rounded-xl border border-[#E4E7EC]"><summary className="cursor-pointer rounded-xl p-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#465FFF]">Record salary given <span className="ml-2 font-normal text-slate-500">Add a payment already made</span></summary><div className="border-t border-[#E4E7EC] p-4">
        <p className="mb-3 text-sm font-semibold">Employee: {result.employee.name}</p>
        <p className="mb-3 text-xs text-slate-600">Paid-for period: {from} – {to}. To change it, open Attendance &amp; date-range report above.</p>
      <form onSubmit={save} className="space-y-3"><div className="grid gap-3 sm:grid-cols-3"><label className="text-xs">Amount INR<input required type="number" min="0.01" max="10000000" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} disabled={busy} className={'mt-1 block w-full '+field}/></label><label className="text-xs">Payment date<input required type="date" max={today} value={paidOn} onChange={e=>setPaidOn(e.target.value)} disabled={busy} className={'mt-1 block w-full '+field}/></label><label className="text-xs">Method<select value={method} onChange={e=>setMethod(e.target.value)} disabled={busy} className={'mt-1 block w-full '+field}>{['Cash','Bank transfer','UPI','Cheque','Other'].map(m=><option key={m}>{m}</option>)}</select></label></div><label className="block text-xs">Reference<input value={reference} maxLength={190} onChange={e=>setReference(e.target.value)} disabled={busy} className={'mt-1 block w-full '+field}/></label><label className="block text-xs">Note / reason<input required value={note} maxLength={500} onChange={e=>setNote(e.target.value)} disabled={busy} className={'mt-1 block w-full '+field}/></label><button disabled={busy||loading||!reportCurrent} className={button+' bg-[#465FFF] text-white'}>Save payment record</button></form>
      </div></details>
      <details key={'history-'+employeeId} className="rounded-xl border border-[#E4E7EC]"><summary className="cursor-pointer rounded-xl p-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#465FFF]">Payment history <span className="ml-2 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{result.payments.length} records</span></summary><div className="border-t border-[#E4E7EC] p-4">
      <div><h4 className="font-bold">Payment history ({result.payments.length})</h4><div className="mt-3 space-y-2">{result.payments.map(p=><article key={p.id} className="rounded-xl border p-3 text-sm"><div className="flex flex-wrap justify-between gap-2"><strong>{money(p.amount)} · {p.paidOn} · {p.method}{p.voided?' · Reversed':''}</strong>{!p.voided&&<button type="button" disabled={busy} onClick={()=>void reverse(p.id)} className="text-red-700 underline">Reverse entry</button>}</div><p className="mt-1">For {p.from} – {p.to} · {p.reference||'No reference'}</p><p className="break-words">{p.note}</p><p className="text-xs text-slate-500">Recorded by {p.recordedBy}{p.voided?' · '+p.voidReason:''}</p></article>)}{!result.payments.length&&<p className="text-sm text-slate-500">No salary payment records yet.</p>}</div></div>
      </div></details>

    {reportCurrent&&<div className="salary-slip-print-only" aria-hidden="true">
      <header className="salary-slip-header">
        <div>
          <p className="salary-slip-eyebrow">{site.name} · PAYROLL STATEMENT</p>
          <h1>Employee Salary Slip</h1>
          <p className="salary-slip-sub">{site.address}</p>
        </div>
        <div className="salary-slip-meta">
          <p><strong>Period:</strong> {from} to {to}</p>
          <p><strong>Generated:</strong> {today}</p>
          <p><strong>Status:</strong> {result.report.missingOut+result.report.reviewRequired>0?'Provisional (pending review)':result.report.partialFinalized?'Partial finalized estimate':'Calculated'}</p>
        </div>
      </header>

      <section className="salary-slip-grid">
        <div><span>Employee</span><strong>{result.employee.name}</strong></div>
        <div><span>Role / Designation</span><strong>{selectedEmployee?.designation||'Staff'}</strong></div>
        <div><span>Monthly Base Salary</span><strong>{selectedEmployee&&selectedEmployee.monthlySalary>0?money(selectedEmployee.monthlySalary):'Not set'}</strong></div>
        <div><span>Cycle / Shift</span><strong>Day {selectedEmployee?.cycleStartDay??1} · {selectedEmployee?.expectedInTime??'09:30'}–{selectedEmployee?.expectedOutTime??'19:30'}</strong></div>
      </section>

      <section className="salary-slip-boxes">
        <div><span>Payable Days</span><strong>{result.report.payableDays}</strong></div>
        <div><span>Net Worked Hours</span><strong>{Math.floor(result.report.workMinutes/60)}h {result.report.workMinutes%60}m</strong></div>
        <div><span>Period Earned</span><strong>{money(result.report.earned)}</strong></div>
        <div><span>Allocated Paid (Period)</span><strong>{money(result.allocatedPaid)}</strong></div>
      </section>

      <section className="salary-slip-balance">
        <h2>Ledger Balance Through {today} <small>(Since {result.baseline})</small></h2>
        <div className="salary-slip-boxes">
          <div><span>Till-Date Earned</span><strong>{money(result.throughToday.earned)}</strong></div>
          <div><span>Till-Date Paid</span><strong>{money(result.throughToday.paid)}</strong></div>
          <div><span>Net Pending</span><strong>{money(result.throughToday.pending)}</strong></div>
          <div><span>Advance / Overpaid</span><strong>{money(result.throughToday.advance)}</strong></div>
        </div>
      </section>

      <section className="salary-slip-payments">
        <h2>Payments Overlapping Period ({slipPayments.length})</h2>
        {slipPayments.length>0 ? (
          <table>
            <thead><tr><th>Paid On</th><th>For Period</th><th>Method / Ref</th><th>Note</th><th>Amount</th></tr></thead>
            <tbody>
              {slipPayments.map(p=><tr key={p.id}><td>{p.paidOn}</td><td>{p.from} – {p.to}</td><td>{p.method}{p.reference?` (${p.reference})`:''}</td><td>{p.note}</td><td>{money(p.amount)}</td></tr>)}
            </tbody>
          </table>
        ) : <p className="salary-slip-empty">No active payments recorded for this period.</p>}
        {result.overlappingPayments>0&&<p className="salary-slip-warn">Note: {result.overlappingPayments} payment(s) cover periods partly outside {from} – {to} and are not automatically apportioned.</p>}
      </section>

      <footer className="salary-slip-footer">
        <p>Generated from saved attendance and salary ledger records. Missing/unreviewed shifts earn ₹0 until approved. Reversed entries are excluded from paid totals.</p>
        <div className="salary-slip-signs">
          <div><span>Employee Signature</span></div>
          <div><span>Authorized Signatory (Super Admin)</span></div>
        </div>
      </footer>
    </div>}
    </>}
  </section>
}
