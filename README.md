# odoo_LDCE26

An Odoo module and customization repository for LDCE 2026.

## 📌 Project Overview

This repository contains custom Odoo modules, extensions, and configurations developed for the **odoo_LDCE26** project.

---

## 🚀 Features

- Custom Odoo Module Development
- Business Logic Customization & Workflows
- Integrated UI/UX Enhancements for Odoo Apps
- Data Management & Reporting

---

## 🛠️ Prerequisites

Before getting started, ensure you have the following installed on your system:

- **Python** (v3.10+)
- **Odoo** (v16 / v17 / v18 depending on target version)
- **PostgreSQL** database server
- **Git**

---

## 📂 Repository Structure

```text
odoo_LDCE26/
├── custom_addons/       # Custom Odoo modules and addons
├── config/              # Odoo configuration files (odoo.conf)
├── docs/                # Documentation and assets
└── README.md            # Project README file
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Prajapati-Krishna18/odoo_LDCE26.git
cd odoo_LDCE26
```

### 2. Setup Virtual Environment

```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

### 3. Configure Odoo

Ensure your `odoo.conf` file includes the path to `custom_addons`:

```ini
[options]
addons_path = /path/to/odoo/addons, /path/to/odoo_LDCE26/custom_addons
db_host = localhost
db_port = 5432
db_user = odoo
db_password = odoo
```

### 4. Run Odoo Server

```bash
odoo-bin -c config/odoo.conf -d odoo_ldce26_db -u custom_module_name
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
