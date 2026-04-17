from datetime import datetime, timezone

def calculate_priority_score(task):
    urgency = 0.0
    importance = 0.0

    # Urgencia basada en deadline
    if task.deadline:
        now = datetime.now(timezone.utc)
        diff = (task.deadline - now).total_seconds() / 3600  # horas restantes
        if diff <= 0:
            urgency = 10.0  # vencida
        elif diff <= 24:
            urgency = 9.0
        elif diff <= 72:
            urgency = 7.0
        elif diff <= 168:
            urgency = 5.0
        else:
            urgency = 2.0
    else:
        urgency = 1.0

    # Importancia basada en prioridad manual
    priority_map = {
        'critical': 10.0,
        'high': 7.5,
        'medium': 5.0,
        'low': 2.5,
    }
    importance = priority_map.get(task.priority, 5.0)

    # Score final: 60% importancia + 40% urgencia
    final_score = (importance * 0.6) + (urgency * 0.4)

    task.urgency_score = urgency
    task.importance_score = importance
    task.final_score = final_score
    task.save()

    return task