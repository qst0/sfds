document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = 'AIzaSyBPPpFZK-Ol4Ta4-YKu95avsfDrJikEWRw'; // replace with your API key
  const SHEET_ID = '1dzuDIhVH3zqsIoEtgikrDQLFxK3oTxtxzBS_0qsXw6Y'; // replace with your sheet ID
  const RANGE = 'Test!A1:B1000000'; // replace with your data range
  const POLL_INTERVAL = 5000; // Polling interval in milliseconds

  let dataCache = [];
  let reversed = true;

  // Check if the URL contains ?flip or ?flip=true
  const params = new URLSearchParams(window.location.search);
  if (params.has('flip')) {
    reversed = true;
  }

  const fetchSheetData = async () => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}&t=${new Date().getTime()}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data.values;
      } else {
        console.error('Error fetching data from Google Sheets:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
      return [];
    }
  };

  const renderTable = (data) => {
    const headers = document.getElementById('table-headers');
    const body = document.getElementById('table-body');

    if (data.length === 0) {
      headers.innerHTML = '<tr><th>No Data; Check the Console</th></tr>';
      body.innerHTML = '';
      return;
    }

    headers.innerHTML = data[0].map(header => `<th>${header}</th>`).join('');
    body.innerHTML = data.slice(1).map(row => {
      return `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
    }).join('');
  };

  const loadData = async () => {
    const sheetData = await fetchSheetData();
    if (sheetData) {
      dataCache = sheetData;
      renderTable(reversed ? sheetData.slice().reverse() : sheetData);
    }
  };

  const toggleOrder = () => {
    reversed = !reversed;
    renderTable(reversed ? dataCache.slice().reverse() : dataCache);
  };

  loadData();
  setInterval(loadData, POLL_INTERVAL);
  document.getElementById('toggle-order').addEventListener('click', toggleOrder);
});