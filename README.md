 # MyBookMyDoctor
 
 ## Project Overview
 **MyBookMyDoctor** is a full-stack appointment booking application that allows users to schedule and manage doctor appointments seamlessly. The application provides a simple, intuitive interface for both patients and administrators to track and manage appointments efficiently. 
 
 Key features include:
 - User registration and login with JWT-based authentication.
 - Browse available doctors and their schedules.
 - Book, cancel, and view appointments.
 - Admin panel to manage users, doctors, and appointments.
 - RESTful APIs for backend services built using Spring Boot.
 - Frontend built using React for a responsive and dynamic UI.
 
 ---
 
 ## Technology Stack
 - **Backend:** Spring Boot (Java)
 - **Frontend:** React.js
 - **Database:** H2 Database (in file mode)
 - **Authentication:** JWT (JSON Web Tokens)
 - **Build Tool:** Maven
 - **Server Port:** 8080
 
 ---
 
 ## H2 Database Configuration
 
 The project uses **H2 Database** in file mode. The configuration is as follows:
 
 ```properties
 spring.datasource.url=jdbc:h2:file:./data/mydb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
 spring.datasource.driver-class-name=org.h2.Driver
 spring.datasource.username=sa
 spring.datasource.password=
 spring.jpa.hibernate.ddl-auto=update
 spring.jpa.show-sql=true
 spring.h2.console.enabled=true
 spring.h2.console.path=/h2-console
 
 ```
## Accessing H2 Console

1. Start the backend server:
```bash
  mvn spring-boot:run
```

2. Open your browser and go to:
```
http://localhost:8080/h2-console
```
3. Use the following credentials to login:
```bash
 Use the following credentials to login:
 Property Value
 JDBC URL jdbc:h2:file:./data/mydb
 Username sa
 Password (leave blank)
```

You will be able to view and manage the database directly from the H2 console.

## Admin Credentials

You can use the following default credentials to access the admin panel:
```bash
Username: admin
Password: admin123
```

## JWT Security

The application uses JWT for authentication:
```
security.jwt.secret=myVerySecretKeyChangeMeToEnvValue
security.jwt.expiration-ms=86400000
```
