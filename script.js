const SHEET_ID = '1pl7DwxtXTeVqKmfQl1UdIS7A2WcFl2sjCrkOqOegv9U';
const API_KEY = 'AIzaSyDt9wLPmhQBYN2OKUnO3tXqiZdo6DCoS0g';
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;

async function fetchSheetData(sheetName) {
    const response = await fetch(`${BASE_URL}/${sheetName}!A1:Z?key=${API_KEY}`);
    const data = await response.json();
    return data.values;
}


let loginAttempts = 0;
async function login() {
    const employeeId = document.getElementById('employeeId').value;
    const password = document.getElementById('password').value;
    const employees = await fetchSheetData('Danh sách nhân viên');
    const user = employees.find(row => row[0] === employeeId && row[2] === password);
    if (user && user[4] === 'ON') {
        localStorage.setItem('loggedInUser', JSON.stringify({ id: user[0], role: user[3] }));
        window.location.href = 'dashboard.html';
    } else {
        loginAttempts++;
        document.getElementById('error').textContent = 'Sai thông tin hoặc tài khoản bị khóa';
        if (loginAttempts >= 5) {
            // Gọi Google Apps Script để cập nhật trạng thái OFF
        }
    }
}


async function addTransaction() {
    const form = document.getElementById('transactionForm');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const transactionId = `GD${Date.now()}`;
    const dateTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const data = [
        transactionId,
        dateTime,
        form.transactionType.value,
        form.customerName.value,
        // Thêm các trường khác
        loggedInUser.id
    ];
    // Gọi Google Apps Script để ghi dữ liệu vào sheet
}
