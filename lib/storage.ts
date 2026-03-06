import fs from "fs/promises";
import path from "path";

export type Participant = {
  id: number;
  participant_code: string;
  name: string;
  phone: string;
  address?: string;
  created_at: string;
};

const dataFile = path.join(process.cwd(), "data", "participants.json");

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
  const raw = await fs.readFile(dataFile, "utf-8");
  return JSON.parse(raw) as Participant[];
}

export async function writeParticipants(items: Participant[]) {
  await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), "utf-8");
}

export async function getByPhone(
  phone: string
): Promise<Participant | undefined> {
  const items = await readParticipants();
  return items.find((p) => p.phone === phone);
}

export async function getByCode(
  code: string
): Promise<Participant | undefined> {
  const items = await readParticipants();
  return items.find((p) => p.participant_code === code);
}

export async function getById(id: number): Promise<Participant | undefined> {
  const items = await readParticipants();
  return items.find((p) => p.id === id);
}

export async function addParticipant(
  data: Omit<Participant, "id" | "participant_code" | "created_at">
): Promise<Participant> {
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

const childrenFile = path.join(process.cwd(), "data", "children.json");

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
  const raw = await fs.readFile(childrenFile, "utf-8");
  return JSON.parse(raw) as Child[];
}

export async function writeChildren(items: Child[]) {
  await ensureChildrenFile();
  await fs.writeFile(childrenFile, JSON.stringify(items, null, 2), "utf-8");
}

export async function getChildrenByParticipantId(
  participant_id: number
): Promise<Child[]> {
  const items = await readChildren();
  return items.filter((c) => c.participant_id === participant_id);
}

export async function addChildrenForParticipant(
  participant_id: number,
  names: string[]
): Promise<Child[]> {
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
  const items = await readChildren();
  return items.filter((c) => c.participant_id === participant_id).length;
}

export async function updateChildName(
  child_id: number,
  name: string
): Promise<Child | undefined> {
  const items = await readChildren();
  const idx = items.findIndex((c) => c.id === child_id);
  if (idx === -1) return undefined;
  const updated: Child = { ...items[idx], name: name.trim() };
  items[idx] = updated;
  await writeChildren(items);
  return updated;
}

export async function deleteChildById(child_id: number): Promise<boolean> {
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

const attendanceFile = path.join(process.cwd(), "data", "attendance.json");

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
  const raw = await fs.readFile(attendanceFile, "utf-8");
  return JSON.parse(raw) as AttendanceRecord[];
}

export async function writeAttendance(items: AttendanceRecord[]) {
  await ensureAttendanceFile();
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

const settingsFile = path.join(process.cwd(), "data", "settings.json");

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
  const raw = await fs.readFile(settingsFile, "utf-8");
  const json = JSON.parse(raw);
  return {
    registration_open: !!json.registration_open,
  };
}

export async function writeSettings(s: Settings) {
  await ensureSettingsFile();
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
