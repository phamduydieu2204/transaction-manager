const SHEET_ID = '1pl7DwxtXTeVqKmfQl1UdIS7A2WcFl2sjCrkOqOegv9U';
const API_KEY = 'AIzaSyDt9wLPmhQBYN2OKUnO3tXqiZdo6DCoS0g';
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;

async function fetchSheetData(sheetName) {
    const response = await fetch(`${BASE_URL}/${sheetName}!A1:Z?key=${API_KEY}`);
    const data = await response.json();
    return data.values;
}
