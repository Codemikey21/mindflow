def evaluate_options(options):
    scored = []

    for option in options:
        # Score = (impacto * peso) - (riesgo * 0.5)
        score = (option.impact * option.weight) - (option.risk * 0.5)
        option.final_score = round(score, 2)
        option.save()
        scored.append(option)

    # Ordenar de mayor a menor score
    scored.sort(key=lambda x: x.final_score, reverse=True)

    if scored:
        best = scored[0]
        recommendation = (
            f"Se recomienda '{best.name}' con un puntaje de {best.final_score}. "
            f"Tiene el mejor balance entre impacto ({best.impact}) y riesgo ({best.risk})."
        )
    else:
        recommendation = "No hay opciones suficientes para evaluar."

    return recommendation