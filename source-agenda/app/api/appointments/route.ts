import { and, eq, gte, lte } from "drizzle-orm";
import { getDb } from "../../../db";
import { appointments } from "../../../db/schema";
import { sendAppointmentConfirmation } from "../../lib/appointment-email";

const VALID_HOURS = new Set([9,10,11,12,13,16,17,18,19,20]);

function validDate(value:string){ return /^20(26|27|28|29|30)-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00`).getTime()); }
function isAllowedSlot(date:string,time:string){
  if(!validDate(date)||!/^\d{2}:00$/.test(time))return false;
  const hour=Number(time.slice(0,2)); const target=new Date(`${date}T${time}:00-06:00`); const day=new Date(`${date}T12:00:00Z`).getUTCDay();
  return VALID_HOURS.has(hour)&&day>=1&&day<=6&&target>=new Date("2026-08-01T00:00:00-06:00")&&target<=new Date("2030-12-31T23:59:59-06:00")&&target.getTime()-Date.now()>=30*60*1000;
}

export async function GET(request:Request){
  try{
    const url=new URL(request.url);const start=url.searchParams.get("start")??"";const end=url.searchParams.get("end")??"";
    if(!validDate(start)||!validDate(end))return Response.json({error:"Rango de fechas inválido"},{status:400});
    const db=getDb();const rows=await db.select({date:appointments.appointmentDate,time:appointments.appointmentTime}).from(appointments).where(and(gte(appointments.appointmentDate,start),lte(appointments.appointmentDate,end),eq(appointments.status,"confirmed")));
    return Response.json({booked:rows.map(r=>`${r.date}|${r.time}`)},{headers:{"cache-control":"no-store"}});
  }catch{return Response.json({error:"No fue posible consultar la disponibilidad"},{status:500});}
}

export async function POST(request:Request){
  try{
    const body=await request.json() as Record<string,unknown>;
    const patientName=String(body.patientName??"").trim();const email=String(body.email??"").trim().toLowerCase();const phone=String(body.phone??"").replace(/\D/g,"");const reason=String(body.reason??"").trim();const sex=String(body.sex??"").trim();const date=String(body.date??"");const time=String(body.time??"");const age=Number(body.age);
    if(!body.privacyAccepted)return Response.json({error:"Debes aceptar el aviso de privacidad"},{status:400});
    if(patientName.length<3||patientName.length>100||!/^\S+@\S+\.\S+$/.test(email)||phone.length<10||phone.length>15||reason.length<3||reason.length>500||!Number.isInteger(age)||age<0||age>120)return Response.json({error:"Revisa los datos de contacto y del paciente"},{status:400});
    if(!isAllowedSlot(date,time))return Response.json({error:"El horario ya no está disponible o faltan menos de 30 minutos"},{status:400});
    const publicId=`DS-${date.replaceAll("-","")}-${time.slice(0,2)}-${crypto.randomUUID().slice(0,4).toUpperCase()}`;const db=getDb();
    await db.insert(appointments).values({publicId,appointmentDate:date,appointmentTime:time,patientName,age,sex:["F","M","O"].includes(sex)?sex:null,reason,email,phone,privacyAcceptedAt:new Date().toISOString()});
    const delivery=await sendAppointmentConfirmation({publicId,date,time,patientName,age,sex,reason,email,phone});
    if(!delivery.sent)console.error("[appointment-email] delivery failed",{provider:delivery.provider,code:delivery.code});
    return Response.json({appointment:{publicId,date,time},notifications:{email:delivery.sent}},{status:201});
  }catch(error){
    const message=error instanceof Error?error.message:"";
    if(message.includes("UNIQUE")||message.includes("unique"))return Response.json({error:"Ese horario acaba de ser reservado. Elige otro."},{status:409});
    return Response.json({error:"No fue posible registrar la cita. Intenta nuevamente."},{status:500});
  }
}
