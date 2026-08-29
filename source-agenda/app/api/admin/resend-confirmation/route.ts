import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { appointments } from "../../../../db/schema";
import { validSession } from "../../../../lib/admin-auth";
import { sendAppointmentConfirmation } from "../../../lib/appointment-email";

export async function POST(request:Request){
  if(!await validSession(request))return Response.json({error:"No autorizado"},{status:401});
  try{
    const body=await request.json() as {publicId?:string};
    const publicId=String(body.publicId??"").trim();
    if(!/^DS-20\d{6}-\d{2}-[A-Z0-9]{4}$/.test(publicId))return Response.json({error:"Cita inválida"},{status:400});
    const db=getDb();
    const rows=await db.select().from(appointments).where(and(eq(appointments.publicId,publicId),eq(appointments.status,"confirmed"))).limit(1);
    const row=rows[0];
    if(!row)return Response.json({error:"La cita no existe o fue cancelada"},{status:404});
    const delivery=await sendAppointmentConfirmation({publicId:row.publicId,date:row.appointmentDate,time:row.appointmentTime,patientName:row.patientName,age:row.age,sex:row.sex??"",reason:row.reason,email:row.email,phone:row.phone});
    if(!delivery.sent){
      console.error("[appointment-email] resend failed",{provider:delivery.provider,code:delivery.code});
      return Response.json({error:"El correo no pudo enviarse",provider:delivery.provider,code:delivery.code},{status:503});
    }
    return Response.json({ok:true},{headers:{"cache-control":"no-store"}});
  }catch{
    return Response.json({error:"No fue posible reenviar la confirmación"},{status:500});
  }
}
