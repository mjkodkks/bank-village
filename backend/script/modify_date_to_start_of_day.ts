import { readFileSync, writeFileSync } from "fs";

const inputFile = "./data.csv";
const outputFile = "./update_transactions.sql";

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

try {
  const content = readFileSync(inputFile, "utf-8");
  const lines = content.trim().split(/\r?\n/);

  if (lines.length <= 1) {
    console.log("❌ ไม่พบข้อมูลในไฟล์ CSV");
    process.exit(0);
  }

  const header = parseCSVLine(lines[0]);
  const idIndex = header.indexOf("id");
  const createdAtIndex = header.indexOf("createdAt");

  if (idIndex === -1 || createdAtIndex === -1) {
    console.error("❌ ไม่พบคอลัมน์ 'id' หรือ 'createdAt' ในไฟล์ CSV");
    process.exit(1);
  }

  const values: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const columns = parseCSVLine(line);

    const id = columns[idIndex]?.replace(/^"|"$/g, "");
    const rawCreatedAt = columns[createdAtIndex]?.replace(/^"|"$/g, "");

    if (id && rawCreatedAt) {
      const utcString = rawCreatedAt.includes("Z")
        ? rawCreatedAt
        : `${rawCreatedAt.replace(" ", "T")}Z`;

      const dateObj = new Date(utcString);

      if (!isNaN(dateObj.getTime())) {
        // ลบเวลาออก 16 ชั่วโมง
        const adjustedDate = new Date(dateObj.getTime() - 16 * 60 * 60 * 1000);

        const formattedCreatedAt = adjustedDate
          .toISOString()
          .replace("T", " ")
          .replace("Z", "");

        // เก็บเฉพาะ (id, createdAt)
        values.push(`  (${id}::integer, '${formattedCreatedAt}'::timestamp)`);
      }
    }
  }

  // 💡 เปลี่ยนมาใช้คำสั่ง UPDATE ชัดเจน ปลอดภัย ไม่ติด NOT NULL constraint
  const sqlStatement = `UPDATE public."Transaction" AS t
SET "createdAt" = v.new_created_at
FROM (VALUES
${values.join(",\n")}
) AS v(id, new_created_at)
WHERE t.id = v.id;`;

  writeFileSync(outputFile, sqlStatement, "utf-8");
  console.log(`✅ เจนคำสั่ง UPDATE สำเร็จทั้งหมด ${values.length} รายการ!`);
  console.log(`📄 บันทึกไฟล์ SQL ไปที่: ${outputFile}`);
} catch (error) {
  console.error("เกิดข้อผิดพลาดในการประมวลผล:", error);
}