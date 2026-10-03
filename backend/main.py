from http.server import HTTPServer, BaseHTTPRequestHandler
import json

# Хранилище отчетов, нарядов и рассылок в памяти
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

class SimpleAIHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self._set_cors_headers()
        self.end_headers()
        
        if '/api/reports' in self.path:
            response_data = {"reports": SHARED_REPORTS}
        elif '/api/orders' in self.path:
            response_data = {"orders": ORDERS}
        elif '/api/broadcasts' in self.path:
            response_data = {"broadcasts": SHARED_BROADCASTS}
        else:
            response_data = {
                "project": "NaryadAI Enterprise API",
                "company": "АО «Костанайские минералы»",
                "status": "online"
            }
        self.wfile.write(json.dumps(response_data, ensure_ascii=False, indent=2).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except Exception:
            data = {}

        response_data = {}

        # 1. Проверка выполнения и ИИ-вердикт
        if '/api/ai/verify-order' in self.path:
            response_data = {
                "verdict": "ACCEPTED",
                "score": 4.9,
                "feedback": "ИИ подтверждает выполнение: дефект устранен, фотоприложение соответствует нормативам АО «Костанайские минералы»."
            }

        # 2. Создание нового наряда мастером
        elif '/api/orders/create' in self.path:
            new_id = str(140 + len(ORDERS) + 1)
            new_order = {
                "id": new_id,
                "title": data.get("title", "Внеплановый ремонт"),
                "equipment": data.get("equipment", "Конвейер К-3"),
                "site": data.get("site", "Обогатительная фабрика"),
                "assignee": data.get("assignee", "Ахметов Е."),
                "priority": data.get("priority", "Обычный"),
                "status": "Выдан",
                "time": "Только что"
            }
            ORDERS.insert(0, new_order)
            response_data = {"status": "success", "order": new_order, "message": f"Наряд №{new_id} успешно сформирован и отправлен!"}

        # 3. Массовая рассылка notifications смене
        elif '/api/broadcast' in self.path:
            bc_item = {
                "title": data.get("title", "Срочное оповещение"),
                "text": data.get("text", "Всем пройти инструктаж"),
                "priority": data.get("priority", "warning"),
                "time": "Только что"
            }
            SHARED_BROADCASTS.insert(0, bc_item)
            response_data = {"status": "success", "message": "Массовая рассылка успешно доставлена всей смене!"}

        # 4. Отправка фотоотчета
        elif '/api/submit-photo' in self.path:
            worker_name = data.get('worker_name', 'Рабочий')
            photo_info = data.get('photo_name', 'Фото узла')
            comment = data.get('comment', 'Выполнено')
            
            report = {
                "worker": worker_name,
                "photo": photo_info,
                "comment": comment,
                "time": "Только что"
            }
            SHARED_REPORTS.insert(0, report)
            response_data = {"status": "success", "message": "Фото и отчет успешно отправлены начальнику смены!"}

        # 5. ИИ-Чат ассистент
        elif '/api/ai/chat' in self.path:
            query = data.get('query', '').lower()
            if "свободн" in query or "available" in query or "бос" in query:
                reply = "🤖 Свободные специалисты: Ахметов Е. (Слесарь 5 разряд), Ким В. (Электрик), Смирнов Д. (Сварщик 6 разряд)."
            elif "просроч" in query or "overdue" in query or "кешігу" in query:
                reply = "⚠️ Внимание! Наряд #140 (Дробилка КМД-1750) просрочен на 35 минут. Рекомендуется эскалация главному механику."
            elif "хризантем" in query or "минерал" in query:
                reply = "💎 АО «Костанайские минералы» — лидер по добыче и обогащению хризотил-асбеста в Казахстане!"
            else:
                reply = f"🤖 НарядAI Ассистент: Запрос «{query}» обработан. Все системы карьера и обогатительной фабрики работают в штатном режиме."
            response_data = {"reply": reply}
            
        else:
            response_data = {"error": "Endpoint not found"}

        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, SimpleAIHandler)
    print("🚀 Сервер НарядAI запущен на http://localhost:8000")
    httpd.serve_forever()