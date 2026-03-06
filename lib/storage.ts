import fs from "fs/promises";
import path from "path";
import { neon } from "@neondatabase/serverless";

async function getKV() {
  const hasKV =
    !!process.env.KV_REST_API_URL ||
    !!process.env.KV_URL ||
    !!process.env.VERCEL_KV_REST_API_URL;
  if (!hasKV) return null;
  try {
    const mod = await import("@vercel/kv");
    return mod.kv;
  } catch {
    return null;
  }
}

function getBaseDataDir() {
  const envDir = process.env.DATA_DIR;
  if (envDir && envDir.trim()) return envDir;
  const isVercel = process.env.VERCEL === "1";
  return isVercel ? "/tmp/data" : path.join(process.cwd(), "data");
}
function dataPath(file: string) {
  return path.join(getBaseDataDir(), file);
}

async function readJsonSafe<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    if (!raw || raw.trim().length === 0) {
      await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf-8");
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf-8");
    } catch {
      // ignore
    }
    return fallback;
  }
}

export async function getStorageMode(): Promise<"kv" | "file"> {
  const kv = await getKV();
  return kv ? "kv" : "file";
}
export type Participant = {
  id: number;
  participant_code: string;
  name: string;
  phone: string;
  address?: string;
  created_at: string;
};

const dataFile = dataPath("participants.json");

async function ensureDataFile() {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify([], null, 2), "utf-8");
  }
}

export async function readParticipants(): Promise<Participant[]> {
  await ensureDataFile();
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    await sql`
      create table if not exists participants (
        id serial primary key,
        participant_code text unique,
        name text not null,
        phone text not null unique,
        address text,
        created_at timestamptz not null default now()
      );
    `;
    const rows = await sql<
      {
        id: number;
        participant_code: string | null;
        name: string;
        phone: string;
        address: string | null;
        created_at: string;
      }[]
    >`select id, participant_code, name, phone, address, created_at from participants order by id asc;`;
    return rows.map((r: any) => ({
      id: r.id,
      participant_code:
        r.participant_code ?? `ITIKAF-${String(r.id).padStart(3, "0")}`,
      name: r.name,
      phone: r.phone,
      address: r.address ?? undefined,
      created_at: r.created_at,
    }));
  }
  const kv = await getKV();
  if (kv) {
    const items = (await kv.get("participants")) ?? [];
    return items as Participant[];
  }
  return readJsonSafe<Participant[]>(dataFile, []);
}

export async function writeParticipants(items: Participant[]) {
  await ensureDataFile();
  const kv = await getKV();
  if (kv) {
    await kv.set("participants", items);
    return;
  }
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), "utf-8");
}

export async function getByPhone(
  phone: string
): Promise<Participant | undefined> {
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    const rows = await sql<
      {
        id: number;
        participant_code: string | null;
        name: string;
        phone: string;
        address: string | null;
        created_at: string;
      }[]
    >`select id, participant_code, name, phone, address, created_at from participants where phone = ${phone} limit 1;`;
    const r = rows[0];
    if (!r) return undefined;
    return {
      id: r.id,
      participant_code:
        r.participant_code ?? `ITIKAF-${String(r.id).padStart(3, "0")}`,
      name: r.name,
      phone: r.phone,
      address: r.address ?? undefined,
      created_at: r.created_at,
    };
  }
  const items = await readParticipants();
  return items.find((p) => p.phone === phone);
}

export async function getByCode(
  code: string
): Promise<Participant | undefined> {
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    const rows = await sql<
      {
        id: number;
        participant_code: string | null;
        name: string;
        phone: string;
        address: string | null;
        created_at: string;
      }[]
    >`select id, participant_code, name, phone, address, created_at from participants where participant_code = ${code} limit 1;`;
    const r = rows[0];
    if (!r) return undefined;
    return {
      id: r.id,
      participant_code:
        r.participant_code ?? `ITIKAF-${String(r.id).padStart(3, "0")}`,
      name: r.name,
      phone: r.phone,
      address: r.address ?? undefined,
      created_at: r.created_at,
    };
  }
  const items = await readParticipants();
  return items.find((p) => p.participant_code === code);
}

