# 🐦 BirdForum
### A full-stack platform for exploring birds, analyzing audio, and understanding nature through data.

🌐 **Live Frontend Demo**  
👉 https://wonderjiayi.github.io/Mybirdforum/

BirdForum is a nature-inspired full-stack web application where users can **upload bird recordings, browse species, analyze audio, view spectrograms, interact with comments/likes, and explore habitat maps**.  
The system combines **software engineering, ecological data, and biological curiosity** into an interactive digital experience.

---

## 🌿 Features Overview

### 🎤 Audio Upload & Management
- Upload MP3/WAV bird recordings  
- Store metadata & link to species  
- Display waveform (spectrogram supported)  
- Prepared for future acoustic analysis  

---

### ❤️ Real-Time Like System (AJAX)
- Like/unlike instantly without page reload  
- Dynamic like counter  
- “Top Liked Birds” ranking list  

---

### 💬 Comment System (AJAX)
- Add comments & replies  
- Real-time update without refresh  
- Permission check for delete  
- User avatar + relative timestamp  

---

### 🐦 Bird Species Detail Page
- Scientific name, habitat, key info  
- Bird images (with fallback placeholder)  
- User-uploaded audio for this species  
- Like & comment panels  
- Future: frequency curves, ecology metadata  

---

### 🗺️ Habitat & Map Visualization
- Display bird distribution using Leaflet  
- Species markers on map  
- Popup detail preview  
- Filter by habitat/location  

---

### 🔍 Search & Browse System
- Search by bird name  
- Jump directly to Bird Detail page  
- Filters: Wild / Pet / Migratory  
- Pagination with state retention  

---

### 👤 User System
- Login + session tracking  
- Username bar across all pages  
- Planned: personal dashboard (likes, uploads)  

---

## 🧱 Tech Stack

### Backend
- **Spring Boot (MVC)**
- **Hibernate (JPA Implementation)**
- **MySQL**
- Custom DAO Layer (manual repository implementation)

### Frontend
- **JSP + Tailwind CSS**
- **AJAX (Likes & Comments)**
- **React (for GitHub Pages demo)**

### Storage
- Local file storage for audio  
- Database storage for metadata  

---

## 📸 Screenshots

### 🏠 Homepage & Bird Exploration  
<img width="1920" height="879" alt="a7141ffdcab3a995f9a39cc128906c76" src="https://github.com/user-attachments/assets/46b3b8f8-fbd3-494c-a3b9-534126818ab8" />

### 🔊 Audio Player & Spectrogram Analysis  

<img width="1920" height="879" alt="9fe40485a21d54aa706aa1e1e408935e" src="https://github.com/user-attachments/assets/b834c3bc-cf4b-43d4-ae6b-b6d3aec6c2b7" />

### 🗺️ Bird Habitat Distribution Map  
<img width="1878" height="828" alt="74f48dc6eb8384286635c51ef79d7563" src="https://github.com/user-attachments/assets/e4b143d3-9e53-4579-941d-a5a5190b920b" />

---

## 🧪 Future Enhancements
- Spectrogram frequency curve  
- Bird ecology knowledge graph  
- Full user dashboard  
- Admin moderation panel  
- Bird call similarity detection  
- Location-based recommendations  

---

## 📬 Contact
- **Email:** wonderjiayi@gmail.com  
- **LinkedIn:** https://www.linkedin.com/in/jiayi-wang-425726330  

---
