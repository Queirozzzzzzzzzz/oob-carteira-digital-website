# OOB Carteira Digital - Website

Este website faz parte de um projeto para a instituição SENAI sobre gestão de carteirinhas físicas e digitais. Seu objetivo é hospedar a API, além de servir como um sistema de gerenciamento para a administração da escola, permitindo o envio de notificações, cadastro de usuários e cursos, e mais algumas coisas.

## Como rodar o projeto

**Requisitos:**

- Node.js
- npm

**Instruções:**

1. Instale o Node.js e o npm, caso ainda não os tenha em seu computador.
2. Clone este repositório no seu diretório local.
3. Baixe os requisitos:
```bash
npm install
```
5. Exporte os valores de ambiente:

```bash
export MYSQL_HOST="{valor aqui}"
export MYSQL_PASSWORD="{valor aqui}"
export MYSQL_DB="{valor aqui}"
export MYSQL_USER="{valor aqui}"
export JWT_SECRET="{valor aqui}"
export JWT_EXPIRATION_TIME="{valor aqui}"
export JWT_ID="{valor aqui}"
export AUTH_EXPIRATION_TIME="{valor aqui}"
export EMAIL="{valor aqui}"
export EMAIL_PASSWORD="{valor aqui}"
```

5. Rode o projeto em modo de desenvolvimento:

```bash
npm run dev
```

## Website

https://oob-carteira-digital-website.vercel.app
