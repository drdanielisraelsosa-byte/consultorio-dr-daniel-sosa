import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { appointments } from "../../../../db/schema";
import { validSession } from "../../../../lib/admin-auth";

export async function POST(request:Request){
  if(!await validSession(request))return Response.json({error:"No autorizado"},{status:401});
  try{
    const body=await request.json() as {publicId?:string;reason?:string};
    const publicId=String(body.publicId??"").trim();
    const reason=String(body.reason??"Cancelada por el propietario").trim().slice(0,240);
    if(!/^DS-20\d{6}-\d{2}-[A-Z0-9]{4}$/.test(publicId))return Response.json({error:"Cita inválida"},{status:400});
    const db=getDb();
    const result=await db.update(appointments).set({status:"cancelled"}).where(and(eq(appointments.publicId,publicId),eq(appointments.status,"confirmed"))).run();
    if(!result.meta.changes)return Response.json({error:"La cita ya fue cancelada o no existe"},{status:409});
    return Response.json({ok:true,publicId,reason},{headers:{"cache-control":"no-store"}});
  }catch{return Response.json({error:"No fue posible cancelar la cita"},{status:500});}
}
