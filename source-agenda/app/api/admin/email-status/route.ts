import { appointmentEmailConfiguration } from "../../../lib/appointment-email";
import { validSession } from "../../../../lib/admin-auth";

export async function GET(request:Request){
  if(!await validSession(request))return Response.json({error:"No autorizado"},{status:401});
  return Response.json(appointmentEmailConfiguration(),{headers:{"cache-control":"no-store"}});
}
