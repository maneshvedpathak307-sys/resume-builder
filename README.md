# 📄 Resume Builder

A modern full-stack Resume Builder web application that allows users to create professional, ATS-friendly resumes through a simple step-by-step process.

Users can register, log in, enter their personal and professional information, select a resume template, preview their resume, and download the final resume as a PDF.

---

## 🚀 Project Overview

The Resume Builder provides an easy-to-use interface for creating professional resumes without requiring any design skills.

The application follows a structured 8-step resume creation process and provides multiple resume templates.

---

## ✨ Features

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Forgot Password
- Password Reset
- Remember Me

### 📊 Dashboard

- Total Resumes
- Profile Completion
- Account Status
- Create Resume
- My Resumes
- Analytics
- Logout

### 📝 Resume Builder

Users can create a resume step by step:

1. Personal Information
2. Education
3. Work Experience
4. Skills
5. Projects
6. Certifications
7. Languages
8. Template Selection

### 👤 Personal Information

- Full Name
- Email Address
- Phone Number
- Address
- LinkedIn Profile
- GitHub Profile
- Career Objective

### 🎓 Education

- Degree
- College
- University
- Start Year
- End Year
- CGPA / Percentage
- Multiple Education Entries

### 💼 Work Experience

- Company Name
- Job Title
- Employment Type
- Start Date
- End Date
- Current Job Option
- Responsibilities and Achievements
- Multiple Experience Entries

### 🛠 Skills

- Add Multiple Skills
- Skill Level
- Beginner
- Intermediate
- Advanced
- Expert

### 💻 Projects

- Project Title
- Technology Used
- GitHub Repository Link
- Live Demo Link
- Project Description
- Multiple Projects

### 🏆 Certifications

- Certificate Name
- Issuing Organization
- Issue Date
- Certificate ID
- Certificate URL
- Multiple Certifications

### 🌐 Languages

- Language
- Proficiency Level
- Multiple Languages

### 🎨 Resume Templates

The application provides multiple resume templates:

- Modern
- Professional
- Creative
- Minimal

### 👁 Resume Preview

Users can:

- Preview completed resume
- Edit resume
- Save resume
- Change resume template
- Download PDF
- Return to Dashboard

---

## 🔄 Application Flow

The complete application flow is:

```text
Home Page
   ↓
Login Page
   ↓
Dashboard
   ↓
Create Resume
   ↓
Personal Information
   ↓
Education
   ↓
Work Experience
   ↓
Skills
   ↓
Projects
   ↓
Certifications
   ↓
Languages
   ↓
Template Selection
   ↓
Resume Preview
   ↓
Download PDF
```

---

## 🏗️ Project Architecture

The Resume Builder is developed using a full-stack architecture.

```text
Resume Builder
│
├── Frontend
│   └── React JS
│
├── Backend
│   └── Spring Boot
│
└── Database
    └── MySQL
```

---

## 🛠️ Technology Stack

### Frontend

- React JS
- JavaScript
- HTML5
- CSS3
- Axios
- React Router

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT Authentication
- Maven

### Database

- MySQL

### Development Tools

- Visual Studio Code
- Eclipse / Spring Tool Suite
- Postman
- MySQL
- Git
- GitHub

---

## 📂 Project Structure

```text
resume-builder/
│
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   │
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/resume/
│       │   │       ├── config/
│       │   │       ├── controller/
│       │   │       ├── dto/
│       │   │       ├── entity/
│       │   │       ├── repository/
│       │   │       ├── security/
│       │   │       └── service/
│       │   │
│       │   └── resources/
│       │       └── application.properties
│       │
│       └── test/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── screenshots/
│   ├── 01-home-page.png
│   ├── 02-login-page.png
│   ├── 03-create-account.png
│   ├── 04-forgot-password.png
│   ├── 05-dashboard.png
│   ├── 06-personal.png
│   ├── 07-education.png
│   ├── 08-experience.png
│   ├── 09-Skills.png
│   ├── 10-projects.png
│   ├── 11-certifications.png
│   ├── 12-languages.png
│   ├── 13-template.png
│   └── 14-preview.png
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database

The application uses MySQL to store user and resume information.

### Main Tables

```text
users
roles
personal
education
experience
skills
projects
certifications
languages
```

### Database Relationship

```text
User
 │
 └── Personal
       │
       ├── Education
       ├── Experience
       ├── Skills
       ├── Projects
       ├── Certifications
       └── Languages
