import { useEffect, useState } from 'react'
import { listSalarySlips, saveManualSalarySlip } from '@/lib/attendance-functions'
import type { SalarySlipRecord } from '@/lib/content-types'

const fields = {presentDays:'Present days',halfDays:'Half days',paidLeaveDays:'Paid leave days',unpaidAndAbsentDays:'Absent / unpaid days',workingDays:'Working days',monthlyBaseSalary:'Monthly base INR',earnedSalary:'Earned salary INR',allowanceAmount:'Bonus INR',deductionAmount:'Deduction INR',paidAmount:'Paid INR'}
export function ManualSalarySlips({employeeId,month,onPrint}:{employeeId:number;month:string;onPrint:(slip:SalarySlipRecord)=>void}) {
  const [rows,setRows]=useState<SalarySlipRecord[]>([]),[id,setId]=useState(0),[selectedMonth,setMonth]=useState(month)
  const [values,setValues]=useState<Record<string,string>>({}),[notes,setNotes]=useState(''),[paidOn,setPaidOn]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('')
  const load=()=>listSalarySlips({data:{employeeId}}).then(setRows)
  useEffect(()=>{setRows([]);setId(0);setValues({});setNotes('');setPaidOn('');load().catch(e=>setError(e.message))},[employeeId])
  return <details className="rounded-xl border p-4"><summary className="cursor-pointer font-semibold">Monthly manual salary slips</summary>
    <form className="mt-4 space-y-3" onSubmit={async event=>{event.preventDefault();setBusy(true);setError('');try{await saveManualSalarySlip({data:{...Object.fromEntries(Object.entries(values).map(([key,value])=>[key,Number(value)])),id,employeeId,month:selectedMonth,notes,paidOn}});await load();setId(0);setValues({});setNotes('');setPaidOn('')}catch(e){setError(e instanceof Error?e.message:'Save failed')}finally{setBusy(false)}}}>
      <p className="text-sm text-slate-600">Enter the month’s figures manually. Net salary is earned salary plus bonus minus deductions.</p>
      <label className="block">Month<input required type="month" value={selectedMonth} onChange={e=>setMonth(e.target.value)} className="ml-3 rounded border p-2"/></label>
      <div className="grid gap-3 sm:grid-cols-3">{Object.entries(fields).map(([key,label])=><label key={key} className="text-sm">{label}<input type="number" min="0" step="0.01" value={values[key]||''} placeholder="0" onChange={e=>setValues({...values,[key]:e.target.value})} className="mt-1 block w-full rounded border p-2"/></label>)}</div>
      <label className="block">Paid on<input type="date" value={paidOn} onChange={e=>setPaidOn(e.target.value)} className="ml-3 rounded border p-2"/></label>
      <label className="block">Notes<input value={notes} onChange={e=>setNotes(e.target.value)} className="mt-1 block w-full rounded border p-2"/></label>
      {error&&<p role="alert" className="text-red-700">{error}</p>}
      <button disabled={busy} className="rounded-lg bg-blue-600 p-3 text-white">{busy?'Saving…':id?'Save changes':'Save manual slip'}</button>
      {id>0&&<button type="button" className="ml-3" onClick={()=>{setId(0);setValues({});setNotes('');setPaidOn('')}}>Cancel edit</button>}
    </form>
    <div className="mt-4 space-y-2">{rows.map(row=><div key={row.id} className="flex flex-wrap items-center gap-3 rounded border p-3"><span>{row.selectedMonth} · ₹{row.netPay} · {row.status}</span><button type="button" onClick={()=>onPrint(row)}>Print / PDF</button>{row.snapshot.manual&&row.status==='issued'&&<button type="button" onClick={()=>{setId(row.id);setMonth(row.selectedMonth);setValues(Object.fromEntries(Object.keys(fields).map(key=>[key,String(row.snapshot[key as keyof typeof row.snapshot]??0)])));setNotes(row.snapshot.notes);setPaidOn(row.snapshot.paidOn)}}>Edit</button>}</div>)}</div>
  </details>
}
