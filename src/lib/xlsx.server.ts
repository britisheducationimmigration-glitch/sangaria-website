import '@tanstack/react-start/server-only'
import { deflateRawSync } from 'node:zlib'

type SheetCell = string | number | null | undefined

type Sheet = {
  name: string
  rows: SheetCell[][]
  widths?: number[]
  headerRows?: number[]
  filter?: string
}

function xmlEscape(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function columnName(index: number) {
  let value = ''
  let current = index + 1
  while (current > 0) {
    const remainder = (current - 1) % 26
    value = String.fromCharCode(65 + remainder) + value
    current = Math.floor((current - 1) / 26)
  }
  return value
}

function worksheetXml(sheet: Sheet) {
  const colCount = Math.max(...sheet.rows.map((row) => row.length), 1)
  const widths = sheet.widths ?? Array.from({ length: colCount }, () => 18)
  const cols = widths.map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${Math.max(8, Math.min(52, width))}" customWidth="1"/>`).join('')
  const headerRows = new Set(sheet.headerRows ?? [1])
  const rows = sheet.rows.map((row, rowIndex) => {
    const cells = row.map((value, colIndex) => {
      const ref = `${columnName(colIndex)}${rowIndex + 1}`
      const text = String(value ?? '')
      const style = headerRows.has(rowIndex + 1) ? ' s="1"' : ''
      if (typeof value === 'number' && Number.isFinite(value)) return `<c r="${ref}"${style}><v>${value}</v></c>`
      return `<c r="${ref}" t="inlineStr"${style}><is><t xml:space="preserve">${xmlEscape(text)}</t></is></c>`
    }).join('')
    return `<row r="${rowIndex + 1}">${cells}</row>`
  }).join('')
  const filter = sheet.filter ? `<autoFilter ref="${sheet.filter}"/>` : ''
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${cols}</cols><sheetData>${rows}</sheetData>${filter}</worksheet>`
}

function crc32(data: Buffer) {
  let crc = 0xffffffff
  for (const byte of data) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function dosDateTime() {
  const now = new Date()
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2)
  return { date, time }
}

function u16(value: number) {
  const buffer = Buffer.alloc(2)
  buffer.writeUInt16LE(value & 0xffff)
  return buffer
}

function u32(value: number) {
  const buffer = Buffer.alloc(4)
  buffer.writeUInt32LE(value >>> 0)
  return buffer
}

function zip(files: Array<{ name: string; data: string }>) {
  const localParts: Buffer[] = []
  const centralParts: Buffer[] = []
  let offset = 0
  const { date, time } = dosDateTime()
  for (const file of files) {
    const name = Buffer.from(file.name)
    const raw = Buffer.from(file.data)
    const compressed = deflateRawSync(raw, { level: 6 })
    const crc = crc32(raw)
    const local = Buffer.concat([
      u32(0x04034b50), u16(20), u16(0), u16(8), u16(time), u16(date), u32(crc), u32(compressed.length), u32(raw.length), u16(name.length), u16(0), name, compressed,
    ])
    localParts.push(local)
    const central = Buffer.concat([
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(8), u16(time), u16(date), u32(crc), u32(compressed.length), u32(raw.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name,
    ])
    centralParts.push(central)
    offset += local.length
  }
  const centralDirectory = Buffer.concat(centralParts)
  const end = Buffer.concat([
    u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(centralDirectory.length), u32(offset), u16(0),
  ])
  return Buffer.concat([...localParts, centralDirectory, end]).toString('base64')
}

function contentTypes(sheetCount: number) {
  const overrides = Array.from({ length: sheetCount }, (_, index) => `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${overrides}</Types>`
}

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="0"/><fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><name val="Arial"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="0B3326"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1"><alignment vertical="center" wrapText="1"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`

export function createLeadsWorkbook(sheets: Sheet[]) {
  const workbookSheets = sheets.map((sheet, index) => `<sheet name="${xmlEscape(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`).join('')
  const relationships = sheets.map((_, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`).join('')
  const files = [
    { name: '[Content_Types].xml', data: contentTypes(sheets.length) },
    { name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
    { name: 'xl/workbook.xml', data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets>${workbookSheets}</sheets></workbook>` },
    { name: 'xl/_rels/workbook.xml.rels', data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${relationships}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>` },
    { name: 'xl/styles.xml', data: stylesXml },
    ...sheets.map((sheet, index) => ({ name: `xl/worksheets/sheet${index + 1}.xml`, data: worksheetXml(sheet) })),
  ]
  return zip(files)
}
