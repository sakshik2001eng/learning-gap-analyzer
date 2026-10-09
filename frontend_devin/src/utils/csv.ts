type CsvCell = string | number | boolean | null | undefined;

const escapeCell = (value: CsvCell): string => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const toCsv = (headers: string[], rows: CsvCell[][]): string =>
  [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n');

// Builds a CSV file in the browser and triggers a download.
// The UTF-8 BOM makes Excel read non-ASCII names correctly.
export const downloadCsv = (filename: string, headers: string[], rows: CsvCell[][]) => {
  const blob = new Blob(['\uFEFF' + toCsv(headers, rows)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
