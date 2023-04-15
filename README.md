# **MAIN**
[API ENDPOINT](https://backdrop-km4p.onrender.com/graphql)

[API Documentation](https://documenter.getpostman.com/view/12211966/2s93XyT35t)

## **Setup**

Clone repository

```bash
git clone https://github.com/GabriellaAmah/Back-Test.git
```

Add environment variables

Request for Environment variable values and replace them in the newly created `env` files.

### **Install dependencies**

```bash
npm i 
```
---

## **Running**

Before starting your server ensure that

- Postgres Instance is running
- Dependencies have been installed
- A test account on paystack has been created

```bash
npm run start - prod

npm run start:dev - local
```

## Testing

For both unit and integration tests, run `npm run test`

## Production Deployment

Merging any branch of these repository to master triggers the deployment to production.

# Tools/Stack

NodeJs, PostgresDb
