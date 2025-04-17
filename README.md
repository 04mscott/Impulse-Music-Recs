# 🎵 Impulse – Swipe-Based Music Discovery Using Spotify

> A full-stack music recommendation app that lets users swipe through personalized song suggestions and sync their likes directly to Spotify. Built with React, Spring Boot, and a FastAPI-powered recommendation engine.

---

## 🚀 Demo

🎥 **[Watch the Demo Video](https://www.youtube.com/watch?v=CKNp-Hg_AkI&ab_channel=MasonScott)**  
📌 _Note: This app is still in development. Some features are using hardcoded demo data to simulate final behavior._

---

## 🔧 Development Progress

Frontend (React) [█████████████---------] 85%

Backend (Spring Boot) [██████████------------] 75%

Recommendation Engine [█████████████████████] 99%

---

## 🧠 Core Features

- 🎵 **Swipe-based interface** for music discovery (like/dislike)
- 🔐 **Spotify login required** – users must have a Spotify Premium account
- 📈 **User stats tracking**, dark mode toggle, and interactive settings menu
- ❤️ **Liking a song in the app automatically adds it to your Spotify liked songs**
- 📦 **Fully Dockerized** for seamless deployment on a VPS

---

## 🖥️ Tech Stack

| Layer           | Technology                             |
| --------------- | -------------------------------------- |
| Frontend        | React, SCSS                            |
| Backend API     | Spring Boot (Java)                     |
| Recommendation  | FastAPI (Python), Celery, Redis, MySQL |
| Deployment      | Docker Compose                         |
| Auth / Playback | Spotify Web Playback SDK, OAuth 2.0    |

---

## 🧠 About the Recommendation Engine

The recommendation engine powering Impulse is built using FastAPI and lives in a separate sub-repo:  
🔗 **[Recommendation API Repo](https://github.com/04mscott/Recommendation-API)**

It features:

- Audio embedding via `librosa`
- Semantic similarity search via cosine distance
- Background processing with Celery & Redis
- YouTube fallback for audio preview links

> For full details on how the engine works, see the [Recommendation API README](https://github.com/04mscott/Recommendation-API/blob/main/README.md)

---

## 📌 Notes

- All songs shown in the demo are **hardcoded** to simulate the app flow.
- In the final version, all playback and song data will be dynamically pulled using the Spotify SDK and personalized based on user listening history.
- The system is fully Dockerized and built for modular development across services.

---

## 👤 Author

**Mason Scott**  
Third year CS major (Data Science track), Statistics minor  
University of Maryland – College Park  
🌐 [masonscott.net](https://masonscott.net)  
🐙 [GitHub](https://github.com/04mscott)  
🔗 [LinkedIn](https://www.linkedin.com/in/mason-t-scott/)

---

## 📄 License & Attribution

This app uses the [Spotify Web API](https://developer.spotify.com/documentation/web-api/) and the [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/).  
Impulse is not affiliated with or endorsed by Spotify.

---
