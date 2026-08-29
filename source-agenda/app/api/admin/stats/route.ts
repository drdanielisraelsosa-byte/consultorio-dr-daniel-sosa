import { and, desc, eq, gte, lt } from "drizzle-orm";
import { getDb } from "../../../../db";
import { appointments } from "../../../../db/schema";
import { validSession } from "../../../../lib/admin-auth";

type View = "day" | "week" | "month";

function clinicDate(){
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City" }).format(new Date());
}

function validDate(value:string){
  return /^20(?:26|27|28|29|30)-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00Z`).getTime());
}

function addDays(value:string, amount:number){
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0,10);
}

function mondayOf(value:string){
  const date = new Date(`${value}T12:00:00Z`);
  const day = date.getUTCDay();
  date.setUTCDate(date.getUTCDate() + (day === 0 ? -6 : 1 - day));
  return date.toISOString().slice(0,10);
}

function nextMonth(value:string){
  const [year, month] = value.split("-").map(Number);
  return `${month === 12 ? year + 1 : year}-${String(month === 12 ? 1 : month + 1).padStart(2,"0")}-01`;
}

function toAppointment(row:typeof appointments.$inferSelect){
  return {publicId:row.publicId,date:row.appointmentDate,time:row.appointmentTime,name:row.patientName,age:row.age,sex:row.sex,reason:row.reason,email:row.email,phone:row.phone,status:row.status};
}

export async function GET(request:Request){
  if(!await validSession(request))return Response.json({error:"No autorizado"},{status:401});
  const url=new URL(request.url);
  const requestedView=url.searchParams.get("view");
  const view:View=requestedView === "day" || requestedView === "week" || requestedView === "month" ? requestedView : "month";
  const requestedDate=url.searchParams.get("date") ?? "";
  const legacyMonth=url.searchParams.get("month") ?? "";
  const date=validDate(requestedDate) ? requestedDate : validDate(`${legacyMonth}-01`) ? `${legacyMonth}-01` : clinicDate();
  const monthStart=`${date.slice(0,7)}-01`;
  const monthEnd=nextMonth(monthStart);
  const weekStart=mondayOf(date);
  const weekEnd=addDays(weekStart,5);
  const range=view === "day" ? {start:date,end:date} : view === "week" ? {start:weekStart,end:weekEnd} : {start:monthStart,end:addDays(monthEnd,-1)};
  const queryStart=range.start < monthStart ? range.start : monthStart;
  const queryEndExclusive=addDays(range.end,1) > monthEnd ? addDays(range.end,1) : monthEnd;
  const db=getDb();
  const rows=await db.select().from(appointments).where(and(eq(appointments.status,"confirmed"),gte(appointments.appointmentDate,queryStart),lt(appointments.appointmentDate,queryEndExclusive))).orderBy(desc(appointments.appointmentDate),desc(appointments.appointmentTime)).limit(500);
  const inRange=rows.filter(row=>row.appointmentDate>=range.start && row.appointmentDate<=range.end);
  const dayCount=rows.filter(row=>row.appointmentDate===date).length;
  const weekCount=rows.filter(row=>row.appointmentDate>=weekStart && row.appointmentDate<=weekEnd).length;
  const monthCount=rows.filter(row=>row.appointmentDate>=monthStart && row.appointmentDate<monthEnd).length;
  return Response.json({view,date,range,summary:{day:dayCount,week:weekCount,month:monthCount},appointments:inRange.map(toAppointment)},{headers:{"cache-control":"no-store"}});
}
