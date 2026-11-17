import { useEffect, useRef, useState, type FormEvent } from 'react'
import { site } from '@/data/site'
import { exportEmployeeRangeReport, getEmployeeRangeReport, issueSalarySlip, listSalarySlips, recordSalaryPayment, reverseSalaryPayment, voidSalarySlip } from '@/lib/attendance-functions'
import type { EmployeeRecord, EmployeeCycleSummary, SalarySlipRecord } from '@/lib/content-types'

type Result = Awaited<ReturnType<typeof getEmployeeRangeReport>>
const money=(amount:number)=>amount.toLocaleString('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2})
const field='min-h-10 rounded-xl border border-[#E4E7EC] bg-white px-3 text-sm'
const button='min-h-10 rounded-xl border border-[#E4E7EC] px-4 py-2 text-sm font-semibold disabled:opacity-50'

export function PayrollLedger({employees,cycles,month,today,onNotice}:{employees:EmployeeRecord[];cycles:EmployeeCycleSummary[];month:string;today:string;onNotice:(message:string)=>void}) {
  const [employeeId,setEmployeeId]=useState(()=>employees.find(e=>e.active)?.id??employees[0]?.id??0)
  const [from,setFrom]=useState(month+'-01'>today?today:month+'-01'),[to,setTo]=useState(()=>{const [y,m]=month.split('-').map(Number);const end=new Date(Date.UTC(y,m,0)).toISOString().slice(0,10);return end<today?end:today})
  const [result,setResult]=useState<Result|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(false),[revision,setRevision]=useState(0)
  const [amount,setAmount]=useState(''),[paidOn,setPaidOn]=useState(today),[method,setMethod]=useState('Cash'),[reference,setReference]=useState(''),[note,setNote]=useState('')
  const [slips,setSlips]=useState<SalarySlipRecord[]>([])
  const [slipMonth,setSlipMonth]=useState(month)
  const [allowanceLabel,setAllowanceLabel]=useState('Bonus / Allowance'),[allowanceAmount,setAllowanceAmount]=useState('')
  const [deductionLabel,setDeductionLabel]=useState('Advance / Other Deduction'),[deductionAmount,setDeductionAmount]=useState('')
  const [slipMethod,setSlipMethod]=useState(''),[slipRef,setSlipRef]=useState(''),[slipPaidOn,setSlipPaidOn]=useState(''),[slipNotes,setSlipNotes]=useState('')
  const [activePrintSlip,setActivePrintSlip]=useState<SalarySlipRecord|null>(null)
  const pendingPrintRef=useRef(false)
  const key=useRef(''),sequence=useRef(0)

  useEffect(()=>{
    const clearPrintSlip=()=>setActivePrintSlip(null)
    window.addEventListener('afterprint',clearPrintSlip)
    return()=>window.removeEventListener('afterprint',clearPrintSlip)
  },[])

  useEffect(()=>{
    if(!pendingPrintRef.current||!activePrintSlip)return
    pendingPrintRef.current=false
    window.requestAnimationFrame(()=>window.print())
  },[activePrintSlip])

  useEffect(()=>{
    let cancelled=false
    if(!employeeId){setSlips([]);return}
    listSalarySlips({data:{employeeId}}).then(rows=>{if(!cancelled)setSlips(rows)}).catch(()=>{if(!cancelled)setSlips([])})
    return()=>{cancelled=true}
  },[employeeId,revision])

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

  async function generateSlip(event:FormEvent){
    event.preventDefault()
    if(!employeeId||busy)return
    setBusy(true);setError('')
    try{
      await issueSalarySlip({
        data:{
          employeeId,month:slipMonth,allowanceLabel,allowanceAmount:Number(allowanceAmount||0),
          deductionLabel,deductionAmount:Number(deductionAmount||0),
          paymentMethod:slipMethod,paymentRef:slipRef,paidOn:slipPaidOn,notes:slipNotes,
        },
      })
      setAllowanceAmount('');setDeductionAmount('');setSlipRef('');setSlipPaidOn('');setSlipNotes('')
      setRevision(n=>n+1)
      onNotice(`Official salary slip issued and saved for ${slipMonth}.`)
    }catch(cause){setError(cause instanceof Error?cause.message:'Could not issue salary slip')}
    finally{setBusy(false)}
  }

  async function voidSlip(id:number,slipNumber:string){
    const reason=window.prompt(`Reason for voiding ${slipNumber}? The voided record remains in history.`)
    if(!reason?.trim())return
    setBusy(true);setError('')
    try{await voidSalarySlip({data:{id,reason}});setRevision(n=>n+1);onNotice(`Salary slip ${slipNumber} voided.`)}
    catch(cause){setError(cause instanceof Error?cause.message:'Could not void salary slip')}
    finally{setBusy(false)}
  }

  function printSavedSlip(slip:SalarySlipRecord){
    pendingPrintRef.current=true
    setActivePrintSlip(slip)
  }

  async function download(){setBusy(true);try{const file=await exportEmployeeRangeReport({data:{employeeId,from,to}}),bytes=Uint8Array.from(atob(file.base64),c=>c.charCodeAt(0)),url=URL.createObjectURL(new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));const link=document.createElement('a');link.href=url;link.download=file.filename;link.click();URL.revokeObjectURL(url)}catch(cause){setError(cause instanceof Error?cause.message:'Export failed')}finally{setBusy(false)}}

  const selectedEmployee=employees.find(e=>e.id===employeeId)
  const slipPayments=result?result.payments.filter(p=>!p.voided&&p.from<=to&&p.to>=from).slice(0,8):[]

  return <section id="salary-slip-document" className="space-y-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
    <div><h3 className="text-xl font-bold">Employee salary overview</h3><p className="mt-1 text-sm text-[#667085]">Choose an employee to view their balance, issue month-wise official salary slips, or record payments.</p></div>
    <div className="flex flex-wrap items-end gap-3"><label className="text-xs font-semibold">Employee<select aria-label="Statement employee" value={employeeId} disabled={busy} onChange={e=>{
      if ((amount || reference || note || allowanceAmount || deductionAmount) && !window.confirm('Discard unsaved payment or slip details before switching employees?')) return
      setEmployeeId(Number(e.target.value));setAmount('');setReference('');setNote('');setAllowanceAmount('');setDeductionAmount('');setSlipRef('');setSlipNotes('');setActivePrintSlip(null);key.current=''
    }} className={'mt-1 block '+field}>{employees.map(e=><option key={e.id} value={e.id}>{e.name}{e.active?'':' (Archived)'}</option>)}</select></label></div>
    {(!from||!to||from>to||to>today)&&<p role="alert" className="text-sm text-amber-800">Choose a valid period through today.</p>}
    {!result&&!loading&&<details open className="rounded-xl border p-4"><summary className="cursor-pointer font-semibold">Choose report dates</summary><div className="mt-3"><div className="flex flex-wrap items-end gap-3"><label className="text-xs font-semibold">From<input type="date" value={from} max={today} disabled={busy} onChange={e=>setFrom(e.target.value)} className={'mt-1 block '+field}/></label><label className="text-xs font-semibold">To<input type="date" value={to} min={from} max={today} disabled={busy} onChange={e=>setTo(e.target.value)} className={'mt-1 block '+field}/></label><button type="button" disabled={busy||!cycles.some(c=>c.employee.id===employeeId)} onClick={()=>{const cycle=cycles.find(c=>c.employee.id===employeeId);if(cycle){setFrom(cycle.cycleStartDate);setTo(cycle.cycleEndDate>today?today:cycle.cycleEndDate)}}} className={button}>Use selected payroll cycle</button><button type="button" disabled={busy||loading||!reportCurrent} onClick={()=>void download()} className={button}>Download employee Excel sheet</button><button type="button" disabled={busy||loading} onClick={()=>setRevision(n=>n+1)} className={button}>Refresh statement</button></div></div></details>}
    {loading&&<p role="status">Loading attendance and payments...</p>}{error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {result&&result.employee.id===employeeId&&<>
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h4 className="text-lg font-bold">{result.employee.name}</h4><p className="mt-1 text-xs text-slate-600">Balance through {today} · Since {result.baseline}</p></div><div className="flex flex-wrap gap-2"><button type="button" disabled={busy||loading||!reportCurrent} onClick={()=>{setActivePrintSlip(null);window.requestAnimationFrame(()=>window.print())}} className={button+' bg-white'}>Print Range Statement</button><button type="button" disabled={busy||loading} onClick={()=>setRevision(n=>n+1)} className={button+' bg-white'}>Refresh balance</button></div></div>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">{([
          ['Earned',result.throughToday.earned,'text-slate-900'],
          ['Paid',result.throughToday.paid,'text-emerald-700'],
          ['Pending',result.throughToday.pending,'text-amber-800'],
          ['Advance / overpaid',result.throughToday.advance,'text-blue-700'],
        ] as const).map(([label,value,tone])=><div key={label} className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4"><p className="text-xs font-medium text-slate-600">{label}</p><p className={'mt-2 break-words text-xl font-bold tabular-nums sm:text-2xl '+tone}>{money(value)}</p></div>)}</div>
        <p className="mt-3 text-xs leading-relaxed text-slate-600">Based on saved attendance and entered payment records. Past unrecorded payments are not included.</p>
        {result.throughToday.missingOut+result.throughToday.reviewRequired>0&&<p role="status" className="mt-2 rounded-lg bg-amber-100 p-3 text-sm text-amber-900">{result.throughToday.missingOut+result.throughToday.reviewRequired} unresolved shifts: balance is provisional until attendance is corrected.</p>}
      </div>

      <details key={'slips-'+employeeId} className="rounded-xl border border-[#E4E7EC]">
        <summary className="cursor-pointer rounded-xl p-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#465FFF]">Monthly official salary slips <span className="ml-2 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{slips.filter(s=>s.status==='issued').length} issued</span></summary>
        <div className="space-y-4 border-t border-[#E4E7EC] p-4">
          <form onSubmit={generateSlip} className="space-y-3 rounded-xl bg-slate-50 p-4">
            <h4 className="text-sm font-bold text-slate-900">Generate &amp; save monthly salary slip</h4>
            <p className="text-xs text-slate-600">Freezes the selected month&apos;s attendance, earnings, deductions and payment reference in Admin so you can print or re-issue anytime.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-xs font-semibold">Salary month<input type="month" required value={slipMonth} onChange={e=>setSlipMonth(e.target.value)} disabled={busy} className={'mt-1 block w-full '+field}/></label>
              <label className="text-xs font-semibold">Allowance / bonus label<input value={allowanceLabel} maxLength={80} onChange={e=>setAllowanceLabel(e.target.value)} disabled={busy} className={'mt-1 block w-full '+field}/></label>
              <label className="text-xs font-semibold">Allowance / bonus INR<input type="number" min="0" step="0.01" value={allowanceAmount} onChange={e=>setAllowanceAmount(e.target.value)} disabled={busy} placeholder="0" className={'mt-1 block w-full '+field}/></label>
              <label className="text-xs font-semibold">Deduction label<input value={deductionLabel} maxLength={80} onChange={e=>setDeductionLabel(e.target.value)} disabled={busy} className={'mt-1 block w-full '+field}/></label>
              <label className="text-xs font-semibold">Deduction INR<input type="number" min="0" step="0.01" value={deductionAmount} onChange={e=>setDeductionAmount(e.target.value)} disabled={busy} placeholder="0" className={'mt-1 block w-full '+field}/></label>
              <label className="text-xs font-semibold">Payment mode (optional)<select value={slipMethod} onChange={e=>setSlipMethod(e.target.value)} disabled={busy} className={'mt-1 block w-full '+field}><option value="">Auto from cycle payment</option>{['Bank transfer','UPI','Cash','Cheque','Other'].map(m=><option key={m}>{m}</option>)}</select></label>
              <label className="text-xs font-semibold">UTR / Ref No. (optional)<input value={slipRef} maxLength={190} onChange={e=>setSlipRef(e.target.value)} disabled={busy} placeholder="Auto if left blank" className={'mt-1 block w-full '+field}/></label>
              <label className="text-xs font-semibold">Payment date (optional)<input type="date" max={today} value={slipPaidOn} onChange={e=>setSlipPaidOn(e.target.value)} disabled={busy} className={'mt-1 block w-full '+field}/></label>
              <label className="text-xs font-semibold">Slip remarks (optional)<input value={slipNotes} maxLength={500} onChange={e=>setSlipNotes(e.target.value)} disabled={busy} placeholder="e.g. Credited via NEFT" className={'mt-1 block w-full '+field}/></label>
            </div>
            <button type="submit" disabled={busy} className={button+' bg-[#465FFF] text-white'}>Generate &amp; save monthly slip</button>
          </form>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Saved salary slips ({slips.length})</h4>
            {slips.map(slip=>(
              <article key={slip.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4E7EC] p-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{slip.snapshot.monthLabel} · <span className="font-mono text-[#465FFF]">{slip.slipNumber}</span> {slip.status==='voided'&&<span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] text-red-700">Voided</span>}</p>
                  <p className="mt-1 text-slate-600">Cycle: {slip.cycleStartDate} to {slip.cycleEndDate} · Payable: {slip.snapshot.payableDays} days · Net Pay: <strong>{money(slip.netPay)}</strong></p>
                  <p className="mt-0.5 text-[11px] text-slate-500">Issued by {slip.issuedBy} on {new Date(slip.issuedAt).toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'})}{slip.status==='voided'?` · Void reason: ${slip.voidReason}`:''}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busy} onClick={()=>printSavedSlip(slip)} className={button+' !min-h-9 !px-3 !py-1.5 !text-xs bg-white text-[#465FFF]'}>Print / PDF Slip</button>
                  {slip.status==='issued'&&<button type="button" disabled={busy} onClick={()=>void voidSlip(slip.id,slip.slipNumber)} className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Void</button>}
                </div>
              </article>
            ))}
            {slips.length===0&&<p className="text-xs text-slate-500">No monthly salary slips issued for this employee yet.</p>}
          </div>
        </div>
      </details>

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

      {activePrintSlip ? (
        <div className="salary-slip-print-only" aria-hidden="true">
          <header className="salary-slip-header">
            <div className="salary-slip-brand">
              <img src="/img/logo.png" alt="" className="salary-slip-logo" />
              <div>
                <p className="salary-slip-eyebrow">{activePrintSlip.snapshot.companyName}</p>
                <h1>PAYSLIP · {activePrintSlip.snapshot.monthLabel.toUpperCase()}</h1>
                <p className="salary-slip-sub">{activePrintSlip.snapshot.companyAddress}</p>
                <p className="salary-slip-sub">{[activePrintSlip.snapshot.companyPhone, activePrintSlip.snapshot.companyEmail].filter(Boolean).join(' · ')}</p>
              </div>
            </div>
            <div className="salary-slip-meta">
              <p><strong>Slip No:</strong> {activePrintSlip.slipNumber}</p>
              <p><strong>Pay Cycle:</strong> {activePrintSlip.cycleStartDate} to {activePrintSlip.cycleEndDate}</p>
              <p><strong>Issued On:</strong> {new Date(activePrintSlip.issuedAt).toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'})}</p>
              <p><strong>Status:</strong> {activePrintSlip.status==='voided'?'VOIDED':'ISSUED'}</p>
            </div>
          </header>

          {activePrintSlip.status==='voided'&&<p className="salary-slip-void-banner">VOIDED SLIP — {activePrintSlip.voidReason}</p>}

          <section className="salary-slip-grid">
            <div><span>Employee Name</span><strong>{activePrintSlip.snapshot.employeeName}</strong></div>
            <div><span>Employee ID</span><strong>{activePrintSlip.snapshot.employeeCode}</strong></div>
            <div><span>Designation</span><strong>{activePrintSlip.snapshot.designation}</strong></div>
            <div><span>Date of Joining</span><strong>{activePrintSlip.snapshot.joiningDate||'—'}</strong></div>
            <div><span>Contact Phone</span><strong>{activePrintSlip.snapshot.employeePhone||'—'}</strong></div>
            <div><span>Email</span><strong>{activePrintSlip.snapshot.employeeEmail||'—'}</strong></div>
            <div><span>Monthly Fixed Base</span><strong>{activePrintSlip.snapshot.monthlyBaseSalary>0?money(activePrintSlip.snapshot.monthlyBaseSalary):'Not set'}</strong></div>
            <div><span>Work Shift / Cycle</span><strong>{activePrintSlip.snapshot.shiftTime} · Day {activePrintSlip.snapshot.cycleStartDay}</strong></div>
          </section>

          <section className="salary-slip-attendance">
            <div><span>Cycle Days</span><strong>{activePrintSlip.snapshot.totalDays}</strong></div>
            <div><span>Working Days</span><strong>{activePrintSlip.snapshot.workingDays}</strong></div>
            <div><span>Offs / Holidays</span><strong>{activePrintSlip.snapshot.weeklyOffsAndHolidays}</strong></div>
            <div><span>Present</span><strong>{activePrintSlip.snapshot.presentDays}</strong></div>
            <div><span>Half Day</span><strong>{activePrintSlip.snapshot.halfDays}</strong></div>
            <div><span>Paid Leave</span><strong>{activePrintSlip.snapshot.paidLeaveDays}</strong></div>
            <div><span>Absent / Unpaid</span><strong>{activePrintSlip.snapshot.unpaidAndAbsentDays}</strong></div>
            <div><span>Payable Days ({Math.floor(activePrintSlip.snapshot.totalWorkMinutes/60)}h {activePrintSlip.snapshot.totalWorkMinutes%60}m)</span><strong>{activePrintSlip.snapshot.payableDays}</strong></div>
          </section>

          <section className="salary-slip-split">
            <table>
              <thead><tr><th>Earnings</th><th className="num">Amount (INR)</th></tr></thead>
              <tbody>
                <tr><td>Earned Basic Salary ({activePrintSlip.snapshot.payableDays} / {activePrintSlip.snapshot.workingDays} payable days)</td><td className="num">{money(activePrintSlip.snapshot.earnedSalary)}</td></tr>
                {activePrintSlip.snapshot.allowanceAmount>0&&<tr><td>{activePrintSlip.snapshot.allowanceLabel}</td><td className="num">{money(activePrintSlip.snapshot.allowanceAmount)}</td></tr>}
              </tbody>
              <tfoot><tr><th>Gross Earnings</th><th className="num">{money(activePrintSlip.snapshot.grossEarnings)}</th></tr></tfoot>
            </table>
            <table>
              <thead><tr><th>Deductions</th><th className="num">Amount (INR)</th></tr></thead>
              <tbody>
                {activePrintSlip.snapshot.deductionAmount>0
                  ? <tr><td>{activePrintSlip.snapshot.deductionLabel}</td><td className="num">{money(activePrintSlip.snapshot.deductionAmount)}</td></tr>
                  : <tr><td>No extra deductions</td><td className="num">{money(0)}</td></tr>}
              </tbody>
              <tfoot><tr><th>Total Deductions</th><th className="num">{money(activePrintSlip.snapshot.totalDeductions)}</th></tr></tfoot>
            </table>
          </section>

          <section className="salary-slip-netbox">
            <div>
              <span>Net Salary Payable</span>
              <strong>{money(activePrintSlip.snapshot.netPay)}</strong>
              <p className="salary-slip-words">{activePrintSlip.snapshot.netPayWords}</p>
            </div>
            <div className="salary-slip-settlement">
              <p><strong>Paid in Cycle:</strong> {money(activePrintSlip.snapshot.paidAmount)}</p>
              <p><strong>Payment Mode:</strong> {activePrintSlip.snapshot.paymentMethod||'—'}</p>
              <p><strong>Ref / UTR:</strong> {activePrintSlip.snapshot.paymentRef||'—'}</p>
              <p><strong>Payment Date:</strong> {activePrintSlip.snapshot.paidOn||'—'}</p>
            </div>
          </section>

          {activePrintSlip.snapshot.notes&&<p className="salary-slip-note"><strong>Remarks:</strong> {activePrintSlip.snapshot.notes}</p>}

          <footer className="salary-slip-footer">
            <p>This is a system-generated payslip issued by {activePrintSlip.snapshot.companyName} ({activePrintSlip.issuedBy}) based on verified attendance and payroll ledger records.</p>
            <div className="salary-slip-signs">
              <div><span>Employee Signature</span></div>
              <div><span>Authorized Signatory &amp; Company Stamp</span></div>
            </div>
          </footer>
        </div>
      ) : reportCurrent && (
        <div className="salary-slip-print-only" aria-hidden="true">
          <header className="salary-slip-header">
            <div className="salary-slip-brand">
              <img src="/img/logo.png" alt="" className="salary-slip-logo" />
              <div>
                <p className="salary-slip-eyebrow">{site.name} · PAYROLL STATEMENT</p>
                <h1>Employee Range Statement</h1>
                <p className="salary-slip-sub">{site.address}</p>
              </div>
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
        </div>
      )}
    </>}
  </section>
}