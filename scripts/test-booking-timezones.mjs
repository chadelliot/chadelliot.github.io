// Read-only tests of the *actual* browser time zone formatter.
// No meeting is created, and no user calendar data is accessed.
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/bookingTimeZones.ts", import.meta.url), "utf8");
const transpiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const times = await import("data:text/javascript;base64," + Buffer.from(transpiled).toString("base64"));

assert.equal(times.HOST_TIME_ZONE, "America/New_York");
assert.equal(times.validTimeZone("America/Denver"), true);
assert.equal(times.validTimeZone("not/a-zone"), false);

// Friday before US DST ends in 2026: EDT = UTC-4, MDT = UTC-6.
// A visitor clicking 2 p.m. Mountain must reach Chad at 4 p.m. Eastern.
const beforeDST = "2026-10-30T20:00:00.000Z";
assert.match(times.meetingClock(beforeDST, "America/Denver"), /2:00\s*PM\s*MDT/i);
assert.match(times.meetingClock(beforeDST, "America/New_York"), /4:00\s*PM\s*EDT/i);

// Monday after fall DST change: EST = UTC-5, MST = UTC-7.
// Times remain correctly paired at the same instant.
const afterDST = "2026-11-02T21:00:00.000Z";
assert.match(times.meetingClock(afterDST, "America/Denver"), /2:00\s*PM\s*MST/i);
assert.match(times.meetingClock(afterDST, "America/New_York"), /4:00\s*PM\s*EST/i);

// Phoenix never changes its UTC offset. Denver does.
assert.match(times.meetingClock(beforeDST, "America/Phoenix"), /1:00\s*PM\s*MST/i);
assert.match(times.meetingClock(afterDST, "America/Phoenix"), /2:00\s*PM\s*MST/i);

// Travelers may see a different *calendar day*, not just a different clock.
assert.match(times.meetingDay("2026-10-30T23:30:00.000Z", "Asia/Tokyo"), /October 31, 2026/);
assert.match(times.meetingDay("2026-10-30T23:30:00.000Z", "America/New_York"), /October 30, 2026/);
console.log("Passed: Eastern / Mountain, DST, Arizona, and cross-date time zone cases.");
