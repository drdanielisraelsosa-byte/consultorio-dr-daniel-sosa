"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarExplorer } from "./components/CalendarExplorer";
import { CreativeEducation } from "./components/CreativeEducation";
import { QuickLinks } from "./components/QuickLinks";
import { VisualIdentity } from "./components/VisualIdentity";
import { canBook, displayDate, isoDate, mondayOf, slotLabel } from "./calendar-utils";
import { APPOINTMENT_HOURS, DAYS, MONTHS, SITE_LINKS } from "./site-config";

type Picked = { date:string; time:string };
type Confirmation = Picked & { publicId:string; patientName:string; emailSent?:boolean };

function clinicNow(){
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Mexico_City",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",hourCycle:"h23"}).formatToParts(new Date());
  const value=Object.fromEntries(parts.map(part=>[part.type,part.value]));
  return new Date(Number(value.year),Number(value.month)-1,Number(value.day),Number(value.hour),Number(value.minute));
}

function initialScheduleDate(){
  const now=clinicNow();
  const start=new Date(2026,7,1);const end=new Date(2030,11,31);
  const date=now<start?start:now>end?end:new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes());
  if(date.getDay()===0)date.setDate(date.getDate()+1);
  if(date.getDay()===6&&(date.getHours()>19||(date.getHours()===19&&date.getMinutes()>=30)))date.setDate(date.getDate()+2);
  return new Date(date.getFullYear(),date.getMonth(),date.getDate());
}

