# Cartola Championship Backend

Backend para aplicação de campeonato de Cartola desenvolvido com NestJS, TypeScript e MongoDB seguindo Clean Architecture.

## Tecnologias

- NestJS
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Swagger/OpenAPI
- Nodemailer

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/cartola

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@cartola.com

# App
PORT=3000
NODE_ENV=development
```

## Executando a aplicação

```bash
# desenvolvimento
npm run start:dev

# produção
npm run build
npm run start:prod
```

## Documentação

A documentação Swagger estará disponível em `http://localhost:3000/api` quando a aplicação estiver rodando.

## Testes

```bash
# unitários
npm run test

# e2e
npm run test:e2e

# coverage
npm run test:cov
```