export async function getById(id: number): Promise<Participant | undefined> {
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    const rows = await sql<
      {
        id: number;
        participant_code: string | null;
        name: string;
        phone: string;
        address: string | null;
        created_at: string;
      }[]
    >`select id, participant_code, name, phone, address, created_at from participants where id = ${id} limit 1;`;
    const r = rows[0];
    if (!r) return undefined;
    return {
      id: r.id,
      participant_code:
        r.participant_code ?? `ITIKAF-${String(r.id).padStart(3, "0")}`,
      name: r.name,
      phone: r.phone,
      address: r.address ?? undefined,
      created_at: r.created_at,
    };
  }
  const items = await readParticipants();
  return items.find((p) => p.id === id);
}

export async function addParticipant(
  data: Omit<Participant, "id" | "participant_code" | "created_at">
): Promise<Participant> {
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    await sql`
      create table if not exists participants (
        id serial primary key,
        participant_code text unique,
        name text not null,
        phone text not null unique,
        address text,
        created_at timestamptz not null default now()
      );
    `;
    const inserted = await sql<{ id: number; created_at: string }[]>`
      insert into participants (name, phone, address)
      values (${data.name}, ${data.phone}, ${data.address ?? null})
      returning id, created_at;
    `;
    const id = inserted[0].id;
    const created_at = inserted[0].created_at;
    const code = `ITIKAF-${String(id).padStart(3, "0")}`;
    await sql`update participants set participant_code = ${code} where id = ${id};`;
    return {
      id,
      participant_code: code,
      name: data.name,
      phone: data.phone,
      address: data.address,
      created_at,
    };
  }
  const items = await readParticipants();
  const id = (items[items.length - 1]?.id ?? 0) + 1;
  const participant_code = `ITIKAF-${String(id).padStart(3, "0")}`;
  const created_at = new Date().toISOString();
  const item: Participant = { id, participant_code, created_at, ...data };
  items.push(item);
  await writeParticipants(items);
  return item;
}

export async function updateParticipantByCode(
  code: string,
  patch: Partial<Pick<Participant, "name" | "phone" | "address">>
): Promise<Participant | undefined> {
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    const current = await getByCode(code);
    if (!current) return undefined;
    try {
      const updatedRows = await sql<
        {
          id: number;
          participant_code: string;
          name: string;
          phone: string;
          address: string | null;
          created_at: string;
        }[]
      >`
        update participants
        set name = ${patch.name ?? current.name},
            phone = ${patch.phone ?? current.phone},
            address = ${patch.address ?? current.address ?? null}
        where participant_code = ${code}
        returning id, participant_code, name, phone, address, created_at;
      `;
      const r = updatedRows[0];
      return {
        id: r.id,
        participant_code: r.participant_code,
        name: r.name,
        phone: r.phone,
        address: r.address ?? undefined,
        created_at: r.created_at,
      };
    } catch (e: any) {
      throw new Error("Nomor HP sudah terdaftar");
    }
  }
  const items = await readParticipants();
  const idx = items.findIndex((p) => p.participant_code === code);
  if (idx === -1) return undefined;
  if (patch.phone) {
    const dup = items.find(
      (p) => p.phone === patch.phone && p.participant_code !== code
    );
    if (dup) {
      throw new Error("Nomor HP sudah terdaftar");
    }
  }
  const current = items[idx];
  const updated: Participant = {
    ...current,
    name: patch.name ?? current.name,
    phone: patch.phone ?? current.phone,
    address: patch.address ?? current.address,
  };
  items[idx] = updated;
  await writeParticipants(items);
  return updated;
}

export async function deleteParticipantByCode(code: string): Promise<boolean> {
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    const res =
      await sql`delete from participants where participant_code = ${code};`;
    return true;
  }
  const items = await readParticipants();
  const next = items.filter((p) => p.participant_code !== code);
  const changed = next.length !== items.length;
  if (changed) {
    await writeParticipants(next);
  }
  return changed;
}

