const API_URL = 'http://localhost:8000/api';

// Показ/скрытие поля пароля в зависимости от роли
function togglePasswordInput(role) {
    const passwordContainer = document.getElementById('passwordFieldContainer');
    if (passwordContainer) {
        if (role === 'employer') {
            passwordContainer.classList.remove('hidden');
        } else {
            passwordContainer.classList.add('hidden');
        }
    }
}

// Авторизация / Вход в систему
function completeRegistration() {
    const nameInput = document.getElementById('regName').value.trim();
    const roleSelect = document.getElementById('regRole').value;
    const passwordInput = document.getElementById('regPassword').value;
    const authError = document.getElementById('authError');

    if (!nameInput) {
        alert('Пожалуйста, введите ваше ФИО!');
        return;
    }

    if (roleSelect === 'employer' && passwordInput !== '1234') {
        if (authError) authError.classList.remove('hidden');
        return;
    }

    if (authError) authError.classList.add('hidden');

    // Сохраняем сессию
    localStorage.setItem('currentUser', JSON.stringify({ name: nameInput, role: roleSelect }));

    // Переключаем экраны
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');

    const profileDisplay = document.getElementById('userProfileDisplay');
    if (profileDisplay) {
        profileDisplay.innerText = `${nameInput} • `;
    }

    // Отображаем нужную панель (Мастер или Рабочий)
    const employerSec = document.getElementById('employerSection');
    const workerSec = document.getElementById('workerSection');

    if (roleSelect === 'employer') {
        if (employerSec) employerSec.classList.remove('hidden');
        if (workerSec) workerSec.classList.add('hidden');
    } else {
        if (employerSec) employerSec.classList.add('hidden');
        if (workerSec) workerSec.classList.remove('hidden');
    }
}

// Выход из системы
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

// Смена языка
function changeLanguage(lang) {
    console.log('Язык изменен на:', lang);
}

// Всплывающие уведомления (Toast)
function showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `p-4 mb-3 rounded-xl shadow-lg text-white font-sans text-xs transition-all duration-300 transform translate-x-0 ${
        type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-indigo-600'
    }`;
    toast.innerHTML = `<strong>${title}</strong><p class="mt-1">${message}</p>`;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// Отправка наряда мастером
async function submitOrderToAI() {
    const desc = document.getElementById('orderDesc').value || 'Плановый ремонт';
    const deadline = document.getElementById('orderDeadline').value || '17:00';
    const resultBox = document.getElementById('aiResultBox');

    try {
        await fetch(`${API_URL}/orders/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: desc, deadline: deadline, priority: 'Аварийный', assignee: 'Ахметов Е.' })
        });
    } catch (e) {
        console.warn('Работаем локально без Бэкенда');
    }

    if (resultBox) {
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `<p class="text-emerald-400 font-bold">✅ Наряд успешно выдан!</p><p class="text-slate-300">Срок выполнения: <strong>до ${deadline}</strong></p>`;
    }
    showToast('Успешно', `Наряд выдан со сроком выполнения до ${deadline}`, 'success');
}

// Отправка фотоотчета рабочим
async function sendPhotoToBoss() {
    const photoInput = document.getElementById('workerPhotoInput');
    const comment = document.getElementById('workerComment').value || 'Работы выполнены';
    const photoName = (photoInput && photoInput.files[0]) ? photoInput.files[0].name : 'photo_report.jpg';

    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    const feed = document.getElementById('employerReportsFeed');
    if (feed) {
        const newReportHTML = `
            <div class="p-3 bg-slate-900 rounded-2xl border border-emerald-500/40 flex justify-between items-center">
                <div>
                    <p class="font-bold text-emerald-400">👷 Ахметов Е. (Слесарь)</p>
                    <p class="text-slate-300 mt-0.5">«${comment}»</p>
                    <p class="text-[10px] text-slate-400 mt-1">📁 Прикреплено фото: <span class="text-indigo-400 underline cursor-pointer">${photoName}</span></p>
                </div>
                <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">${timeStr}</span>
            </div>
        `;
        feed.insertAdjacentHTML('afterbegin', newReportHTML);
    }

    showToast('✅ Отчет отправлен!', 'Фотоотчет успешно доставлен мастеру смены.', 'success');
}

// Модальное окно рассылки
function openBroadcastModal() {
    const modal = document.getElementById('broadcastModal');
    if (modal) modal.style.display = 'flex';
}

function closeBroadcastModal() {
    const modal = document.getElementById('broadcastModal');
    if (modal) modal.style.display = 'none';
}

function sendMassBroadcast() {
    const title = document.getElementById('bcTitle').value;
    const text = document.getElementById('bcText').value;
    closeBroadcastModal();
    showToast(`📢 ${title}`, text, 'error');
}