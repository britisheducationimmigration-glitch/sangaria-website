import { useEffect, useRef, useState, type FormEvent } from 'react'
import { issueSalarySlip, listSalarySlips, saveManualSalarySlip, voidSalarySlip } from '@/lib/attendance-functions'
import type { SalarySlipRecord } from '@/lib/content-types'

const manualFields = {workingDays:'Working days',presentDays:'Present days',halfDays:'Half days',paidLeaveDays:'Paid leave days',unpaidAndAbsentDays:'Absent / unpaid days',monthlyBaseSalary:'Monthly base (INR)',earnedSalary:'Earned salary (INR)'}
const sharedFields = {allowanceAmount:'Bonus (INR)',deductionAmount:'Deduction (INR)',paidAmount:'Amount paid (INR)'}
const field = 'mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2'
const action = 'rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50'
type Props = { employeeId:number; month:string; today:string; onPrint:(row:SalarySlipRecord)=>void; onLedgerChange:()=>void }

export function ManualSalarySlips({employeeId,month,today,onPrint,onLedgerChange}:Props) {
  const [manual,setManual] = useState(false)
  const [edit,setEdit] = useState<SalarySlipRecord|null>(null)
  const [rows,setRows] = useState<SalarySlipRecord[]>([])
  const [revision,refresh] = useState(0)
  const [busy,setBusy] = useState(false)
  const [message,setMessage] = useState('')
  const [historyError,setHistoryError] = useState(false)
  const retry = useRef({payload:'',key:''})
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(()=>{
    let current = true
    setHistoryError(false)
    listSalarySlips({data:{employeeId}}).then(list=>{
      if(current) setRows(list)
    }).catch(()=>{if(current) setHistoryError(true)})
    return ()=>{current=false}
  },[employeeId,revision])

  async function save(event:FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if(busy) return
    const form = event.currentTarget
    const data = {...Object.fromEntries(new FormData(form)),employeeId}
    setBusy(true)
    setMessage('')
    try {
      let saved:SalarySlipRecord
      if(manual) {
        const payload = JSON.stringify(data)
        if(payload!==retry.current.payload) retry.current={payload,key:crypto.randomUUID()}
        saved=await saveManualSalarySlip({data:{...data,id:edit?.id,requestKey:retry.current.key}})
      } else {
        saved=await issueSalarySlip({data})
        onLedgerChange()
      }
      retry.current={payload:'',key:''}
      form.reset()
      setEdit(null)
      setRows(list=>[saved,...list.filter(row=>row.id!==saved.id)])
      refresh(n=>n+1)
      setMessage('Saved slip for '+saved.snapshot.employeeName+' · '+saved.snapshot.monthLabel)
    } catch(cause) {setMessage(cause instanceof Error ? cause.message : 'Could not save slip.')}
    finally {setBusy(false)}
  }
  async function cancelSlip(row:SalarySlipRecord) {
    const reason=window.prompt('Void the '+row.snapshot.monthLabel+' slip for '+row.snapshot.employeeName+'? Enter a reason. Recorded payments are kept.')?.trim()
    if(!reason) return
    setBusy(true)
    try {
      await voidSalarySlip({data:{id:row.id,reason}})
      setRows(list=>list.map(item=>item.id===row.id?{...item,status:'voided',voidReason:reason}:item))
      if(edit?.id===row.id) setEdit(null)
      if(!row.snapshot.manual) onLedgerChange()
      refresh(n=>n+1)
      setMessage('Slip voided.')
    } catch(cause) {setMessage(cause instanceof Error ? cause.message : 'Could not void slip.')}
    finally {setBusy(false)}
  }
  const snapshot=edit?.snapshot
  return <details className="rounded-xl border border-slate-200">
    <summary className="cursor-pointer p-4 text-sm font-semibold">Monthly salary slips</summary>
    <div className="space-y-4 border-t p-4">
      <label className="block text-sm">Create slip<select value={manual?'manual':'attendance'} disabled={busy} className={field} onChange={e=>{setManual(e.target.value==='manual');setEdit(null);setMessage('')}}>
        <option value="attendance">Generate from attendance</option><option value="manual">Enter manually</option>
      </select></label>
      <form key={String(manual)+'-'+(edit?.id??month)} ref={formRef} onSubmit={save}><fieldset disabled={busy} className="space-y-3">
        <legend className="font-bold">{edit?'Edit manual slip':manual?'Manual monthly record':'Attendance-based slip'}</legend>
        <p className="text-sm text-slate-600">{manual?'Enter days and amounts yourself. Payment details are saved on this slip only.':'Uses saved attendance. Leave amount paid blank to use recorded payments. Any additional payment is recorded in the ledger.'}</p>
        <label className="block text-sm">Salary month<input className={field} type="month" required name="month" defaultValue={edit?.selectedMonth??month}/></label>
        <div className="grid gap-3 sm:grid-cols-3">
          {Object.entries(manual?{...manualFields,...sharedFields}:sharedFields).map(([key,label])=><label key={key} className="text-sm">{label}<input className={field} name={key} type="number" min="0" max="10000000" step="0.01" defaultValue={snapshot?Number(snapshot[key as keyof typeof manualFields|keyof typeof sharedFields]):''}/></label>)}
          {!manual&&<><label className="text-sm">Allowance description<input className={field} name="allowanceLabel" maxLength={80}/></label><label className="text-sm">Deduction description<input className={field} name="deductionLabel" maxLength={80}/></label></>}
          <label className="text-sm">Payment method<select className={field} name="paymentMethod" defaultValue={snapshot?.paymentMethod??''}><option value="">Select method</option>{['Cash','Bank transfer','UPI','Cheque','Other'].map(value=><option key={value}>{value}</option>)}</select></label>
          <label className="text-sm">Payment reference / UTR<input className={field} name="paymentRef" maxLength={190} defaultValue={snapshot?.paymentRef}/></label>
          <label className="text-sm">Payment date<input className={field} name="paidOn" type="date" max={today} defaultValue={snapshot?.paidOn}/></label>
        </div>
        <label className="block text-sm">Remarks<input className={field} name="notes" maxLength={500} defaultValue={snapshot?.notes}/></label>
        <button className={action+' bg-[#465FFF] text-white'}>{busy?'Please wait…':edit?'Save changes':manual?'Save manual slip':'Generate and save slip'}</button>
        {edit&&<button type="button" className={action+' ml-2'} onClick={()=>setEdit(null)}>Cancel edit</button>}
      </fieldset></form>
      {message&&<p role="status">{message}</p>}
      <h4 className="text-sm font-bold">Saved slips</h4>
      {historyError&&<p role="alert">Could not load slip history. <button className={action} onClick={()=>refresh(n=>n+1)}>Retry history</button></p>}
      {rows.map(row=><article key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
        <div><strong>{row.snapshot.monthLabel} · {row.netPay.toLocaleString('en-IN',{style:'currency',currency:'INR'})}</strong><p className="text-xs text-slate-600">{row.snapshot.manual?'Manual':'Attendance'} · {row.status} {row.voidReason}</p></div>
        <div className="flex flex-wrap gap-2">
          <button disabled={busy} className={action} onClick={()=>onPrint(row)}>Print / PDF</button>
          {row.status==='issued'&&<>{row.snapshot.manual&&<button disabled={busy} className={action} onClick={()=>{setManual(true);setEdit(row);setMessage('');requestAnimationFrame(()=>formRef.current?.querySelector('input')?.focus())}}>Edit</button>}
            <button disabled={busy} className={action+' text-red-700'} onClick={()=>void cancelSlip(row)}>Void</button></>}
        </div>
      </article>)}
    </div>
  </details>
}