# Documentação do Projeto - Shoten-URL

## Visão Geral
Shoten-URL é um serviço de encurtamento de URLs construído com **NestJS**, utilizando **PostgreSQL** para armazenamento. O serviço inclui autenticação baseada em JWT, lógica de encurtamento de URLs e uma API para os usuários interagirem com URLs encurtadas.

## Pré-requisitos
Antes de rodar o projeto, certifique-se de ter os seguintes itens instalados:
- **Node.js**: Versão `>=18.0.0`

### Instalação do pnpm
```bash
npm install -g pnpm
```

- **Docker**: Versão `>=20.10.0`

## Configuração
### Configuração do Docker
O projeto utiliza **Docker** para gerenciar o banco de dados PostgreSQL.

#### Dockerfile
```dockerfile
FROM postgres
RUN usermod -u 1000 postgres
```

#### Docker Compose
```yaml
version: '3.1'
services:
  db:
    build: .
    container_name: shoten-url-db
    restart: always
    ports:
      - "5432:5432"
    volumes:
      - .docker/dbdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=docker
      - POSTGRES_DB=shoten-url
```

### Variáveis de Ambiente
Crie um arquivo `.env` baseado no arquivo `.env.example`:
```env
PORT=
NODE_ENV=
JWT_SECRET=
EXPIRES_IN=
```

Detalhes das variáveis:
- `PORT`: A porta onde o serviço será executado
- `NODE_ENV`: O ambiente do Node.js (por exemplo, development, production)
- `JWT_SECRET`: A chave secreta utilizada para assinatura dos tokens JWT
- `EXPIRES_IN`: O tempo de expiração do token JWT (exemplo: 1h)

## Documentação da API
### Swagger Documentation
- **URL de Documentação de Autenticação**: `${basepath}/api/docs/auth`
- **URL de Documentação de URLs**: `${basepath}/api/docs/url`

### Passos para Autenticação:
1. **Criar Usuário**
   - Acesse a rota `/api/user` no Swagger de Autenticação
   - Crie um novo usuário fornecendo os dados necessários (email, senha, etc.)

2. **Fazer Login**
   - Acesse a rota `/api/login`
   - Utilize o email e senha criados anteriormente
   - A API retornará um token JWT

3. **Acessar Documentação de URLs**
   - Cole o token JWT na seção de autorização
     - Geralmente, isso é feito no botão "Authorize"
     - Formato: `Bearer SEU_TOKEN_JWT`

## Deploy
### Plataforma de Hospedagem
- **Heroku**: Plataforma de nuvem utilizada para hospedagem da aplicação
- **Método de Deploy**: Heroku CLI
- **Região**: Estados Unidos

### Links de Acesso
- **Documentação de Autenticação**: [https://nestjs-shortenurl-59b92c57a4a8.herokuapp.com/api/docs/auth](https://nestjs-shortenurl-59b92c57a4a8.herokuapp.com/api/docs/auth)
- **Documentação de URLs**: [https://nestjs-shortenurl-59b92c57a4a8.herokuapp.com/api/docs/url](https://nestjs-shortenurl-59b92c57a4a8.herokuapp.com/api/docs/url)

## Dependências
O projeto utiliza as seguintes dependências principais:
- NestJS: Framework para construção do serviço
- PostgreSQL: Banco de dados utilizado para armazenamento
- JWT: Para autenticação de usuários
- bcryptjs: Para hash de senhas

### Instalação de Dependências
```bash
pnpm install
```

## Execução
### Iniciar Banco de Dados
```bash
docker-compose up -d
```

### Iniciar Servidor
```bash
pnpm start:dev
```

## Testes
Para rodar os testes unitários:
```bash
pnpm test:unit
```

## Contato
Em caso de dúvidas ou sugestões, entre em contato:
**Gabriel Muzeti**
- Email: gabriel.muzeti123@gmail.com