export type Child = {
  id: number;
  participant_id: number;
  name: string;
};

const childrenFile = dataPath("children.json");

async function ensureChildrenFile() {
  try {
    await fs.access(childrenFile);
  } catch {
    await fs.mkdir(path.dirname(childrenFile), { recursive: true });
    await fs.writeFile(childrenFile, JSON.stringify([], null, 2), "utf-8");
  }
}

export async function readChildren(): Promise<Child[]> {
  await ensureChildrenFile();
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    await sql`
      create table if not exists children (
        id serial primary key,
        participant_id integer not null references participants(id) on delete cascade,
        name text not null
      );
    `;
    const rows = await sql<
      { id: number; participant_id: number; name: string }[]
    >`select id, participant_id, name from children order by id asc;`;
    return rows.map((r: any) => ({
      id: r.id,
      participant_id: r.participant_id,
      name: r.name,
    }));
  }
  const kv = await getKV();
  if (kv) {
    const items = (await kv.get("children")) ?? [];
    return items as Child[];
  }
  return readJsonSafe<Child[]>(childrenFile, []);
}

export async function writeChildren(items: Child[]) {
  await ensureChildrenFile();
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    return;
  }
  const kv = await getKV();
  if (kv) {
    await kv.set("children", items);
    return;
  }
  await fs.writeFile(childrenFile, JSON.stringify(items, null, 2), "utf-8");
}

export async function getChildrenByParticipantId(
  participant_id: number
): Promise<Child[]> {
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    const rows = await sql<
      { id: number; participant_id: number; name: string }[]
    >`select id, participant_id, name from children where participant_id = ${participant_id} order by id asc;`;
    return rows.map((r: any) => ({
      id: r.id,
      participant_id: r.participant_id,
      name: r.name,
    }));
  }
  const items = await readChildren();
  return items.filter((c) => c.participant_id === participant_id);
}

export async function addChildrenForParticipant(
  participant_id: number,
  names: string[]
): Promise<Child[]> {
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    const added: Child[] = [];
    for (const nm of names) {
      const name = nm.trim();
      if (!name) continue;
      const rows = await sql<{ id: number }[]>`
        insert into children (participant_id, name)
        values (${participant_id}, ${name})
        returning id;
      `;
      const id = rows[0].id;
      added.push({ id, participant_id, name });
    }
    return added;
  }
  const items = await readChildren();
  let lastId = items[items.length - 1]?.id ?? 0;
  const toAdd: Child[] = [];
  for (const name of names) {
    if (!name.trim()) continue;
    lastId += 1;
    toAdd.push({ id: lastId, participant_id, name: name.trim() });
  }
  const next = items.concat(toAdd);
  await writeChildren(next);
  return toAdd;
}

export async function countChildrenByParticipantId(
  participant_id: number
): Promise<number> {
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    const rows = await sql<{ count: number }[]>`
      select count(*)::int as count from children where participant_id = ${participant_id};
    `;
    return rows[0]?.count ?? 0;
  }
  const items = await readChildren();
  return items.filter((c) => c.participant_id === participant_id).length;
}

export async function updateChildName(
  child_id: number,
  name: string
): Promise<Child | undefined> {
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    const rows = await sql<
      { id: number; participant_id: number; name: string }[]
    >`
      update children set name = ${name.trim()} where id = ${child_id}
      returning id, participant_id, name;
    `;
    const r = rows[0];
    if (!r) return undefined;
    return { id: r.id, participant_id: r.participant_id, name: r.name };
  }
  const items = await readChildren();
  const idx = items.findIndex((c) => c.id === child_id);
  if (idx === -1) return undefined;
  const updated: Child = { ...items[idx], name: name.trim() };
  items[idx] = updated;
  await writeChildren(items);
  return updated;
}

