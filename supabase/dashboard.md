
# Metrodle BCN - Diccionario de Datos del Dashboard

Este documento detalla la estructura y el propósito de los datos recogidos de los usuarios, diseñados para analíticas profundas y mejora del juego.

---

## 1. Nivel de Identidad (Supabase Auth)
Datos automáticos de registro y conexión.

| Variable | Descripción | Información que aporta |
| :--- | :--- | :--- |
| **User ID** | Identificador único universal (UUID). | Diferencia a los jugadores sin guardar sus nombres reales. |
| **Email** | Correo electrónico del usuario. | Canal de comunicación (si el registro está activado). |
| **IP Address** | Dirección IP de la última conexión. | Geolocalización aproximada y prevención de fraude. |
| **User Agent** | Metadatos del navegador y sistema operativo. | Análisis técnico: Balance entre móvil y PC. |

---

## 2. Nivel Histórico (`user_stats`)
Resumen del rendimiento a largo plazo para cada modo de juego.

| Variable | Descripción | Información que aporta |
| :--- | :--- | :--- |
| **mode_id** | El modo de juego ('metrodle' o 'ruta'). | Filtra las estadísticas por experiencia de juego. |
| **games_played** | Total de sesiones iniciadas. | Mide el compromiso (engagement) y el volumen de usuarios. |
| **wins** | Total de juegos completados con éxito. | Mide la habilidad del usuario y la tasa de éxito. |
| **current_streak** | Número de días consecutivos ganando. | Indica la recurrencia activa y la fidelidad. |
| **max_streak** | La mayor racha de victorias de la historia. | Muestra el nivel máximo de compromiso alcanzado. |
| **last_played_date**| Fecha de la última sesión. | Identifica el abandono y la base de usuarios activos. |

---

## 3. Nivel de Sesión (`game_sessions`)
Datos detallados sobre los desafíos diarios específicos.


| Variable | Descripción | Información que aporta |
| :--- | :--- | :--- |
| **date** | Fecha del desafío diario específico. | Relaciona el comportamiento con la dificultad del puzzle. |
| **attempts** | Array de IDs de estaciones intentadas. | **Analítica Profunda:** Muestra el camino que toman los usuarios. |
| **won** | Resultado booleano (Verdadero/Falso). | KPI principal: Tasa de éxito del día. |
| **status** | Estado de la sesión ('started' o 'completed'). | **Índice de Abandono:** Permite saber cuántos se rinden. |
| **error_log** | Array de IDs de estaciones fallidas (Modo Ruta). | **Mapa de Calor:** Identifica los transbordos exactos que confunden. |
| **shares_count** | Contador de clics en los botones de compartir. | **Analítica Viral:** Mide la fricción social y el factor de "presumir". |
| **duration_seconds**| Tiempo total pasado en la sesión. | Clasificaciones de velocidad y validación de dificultad. |
| **created_at** | Marca de tiempo exacta del inicio. | Identifica horas pico y patrones de comportamiento. |

---

## Preguntas Estratégicas del Dashboard
Esta estructura de datos permite responder a:
1. **¿Qué transbordo es el más confuso de Barcelona?** (Frecuencia en `error_log`).
2. **¿Cuál es el Índice de Abandono de hoy?** (Comparar `status = started` vs `status = completed`).
3. **¿Qué desafíos se vuelven virales?** (Picos en `shares_count`).
4. **¿El juego se está volviendo más difícil?** (Tendencia de `duration_seconds` y tasa de `won`).
5. **¿Dónde abandonan los jugadores?** (Analizar `attempts` cuando el `status` es `started` pero no `completed`).
