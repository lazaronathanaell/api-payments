# 💳 API de Pagamentos e Reembolsos

API RESTful desenvolvida como parte de um teste técnico, simulando a criação e gestão de pagamentos via **Pix** e **Cartão de Crédito**, com suporte a **reembolsos parciais e totais**.

---

## 🚀 Tecnologias Utilizadas

- Node.js
- Fastify
- TypeScript
- Zod
- MySQL
- mysql2
- Jest
- Supertest

---

## 📁 Estrutura do Projeto

```
src/
├── app/                 # Instância e rotas do servidor Fastify
├── domain/              # Tipos e entidades
├── infra/               # Repositórios e conexão com banco
├── usecases/            # Casos de uso da aplicação
scripts-create-db/       # Script para criação de tabelas
tests/                   # Testes automatizados
.env                     # Variáveis de ambiente
```

---

## ⚙️ Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone https://github.com/lazaronathanaell/api-payments.git
   cd api-payments
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados:

   - Crie um banco MySQL chamado `payments`
   - Copie o `.env.example` para `.env` e edite:

     ```
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=root
     DB_PASSWORD=sua_senha
     DB_DATABASE=payments
     ```

4. Execute o script de criação de tabelas:
   ```bash
   npm run init-db
   ```

---
## 🧪 Modo Desenvolvedor

```bash
npm run dev
```

## 🚀 Inicializando o Servidor (modo produção)

```bash
npm test
```

## 🧪 Inicalizando o Servidor

```bash
npm start
```

---

## 📌 Endpoints

### Criar Pagamento  
`POST /payments`

```json
{
  "method": "pix" | "credit_card",
  "amount": 100.5,
  "buyer": {
    "name": "Fulano",
    "email": "fulano@example.com"
  },
  "card": {
    "encryptedData": "abc123..." // opcional para Pix
  }
}
```

---

### Buscar Pagamento por ID  
`GET /payments/:id`

---

### Reembolso Parcial  
`POST /payments/:id/refund-partial`

```json
{
  "amount": 50
}
```

---

### Reembolso Total  
`POST /payments/:id/refund`

---

## 🧼 Convenções

- Clean Architecture simplificada
- Separação entre domínio, infraestrutura e aplicação
- Tipagem forte com TypeScript e validação com Zod

---

### ⚠️ Observação

Por limitações de desempenho da minha máquina, o banco de dados **não foi containerizado com Docker**.  
O MySQL foi configurado e executado localmente.  
Se desejar rodar o projeto, certifique-se de ter uma instância do MySQL rodando e devidamente configurada de acordo com o arquivo `.env`.