export async function deleteChildById(child_id: number): Promise<boolean> {
  const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
  if (sql) {
    await sql`delete from children where id = ${child_id};`;
    return true;
  }
  const items = await readChildren();
  const next = items.filter((c) => c.id !== child_id);
  const changed = next.length !== items.length;
  if (changed) {
    await writeChildren(next);
  }
  return changed;
}

export type AttendanceRecord = {
  id: number;
  participant_id: number;
  night?: number;
  date: string;
  attendees: string[];
};

const attendanceFile = dataPath("attendance.json");

async function ensureAttendanceFile() {
  try {
    await fs.access(attendanceFile);
  } catch {
    await fs.mkdir(path.dirname(attendanceFile), { recursive: true });
    await fs.writeFile(attendanceFile, JSON.stringify([], null, 2), "utf-8");
  }
}

export async function readAttendance(): Promise<AttendanceRecord[]> {
  await ensureAttendanceFile();
  const kv = await getKV();
  if (kv) {
    const items = (await kv.get("attendance")) ?? [];
    return items as AttendanceRecord[];
  }
  return readJsonSafe<AttendanceRecord[]>(attendanceFile, []);
}

export async function writeAttendance(items: AttendanceRecord[]) {
  await ensureAttendanceFile();
  const kv = await getKV();
  if (kv) {
    await kv.set("attendance", items);
    return;
  }
  await fs.writeFile(attendanceFile, JSON.stringify(items, null, 2), "utf-8");
}

export async function addAttendanceRecord(
  participant_id: number,
  date: string,
  attendees: string[],
  night?: number
): Promise<AttendanceRecord> {
  const items = await readAttendance();
  const id = (items[items.length - 1]?.id ?? 0) + 1;
  const record: AttendanceRecord = {
    id,
    participant_id,
    date,
    attendees,
    night,
  };
  items.push(record);
  await writeAttendance(items);
  return record;
}

export async function updateAttendanceRecord(
  id: number,
  patch: Partial<Pick<AttendanceRecord, "date" | "night" | "attendees">>
): Promise<AttendanceRecord | undefined> {
  const items = await readAttendance();
  const idx = items.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  const current = items[idx];
  const updated: AttendanceRecord = {
    ...current,
    date: patch.date ?? current.date,
    night: patch.night ?? current.night,
    attendees: patch.attendees ?? current.attendees,
  };
  items[idx] = updated;
  await writeAttendance(items);
  return updated;
}

export async function deleteAttendanceRecordById(id: number): Promise<boolean> {
  const items = await readAttendance();
  const next = items.filter((r) => r.id !== id);
  const changed = next.length !== items.length;
  if (changed) {
    await writeAttendance(next);
  }
  return changed;
}

export type Settings = {
  registration_open: boolean;
};

const settingsFile = dataPath("settings.json");

async function ensureSettingsFile() {
  try {
    await fs.access(settingsFile);
  } catch {
    await fs.mkdir(path.dirname(settingsFile), { recursive: true });
    const defaultSettings: Settings = { registration_open: true };
    await fs.writeFile(
      settingsFile,
      JSON.stringify(defaultSettings, null, 2),
      "utf-8"
    );
  }
}

export async function readSettings(): Promise<Settings> {
  await ensureSettingsFile();
  const kv = await getKV();
  let json: Settings | null = null;
  if (kv) {
    json = (await kv.get("settings")) ?? null;
  }
  if (!json) {
    json = await readJsonSafe<Settings>(settingsFile, {
      registration_open: true,
    });
  }
  return {
    registration_open: !!json.registration_open,
  };
}

export async function writeSettings(s: Settings) {
  await ensureSettingsFile();
  const kv = await getKV();
  if (kv) {
    await kv.set("settings", s);
    return;
  }
  await fs.writeFile(settingsFile, JSON.stringify(s, null, 2), "utf-8");
}

export async function getRegistrationOpen(): Promise<boolean> {
  const s = await readSettings();
  return !!s.registration_open;
}

export async function setRegistrationOpen(open: boolean) {
  const s = await readSettings();
  s.registration_open = !!open;
  await writeSettings(s);
}