export default function Home(){
  const [selected,setSelected]=useState<Date>(initialScheduleDate);
  const [now,setNow]=useState(new Date());
  const [booked,setBooked]=useState<Set<string>>(new Set());
  const [loading,setLoading]=useState(true);
  const [picked,setPicked]=useState<Picked|null>(null);
  const [privacy,setPrivacy]=useState(false);
  const [confirmation,setConfirmation]=useState<Confirmation|null>(null);
  const weekStart=useMemo(()=>mondayOf(selected),[selected]);
  const week=useMemo(()=>Array.from({length:6},(_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return d}),[weekStart]);

  useEffect(()=>{ const id=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(id); },[]);
  useEffect(()=>{
    const start=isoDate(week[0]); const end=isoDate(week[5]);
    fetch(`/api/appointments?start=${start}&end=${end}`).then(r=>r.json()).then(data=>setBooked(new Set(data.booked??[]))).catch(()=>setBooked(new Set())).finally(()=>setLoading(false));
  },[week]);

  return <main className="app-shell">
    <header className="topbar"><a className="brand-home" href={SITE_LINKS.mainWebsite} target="_top" aria-label="Ir al sitio principal del Dr. Daniel Sosa"><img className="brandmark" src="/logo-round.jpg" alt="Logotipo del Dr. Daniel Sosa"/></a><div className="brandtext"><strong>Dr. Daniel Sosa</strong><span>Médico Cirujano · Cédula profesional 12296387</span></div><div className="clock"><strong>{now.toLocaleTimeString("es-MX",{timeZone:"America/Mexico_City",hour:"2-digit",minute:"2-digit"})}</strong>{now.toLocaleDateString("es-MX",{timeZone:"America/Mexico_City",day:"numeric",month:"short",year:"numeric"})}</div></header>
    <div className="workspace">
      <div className="introline"><div><h1>Agenda tu consulta</h1><p>Selecciona un horario disponible. Las citas cierran 30 minutos antes.</p></div><span className="date-pill">Lunes a sábado · comida 14:00–16:00</span></div>
      <div className="schedule-stack">
        <section className="panel schedule-panel" aria-label="Disponibilidad semanal">
          <div className="panel-head"><button className="navbtn" onClick={()=>{const d=new Date(selected);d.setDate(d.getDate()-7);if(d>=new Date(2026,7,1))setSelected(d)}} aria-label="Semana anterior">‹</button><h2>Semana del {week[0].getDate()} al {week[5].getDate()} de {MONTHS[week[5].getMonth()].toLowerCase()}</h2><button className="navbtn" onClick={()=>{const d=new Date(selected);d.setDate(d.getDate()+7);if(d<=new Date(2030,11,31))setSelected(d)}} aria-label="Semana siguiente">›</button></div>
          <div className="day-tabs-mobile" aria-label="Seleccionar día">{week.map((d,i)=><button key={isoDate(d)} className={isoDate(d)===isoDate(selected)?"active":""} onClick={()=>setSelected(d)}><b>{DAYS[i]}</b><span>{d.getDate()} {MONTHS[d.getMonth()].slice(0,3)}</span></button>)}</div>
          <div className="day-slots-mobile" aria-label={`Horarios disponibles para ${displayDate(isoDate(selected))}`}>{APPOINTMENT_HOURS.map(hour=>{const date=isoDate(selected);const key=`${date}|${String(hour).padStart(2,"0")}:00`;const isBooked=booked.has(key);const closed=!canBook(date,hour);return <button key={key} disabled={isBooked||closed} className={`daily-slot ${isBooked?"booked":""} ${closed?"closed":""}`} onClick={()=>setPicked({date,time:`${String(hour).padStart(2,"0")}:00`})}><b>{slotLabel(hour)}</b><span>{isBooked?"Ocupada":closed?"No disponible":"Disponible"}</span></button>})}</div>
          <div className="week-wrap"><div className="week-grid"><div className="week-corner">Hora</div>{week.map((d,i)=><div className="week-day" key={i}><b>{DAYS[i]}</b><span>{d.getDate()} {MONTHS[d.getMonth()].slice(0,3)}</span></div>)}
            {APPOINTMENT_HOURS.flatMap(hour=>[<div className="time-label" key={`t${hour}`}>{slotLabel(hour)}</div>,...week.map(d=>{const date=isoDate(d);const key=`${date}|${String(hour).padStart(2,"0")}:00`;const isBooked=booked.has(key);const closed=!canBook(date,hour);return <button key={key} disabled={isBooked||closed} className={`slot ${isBooked?"booked":""} ${closed?"closed":""}`} onClick={()=>setPicked({date,time:`${String(hour).padStart(2,"0")}:00`})}><span>{isBooked?"Ocupada":closed?"No disponible":"Disponible"}</span></button>})])}
          </div></div><div className="week-status">{loading?"Actualizando disponibilidad…":"Disponibilidad actualizada · horario de comida 14:00–16:00"}</div>
          <div className="schedule-notice" role="note" aria-label="Aviso sobre datos de confirmación">
            <span>DATOS PARA CONFIRMAR TU CITA</span>
            <strong>Usa un correo personal y un celular con WhatsApp que consultes con frecuencia.</strong>
          </div>
        </section>
        <CalendarExplorer selected={selected} now={now} onSelect={setSelected}/>
        <VisualIdentity/>
        <nav className="contact-actions" aria-label="Contacto y ubicación">
          <a className="contact-link whatsapp-direct" href={SITE_LINKS.whatsapp} target="_blank" rel="noreferrer"><span>WhatsApp directo</span><strong>477 123 53 88</strong></a>
          <a className="contact-link" href={SITE_LINKS.maps} target="_blank" rel="noreferrer"><span>Dirección del consultorio</span><strong>Abrir en Google Maps</strong></a>
          <a className="contact-link" href={SITE_LINKS.instagram} target="_blank" rel="noreferrer"><span>Espacio educativo</span><strong>Instagram · @leinadrd</strong></a>
        </nav>
        <CreativeEducation/>
        <section className="site-return">
          <img src="/logo-round.jpg" alt="Logotipo del Dr. Daniel Sosa"/>
          <div><span>SITIO PROFESIONAL</span><h2>Conoce más sobre el Dr. Daniel Israel Sosa de Santiago</h2><p>Servicios, formación, consultorio y medios de contacto.</p><a href={SITE_LINKS.mainWebsite} target="_top">Volver al sitio principal del doctor</a></div>
        </section>
      </div>
    </div>
    <QuickLinks onPrivacy={()=>setPrivacy(true)}/>
    <div className="owner-access"><span>Área del doctor</span><a className="doctor-key" href="/doctor" target="_top" aria-label="Acceso exclusivo para el Dr. Sosa"><img src="/logo-round.jpg" alt=""/></a></div>
    {picked&&<BookingModal picked={picked} onClose={()=>setPicked(null)} onPrivacy={()=>setPrivacy(true)} onBooked={result=>{setBooked(prev=>new Set(prev).add(`${result.date}|${result.time}`));setConfirmation(result)}}/>}
    {confirmation&&<SuccessModal value={confirmation} onClose={()=>{setConfirmation(null);setPicked(null)}}/>}
    {privacy&&<PrivacyModal onClose={()=>setPrivacy(false)}/>} 
  </main>;
}

