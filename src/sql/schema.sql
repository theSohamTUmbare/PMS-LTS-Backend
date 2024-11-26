CREATE TABLE prisoners (
    prisoner_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(10),
    national_id VARCHAR(50),
    entry_date DATE,
    release_date DATE,
    status VARCHAR(20) CHECK (status IN ('Incarcerated', 'Released', 'On Trial', 'Transferred')),
    cell_id INT REFERENCES Cells(cell_id),
    behavior_record JSON,
    medical_history JSON,
    tracking_device_id VARCHAR(60) REFERENCES trackingdevices(device_id)
);  

CREATE TABLE trackingdevices (
    device_id VARCHAR(60) PRIMARY KEY,
    assigned_to VARCHAR(10) CHECK (assigned_to IN ('Prisoner', 'Guard', 'Police')),
    battery_level INT CHECK (battery_level BETWEEN 0 AND 100),
    signal_status VARCHAR(10) CHECK (signal_status IN ('Strong', 'Weak', 'Lost')),
    status VARCHAR(20) CHECK (status IN ('Active', 'Inactive', 'Malfunctioning'))
);

CREATE TABLE Cells (
    cell_id SERIAL PRIMARY KEY,
    block VARCHAR(10),
    capacity INT,
    current_occupants JSON,
    security_level VARCHAR(10) CHECK (security_level IN ('Low', 'Medium', 'High')),
    guard_assignments JSON
);

CREATE TABLE admins (
  admin_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  username VARCHAR(40) UNIQUE,
  password VARCHAR(100),
  contact_info INTEGER
);

CREATE TABLE staff(
    staff_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(50),
    badge_number INT UNIQUE,
    rank INT,
    department VARCHAR(10),
    contact_info JSON  --information can include number address etc
);

CREATE TABLE staff_approval (
    approval_id SERIAL PRIMARY KEY,
    staff_id INT REFERENCES staff(staff_id) ,
    first_name VARCHAR(50) ,
    last_name VARCHAR(50) ,
    role VARCHAR(10),
    badge_number INT UNIQUE ,
    rank INT,
    department VARCHAR(10),
    contact_info JSON,  
    approval_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by INT REFERENCES admins(admin_id), 
    rejection_reason TEXT  
);

CREATE TABLE geofences (
    geofence_id VARCHAR(60) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    alert_type VARCHAR(20) CHECK (alert_type IN ('Informational', 'Warning', 'Critical')) NOT NULL,
    type VARCHAR(15) CHECK (type IN ('Positive', 'Negative')) NOT NULL,
    shape VARCHAR(15) CHECK (shape IN ('Circle', 'Polygon', 'Rectangle')) NOT NULL,
    radius FLOAT NULL,
    center_lat FLOAT NULL,
    center_lng FLOAT NULL,
    coordinates JSON NULL
);
