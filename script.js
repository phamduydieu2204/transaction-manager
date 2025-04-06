const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlIBUV-wJDSUejBk80mFLLoMhtRm0eoCiY3JEn4Bfxp0_MPS_e6ssXKPuU6_bpfqkN6Q/exec';

function login() {
    const employeeId = document.getElementById('employeeId').value;
    const password = document.getElementById('password').value;
    if (employeeId && password) {
        // Lưu thông tin đăng nhập tạm thời (sẽ cải thiện sau)
        localStorage.setItem('loggedInUser', JSON.stringify({ id: employeeId }));
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('error').innerText = 'Vui lòng nhập đầy đủ thông tin!';
    }
}

function addTransaction() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('Vui lòng đăng nhập trước!');
        window.location.href = 'index.html';
        return;
    }

    // Lấy dữ liệu từ form
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
        // Thêm các trường khác theo nhu cầu
    };

    // Gửi dữ liệu tới Google Apps Script
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(transactionData),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors' // Quan trọng khi gọi từ GitHub Pages
    })
    .then(response => {
        console.log('Gửi dữ liệu thành công');
        alert('Thêm giao dịch thành công!');
        form.reset(); // Xóa form sau khi gửi
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra!');
    });
}
