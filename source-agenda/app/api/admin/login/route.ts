import { issueSession, pinMatches } from "../../../../lib/admin-auth";

export async function POST(request:Request){const body=await request.json() as {pin?:string};if(!body.pin||!pinMatches(body.pin))return Response.json({error:"Código incorrecto"},{status:401});const token=await issueSession();return Response.json({ok:true},{headers:{"set-cookie":`sosa_admin=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1800`}})}
export async function DELETE(){return Response.json({ok:true},{headers:{"set-cookie":"sosa_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"}})}
