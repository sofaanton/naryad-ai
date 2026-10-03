from http.server import HTTPServer, BaseHTTPRequestHandler
import json

# Хранилище отчетов и фото в памяти (для демонстрации на хакатоне)
SHARED_REPORTS = []

class SimpleAIHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if '/api/reports' in self.path:
            response_data = {"reports": SHARED_REPORTS}
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
        except:
            data = {}

        response_data = {}

        if '/api/ai/verify-order' in self.path:
            response_data = {
                "verdict": "ACCEPTED",
                "score": 4.9,
                "feedback": "ИИ подтверждает выполнение: дефект устранен, фотоприложение соответствует нормативам АО «Костанайские минералы»."
            }
        elif '/api/submit-photo' in self.path:
            # Сохранение отчета от рабочего для начальника
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
            response_data = {"status": "success", "message": "Фото успешно отправлено начальнику смены!"}

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
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, SimpleAIHandler)
    print("🚀 Сервер НарядAI запущен на http://localhost:8000")
    httpd.serve_forever()