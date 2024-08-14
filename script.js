let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || {};
let editingIndex = -1;
let isLoginMode = true;

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = document.body.classList.contains('dark-theme') ? '🌞' : '🌓';
}

function authenticate() {
    const username = document.getElementById('username').value;
    const pin = document.getElementById('pin').value;

    if (isLoginMode) {
        if (users[username] && users[username].pin === pin) {
            currentUser = username;
            showDiaryForm();
        } else {
            showAlert('اسم المستخدم أو الرمز السري غير صحيح.', 'error');
        }
    } else {
        if (!users[username]) {
            users[username] = { pin, entries: [] };
            localStorage.setItem('users', JSON.stringify(users));
            showAlert('تم إنشاء الحساب بنجاح.', 'success');
            toggleAuthMode();
        } else {
            showAlert('اسم المستخدم موجود بالفعل.', 'error');
        }
    }
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').textContent = isLoginMode ? 'تسجيل الدخول' : 'إنشاء حساب جديد';
    document.getElementById('username').value = '';
    document.getElementById('pin').value = '';
}

function showDiaryForm() {
    document.getElementById('auth-form').style.display = 'none';
    document.getElementById('diary-form').style.display = 'block';
    loadEntries();
}

function saveEntry() {
    const entryText = document.getElementById('diary-entry').value.trim();
    if (entryText) {
        const entry = { text: entryText, date: new Date().toLocaleDateString('ar-SA') };
        if (editingIndex === -1) {
            users[currentUser].entries.push(entry);
        } else {
            users[currentUser].entries[editingIndex] = entry;
            editingIndex = -1;
            document.getElementById('save-button').textContent = 'حفظ اليومية 💾';
        }
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('diary-entry').value = '';
        loadEntries();
    }
}

function loadEntries() {
    const entries = users[currentUser].entries;
    const entriesContainer = document.getElementById('entries');
    entriesContainer.innerHTML = '';

    entries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry');
        entryDiv.innerHTML = `
            <div class="entry-date">${entry.date}</div>
            <div class="entry-text">${entry.text}</div>
            <div class="entry-actions">
                <button onclick="editEntry(${index})">تعديل ✏️</button>
                <button onclick="deleteEntry(${index})">حذف 🗑️</button>
            </div>
        `;
        entriesContainer.appendChild(entryDiv);
    });
}

function editEntry(index) {
    const entry = users[currentUser].entries[index];
    document.getElementById('diary-entry').value = entry.text;
    editingIndex = index;
    document.getElementById('save-button').textContent = 'تعديل اليومية ✏️';
}

function deleteEntry(index) {
    users[currentUser].entries.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    loadEntries();
}

function searchEntries() {
    const searchDate = document.getElementById('search-date').value;
    const entries = users[currentUser].entries;
    const entriesContainer = document.getElementById('entries');
    entriesContainer.innerHTML = '';

    const filteredEntries = entries.filter(entry => new Date(entry.date).toISOString().split('T')[0] === searchDate);

    filteredEntries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry');
        entryDiv.innerHTML = `
            <div class="entry-date">${entry.date}</div>
            <div class="entry-text">${entry.text}</div>
            <div class="entry-actions">
                <button onclick="editEntry(${index})">تعديل ✏️</button>
                <button onclick="deleteEntry(${index})">حذف 🗑️</button>
            </div>
        `;
        entriesContainer.appendChild(entryDiv);
    });
}

function showSettings() {
    document.getElementById('diary-form').style.display = 'none';
    document.getElementById('settings-form').style.display = 'block';
}

function hideSettings() {
    document.getElementById('settings-form').style.display = 'none';
    document.getElementById('diary-form').style.display = 'block';
}

function updateAccount() {
    const newUsername = document.getElementById('new-username').value.trim();
    const newPin = document.getElementById('new-pin').value.trim();

    if (newUsername && newPin) {
        const updatedUser = { ...users[currentUser], pin: newPin };
        delete users[currentUser];
        users[newUsername] = updatedUser;
        currentUser = newUsername;
        localStorage.setItem('users', JSON.stringify(users));
        showAlert('تم تحديث الحساب بنجاح.', 'success');
        hideSettings();
    } else {
        showAlert('يرجى إدخال اسم مستخدم جديد ورمز سري جديد.', 'error');
    }
}

function logout() {
    currentUser = null;
    document.getElementById('diary-form').style.display = 'none';
    document.getElementById('auth-form').style.display = 'block';
}

function addEmoji(emoji) {
    const diaryEntry = document.getElementById('diary-entry');
    diaryEntry.value += emoji;
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        showDiaryForm();
    }
});
