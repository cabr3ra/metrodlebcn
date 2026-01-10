# 🚇 Metrodle BCN

**Endevina l'estació del dia del Metro de Barcelona!**

Benvingut a **Metrodle BCN**, un joc estil "Wordle" on l'objectiu és endevinar una estació oculta de la xarxa de metro de Barcelona utilitzant pistes basades en la proximitat, línies i característiques de les estacions.



## 🎮 Com Jugar

1.  **Cerca i selecciona una estació** de metro de Barcelona.
2.  Després de cada intent, l'estació seleccionada apareixerà a la llista amb **pistes**:
    *   **Línies**: Si comparteix alguna línia amb l'estació oculta.
    *   **Tipus**: Si és *Subterrània*, *Superfície* o *Elevada*.
    *   **Posició**: Si està al *Centre* de la línia o a un *Extrem*.
    *   **Connexions**: Si té enllaç amb *Bus*, *Tram*, *Rodalies*, *FGC*, etc.
    *   **Distància**: A quants quilòmetres distància física es troba el teu intent de l'estació objectiu.
3.  Utilitza aquestes pistes per afinar el teu proper intent.
4.  Tens **6 intents** per trobar l'estació del dia!

Cada dia a mitjanit (hora Barcelona) hi ha una **nova estació** per descobrir. Tothom juga amb la mateixa estació!

## ✨ Característiques

*   **Identitat Persistente**: No cal registrar-se. El joc recorda qui ets i les teves estadístiques directament al teu navegador i al núvol.
*   **Sincronització al Núvol (Supabase)**:
    *   El teu progrés es guarda automàticament.
    *   Estadístiques globals (ratxa de victòries, percentatge d'encerts).
    *   L'estació del dia és idèntica per a tots els jugadors gràcies al servidor.
*   **Mode Fosc**: Disseny modern i elegant adaptat per no cansar la vista.
*   **Bilingüe**: Disponible en Català i Castellà (configurable).

## 🛠️ Tecnologies

El projecte està construït amb tecnologies modernes per assegurar rendiment i escalabilitat:

*   **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/).
*   **Estils**: [Tailwind CSS v4](https://tailwindcss.com/) per un disseny ràpid i responsive.
*   **Backend & Base de Dades**: [Supabase](https://supabase.com/).
    *   **Auth**: Autenticació anònima automàtica.
    *   **Database**: PostgreSQL amb Row Level Security (RLS) per protegir les dades dels jugadors.
    *   **RPC**: Funcions al servidor per garantir la integritat del joc diari.

## 🚀 Instal·lació Local

Si vols executar aquest projecte al teu ordinador:

1.  **Clona el repositori**:
    ```bash
    git clone https://github.com/cabr3ra/metrodlebcn.git
    cd metrodlebcn
    ```

2.  **Instal·la les dependències**:
    ```bash
    npm install
    ```

3.  **Configura les variables d'entorn**:
    Crea un fitxer `.env` a l'arrel i afegeix les teves claus de Supabase:
    ```env
    VITE_SUPABASE_URL=la_teva_url_de_supabase
    VITE_SUPABASE_ANON_KEY=la_teva_clau_anonima
    ```

4.  **Inicia el servidor de desenvolupament**:
    ```bash
    npm run dev
    ```

5.  Obre el navegador a `http://localhost:3000`.

## 📂 Estructura de Dades

El projecte inclou scripts per generar i mantenir la base de dades a Supabase:
*   `scripts/generate_sql.js`: Genera el fitxer SQL amb l'esquema de la base de dades i les dades de les estacions.
*   `supabase/schema.sql`: El fitxer resultant llest per ser executat a l'Editor SQL de Supabase.

---

Fet amb ❤️ per a Barcelona.
