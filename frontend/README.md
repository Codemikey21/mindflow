<div align="center">

# 🧠 MindFlow

### Plataforma Inteligente de Organización Personal y Decisiones

[![Django](https://img.shields.io/badge/Django-5.2-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Swagger](https://img.shields.io/badge/Swagger-Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:8000/api/docs)

> **MindFlow** reduce la sobrecarga mental mediante priorización automática de tareas y un motor inteligente de decisiones. No es un CRUD simple — organiza, analiza, prioriza y recomienda.

</div>

---

## ✨ Funcionalidades principales

| Módulo | Descripción |
|--------|-------------|
| 🔐 **Autenticación** | Registro, login con JWT, protección de rutas |
| 📋 **Gestión de Tareas** | CRUD con priorización automática por urgencia e importancia |
| ⚡ **Algoritmo de Scoring** | Clasifica tareas dinámicamente con score final |
| 🧠 **Motor de Decisiones** | Evalúa opciones por peso, impacto y riesgo |
| 📊 **Dashboard Inteligente** | Resumen diario, alertas y actividad reciente |
| 🤖 **Avatar Asistente** | Tips contextuales por sección |
| 📡 **Swagger UI** | Documentación completa en `/api/docs/` |
| ✅ **Tests Unitarios** | 7 tests cubriendo auth, tasks y decisions |

---

## 🏗️ Arquitectura

```
mindflow/
├── backend/                  # Django REST API
│   ├── authentication/       # Registro, login, JWT
│   ├── tasks/                # CRUD + algoritmo de priorización
│   ├── decisions/            # Motor de decisiones
│   └── mindflow_backend/     # Configuración principal
└── frontend/                 # React SPA
    └── src/
        ├── components/       # PrivateRoute, Avatar
        ├── context/          # AuthContext, TaskContext
        ├── pages/            # Login, Register, Dashboard, Tasks, Decisions
        └── services/         # api.js, authService, taskService, decisionService
```

---

## 🚀 Instalación y uso

### Requisitos previos

- Python 3.11+
- Node.js 22+
- MySQL 8.0+
- Git

---

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/Codemikey21/mindflow.git
cd mindflow
```

---

### 2️⃣ Configurar el Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Crear la base de datos en MySQL:

```sql
CREATE DATABASE mindflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Configurar credenciales en `backend/mindflow_backend/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mindflow_db',
        'USER': 'root',
        'PASSWORD': 'tu_contraseña',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

Ejecutar migraciones e iniciar servidor:

```bash
python manage.py migrate
python manage.py runserver
```

✅ Backend corriendo en `http://localhost:8000`

---

### 3️⃣ Configurar el Frontend

```bash
cd frontend
npm install
npm start
```

✅ Frontend corriendo en `http://localhost:3000`

---

## 📡 API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/register/` | Registro de usuario |
| `POST` | `/api/auth/login/` | Login — retorna JWT |
| `POST` | `/api/auth/token/refresh/` | Refrescar token |
| `GET` | `/api/auth/profile/` | Perfil del usuario autenticado |

### Tareas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/tasks/` | Listar todas las tareas |
| `POST` | `/api/tasks/` | Crear tarea con scoring automático |
| `PATCH` | `/api/tasks/{id}/` | Actualizar tarea |
| `DELETE` | `/api/tasks/{id}/` | Eliminar tarea |
| `GET` | `/api/tasks/prioritized/` | Tareas ordenadas por score |
| `GET` | `/api/tasks/daily_summary/` | Resumen del día |

### Decisiones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/decisions/` | Listar decisiones |
| `POST` | `/api/decisions/` | Crear y evaluar decisión |
| `DELETE` | `/api/decisions/{id}/` | Eliminar decisión |

### Documentación
| Endpoint | Descripción |
|----------|-------------|
| `/api/docs/` | Swagger UI interactivo |

---

## 🧪 Tests

```bash
cd backend
python manage.py test
```

```
Ran 7 tests in 3.019s
OK
```

---

## 🌿 Control de versiones

```
main
└── develop
    ├── feature/project-setup
    └── feature/frontend-setup
```

| Commit | Descripción |
|--------|-------------|
| `feat: project structure and django apps setup` | Estructura inicial |
| `feat: django settings configured with MySQL, JWT and CORS` | Configuración Django |
| `feat: custom user model for authentication app` | Modelo de usuario |
| `feat: authentication endpoints with JWT login and register` | Auth completa |
| `feat: tasks app with automatic prioritization algorithm` | App tareas |
| `feat: decisions app with scoring engine and recommendations` | App decisiones |
| `feat: unit tests for authentication, tasks and decisions` | Tests unitarios |
| `feat: frontend complete with React, routing and UI` | Frontend completo |

---

## 👤 Autor

<div align="center">

**Miguel Solano**  
Estudiante de Ingeniería — Universidad Autónoma de Bucaramanga (UNAB)  

[![GitHub](https://img.shields.io/badge/GitHub-Codemikey21-181717?style=for-the-badge&logo=github)](https://github.com/Codemikey21)

</div>