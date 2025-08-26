#!/usr/bin/env node
const postgres=require('postgres');require('dotenv').config({path:'.env.local'});require('dotenv').config();
(async()=>{const sql=postgres(process.env.POSTGRES_URL);const rows=await sql`SELECT column_name,data_type,udt_name FROM information_schema.columns WHERE table_name='user_byte_history' ORDER BY ordinal_position`;console.log(rows);await sql.end();})();
