# 🧱 Inventory Microservice Template

Plantilla estructurada de microservicio desarrollada en **Node.js**, utilizando **TypeScript**, **TypeORM**, **PostgreSQL**, **Docker**, y **Swagger**. Diseñada para funcionar en entornos empresariales, escalables, orientados a eventos con integración a **SAP PO**, **EventBridge AWS**, y **VTEX**.

---

## 📌 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Ciclo de Vida de los Procesos](#ciclo-de-vida-de-los-procesos)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Instalación y Setup](#instalación-y-setup)
- [Comandos Útiles](#comandos-útiles)
- [Documentación Swagger](#documentación-swagger)
- [Extensión: Nuevos Módulos](#extensión-nuevos-módulos)
- [Logs y Observabilidad](#logs-y-observabilidad)
- [Autor](#autor)

---

## 🧠 Arquitectura

Este microservicio sigue los principios de **arquitectura limpia** y separación de responsabilidades con enfoque **event-driven**:

- Comunicación mediante eventos entrantes desde **SAP PO**
- Persistencia de cambios en PostgreSQL
- Registro en `EventOutbox` para emisión segura a **AWS EventBridge**
- Logs de cambios en inventario y sincronización
- Emisión de eventos procesada por `main-worker.ts`

---

## 🛠️ Tecnologías

| Tecnología         | Uso                                               |
|--------------------|----------------------------------------------------|
| Node.js + TypeScript | Lógica de negocio y runtime                       |
| Express             | Framework web                                     |
| TypeORM             | ORM con PostgreSQL                                |
| PostgreSQL          | Base de datos persistente                         |
| Docker              | Contenedorización del servicio                    |
| Swagger             | Documentación de API                              |
| Winston             | Logs estructurados                                |
| EventBridge AWS     | Emisión de eventos externos                       |
| SAP PO              | Proveedor de inventario                          |

---

## 🔁 Ciclo de Vida de los Procesos

### 1. Recepción de evento SAP
- Vía `POST /notifications`
- Se recibe `locationCode` y `internalIds`

### 2. Llamado a API SAP PO
- Se consulta la disponibilidad real vía HTTP

### 3. Procesamiento
- Se compara el inventario actual con el nuevo
- Se insertan o actualizan los registros (`Inventory`)
- Se registran logs (`InventoryLog`)
- Se colocan los eventos en la `EventOutbox`

### 4. Emisión de eventos
- El worker `main-worker.ts` procesa la `EventOutbox`
- Emite eventos válidos a EventBridge
- Maneja reintentos si falla

---

## 🗂 Estructura de Carpetas

```
src/
├── app/                          # Casos de uso principales
├── config/                       # Configuración de base de datos
├── domain/ports/                # Contratos (servicios, fuentes de datos)
├── infrastructure/
│   ├── adapters/                # Integraciones (SAP, EventBridge, etc)
│   └── entities/                # Entidades y modelos TypeORM
├── interfaces/api/              # Rutas y controladores
├── shared/                      # Utilidades comunes (logs, middlewares)
├── tools/                       # Scripts auxiliares (swagger, workers)
```

---

## ⚙️ Instalación y Setup

1. Clonar el proyecto

```bash
git clone <REPO_URL>
cd inventory-service
```

2. Instalar dependencias

```bash
npm install
```

3. Crear archivo `.env`

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_password
DB_NAME=inventory_db
API_KEY=secret123
SAP_PO_API_URL=http://sap/api
AWS_REGION=us-east-1
EVENT_BUS_NAME=inventory-events
```

4. Levantar PostgreSQL con Docker

```bash
docker-compose -f docker-compose.db.yml up -d
```

5. Ejecutar migraciones

```bash
npm run migration:run
```

6. Levantar el proyecto

```bash
npm run dev
```

---

## 📘 Documentación Swagger

Generar Swagger:

```bash
npx ts-node src/tools/generate-swagger.ts
```

Ver documentación en:

```
http://localhost:3000/api-docs
```

---

## 🧩 Extensión: Nuevos Módulos

Para agregar un nuevo microservicio o funcionalidad:

1. Crear nueva entidad en `src/infrastructure/entities`
2. Registrar modelo en `data-source.ts`
3. Agregar ruta/controlador en `interfaces/api/controllers`
4. Definir caso de uso en `src/app`
5. Agregar test y documentación Swagger

---

## 📊 Logs y Observabilidad

- Todos los logs están en `logs/` y usan `Winston`
- Se capturan errores, skips, inserts, updates y emisiones de eventos
- Cada proceso (`INIT_LOAD`, `NOTIFICATION`, `EVENT_SEND`) genera su propio log en la tabla `SyncControl`

---

## 🧑‍💻 Autor

Este proyecto fue creado como una **plantilla base estructurada y funcional** por **Sadel Fortunato**, lista para ser reutilizada en la implementación de nuevos microservicios.