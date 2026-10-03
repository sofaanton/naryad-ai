import random

class AIAgent:
    @staticmethod
    def evaluate_order(description, materials_count, has_photo):
        """ИИ-проверка закрытого наряда (модуль 6.2 и 6.3)"""
        if not has_photo:
            return {
                "verdict": "NEEDS_REVISION",
                "score": 2.0,
                "feedback": "Отклонено ИИ: отсутствует обязательное фото 'после'."
            }
        
        # Симуляция анализа совпадения текста и материалов
        score = round(random.uniform(4.2, 5.0), 1)
        return {
            "verdict": "ACCEPTED",
            "score": score,
            "feedback": f"ИИ подтверждает выполнение: работы соответствуют описанию, материалы в норме. Качество фото: {score}/5.0"
        }

    @staticmethod
    def chat_with_assistant(query, role):
        """Интеллектуальный ИИ-ассистент мастера/руководителя (модуль 6.7)"""
        query_lower = query.lower()
        if "свободн" in query_lower:
            return "🤖 Сейчас свободны: Ахметов Е. (Слесарь 5 р., рейтинг 4.9) и Ким В. (Сварщик 4 р.)."
        elif "просроч" in query_lower:
            return "⚠️ Внимание! Наряд #140 (Насос Н-2) просрочен на 45 минут. Мастер уведомлен."
        elif "проблем" in query_lower or "аном" in query_lower:
            return "📊 ИИ-анализ: Конвейер К-3 имеет 7 внеплановых остановок за месяц. Рекомендуем проверить соосность привода."
        else:
            return f"🤖 НарядAI Ассистент: Я проанализировал ваш запрос («{query}»). На АО «Костанайские минералы» все системы работают в штатном режиме. Чем еще помочь?"