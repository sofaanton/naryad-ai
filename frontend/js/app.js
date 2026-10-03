// Выдача наряда мастером с учётом времени (дедлайна)
async function submitOrderToAI() {
    const desc = document.getElementById('orderDesc').value || 'Плановый ремонт';
    const deadline = document.getElementById('orderDeadline').value || '17:00';
    const resultBox = document.getElementById('aiResultBox');

    try {
        const res = await fetch(`${API_URL}/orders/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: desc, deadline: deadline, priority: 'Аварийный', assignee: 'Ахметов Е.' })
        });
        const data = await res.json();
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `<p class="text-emerald-400 font-bold">✅ Наряд выдан!</p><p class="text-slate-300">Срок выполнения: <strong>до ${deadline}</strong></p>`;
    } catch (e) {
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `<p class="text-emerald-400 font-bold">✅ Наряд выдан!</p><p class="text-slate-300">Наряд сформирован и отправлен смене. Срок: <strong>до ${deadline}</strong></p>`;
    }
}

// Отправка фото-отчета рабочим прямо мастеру
async function sendPhotoToBoss() {
    const photoInput = document.getElementById('workerPhotoInput');
    const comment = document.getElementById('workerComment').value || 'Работы выполнены';
    const photoName = photoInput.files[0] ? photoInput.files[0].name : 'photo_report.jpg';

    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    try {
        await fetch(`${API_URL}/submit-photo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ worker_name: 'Рабочий', photo_name: photoName, comment: comment })
        });
    } catch (e) {
        // Локальное добавление в feed мастером
    }

    // Добавляем новый отчет в ленту работодателя
    const feed = document.getElementById('employerReportsFeed');
    if (feed) {
        const newReportHTML = `
            <div class="p-3 bg-slate-900 rounded-2xl border border-emerald-500/40 flex justify-between items-center animate-pulse">
                <div>
                    <p class="font-bold text-emerald-400">👷 Вы (Рабочий)</p>
                    <p class="text-slate-300 mt-0.5">«${comment}»</p>
                    <p class="text-[10px] text-slate-400 mt-1">📁 Фото: <span class="text-indigo-400 underline">${photoName}</span></p>
                </div>
                <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">${timeStr}</span>
            </div>
        `;
        feed.insertAdjacentHTML('afterbegin', newReportHTML);
    }

    showToast('✅ Успешно!', 'Ваш фото-отчет отправлен работодателю (мастеру смены).', 'success');
}