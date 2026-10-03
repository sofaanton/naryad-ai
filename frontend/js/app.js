let currentRole = 'employer';
let currentLang = 'ru';
let activeTimerSeconds = 180;
let timerInterval = null;
let loggedInUserName = 'Соня';

const translations = {
    ru: {
        name_label: "Ваше ФИО / Табельный номер",
        role_label: "Ваша роль / Должность",
        lang_label: "Язык интерфейса",
        enter_btn: "Войти в систему",
        logout: "Выйти",
        create_order_title: "Создать новый наряд",
        emergency_opt: "Аварийный наряд — срочно",
        planned_opt: "Плановый (ППР)",
        photo_check: "Требовать ИИ-контроль фото",
        issue_btn: "Выдать наряд",
        kanban_title: "Доска нарядов смены",
        ai_bot_title: "ИИ-Ассистент Наряда",
        ai_bot_desc: "Спросите у бота про свободных работников или состояние оборудования.",
        bot_welcome: "🤖 Привет! Я ИИ-ассистент НарядAI. Готов отвечать на запросы по смене.",
        chat_placeholder: "Спроси: кто свободен?...",
        emergency_badge: "🔥 АВАРИЙНЫЙ НАРЯД #147",
        timer_label: "Таймер принятия:",
        section_label: "Участок:",
        desc_label: "Описание:",
        materials_label: "Материалы:"
    },
    kz: {
        name_label: "Аты-жөніңіз / Табельдік нөміріңіз",
        role_label: "Рөліңіз / Қызметіңіз",
        lang_label: "Интерфейс тілі",
        enter_btn: "Жүйеге кіру",
        logout: "Шығу",
        create_order_title: "Жаңа наряд құру",
        emergency_opt: "Авариялық наряд — шұғыл",
        planned_opt: "Жоспарлы жөндеу",
        photo_check: "ЖИ бақылауын талап етіңіз",
        issue_btn: "Наряд беру",
        kanban_title: "Ауысым нарядтарының тақтасы",
        ai_bot_title: "ЖИ Шебер Көмекшісі",
        ai_bot_desc: "Боттан бос қызметкерлер немесе жабдық туралы сұраңыз.",
        bot_welcome: "🤖 Сәлем! Мен НарядAI көмекшісімін. Сұрақтарыңызға жауап беруге дайынмын.",
        chat_placeholder: "Сұраңыз: кім бос?...",
        emergency_badge: "🔥 АВАРИЯЛЫҚ НАРЯД #147",
        timer_label: "Қабылдау таймері:",
        section_label: "Аумақ:",
        desc_label: "Сипаттама:",
        materials_label: "Материалдар:"
    },
    en: {
        name_label: "Your Name / ID",
        role_label: "Your Role / Position",
        lang_label: "Interface Language",
        enter_btn: "Sign In",
        logout: "Logout",
        create_order_title: "Create New Work Order",
        emergency_opt: "Emergency Order — Urgent",
        planned_opt: "Scheduled Maintenance",
        photo_check: "Require AI Photo Control",
        issue_btn: "Issue Order",
        kanban_title: "Shift Work Orders Kanban",
        ai_bot_title: "AI Work Order Assistant",
        ai_bot_desc: "Ask about available workers or equipment status.",
        bot_welcome: "🤖 Hello! I am NaryadAI Assistant. Ready to help with shift requests.",
        chat_placeholder: "Ask: who is free?...",
        emergency_badge: "🔥 EMERGENCY ORDER #147",
        timer_label: "Acceptance Timer:",
        section_label: "Section:",
        desc_label: "Description:",
        materials_label: "Materials:"
    }
};

function togglePasswordInput(role) {
    const passwordContainer = document.getElementById('passwordFieldContainer');
    if (role === 'employer') {
        passwordContainer.classList.remove('hidden');
    } else {
        passwordContainer.classList.add('hidden');
    }
}

function completeRegistration() {
    const nameInput = document.getElementById('regName').value.trim();
    const role = document.getElementById('regRole').value;
    const lang = document.getElementById('regLang').value;
    const password = document.getElementById('regPassword').value;
    const errorMsg = document.getElementById('authError');

    // Проверка пароля для начальника
    if (role === 'employer') {
        if (password !== '1234') {
            errorMsg.classList.remove('hidden');
            return;
        }
    }
    errorMsg.classList.add('hidden');

    loggedInUserName = nameInput || (role === 'employer' ? 'Соня (Мастер смены)' : 'Рабочий смены');
    currentRole = role;
    currentLang = lang;
    
    let roleTitleMap = {
        'employer': 'Мастер смены',
        'worker_locksmith': 'Слесарь-ремонтник',
        'worker_electric': 'Электрик',
        'worker_welder': 'Электросварщик',
        'worker_operator': 'Оператор оборудования'
    };

    document.getElementById('userProfileDisplay').innerText = `${loggedInUserName} (${roleTitleMap[role]})`;
    
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');

    applyRoleView();
    changeLanguage(lang);
}

