# Project Documentation - Shoten-URL

## Overview
Shoten-URL is a URL shortening service built with **NestJS**, utilizing **PostgreSQL** for storage. The service includes JWT-based authentication, URL shortening logic, and an API for users to interact with shortened URLs. This documentation will guide you through the project's setup, environment variables, dependencies, and configuration.

---

## Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js**: Version `>=18.0.0` (Ensure that `pnpm` is installed).
- **Docker**: Version `>=20.10.0`.

---

## Setup

### Docker Configuration
The project uses **Docker** to manage the PostgreSQL database. The provided `Dockerfile` is based on the official **PostgreSQL** image.

#### Dockerfile
```dockerfile
FROM postgres

RUN usermod -u 1000 postgres
