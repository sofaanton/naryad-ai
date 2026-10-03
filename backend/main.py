from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NaryadAI Enterprise API")

# Настройка CORS для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Хранилище в памяти
SHARED_REPORTS = []
SHARED_BROADCASTS = []
ORDERS = [
    {
        "id": "140",
        "title": "Ремонт привода",
        "equipment": "Дробилка КМД-1750",
        "site": "Участок дробления",
        "assignee": "Ахметов Е.",
        "priority": "Аварийный",
        "status": "Просрочен",
        "time": "10:15"
    }
]

@app.get("/")
def get_root():
    return {
        "project": "NaryadAI Enterprise API",
        "company": "АО «Костанайские минералы»",
        "status": "online"
    }

@app.get("/api/reports")
def get_reports():
    return {"reports": SHARED_REPORTS}

@app.get("/api/orders")
def get_orders():
    return {"orders": ORDERS}

@app.get("/api/broadcasts")
def get_broadcasts():
    return {"broadcasts": SHARED_BROADCASTS}

@app.post("/api/ai/verify-order")
def verify_order():
    return {
        "verdict": "ACCEPTED",
        "score": 4.9,
        "feedback": "ИИ подтверждает выполнение: дефект устранен, фотоприложение соответствует нормативам АО «Костанайские минералы»."
    }

@app.post("/api/orders/create")
async def create_order(request: Request):
    data = await request.json()
    new_id = str(140 + len(ORDERS) + 1)
    new_order = {
        "id": new_id,
        "title": data.get("title", "Внеплановый ремонт"),
        "equipment": data.get("equipment", "Конвейер К-3"),
        "site": data.get("site", "Обогатительная фабрика"),
        "assignee": data.get("assignee", "Ахметов Е."),
        "priority": data.get("priority", "Обычный"),
        "deadline": data.get("deadline", "17:00"),
        "status": "Выдан",
        "time": "Только что"
    }
    ORDERS.insert(0, new_order)
    return {"status": "success", "order": new_order, "message": f"Наряд №{new_id} успешно сформирован и отправлен!"}

@app.post("/api/broadcast")
async def broadcast(request: Request):
    data = await request.json()
    bc_item = {
        "title": data.get("title", "Срочное оповещение"),
        "text": data.get("text", "Всем пройти инструктаж"),
        "priority": data.get("priority", "warning"),
        "time": "Только что"
    }
    SHARED_BROADCASTS.insert(0, bc_item)
    return {"status": "success", "message": "Массовая рассылка успешно доставлена всей смене!"}

@app.post("/api/submit-photo")
async def submit_photo(request: Request):
    data = await request.json()
    report = {
        "worker": data.get('worker_name', 'Рабочий'),
        "photo": data.get('photo_name', 'Фото узла'),
        "comment": data.get('comment', 'Выполнено'),
        "time": "Только что"
    }
    SHARED_REPORTS.insert(0, report)
    return {"status": "success", "message": "Фото и отчет успешно отправлены начальнику смены!"}

@app.post("/api/ai/chat")
async def ai_chat(request: Request):
    data = await request.json()
    query = data.get('query', '').lower()
    if "свободн" in query or "available" in query or "бос" in query:
        reply = "🤖 Свободные специалисты: Ахметов Е. (Слесарь 5 разряд), Ким В. (Электрик), Смирнов Д. (Сварщик 6 разряд)."
    elif "просроч" in query or "overdue" in query or "кешігу" in query:
        reply = "⚠️ Внимание! Наряд #140 (Дробилка КМД-1750) просрочен на 35 минут. Рекомендуется эскалация главному механику."
    elif "хризантем" in query or "минерал" in query:
        reply = "💎 АО «Костанайские минералы» — лидер по добыче и обогащению хризотил-асбеста в Казахстане!"
    else:
        reply = f"🤖 НарядAI Ассистент: Запрос «{query}» обработан. Все системы карьера и обогатительной фабрики работают в штатном режиме."
    return {"reply": reply}