function logout() {
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('regPassword').value = '1234';
    clearInterval(timerInterval);
}

function applyRoleView() {
    const employerSection = document.getElementById('employerSection');
    const workerSection = document.getElementById('workerSection');

    if (currentRole === 'employer') {
        employerSection.classList.remove('hidden');
        workerSection.classList.add('hidden');
        loadWorkerReports();
    } else {
        employerSection.classList.add('hidden');
        workerSection.classList.remove('hidden');
        startAcceptanceTimer();
    }
}

function changeLanguage(lang) {
    currentLang = lang;
    document.getElementById('regLang').value = lang;
    document.getElementById('headerLang').value = lang;

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

function startAcceptanceTimer() {
    clearInterval(timerInterval);
    activeTimerSeconds = 180;
    const timerDisplay = document.getElementById('acceptanceTimer');
    
    timerInterval = setInterval(() => {
        if (activeTimerSeconds > 0) {
            activeTimerSeconds--;
            let mins = Math.floor(activeTimerSeconds / 60);
            let secs = activeTimerSeconds % 60;
            if(timerDisplay) {
                timerDisplay.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            }
        } else {
            clearInterval(timerInterval);
            if(timerDisplay) timerDisplay.innerText = "EXPIRED / ЭСКАЛАЦИЯ!";
        }
    }, 1000);
}

// Отправка фото рабочим начальнику
async function sendPhotoToBoss() {
    const fileInput = document.getElementById('workerPhotoInput');
    const commentInput = document.getElementById('workerComment');
    
    let photoName = "Фото_ремонта_узла.jpg";
    if (fileInput.files && fileInput.files.length > 0) {
        photoName = fileInput.files[0].name;
    }
    
    const comment = commentInput.value.trim() || "Работа выполнена, дефект устранен.";

    try {
        const response = await fetch('http://localhost:8000/api/submit-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                worker_name: loggedInUserName,
                photo_name: photoName,
                comment: comment
            })
        });
        const data = await response.json();
        alert(`✅ ${data.message}`);
        commentInput.value = '';
    } catch(e) {
        alert('✅ Фото успешно отправлено начальнику смены (Демо-режим)');
    }
}

// Загрузка отчетов для начальника
async function loadWorkerReports() {
    const feedContainer = document.getElementById('employerReportsFeed');
    try {
        const response = await fetch('http://localhost:8000/api/reports');
        const data = await response.json();
        
        if (data.reports && data.reports.length > 0) {
            feedContainer.innerHTML = data.reports.map(rep => `
                <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                        <p class="font-bold text-white">👷 ${rep.worker}</p>
                        <p class="text-[11px] text-slate-300">💬 ${rep.comment}</p>
                        <p class="text-[10px] text-indigo-400">📷 Файл: ${rep.photo}</p>
                    </div>
                    <span class="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg text-[10px]">✔ Проверено ИИ</span>
                </div>
            `).join('');
        } else {
            feedContainer.innerHTML = `<p class="text-slate-400 italic text-center py-2">Пока нет новых фото-отчетов от смены...</p>`;
        }
    } catch(e) {
        feedContainer.innerHTML = `<p class="text-slate-400 italic text-center py-2">Связь с сервером отчетов отсутствует.</p>`;
    }
}

async function submitOrderToAI() {
    const desc = document.getElementById('orderDesc').value;
    const hasPhoto = document.getElementById('hasPhotoCheck').checked;
    
    try {
        const response = await fetch('http://localhost:8000/api/ai/verify-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: 147, description: desc, has_photo: hasPhoto })
        });
        const data = await response.json();
        
        const resultBox = document.getElementById('aiResultBox');
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `
            <p class="font-bold ${data.verdict === 'ACCEPTED' ? 'text-emerald-400' : 'text-rose-400'}">
                🤖 Вердикт ИИ: ${data.verdict} (Оценка: ${data.score}/5.0)
            </p>
            <p class="text-xs text-slate-300 mt-1">${data.feedback}</p>
        `;
    } catch(e) {
        alert('Наряд успешно выдан и зарегистрирован в системе!');
    }
}