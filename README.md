# FmMusicplayer 🎵

**FmMusicplayer** es una aplicación web moderna para gestionar y reproducir música, creada con Angular, Tailwind CSS, Firebase y la API de Spotify. Permite buscar canciones, crear playlists personalizadas, agregar/eliminar canciones y autenticarse con Google.

---

## 🚀 Características principales

- **Login seguro** con Google (Firebase Auth)
- **Buscador de canciones** con integración a Spotify (API oficial)
- **Playlists personalizadas**: crea, elimina y administra tus listas
- **Agrega/elimina canciones** a tus playlists fácilmente
- **Persistencia en la nube** usando Firestore (Firebase)
- **UI profesional y responsive** (Angular + Tailwind CSS)
- **Notificaciones** y feedback visual
- **Soporte mobile-first**

---

  
## 🛠️ Stack tecnológico

- Angular 16+ (standalone components, signals)
- Tailwind CSS (estilos modernos y mobile-first)
- Firebase (Auth, Firestore)
- Spotify Web API
- Lucide Icons (iconografía)

---

## ⚙️ Requisitos previos

- Node.js 18+
- Angular CLI

  ```bash
  npm install -g @angular/cli
  ```
- Credenciales de Spotify Developer (Client ID y Secret)

## 🔧 Instalación y configuración
1. Clona el repositorio:

  ```bash
  git clone https://github.com/andrescastilla91/fm-musicplayer.git
  cd fm-musicplayer
  ```
2. Instala dependencias:
  ```bash
  npm install
  ```
3. Configura las variables de entorno:
- Crea src/environments/environment.ts con tus credenciales de Firebase y Spotify:
- Pega las credenciales entregadas por el desarrollador

```json
  export const environment = {
    firebase: {
      apiKey: 'TU_API_KEY',
      authDomain: 'TU_DOMINIO.firebaseapp.com',
      projectId: 'TU_PROJECT_ID',
      storageBucket: 'TU_BUCKET.appspot.com',
      messagingSenderId: 'TU_SENDER_ID',
      appId: 'TU_APP_ID',
    },
    spotify: {
      clientId: 'TU_CLIENT_ID',
      clientSecret: 'TU_CLIENT_SECRET',
    }
  };
```
4. Inicia el servidor de desarrollo:
```bash
  ng serve
  ```

## 📁 Estructura básica del proyecto
```
fm-musicplayer/
├── src/
│   ├── app/
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   │   ├── playlists/           # CRUD de playlists
│   │   │   │   ├── song-finder/         # Buscador de canciones
│   │   │   └── home-page/               # Landing page
│   │   ├── shared/                      # Componentes reutilizables
│   │   └── core/                        # Servicios, guards, etc.
│   ├── environments/                    # Configuración de entorno
│   └── styles.scss                      # Tailwind y estilos globales
├── angular.json
├── package.json
└── README.md
```

¡Disfruta creando y escuchando tu música favorita con FmMusicplayer! 🎶