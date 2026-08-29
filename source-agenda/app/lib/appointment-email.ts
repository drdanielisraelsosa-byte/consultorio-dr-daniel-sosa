import { env } from "cloudflare:workers";

export type AppointmentEmailData={publicId:string;date:string;time:string;patientName:string;age:number;sex:string;reason:string;email:string;phone:string};
export type AppointmentEmailResult={sent:boolean;provider:"gmail-webhook"|"resend"|"none";code:"sent"|"unconfigured"|"http-error"|"invalid-response"|"network-error"};

function escapeHtml(value:string){return value.replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;"}[c]??c));}

function emailHtml(data:AppointmentEmailData){
  return `<div style="font-family:Arial;color:#10231d;max-width:620px;border:1px solid #d6c59b;border-radius:22px;overflow:hidden"><div style="background:#0b5b45;color:white;padding:22px"><div style="font-size:12px;letter-spacing:2px">CITA CONFIRMADA</div><h1 style="font-family:Georgia;margin:6px 0">Agenda del Dr. Daniel Sosa</h1></div><div style="padding:22px"><div style="color:#6b756f;font-size:12px">${escapeHtml(data.publicId)}</div><h2 style="font-family:Georgia">${escapeHtml(data.patientName)}</h2><p><b>Fecha:</b> ${escapeHtml(data.date)} · ${escapeHtml(data.time)} h<br><b>Edad:</b> ${data.age}${data.sex?` · <b>Sexo:</b> ${escapeHtml(data.sex)}`:""}<br><b>Celular:</b> ${escapeHtml(data.phone)}<br><b>Correo:</b> ${escapeHtml(data.email)}</p><div style="background:#f6f2e8;border-radius:14px;padding:14px"><b>Motivo de consulta</b><p>${escapeHtml(data.reason)}</p></div><p style="font-size:12px;color:#66736d">Conserva este mensaje como comprobante de tu cita.</p></div></div>`;
}

async function sendWithGmailWebhook(data:AppointmentEmailData,runtime:Record<string,string|undefined>):Promise<AppointmentEmailResult|null>{
  if(!runtime.GMAIL_WEBHOOK_URL||!runtime.GMAIL_WEBHOOK_SECRET)return null;
  try{
    const response=await fetch(runtime.GMAIL_WEBHOOK_URL,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({secret:runtime.GMAIL_WEBHOOK_SECRET,doctorEmail:runtime.DOCTOR_EMAIL,data,html:emailHtml(data)}),signal:AbortSignal.timeout(15000)});
    if(!response.ok)return {sent:false,provider:"gmail-webhook",code:"http-error"};
    const result=await response.json().catch(()=>null) as {ok?:boolean}|null;
    return result?.ok===true?{sent:true,provider:"gmail-webhook",code:"sent"}:{sent:false,provider:"gmail-webhook",code:"invalid-response"};
  }catch{return {sent:false,provider:"gmail-webhook",code:"network-error"};}
}

async function sendWithResend(data:AppointmentEmailData,runtime:Record<string,string|undefined>):Promise<AppointmentEmailResult>{
  if(!runtime.RESEND_API_KEY||!runtime.DOCTOR_EMAIL)return {sent:false,provider:"none",code:"unconfigured"};
  const html=emailHtml(data);const from=runtime.NOTIFY_FROM_EMAIL??"Agenda Dr. Sosa <agenda@resend.dev>";
  try{
    const [doctor,patient]=await Promise.all([
      fetch("https://api.resend.com/emails",{method:"POST",headers:{authorization:`Bearer ${runtime.RESEND_API_KEY}`,"content-type":"application/json"},body:JSON.stringify({from,to:[runtime.DOCTOR_EMAIL],subject:`Nueva cita · ${data.date} ${data.time} · ${data.patientName}`,html}),signal:AbortSignal.timeout(15000)}),
      fetch("https://api.resend.com/emails",{method:"POST",headers:{authorization:`Bearer ${runtime.RESEND_API_KEY}`,"content-type":"application/json"},body:JSON.stringify({from,to:[data.email],subject:`Tu cita con el Dr. Daniel Sosa · ${data.date} ${data.time}`,html}),signal:AbortSignal.timeout(15000)}),
    ]);
    return doctor.ok&&patient.ok?{sent:true,provider:"resend",code:"sent"}:{sent:false,provider:"resend",code:"http-error"};
  }catch{return {sent:false,provider:"resend",code:"network-error"};}
}

export function appointmentEmailConfiguration(){
  const runtime=env as unknown as Record<string,string|undefined>;
  if(runtime.GMAIL_WEBHOOK_URL&&runtime.GMAIL_WEBHOOK_SECRET)return {configured:true,provider:"gmail-webhook" as const};
  if(runtime.RESEND_API_KEY&&runtime.DOCTOR_EMAIL)return {configured:true,provider:"resend" as const};
  return {configured:false,provider:"none" as const};
}

export async function sendAppointmentConfirmation(data:AppointmentEmailData){
  const runtime=env as unknown as Record<string,string|undefined>;
  const gmailResult=await sendWithGmailWebhook(data,runtime);
  if(gmailResult!==null)return gmailResult;
  return sendWithResend(data,runtime);
}