function BookingModal({picked,onClose,onPrivacy,onBooked}:{picked:Picked;onClose:()=>void;onPrivacy:()=>void;onBooked:(c:Confirmation)=>void}){
  const [busy,setBusy]=useState(false);const [error,setError]=useState("");const [complete,setComplete]=useState(false);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError("");const form=new FormData(e.currentTarget);const payload=Object.fromEntries(form.entries());
    try{const r=await fetch("/api/appointments",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({...payload,...picked,privacyAccepted:payload.privacy==="on"})});const data=await r.json();if(!r.ok)throw new Error(data.error||"No fue posible reservar");onBooked({...picked,publicId:data.appointment.publicId,patientName:String(payload.patientName),emailSent:Boolean(data.notifications?.email)});}catch(err){setError(err instanceof Error?err.message:"No fue posible reservar");}finally{setBusy(false)}}
  return <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="booking-title"><div className="modal-top"><div><h2 id="booking-title">Datos para tu consulta</h2><p className="appointment-label">{displayDate(picked.date)} · {slotLabel(Number(picked.time.slice(0,2)))}</p></div><button className="close" onClick={onClose} aria-label="Cerrar">×</button></div><div className="contact-banner" role="note"><b>Tu correo personal y tu celular con WhatsApp son indispensables.</b><span>Ingresa los datos que tú utilizas y verifica que sean correctos: ahí recibirás la confirmación y los avisos relacionados con tu cita.</span></div><form onSubmit={submit} onInput={e=>setComplete(e.currentTarget.checkValidity())} onChange={e=>setComplete(e.currentTarget.checkValidity())}><div className="form-grid">
    <div className="field full"><label htmlFor="patientName">Nombre completo</label><input id="patientName" name="patientName" autoComplete="name" required maxLength={100}/></div>
    <div className="field"><label htmlFor="age">Edad</label><input id="age" name="age" type="number" min="0" max="120" inputMode="numeric" required/></div>
    <div className="field"><label htmlFor="sex">Sexo (opcional)</label><select id="sex" name="sex" defaultValue=""><option value="">Prefiero no indicarlo</option><option value="F">Femenino</option><option value="M">Masculino</option><option value="O">Otro</option></select></div>
    <div className="field"><label htmlFor="email">Correo electrónico</label><input id="email" name="email" type="email" autoComplete="email" required/></div>
    <div className="field"><label htmlFor="phone">Celular con WhatsApp</label><input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" minLength={10} required/></div>
    <div className="field full"><label htmlFor="reason">Motivo de consulta</label><textarea id="reason" name="reason" required maxLength={500} placeholder="Descríbelo brevemente"/></div>
  </div><label className="consent"><input name="privacy" type="checkbox" required/>Acepto el tratamiento de mis datos, incluidos los datos de salud, para gestionar esta cita y la atención médica. He leído el <button type="button" className="text-button" onClick={onPrivacy}>aviso de privacidad</button>.</label><div className="submit-row"><span className="form-error">{error}</span><button className="primary" disabled={busy||!complete}>{busy?"Reservando…":complete?"Agendar consulta":"Completa tus datos"}</button></div></form></section></div>;
}

function SuccessModal({value,onClose}:{value:Confirmation;onClose:()=>void}){
  const text=encodeURIComponent(`Hola, soy ${value.patientName}. Confirmo mi cita con el Dr. Daniel Sosa el ${displayDate(value.date)} a las ${slotLabel(Number(value.time.slice(0,2)))}. Folio: ${value.publicId}`);
  return <div className="modal-backdrop"><section className="modal success" role="dialog" aria-modal="true"><div className="success-badge">✓</div><h2>Consulta agendada</h2><p>{value.emailSent?"El horario quedó reservado y la confirmación fue enviada por correo.":"El horario quedó reservado. Envía la confirmación por WhatsApp."}</p><div className="credential"><small>Credencial de cita</small><strong>{value.patientName}</strong><div>{displayDate(value.date)} · {slotLabel(Number(value.time.slice(0,2)))}</div><small>Folio {value.publicId}</small></div><a className="whatsapp" href={`${SITE_LINKS.whatsapp}?text=${text}`} target="_blank" rel="noreferrer">Confirmar por WhatsApp</a><button className="text-button" style={{marginTop:18}} onClick={onClose}>Volver al calendario</button></section></div>;
}

function PrivacyModal({onClose}:{onClose:()=>void}){return <div className="modal-backdrop"><section className="modal privacy" role="dialog" aria-modal="true"><div className="modal-top"><h2>Aviso de privacidad</h2><button className="close" onClick={onClose} aria-label="Cerrar">×</button></div><p><b>Responsable:</b> Dr. Daniel Israel Sosa de Santiago, Médico Cirujano, consultorio en José María Cruz 633, Local 101, Real del Bosque, León, Guanajuato.</p><h3>Datos y finalidad</h3><p>Se recaban nombre, edad, datos de contacto y motivo de consulta para reservar, confirmar y dar seguimiento a la atención médica; integrar los registros clínicos que correspondan y contactar al paciente. Los datos de salud son sensibles y no se utilizarán con fines publicitarios.</p><h3>Expediente clínico</h3><p>Cuando exista atención médica, los documentos clínicos se integrarán y conservarán conforme a la NOM-004-SSA3-2012. La norma establece un plazo mínimo de conservación de cinco años desde el último acto médico. El agendamiento por sí solo no sustituye la valoración ni constituye un diagnóstico.</p><h3>Acceso y confidencialidad</h3><p>La agenda pública solo muestra horarios disponibles; nunca nombres ni motivos. El acceso administrativo está restringido. Para solicitar acceso, rectificación, cancelación u oposición, o una copia de documentos clínicos, comunícate al 477 123 53 88.</p><button className="primary" onClick={onClose}>Entendido</button></section></div>}
