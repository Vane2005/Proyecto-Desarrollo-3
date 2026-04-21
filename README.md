# 🎟️ VivaEventos — Documentación del Proyecto

Backend del MVP de **VivaEventos**, una plataforma de venta de boletería digital para eventos como conciertos, talleres y conferencias. Construido con arquitectura de microservicios, Clean Architecture, Spring Boot 3.5 y Java 21.

---

## 📦 Repositorios

| Servicio | Repositorio | Responsabilidad |
|---|---|---|
| 👤 User Service | [vivaeventos-user-service](https://github.com/Vane2005/vivaeventos-user-service) | Registro, login y roles |
| 🎪 Event Service | [vivaeventos-event-service](https://github.com/Vane2005/vivaeventos-event-service) | Eventos, tipos de boletas y códigos de descuento |
| 🛒 Order Service | [vivaeventos-order-service](https://github.com/Vane2005/vivaeventos-order-service) | Órdenes de compra y reserva de stock |
| 💳 Payment Service | [vivaeventos-payment-service](https://github.com/Vane2005/vivaeventos-payment-service) | Integración con pasarela de pagos |
| 🎫 Ticket Service | [vivaeventos-ticket-service](https://github.com/Vane2005/vivaeventos-ticket-service) | Generación de boletas digitales con QR y validación en puerta |
| 📧 Notification Service | [vivaeventos-notification-service](https://github.com/Vane2005/vivaeventos-notification-service) | Envío de correos y notificaciones |
| 📊 Dashboard Service | [vivaeventos-dashboard-service](https://github.com/Vane2005/vivaeventos-dashboard-service) | Métricas en tiempo real para el gerente |
| 🌐 API Gateway | [vivaeventos-api-gateway](https://github.com/Vane2005/vivaeventos-api-gateway) | Punto de entrada único y autenticación JWT |
| 🐳 Infra | [vivaeventos-infra](https://github.com/Vane2005/vivaeventos-infra) | Docker Compose global para levantar todo junto |

---

## 🏗️ Arquitectura

El sistema está compuesto por **microservicios independientes**, cada uno con su propia base de datos. La comunicación entre servicios se realiza mediante **mensajería asíncrona con RabbitMQ** o llamadas HTTP enrutadas a través del **API Gateway**. Ningún servicio accede directamente a la base de datos de otro.

```
Cliente / Organizador / Logística
            │
            ▼
      [ API Gateway ]          ← Enrutamiento + validación JWT
            │
   ┌────────┼────────┐
   ▼        ▼        ▼
[User]  [Event]  [Order] ──► [Payment] ──► [Ticket]
                                                │
                                                ▼
                                        [Notification]
                                        [Dashboard]

Mensajería: RabbitMQ
  pago.aprobado     → ticket-service
  boleta.generada   → notification-service
  evento.cancelado  → notification-service
  reserva.expirada  → order-service
```

---

## 🧱 Clean Architecture

Cada microservicio sigue la misma estructura de capas:

```
src/main/java/co/edu/univalle/<servicio>/
├── domain/
│   ├── model/        # Entidades y enums del dominio puro
│   └── port/         # Interfaces (contratos del dominio)
├── application/
│   ├── usecase/      # Casos de uso (lógica de negocio)
│   └── dto/          # Objetos de transferencia de datos
└── infrastructure/
    ├── persistence/  # Entidades JPA y adaptadores de repositorio
    ├── web/          # Controladores REST
    ├── messaging/    # Publicadores y consumidores de RabbitMQ
    └── security/     # JWT y configuración de seguridad
```

---

## 🛠️ Stack tecnológico

| Tecnología | Versión |
|---|---|
| Java | 21 |
| Spring Boot | 3.5.13 |
| Spring Cloud (solo api-gateway) | 2025.0.0 |
| PostgreSQL | 15 |
| RabbitMQ | 3.x |
| Docker / Docker Compose | - |

---

## 🐇 ¿Por qué RabbitMQ?

Los eventos del sistema son transaccionales y puntuales. RabbitMQ es ideal porque:

- Tiene **reintentos automáticos** y **Dead Letter Queue** nativa
- Si el servicio de notificaciones falla, **la compra no se ve afectada** — el mensaje queda en cola
- Es simple de configurar y tiene una **interfaz web de administración** para debug
- Escala bien para los picos de venta que describe el negocio

---

## 🗺️ Contratos de API


> Los contratos completos de cada servicio se documentan en el `README.md` de cada repositorio.

---

## 🗓️ Planificación — Sprints

| Sprint | Meta | Historias |
|---|---|---|
| **Sprint 1** | Usuarios, eventos, catálogo y base del flujo de compra | US-01, US-02, US-03, US-04, US-05, US-06, US-11 + inicio US-07 |
| **Sprint 2** | Pago completo con pasarela real (sandbox), generación de QR y boleta digital | US-07 (cierre), US-08, US-09 |
| **Sprint 3** | Validación en puerta, dashboard de métricas y cancelación de eventos | US-09 (cierre), US-10, US-12, US-13 |

**Velocidad del equipo:** 25 puntos por sprint · 6 integrantes · 3 sprints

---

## 👥 Equipo y asignaciones

| Integrante | Servicios / Historias |
|---|---|
| Santiago | `user-service` + integración pasarela en `payment-service` |
| Alejandro | `event-service` (US-03, US-04, US-11) |
| Vanessa | `order-service` (US-07 completa) |
| Alejandra | `event-service` catálogo (US-05, US-06) + `ticket-service` (US-09) |
| David | `payment-service` flujos de estado (US-08) + `ticket-service` validación (US-10) |
| Miguel | `dashboard-service` (US-12) + `event-service` cancelación (US-13) |

---

## 🚀 Cómo levantar el proyecto completo

```bash
# 1. Clonar el repo de infraestructura
git clone https://github.com/Vane2005/vivaeventos-infra.git
cd vivaeventos-infra

# 2. Levantar todos los servicios
docker compose up -d

# 3. Verificar que todos los servicios estén corriendo
docker compose ps
```

> Ver instrucciones detalladas en el [README de vivaeventos-infra](https://github.com/Vane2005/vivaeventos-infra).

---

## 📋 Convenciones del proyecto

- **Ramas:** `main` para producción, `develop` para integración, `feature/<nombre>` para desarrollo
- **Commits:** mensajes en español, descriptivos: `feat: agregar endpoint de registro`
- **Variables de entorno:** nunca hardcodear credenciales — usar `.env` local (ver `.env.example` en cada repo)
- **Java version:** siempre usar Java 21 (`./mvnw` para ejecutar, no `mvn` global)
