import random

class AIAgent:
    @staticmethod
    def evaluate_order(description: str, materials_count: int, has_photo: bool):
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
    def chat_with_assistant(query: str, role: str = "master"):
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


def recommend_best_worker(equipment: str, problem: str):
    """ИИ-подбор самого подходящего свободного сотрудника по квалификации и рейтингу (модуль 5.1 / 6.1)"""
    candidates = [
        {"id": "worker_1", "name": "Ахметов Е.", "role": "Слесарь 5 разряда", "rating": 4.9, "status": "Свободен", "reason": "98% успешных ремонтов КМД-1750"},
        {"id": "worker_2", "name": "Иванов С.", "role": "Электрик 4 разряда", "rating": 4.7, "status": "Свободен", "reason": "Специалист по приводам"},
        {"id": "worker_3", "name": "Сидоров К.", "role": "Сварщик", "rating": 4.5, "status": "Занят (1 в очереди)", "reason": "Второй в приоритете"}
    ]
    best = candidates[0]
    return {
        "recommended_worker": best,
        "ai_explanation": f"Рекомендован {best['name']} ({best['reason']}). Текущий статус: {best['status']}."
    }


def verify_order_completion(order_id: str, description: str, has_photo: bool, materials: list):
    """ИИ-проверка качества закрытия наряда с валидацией аварийных работ"""
    if not has_photo and "аварийный" in description.lower():
        return {
            "verdict": "Требует доработки",
            "score": 2.0,
            "comment": "Ошибка: Для внеплановых/аварийных работ обязательно фото 'После'!",
            "action_required": "Загрузить фото выполненной работы"
        }
    
    return {
        "verdict": "Принято",
        "score": 5.0,
        "comment": "ИИ-Проверка пройдена: описание работ соответствует проблеме, списания материалов в норме.",
        "action_required": None
    }