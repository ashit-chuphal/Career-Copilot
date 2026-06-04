# AI CareerCopilot 🚀

AI CareerCopilot is a full-stack AI-powered career assistant that analyzes resumes against job descriptions using OpenAI, helping candidates understand their role fit, identify skill gaps, improve ATS compatibility, and prepare for interviews.

The platform provides actionable career insights through an intuitive SaaS-style dashboard and maintains a history of previous analyses for future reference.

🌐 **Live Application:** https://careercopilot-alb-2135176287.us-east-1.elb.amazonaws.com

---

## ✨ Features

### AI-Powered Resume Analysis

* Resume vs Job Description matching
* AI-generated Fit Score
* Matching Skills identification
* Missing Skills detection
* Personalized improvement recommendations
* ATS optimization suggestions

### Interview Preparation

* AI-generated interview questions
* Technical and behavioral question generation
* Role-specific interview preparation

### User Management

* Secure JWT Authentication
* User Registration & Login
* Protected Routes
* Session Management

### Resume Processing

* PDF Resume Upload
* Automatic Resume Parsing
* Candidate Information Extraction
* Resume Metadata Detection

### Analysis History

* Persistent analysis storage
* View previous analyses
* Reopen past analysis results
* Delete analysis records
* Timestamped analysis history

### Modern SaaS UI

* Responsive design
* Dark mode dashboard
* Interactive analysis cards
* Professional user experience

### Cloud & DevOps

* Dockerized frontend and backend
* AWS ECR repositories
* AWS ECS Fargate deployment
* Application Load Balancer (ALB)
* AWS Aurora PostgreSQL integration
* AWS Secrets Manager integration
* Infrastructure as Code using Terraform
* GitHub Actions CI/CD pipelines

---

## 🛠 Tech Stack

### Frontend

* React 19
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Icons

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* Bcrypt Password Hashing
* Multer File Uploads

### Database

* PostgreSQL
* Prisma ORM
* AWS Aurora PostgreSQL

### AI Integration

* OpenAI API

### Authentication

* JWT
* Google OAuth (In Progress)

### DevOps & Cloud

* Docker
* Docker Compose
* AWS ECS Fargate
* AWS ECR
* AWS ALB
* AWS Secrets Manager
* CloudWatch Logs
* Terraform
* GitHub Actions

---

## 🏗 System Architecture

```text
User
 │
 ▼
React Frontend (Vite)
 │
 ▼
AWS Application Load Balancer
 │
 ├──────────────► Frontend Container (Nginx)
 │
 ▼
Backend API (Node.js / Express)
 │
 ├──────────────► OpenAI API
 │
 ├──────────────► AWS Secrets Manager
 │
 ▼
Aurora PostgreSQL
```

---

## 📊 Analysis Output

CareerCopilot provides:

* Fit Score (%)
* Matching Skills
* Missing Skills
* Career Advice
* ATS Recommendations
* Interview Questions
* Resume Improvement Suggestions

---

## 🔒 Security Features

* JWT Authentication
* Password Hashing using Bcrypt
* Protected API Endpoints
* Secrets Management via AWS Secrets Manager
* Environment Variable Protection
* Secure Database Connections

---

## 🚀 Local Development

### Clone Repository

```bash
git clone <repository-url>
cd career-copilot
```

### Backend Setup

```bash
cd server

npm install

npx prisma generate

npm run dev
```

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

### Docker Setup

```bash
docker-compose up --build
```

---

## 📦 Infrastructure

Infrastructure is provisioned using Terraform and includes:

* ECS Cluster
* ECR Repositories
* Application Load Balancer
* Security Groups
* CloudWatch Log Groups
* IAM Roles
* AWS Secrets Manager
* Remote Terraform State (S3)
* DynamoDB State Locking

---

## 🔮 Planned Enhancements

* Google OAuth Login
* LinkedIn OAuth Login
* PDF Export of Analysis
* Analysis Comparison Dashboard
* Resume Version Tracking
* Auto Skill Recommendations
* Learning Roadmaps
* Custom Domain & SSL
* WAF Integration
* Auto Scaling
* Monitoring & Alerts

---

## 👨‍💻 Author

Developed by Ashit Chuphal & Hrithika Panchikkal

Software Engineer | AWS | Node.js | React | AI Applications | DevOps

Focused on building scalable cloud-native applications, automation solutions, and AI-powered developer products.
