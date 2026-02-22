# Metrodle BCN - Diccionario de Datos de Usuario

Este documento detalla la estructura y el propósito de los datos que se recogen del usuario en la plataforma. La información está organizada en tres niveles de profundidad.

---

## 1. Nivel de Identidad (Supabase Auth)
Datos de registro y conexión gestionados automáticamente por el sistema.

| Variable | Descripción | Información que aporta |
| :--- | :--- | :--- |
| **User ID** | Identificador único universal (UUID). | Permite diferenciar a cada jugador sin usar nombres reales. |
| **Email** | Correo electrónico del usuario. | Canal de comunicación y recuperación de cuenta. |
| **IP Address** | Dirección IP de la última conexión. | Geolocalización aproximada y control de fraude/spam. |
| **User Agent** | Datos del navegador y sistema operativo. | Información técnica: ¿juegan desde iPhone, Android o PC? |

---

## 2. Nivel Histórico (`user_stats`)
Resume el rendimiento acumulado del jugador en cada modo de juego.

| Variable | Descripción | Información que aporta |
| :--- | :--- | :--- |
| **game_id** | Identificador del modo (Metrodle o Ruta). | Diferencia las estadísticas entre los dos juegos. |
| **games_played** | Contador total de partidas iniciadas. | Mide el nivel de compromiso (engagement) del usuario. |
| **wins** | Contador total de partidas ganadas. | Mide la tasa de éxito del jugador. |
| **current_streak** | Racha de días seguidos ganando. | Indica la recurrencia actual del jugador. |
| **max_streak** | Récord histórico de racha. | Muestra el máximo nivel de lealtad alcanzado. |
| **last_played_date** | Fecha de la última partida. | Ayuda a identificar usuarios inactivos. |

---

## 3. Nivel de Sesión (`game_sessions`)
Detalla lo ocurrido en una partida específica de un día concreto.

| Variable | Descripción | Información que aporta |
| :--- | :--- | :--- |
| **date** | Fecha del desafío diario. | Permite analizar el comportamiento en días específicos. |
| **guesses** | Lista (array) de estaciones intentadas. | **Crítico:** Revela qué estaciones son las más difíciles/confusas. |
| **won** | Resultado binario (Sí/No). | Indica si el usuario superó el reto de ese día. |
| **errors** | Fallos cometidos (Solo modo Ruta). | Mide la precisión del usuario al trazar el camino. |
| **duration_seconds** | Tiempo total en resolver el puzzle. | Permite crear rankings de velocidad y detectar bots. |
| **created_at** | Hora exacta de inicio de la partida. | Revela las horas pico de juego durante el día. |

---

## Resumen para Dashboard
Con estos datos integrados, el Dashboard puede responder a:
1. **¿Qué estación es la más difícil del mes?** (Viendo `guesses` en `game_sessions`).
2. **¿Cuál es nuestra tasa de retención?** (Viendo `current_streak` en `user_stats`).
3. **¿A qué hora prefiere jugar la gente?** (Viendo `created_at` en `game_sessions`).
4. **¿Los usuarios prefieren jugar en móvil o PC?** (Viendo `User Agent` en Auth).
