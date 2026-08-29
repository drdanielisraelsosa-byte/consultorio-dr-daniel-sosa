"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type View = "day" | "week" | "month";
type Row = { publicId:string; date:string; time:string; name:string; age:number; sex:string|null; reason:string; email:string; phone:string; status:string };
type Summary = { day:number; week:number; month:number };
type EmailConfig = { configured:boolean; provider:"gmail-webhook"|"resend"|"none" };

function todayMexico(){
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Mexico_City",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
  const value=Object.fromEntries(parts.map(part=>[part.type,part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function displayDate(value:string){
  return new Intl.DateTimeFormat("es-MX",{timeZone:"UTC",weekday:"short",day:"numeric",month:"short",year:"numeric"}).format(new Date(`${value}T12:00:00Z`));
}

function sexLabel(value:string|null){
  return value === "F" ? "Femenino" : value === "M" ? "Masculino" : value === "O" ? "Otro" : "Sin dato";
}

export default function Doctor(){
  const [ready,setReady]=useState(false);
  const [authed,setAuthed]=useState(false);
  const [error,setError]=useState("");
  const [rows,setRows]=useState<Row[]>([]);
  const [summary,setSummary]=useState<Summary>({day:0,week:0,month:0});
  const [date,setDate]=useState(todayMexico);
  const [view,setView]=useState<View>("month");
  const [refresh,setRefresh]=useState(0);
  const [canceling,setCanceling]=useState("");
  const [resending,setResending]=useState("");
  const [emailConfig,setEmailConfig]=useState<EmailConfig|null>(null);

  useEffect(()=>{
    fetch("/api/admin/login",{method:"DELETE",cache:"no-store"})
      .finally(()=>{setAuthed(false);setReady(true)});
  },[]);

  useEffect(()=>{
    if(!authed)return;
    const controller=new AbortController();
    setReady(false);setError("");
    fetch(`/api/admin/stats?view=${view}&date=${date}`,{cache:"no-store",signal:controller.signal})
      .then(async response=>({status:response.status,data:await response.json()}))
      .then(({status,data})=>{
        if(status===401){setAuthed(false);setReady(true);return}
        if(status!==200)throw new Error(data.error||"No fue posible cargar el panel");
        setRows(data.appointments??[]);setSummary(data.summary??{day:0,week:0,month:0});setAuthed(true);setReady(true);
      })
      .catch(reason=>{if(reason?.name!=="AbortError"){setError("No fue posible cargar los datos del periodo");setReady(true)}});
    return()=>controller.abort();
  },[date,view,refresh,authed]);

  useEffect(()=>{
    if(!authed)return;
    fetch("/api/admin/email-status",{cache:"no-store"})
      .then(async response=>response.ok?response.json():null)
      .then(data=>setEmailConfig(data))
      .catch(()=>setEmailConfig(null));
  },[authed,refresh]);

  async function login(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();setError("");
    const pin=new FormData(event.currentTarget).get("pin");
    const response=await fetch("/api/admin/login",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({pin})});
    if(!response.ok){setError("Código incorrecto");return}
    setReady(false);
    const refreshed=await fetch(`/api/admin/stats?view=${view}&date=${date}`,{cache:"no-store"});
    if(refreshed.ok){const data=await refreshed.json();setRows(data.appointments??[]);setSummary(data.summary??{day:0,week:0,month:0});setAuthed(true)}
    setReady(true);
  }

  async function cancelAppointment(row:Row){
    if(!window.confirm(`¿Cancelar la cita de ${row.name} del ${displayDate(row.date)} a las ${row.time} y liberar ese horario?`))return;
    setCanceling(row.publicId);setError("");
    try{
      const response=await fetch("/api/admin/cancel",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({publicId:row.publicId})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||"No fue posible cancelar la cita");
      setRefresh(value=>value+1);
    }catch(reason){setError(reason instanceof Error?reason.message:"No fue posible cancelar la cita");}
    finally{setCanceling("");}
  }

  async function resendConfirmation(row:Row){
    setResending(row.publicId);setError("");
    try{
      const response=await fetch("/api/admin/resend-confirmation",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({publicId:row.publicId})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||"No fue posible reenviar la confirmación");
      window.alert("Confirmación reenviada al correo del paciente.");
    }catch(reason){setError(reason instanceof Error?reason.message:"No fue posible reenviar la confirmación");}
    finally{setResending("");}
  }

  const stats=useMemo(()=>{
    const total=rows.length;
    const avg=total?Math.round(rows.reduce((sum,row)=>sum+row.age,0)/total):0;
    const sex=rows.reduce((acc,row)=>{const key=row.sex??"Sin dato";acc[key]=(acc[key]??0)+1;return acc},{} as Record<string,number>);
    const reasons=rows.reduce((acc,row)=>{const key=row.reason.toLowerCase().split(/\s+/).slice(0,4).join(" ");acc[key]=(acc[key]??0)+1;return acc},{} as Record<string,number>);
    return {total,avg,sex,reasons:Object.entries(reasons).sort((a,b)=>b[1]-a[1]).slice(0,6)};
  },[rows]);

  if(!ready)return <main className="admin-login"><section><img src="/logo-round.jpg" alt="Logo del Dr. Daniel Sosa"/><p>ÁREA DEL PROPIETARIO</p><h1>Cargando panel seguro…</h1></section></main>;
  if(!authed)return <main className="admin-login"><section><img src="/logo-round.jpg" alt="Logo del Dr. Daniel Sosa"/><p>ACCESO EXCLUSIVO</p><h1>Área del doctor</h1><span>La información de pacientes nunca se muestra en la agenda pública.</span><form onSubmit={login}><label htmlFor="pin">Código de acceso</label><input id="pin" name="pin" type="password" inputMode="numeric" autoComplete="current-password" pattern="[0-9]*" required autoFocus/><button className="primary">Ingresar</button><small>{error}</small></form><div className="biometric-note">Puedes usar el gestor de contraseñas del teléfono para proteger este acceso con huella digital.</div><Link href="/">← Volver a la agenda pública</Link></section></main>;

  const viewLabel=view === "day" ? "Día" : view === "week" ? "Semana" : "Mes";
  return <main className="admin"><header className="admin-header"><div><p>ÁREA PRIVADA · SOLO DR. SOSA</p><h1>Panel del propietario</h1><span className="admin-subtitle">Consultas, acumulados y datos de contacto de pacientes.</span></div><div className="admin-actions"><label>Fecha de referencia<input type="date" min="2026-08-01" max="2030-12-31" value={date} onChange={event=>setDate(event.target.value)}/></label><button onClick={async()=>{await fetch("/api/admin/login",{method:"DELETE"});location.href="/"}}>Cerrar sesión</button></div></header>
    <section className="period-toolbar" aria-label="Periodo del panel"><span>Mostrar actividad por:</span><div className="period-tabs" role="tablist">{(["day","week","month"] as View[]).map(option=><button key={option} className={view===option?"active":""} role="tab" aria-selected={view===option} onClick={()=>setView(option)}>{option === "day" ? "Día" : option === "week" ? "Semana" : "Mes"}</button>)}</div><strong>{viewLabel} seleccionado · {displayDate(date)}</strong></section>
    {error&&<p className="admin-error" role="alert">{error}</p>}
    {emailConfig&&<p className={`admin-email-status ${emailConfig.configured?"ready":"missing"}`}><b>{emailConfig.configured?"Correo automático conectado":"Correo automático sin conexión"}</b><span>{emailConfig.configured?"Cada nueva cita envía confirmación al paciente y aviso al doctor.":"Las citas se guardan, pero la confirmación por correo no saldrá hasta configurar el proveedor."}</span></p>}
    <section className="stat-grid" aria-label="Acumulados"><article><span>Consultas del día</span><strong>{summary.day}</strong><small>{displayDate(date)}</small></article><article><span>Acumulado semanal</span><strong>{summary.week}</strong><small>Lunes a sábado</small></article><article><span>Acumulado mensual</span><strong>{summary.month}</strong><small>{new Intl.DateTimeFormat("es-MX",{month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(`${date}T12:00:00Z`))}</small></article></section>
    <section className="admin-columns"><article className="admin-card"><h2>Resumen del periodo</h2><div className="mini-summary"><span>Registros mostrados</span><b>{stats.total}</b><span>Edad promedio</span><b>{stats.avg||"—"}{stats.avg?" años":""}</b></div>{rows[0]&&<p className="next-appointment"><b>Último registro del periodo</b><br/>{displayDate(rows[0].date)} · {rows[0].time} · {rows[0].name}</p>}</article><article className="admin-card"><h2>Distribución por sexo</h2>{Object.entries(stats.sex).length?Object.entries(stats.sex).map(([key,value])=><div className="bar-row" key={key}><span>{sexLabel(key)}</span><div><i style={{width:`${value/Math.max(stats.total,1)*100}%`}}/></div><b>{value}</b></div>):<p className="empty">Sin datos en este periodo.</p>}</article></section>
    <section className="admin-card"><h2>Motivos más frecuentes</h2>{stats.reasons.length?<div className="reason-grid">{stats.reasons.map(([key,value])=><div className="reason" key={key}><span>{key}</span><b>{value}</b></div>)}</div>:<p className="empty">Sin datos en este periodo.</p>}</section>
    <section className="admin-card table-card"><div className="table-title"><div><h2>Tabla de pacientes y citas</h2><p>Vista {viewLabel.toLowerCase()} · los datos solo aparecen después del acceso del doctor.</p></div><span>{rows.length} registros</span></div>{rows.length?<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Fecha</th><th>Hora</th><th>Paciente</th><th>Edad</th><th>Contacto</th><th>Motivo</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{rows.map(row=><tr key={row.publicId}><td>{displayDate(row.date)}</td><td>{row.time}</td><td><strong>{row.name}</strong><small>{sexLabel(row.sex)}</small></td><td>{row.age}</td><td><span>{row.email}</span><small>{row.phone}</small></td><td>{row.reason}</td><td><em>{row.status === "confirmed" ? "Confirmada" : row.status}</em></td><td><div className="row-actions"><button className="email-button" disabled={!emailConfig?.configured||resending===row.publicId} onClick={()=>resendConfirmation(row)}>{resending===row.publicId?"Enviando…":"Reenviar correo"}</button><button className="cancel-button" disabled={canceling===row.publicId} onClick={()=>cancelAppointment(row)}>{canceling===row.publicId?"Liberando…":"Cancelar y liberar"}</button></div></td></tr>)}</tbody></table></div>:<div className="empty-state"><strong>No hay consultas registradas en este periodo.</strong><span>Cuando un paciente agende, aparecerá aquí y se actualizarán los acumulados.</span></div>}</section><Link className="back-agenda" href="/">← Volver a la agenda pública</Link></main>;
}
