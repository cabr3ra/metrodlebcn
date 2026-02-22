
# Metrodle BCN - Dashboard Data Dictionary

This document details the structure and purpose of the data collected from users, designed for deep analytics and game improvement.

---

## 1. Identity Level (Supabase Auth)
Automatic connection and registration data.

| Variable | Description | Insights Provided |
| :--- | :--- | :--- |
| **User ID** | Universal Unique ID (UUID). | Distinguishes players without storing real names. |
| **Email** | User's email address. | Communication channel (if registration is enabled). |
| **IP Address** | Last connection IP. | Approximate geolocation and fraud prevention. |
| **User Agent** | Browser and OS metadata. | Technical breakdown: Phone vs PC balance. |

---

## 2. Historical Level (`user_stats`)
Long-term performance summary for each game mode.

| Variable | Description | Insights Provided |
| :--- | :--- | :--- |
| **mode_id** | The game mode ('metrodle' or 'ruta'). | Filters stats by game experience. |
| **games_played** | Total sessions started. | Measures engagement and user volume. |
| **wins** | Total successful game completions. | Measures user skill and success rate. |
| **current_streak** | Number of consecutive days winning. | Indicates active recurrence and loyalty. |
| **max_streak** | All-time highest win streak. | Shows maximum engagement level reached. |
| **last_played_date**| Date of the last session. | Identifies churn and active user base. |

---

## 3. Session Level (`game_sessions`)
Deep data about specific daily challenges.

| Variable | Description | Insights Provided |
| :--- | :--- | :--- |
| **date** | The specific daily challenge date. | Links behavior to specific puzzle difficulty. |
| **attempts** | Array of guessed/found station IDs. | **Deep Analytics:** Shows the path users take. |
| **won** | Boolean result (True/False). | Core KPI: Today's success rate. |
| **error_log** | Array of failed station IDs (Route mode). | **Heatmap:** Identifies the exact confusing transfers. |
| **shares_count** | Integer tracking share button clicks. | **Viral Analytics:** Measures social friction and brag-factor. |
| **duration_seconds**| Total time spent in the session. | Speed rankings and difficulty validation. |
| **created_at** | Exact start timestamp. | Identifies peak traffic hours and behavior patterns. |

---

## Strategic Dashboard Questions
This data structure allows answering:
1. **Which transfer is the most confusing in BCN?** (Check `error_log` frequency).
2. **Which challenges go viral?** (Check `shares_count` peaks).
3. **Is the game getting harder?** (Track `duration_seconds` and `won` rate over time).
4. **Where do players quit?** (Compare `attempts` length vs completion rate).
