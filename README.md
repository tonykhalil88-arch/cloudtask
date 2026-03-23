# ☁️ CloudTask — Full-Stack AWS Task Manager

A serverless full-stack task manager built entirely on AWS. Live and fully functional.

## 🔗 Live Demo
http://cloudtask-frontend-tony.s3-website-ap-southeast-2.amazonaws.com

## 🏗️ Architecture
Browser → S3 (React Frontend)
→ API Gateway (REST API)
→ Lambda (Node.js Functions)
→ RDS PostgreSQL (Private VPC)

## ✨ Features
- Full CRUD — create, update, delete tasks
- Filter by status (To Do, In Progress, Done)
- Priority levels (Low, Medium, High)
- Fully serverless — scales to zero when idle
- Secure — database in private VPC, no public access

## 🛠️ AWS Services Used
| Service | Purpose |
|---|---|
| S3 | Frontend static hosting |
| API Gateway | REST API layer |
| Lambda | Serverless backend functions |
| RDS PostgreSQL | Managed relational database |
| VPC + Subnets | Private network isolation |
| IAM | Least-privilege access control |
| Secrets Manager | Secure credential storage |

## 💻 Tech Stack
- **Frontend**: React, React Query, Axios, Lucide Icons
- **Backend**: Node.js, AWS Lambda
- **Database**: PostgreSQL on Amazon RDS
- **Infrastructure**: AWS CLI, IAM, VPC

## 🚀 How It Works
1. React app served from S3
2. API calls go to API Gateway
3. Gateway triggers Lambda functions
4. Lambda connects to RDS via private VPC
5. Data stored in PostgreSQL

## 👨‍💻 Author
Tony Khalil
