document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = 'AIzaSyBPPpFZK-Ol4Ta4-YKu95avsfDrJikEWRw'; // replace with your API key
  const SHEET_ID = '1dzuDIhVH3zqsIoEtgikrDQLFxK3oTxtxzBS_0qsXw6Y'; // replace with your sheet ID
  const RANGE = 'Test!A1:B1000'; // replace with your data range

  const fetchSheetData = async () => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.values; // returns the data in a 2D array
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
      return [];
    }
  };

  const renderTable = (data) => {
    const headers = document.getElementById('table-headers');
    const body = document.getElementById('table-body');

    if (data.length === 0) {
      headers.innerHTML = '<tr><th>No Data</th></tr>';
      body.innerHTML = '';
      return;
    }

    // Set table headers
    headers.innerHTML = data[0].map(header => `<th>${header}</th>`).join('');

    // Set table body
    body.innerHTML = data.slice(1).map(row => {
      return `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
    }).join('');
  };

  const loadData = async () => {
    const sheetData = await fetchSheetData();
    renderTable(sheetData);
  };

  loadData();
});

