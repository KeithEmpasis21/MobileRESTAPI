# Medicines Directory App

A mobile CRUD application for managing a medicines directory, built with React Native (Expo) and a custom PHP/MySQL REST API.

## Features

- **Full CRUD** on a medicines database (Create, Read, Update, Delete)
- **List and detail views** for browsing medicines
- **Form validation** on add and edit screens
- **Delete confirmation dialog** to prevent accidental removal
- **Live drug information lookup** using a third-party public API

## Tech Stack

- **Frontend**: React Native (Expo), React Navigation, Axios
- **Backend**: PHP + MySQL, hosted on Freehostia
- **Domain**: DuckDNS (medicinesapp.duckdns.org)

## Third-Party Public API

This app integrates the **openFDA Drug Label API**:
https://api.fda.gov/drug/label.json

Used for the Drug Info Lookup screen, which fetches real FDA drug label data (manufacturer, purpose, warnings) for a searched brand name.

## Project Structure

```
medicinesapp/
  App.js
  api/
    api.js            # Custom backend API client
    openFdaApi.js      # openFDA public API client
  screens/
    MedicineListScreen.js
    MedicineDetailScreen.js
    AddMedicineScreen.js
    EditMedicineScreen.js
    DrugLookupScreen.js
  backend/
    api/
      db_config.php
      get_medicines.php
      get_medicine.php
      add_medicine.php
      update_medicine.php
      delete_medicine.php
```

## Backend Setup

The `backend/api` folder contains the PHP scripts used by the live API. To deploy your own copy:

1. Upload the files to a PHP-enabled host.
2. Create a MySQL database using the schema below.
3. Fill in your database credentials in `db_config.php`.

```sql
CREATE TABLE medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    generic_name VARCHAR(150),
    category VARCHAR(100),
    dosage_form VARCHAR(50),
    strength VARCHAR(50),
    description TEXT,
    manufacturer VARCHAR(150),
    price DECIMAL(10,2),
    stock_quantity INT DEFAULT 0,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Running the App

```
npm install
npx expo start
```

Scan the QR code with the Expo Go app on your phone.
