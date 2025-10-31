# 🚍 Service Request App

A **full-stack service request application** for a coach company where customers can submit trip requests and coordinators can manage them efficiently.

---

## 🚀 Features

### Customer

* Submit trip requests with:

  * Name & Phone Number
  * Pickup & Dropoff Locations
  * Pickup Time
  * Number of Passengers
  * Additional Notes

### Coordinator

* Admin Panel with Login
* View and manage service requests
* Approve, reject, or schedule requests
* Assign drivers and vehicles
* Search requests by name or phone number

---

## 🛠 Tech Stack

* **Frontend:** React.js with Tailwind CSS
* **Backend:** Node.js with Express
* **Database:** MySQL
* **Containerization:** Docker & Docker Compose

---

## 📦 Setup

### Prerequisites

* [Docker](https://www.docker.com/) & Docker Compose

### Quick Start

```bash
git clone <your-repo-url>
cd service-request-app
docker compose up --build
```

### Access

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **phpMyAdmin:** [http://localhost:8080](http://localhost:8080)

**Admin Login:**

* Email: `admin@gmail.com`
* Password: `admin123`

---

## 🗄 Database Tables

* `contact_messages` – customer messages
* `drivers` – available drivers
* `service_requests` – customer trip requests
* `users` – admin/ users
* `vehicles` – available vehicles

---