```

---

## 🔌 Backend API

### Base URL

```text
http://localhost:8080/api
```

### Authentication

```text
POST /auth/register
POST /auth/login
```

### Personal Information

```text
POST   /personal
GET    /personal/user/{userId}
GET    /personal/{id}
PUT    /personal/{id}
DELETE /personal/{id}
```

### Education

```text
POST   /education
GET    /education/personal/{personalId}
PUT    /education/{id}
DELETE /education/{id}
```

### Work Experience

```text
POST   /experience
GET    /experience/personal/{personalId}
PUT    /experience/{id}
DELETE /experience/{id}
```

### Skills

```text
POST   /skills
GET    /skills/personal/{personalId}
PUT    /skills/{id}
DELETE /skills/{id}
```

### Projects

```text
POST   /projects
GET    /projects/personal/{personalId}
PUT    /projects/{id}
DELETE /projects/{id}
```

### Certifications

```text
POST   /certifications
GET    /certifications/personal/{personalId}
PUT    /certifications/{id}
DELETE /certifications/{id}
```

### Languages

```text
POST   /languages
GET    /languages/personal/{personalId}
PUT    /languages/{id}
DELETE /languages/{id}
```

---

## 🔐 JWT Authentication Flow

The application uses JWT-based authentication.

```text
User Login
    ↓
Backend Validates Credentials
    ↓
JWT Token Generated
    ↓
Frontend Receives Token
    ↓
Token Stored in Frontend
    ↓
Token Sent With API Requests
    ↓
JWT Authentication Filter
    ↓
Backend Validates Token
    ↓
API Request Processed
```

---

## ▶️ How to Run the Project

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd resume-builder
```

### 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE resume_builder;
```

Configure your MySQL username, password, and database details in:

```text
backend/src/main/resources/application.properties
```

### 3. Run Backend

Open a terminal in the project root:

```bash
cd backend
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

Backend will run on:

```text
http://localhost:8080
```

### 4. Run Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

Frontend will run on:

```text
http://localhost:3000
```

---

## 📸 Project Screenshots

### 1. Home Page

![Home Page](screenshots/01-home-page.png)

### 2. Login Page

![Login Page](screenshots/02-login-page.png)

### 3. Create Account

![Create Account](screenshots/03-create-account.png)

### 4. Forgot Password

![Forgot Password](screenshots/04-forgot-password.png)

### 5. Dashboard

![Dashboard](screenshots/05-dashboard.png)

### 6. Personal Information

![Personal Information](screenshots/06-personal.png)

### 7. Education

![Education](screenshots/07-education.png)

### 8. Work Experience

![Work Experience](screenshots/08-experience.png)

### 9. Skills

![Skills](screenshots/09-Skills.png)

### 10. Projects

![Projects](screenshots/10-projects.png)

### 11. Certifications

![Certifications](screenshots/11-certifications.png)

### 12. Languages

![Languages](screenshots/12-languages.png)

### 13. Template Selection

![Template Selection](screenshots/13-template.png)

### 14. Resume Preview

![Resume Preview](screenshots/14-preview.png)

---

## 🎯 Future Enhancements

- Multiple resumes per user
- Resume version management
- Additional professional templates
- AI-powered resume suggestions
- ATS score checking
- Public resume sharing
- Cloud storage
- Email resume functionality

---

## 👨‍💻 Author

**Manesh Vedpathak**

Full Stack Resume Builder

**React JS + Spring Boot + MySQL**

---

## ⭐ Project

If you find this project useful, consider giving it a star on GitHub.