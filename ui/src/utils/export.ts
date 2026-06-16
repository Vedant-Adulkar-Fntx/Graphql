export function downloadCSV(data: any[], filename: string) {
  if (!data || data.length === 0) return;

  // Get headers from the first object
  const headers = Object.keys(data[0]);

  // Convert data to CSV string
  const csvRows = [];

  // Add headers row
  csvRows.push(headers.map((header) => `"${header}"`).join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      // Escape quotes and wrap in quotes
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');

  // Create download link
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}