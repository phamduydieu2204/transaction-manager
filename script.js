// URL Google Apps Script để ghi dữ liệu
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlIBUV-wJDSUejBk80mFLLoMhtRm0eoCiY3JEn4Bfxp0_MPS_e6ssXKPuU6_bpfqkN6Q/exec';
// Google Sheets API URL để đọc dữ liệu
const SHEET_ID = '1OKMn-g-mOm2MlsAOoWEMi3JjRlwfdw5IpVTRmwMKcHU'; // Thay bằng Sheet ID của bạn
const API_KEY = 'AIzaSyDt9wLPmhQBYN2OKUnO3tXqiZdo6DCoS0g';   // Thay bằng API Key của bạn
const BASE_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;

// Hàm đăng nhập (đơn giản hóa)
function login() {
  const employeeId = document.getElementById('employeeId').value;
  const password = document.getElementById('password').value;
  if (employeeId && password) {
    localStorage.setItem('loggedInUser', JSON.stringify({ id: employeeId }));
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('error').innerText = 'Vui lòng nhập đầy đủ thông tin!';
  }
}

// Hàm thêm giao dịch
function addTransaction() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!loggedInUser) {
    alert('Vui lòng đăng nhập trước!');
    window.location.href = 'index.html';
    return;
  }

  const form = document.getElementById('transactionForm');
  const transactionId = `GD${Date.now()}`;
  const dateTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  const transactionData = {
    transactionId: transactionId,
    dateTime: dateTime,
    transactionType: form.transactionType.value,
    customerName: form.customerName.value,
    email: form.email.value.toLowerCase(),
    employeeId: loggedInUser.id
  };

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(transactionData),
    headers: { 'Content-Type': 'application/json' },
    mode: 'no-cors'
  })
  .then(() => {
    alert('Thêm giao dịch thành công!');
    form.reset();
    fetchTransactions(); // Cập nhật danh sách giao dịch ngay sau khi thêm
  })
  .catch(error => {
    console.error('Lỗi:', error);
    alert('Có lỗi xảy ra!');
  });
}

// Hàm lấy danh sách giao dịch từ Google Sheet
function fetchTransactions() {
  fetch(`${BASE_API_URL}/Dữ liệu giao dịch!A2:F?key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const transactions = data.values || [];
      displayTransactions(transactions);
    })
    .catch(error => {
      console.error('Lỗi lấy giao dịch:', error);
      document.getElementById('transactionList').innerText = 'Không thể tải danh sách giao dịch.';
    });
}

// Hàm lấy danh sách nhân viên từ Google Sheet
function fetchEmployees() {
  fetch(`${BASE_API_URL}/Danh sách nhân viên!A2:E?key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const employees = data.values || [];
      displayEmployees(employees);
    })
    .catch(error => {
      console.error('Lỗi lấy nhân viên:', error);
      document.getElementById('employeeList').innerText = 'Không thể tải danh sách nhân viên.';
    });
}

// Hàm hiển thị danh sách giao dịch
function displayTransactions(transactions) {
  const list = document.getElementById('transactionList');
  list.innerHTML = '<h2>Danh sách giao dịch</h2>';
  if (transactions.length === 0) {
    list.innerHTML += '<p>Chưa có giao dịch nào.</p>';
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>Mã GD</th><th>Ngày giờ</th><th>Loại GD</th><th>Khách hàng</th><th>Email</th><th>Mã NV</th>
    </tr>
  `;
  transactions.forEach(row => {
    table.innerHTML += `
      <tr>
        <td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${row[4]}</td><td>${row[5]}</td>
      </tr>
    `;
  });
  list.appendChild(table);
}

// Hàm hiển thị danh sách nhân viên
function displayEmployees(employees) {
  const list = document.getElementById('employeeList');
  list.innerHTML = '<h2>Danh sách nhân viên</h2>';
  if (employees.length === 0) {
    list.innerHTML += '<p>Chưa có nhân viên nào.</p>';
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>Mã NV</th><th>Tên NV</th><th>Mật khẩu</th><th>Vai trò</th><th>Trạng thái</th>
    </tr>
  `;
  employees.forEach(row => {
    table.innerHTML += `
      <tr>
        <td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${row[4]}</td>
      </tr>
    `;
  });
  list.appendChild(table);
}

// Tự động tải dữ liệu khi vào dashboard
window.onload = function() {
  if (window.location.pathname.endsWith('dashboard.html')) {
    fetchTransactions();
    fetchEmployees();
  }
};