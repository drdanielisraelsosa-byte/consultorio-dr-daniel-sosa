import { env } from "cloudflare:workers";

const encoder=new TextEncoder();
function runtime(){return env as unknown as Record<string,string|undefined>}
function bytesToHex(bytes:Uint8Array){return Array.from(bytes).map(b=>b.toString(16).padStart(2,"0")).join("")}
async function sign(value:string){const key=await crypto.subtle.importKey("raw",encoder.encode(runtime().SESSION_SECRET??"unset"),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return bytesToHex(new Uint8Array(await crypto.subtle.sign("HMAC",key,encoder.encode(value))))}
export function configured(){return Boolean(runtime().ADMIN_PIN&&runtime().SESSION_SECRET)}
export function pinMatches(pin:string){return configured()&&pin===runtime().ADMIN_PIN}
export async function issueSession(){const exp=Date.now()+30*60*1000;const value=String(exp);return `${value}.${await sign(value)}`}
export async function validSession(request:Request){const cookie=request.headers.get("cookie")??"";const raw=cookie.split(";").map(x=>x.trim()).find(x=>x.startsWith("sosa_admin="))?.slice(11);if(!raw)return false;const [exp,sig]=raw.split(".");if(!exp||!sig||Number(exp)<Date.now())return false;const expected=await sign(exp);if(expected.length!==sig.length)return false;let diff=0;for(let i=0;i<sig.length;i++)diff|=sig.charCodeAt(i)^expected.charCodeAt(i);return diff===0}
