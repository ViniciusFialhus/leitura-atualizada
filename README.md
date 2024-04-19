# Leitura Atualizada
  - [Introdução](#introdução)
  - [Tecnologias](#tecnologias)
  - [Instruções](#instruções)
  - [Endpoints](#endpoints)
  - [Variáveis de ambiente](#variáveis-de-ambiente)
  - [Colaboradores](#colaboradores)
## Introdução
Esta API bibliotecária tem a proposta de servir como um sistema disponível a clientes de uma biblioteca, em que um cliente poderá visualizar todos os livros disponíveis da biblioteca e sua disponibilidade, além de criar uma Lista de Desejos com os livros que deseja solicitar, que pode ser compartilhada com qualquer um que tenha o link, independente de ser um outro cliente da biblioteca ou não. Uma conta de funcionário poderá adicionar, deletar e atualizar os livros disponíveis, preenchendo os dados que faltam com os disponíveis no Google Livros, desde que o funcionário possua o ISBN do livro em questão.

A estrutura e organização seguirão os padrões de uma API RESTful, com endpoints específicos para cada funcionalidade. A autenticação será necessária para acessar as funcionalidades de gerenciamento de livros, garantindo a segurança das informações dos usuários e dos livros na plataforma, e tanto clientes como funcionários da biblioteca poderão realizar seu cadastro com um email e senha, ou usando sua conta da Google para fazer login sem dar suas informações pessoais para a API.
## Tecnologias
<div align="center">
<a href="https://www.typescriptlang.org/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/typescript-original.svg" alt="TypeScript" height="80" /></a>  
<a href="https://nestjs.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/nestjs.svg" alt="NestJS" height="80" /></a>  
<a href="https://www.prisma.io/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/prisma.png" alt="Prisma" height="80" /></a>  
<a href="https://www.postgresql.org/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/postgresql-original-wordmark.svg" alt="PostgreSQL" height="80" /></a>  
<a href="https://www.docker.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/docker-original-wordmark.svg" alt="Docker" height="80" /></a>  
<a href="https://nodejs.org/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/nodejs-original-wordmark.svg" alt="Node.js" height="80" /></a>  
</div>

## Instruções
1. Clone o repositório
2. Efetue a integração do banco de dados PostgreSQL em uma plataforma como a [Neon Console](https://console.neon.tech/), ou caso prefira utilizar o Docker para isso, pule essa etapa
3. Crie um arquivo `.env` e dê um valor válido para as variáveis listadas em `.env.example` de acordo com a [tabela](#variáveis-de-ambiente)
4. Instale as dependências localmente ou construa e rode a imagem do projeto no Docker
   - Caso utilize o Docker para rodar o banco de dados, em vez de criar a imagem utilizando o `Dockerfile`, utilize o `docker-compose.yml`

<strong>OBS: Crie diretamente um usuário `admin` no banco, com a propriedade `isAdm: true` para obter controle das funções administrativas do projeto e poder conceder privilégios de administrador para outros usuários</strong>
## Endpoints
<details>
<summary id='autenticação'>Autenticação</summary>

  - `GET /auth/google`

    > Rota de login inicial com a conta Google, que redireciona o usuário para a tela de login do Google via callback. Se o login tiver sucesso, retorna um objeto com o seguinte formato na requisição, que então é utilizado na criação de um novo usuário no banco de dados:

    | Propriedade                | Tipo     | Descrição           |
    |--------------------------|----------|-----------------------|
    |email                     |`string`  |Email do usuário logado|
    |firstName                 |`string`  |Nome do usuário|
    |lastName                  |`string`  |Sobrenome do usuário|
    |picture                   |`string`  |Link com a foto do usuário associada a conta Google|
    |accessToken               |`string`  |Token de acesso validado pelo `Google OAuth`|
    |refreshToken              |`string`  |Token para renovar validação do acesso|
  - `POST /auth/login`

    > Rota de login inicial com usuário cadastrado diretamente na API, sem usar suas credenciais do Google, com email e senha.

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |email                     |`string`  |Email do usuário cadastrado|
    |password                  |`string`  |Senha de usuário cadastrado|

    Exemplo do corpo da requisição:
    ```shell
    {
      "email": "email@mail.com",
      "senha": "###################"
    }
    ```

    Exemplo da resposta:
    ```shell
    {
      "accessToken": "hashedDataString",
      "refreshToken": "hashDataString"
    }
    ```
  - `GET /auth/refresh`

    > Rota de renovação do token de acesso do usuário logado, que precisa ser acessada quando o tempo de validade do JWT enviado como Bearer Token acabar, recebendo o `refreshToken` do usuário, o validando, e retornando um novo `acessToken` válido.

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |refreshToken              |`Bearer Token`  |Token recuperado em login e enviado para pedir um novo token de acesso|

    Exemplo dos `Headers` da requisição:
    ```shell
    {
      'Authorization': 'Bearer YOUR_REFRESH_TOKEN'
    }
    ```
  - `PATCH /auth/promote/:email`

    > Rota que concede privilégios de administrador para um usuário, podendo ser acessada apenas por um outro administrador, e recebendo o email da conta a ser promovida como um parâmetro na URL. Funcionários da biblioteca possuem contas com esse nível de privilégio.

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |email              |`URL Param`  |Email da conta que terá privilégios de administrador|
  - `POST /auth/logout`

    > Rota que desloga o usuário do terminal, invalidando seus tokens de acesso, independente do seu método de login.

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |refresh_token              |`Cookie`  |Token de renovação armazenado como cookie por usuários logados com uma conta do Google|
    |access_token              |`Cookie`  |Token de acesso armazenado como cookie por usuários logados com uma conta do Google|
    |refreshToken              |`Bearer Token`  |Token recuperado em login e enviado nas `Headers` da requisição por usuários logados diretamente|
</details>
<details>
<summary id='usuários'>Usuários</summary>

  - `GET /profile`

    > Rota para recuperar os dados do usuário logado, encontrando ele através do token de acesso fornecido como `Bearer Token`, por usuários logados diretamente, ou `Cookie`, por usuários logados pelo Google.

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |access_token              |`Cookie`  |Token de acesso armazenado como cookie por usuários logados com uma conta do Google|
    |accessToken              |`Bearer Token`  |Token recuperado em login e enviado nas `Headers` da requisição por usuários logados diretamente|

    Exemplo da resposta:
    ```shell
    {
      "id": "id-do-usuário",
      "name": "nome",
      "email": "email@mail.com",
      "isAdm": false,
      "password": "###################",
      "username": "email",
      "createdAt": "2024-04-05T01:23:23.655Z",
      "updatedAt": "2024-04-05T01:23:23.655Z",
      "shareableHash": "####################",
      "refreshToken": null
    }
    ```
  - `POST /profile`
    > Rota de cadastro de um novo usuário, por padrão, com privilégios de cliente da biblioteca. Aceita os seguintes dados:

    | Propriedade              | Tipo     | Obrigatório|Descrição               |
    |--------------------------|----------|------------|------------------------|
    |email                     |`string`  |sim         |Email do usuário a ser cadastrado|
    |password                  |`string`  |sim         |Senha de usuário a ser cadastrado|
    |nome                      |`string`  |sim         |Nome do usuário a ser cadastrado|
    |username                  |`string`  |não         |Nome do perfil a ser cadastrado|

    Exemplo de resposta:
    ```shell
    {
      "id": "id-do-usuário",
      "name": "nome",
      "email": "email@mail.com",
      "password": "###################",
      "username": "email",
      "createdAt": "2024-04-05T01:23:23.655Z",
      "updatedAt": "2024-04-05T01:23:23.655Z",
      "shareableHash": "####################",
      "refreshToken": null
    }
    ```
  - `PUT /profile`
    > Rota de edição dos dados do usuário logado

    | Propriedade              | Tipo     | Obrigatório|Descrição               |
    |--------------------------|----------|------------|------------------------|
    |email                     |`string`  |não         |Email do usuário a ser cadastrado|
    |password                  |`string`  |não         |Senha de usuário a ser cadastrado|
    |nome                      |`string`  |não         |Nome do usuário a ser cadastrado|
    |username                  |`string`  |não         |Nome do perfil a ser cadastrado|

    Exemplo de resposta:
    ```shell
    {
      "id": "id-do-usuário",
      "name": "nome",
      "email": "email@mail.com",
      "isAdm": false,
      "password": "###################",
      "username": "email",
      "createdAt": "2024-04-05T01:23:23.655Z",
      "updatedAt": "2024-04-05T01:23:23.655Z",
      "shareableHash": "####################",
      "refreshToken": null
    }
    ```
  - `GET /wishlist`
    > Rota que retorna a Lista de Desejos do usuário logado

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |access_token              |`Cookie`  |Token de acesso armazenado como cookie por usuários logados com uma conta do Google|
    |accessToken              |`Bearer Token`  |Token recuperado em login e enviado nas `Headers` da requisição por usuários logados diretamente|

    Exemplo de resposta:
    ```shell
    [
      {
        "id": "xxxxxxxxxxx",
        "title": "Book Title",
        "author": "Author",
        "genre": "Genre Name",
        "description": "Lorem ipsum.",
        "isbn": "33333333333333",
        "imgUrl": "http://validlink.com",
        "status": "AVAILABLE",
        "publishedAt": DATETIME,
        "createdAt": DATETIME,
        "updatedAt": DATETIME
      },
      {
        "id": "xxxxxxxxxxx",
        "title": "Book Title",
        "author": "Author",
        (...)
      },
      (...)
    ]
    ```
  - `POST /wishlist`
    >  Rota para adicionar um livro a lista de desejos do usuário logado.

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |access_token              |`Cookie`  |Token de acesso armazenado como cookie por usuários logados com uma conta do Google|
    |accessToken              |`Bearer Token`  |Token recuperado em login e enviado nas `Headers` da requisição por usuários logados diretamente|
    |bookId              |`string`  |Identificdor único do livro|

    Exemplo de requisição:
    ```shell
    {
      "bookId": "ID do Livro a ser Adicionado à Lista de Desejos"
    }
    ```
    Exemplo de resposta:
    ```shell
    {
      "entryId": "18bdf9da-1e2f-4d57-9b45-307b9af5bf4f",
      "userId": "29340d69-9fb5-4e80-ac7a-9ead9332013b",
      "bookId": "f1318591-1fd3-4467-9e4d-58f45d3e81b3"
    }
    ```
  - `DELETE /wishlist/:bookId`
    >  Rota para retirar um livro da Lista de Desejo do usuário logado.

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |access_token              |`Cookie`  |Token de acesso armazenado como cookie por usuários logados com uma conta do Google|
    |accessToken              |`Bearer Token`  |Token recuperado em login e enviado nas `Headers` da requisição por usuários logados diretamente|

    Exemplo de requisição:
    ```shell
    {
      "bookId": "ID do Livro a ser Adicionado à Lista de Desejos"
    }
    ```
  - `GET /wishlist/share`
    >  Rota que gera um novo código de Lista de Desejos para o usuário logado.

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |access_token              |`Cookie`  |Token de acesso armazenado como cookie por usuários logados com uma conta do Google|
    |accessToken              |`Bearer Token`  |Token recuperado em login e enviado nas `Headers` da requisição por usuários logados diretamente|

    Exemplo de resposta:
    ```shell
    https://www.leitura-atualizada.com/{hash}
    ```
  - `GET /:hash`
    >  Rota que acessa a Liste de Desejos pública do usuário cujo código compartilhável é enviado como parâmetro na URL.

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |hash              |`URL Param`  |Conjunto alfanumérico aleatório e individual, ligado a Lista de Desejos do usuário|

    Exemplo de resposta:
    ```shell
    [
      {
        "id": "xxxxxxxxxxx",
        "title": "Book Title",
        "author": "Author",
        "genre": "Genre Name",
        "description": "Lorem ipsum.",
        "isbn": "33333333333333",
        "imgUrl": "http://validlink.com",
        "status": "AVAILABLE",
        "publishedAt": DATETIME,
        "createdAt": DATETIME,
        "updatedAt": DATETIME
      },
      {
        "id": "xxxxxxxxxxx",
        "title": "Book Title",
        "author": "Author",
        (...)
      },
      (...)
    ]
    ```
</details>
<details>
<summary id='livros'>Livros</summary>

  - `GET /books/all`
    >  Rota que retorna todos os livros disponíveis na biblioteca.

    Exemplo de resposta:
    ```shell
    [
      {
        "id": "xxxxxxxxxxx",
        "title": "Book Title",
        "author": "Author",
        "genre": "Genre Name",
        "description": "Lorem ipsum.",
        "isbn": "33333333333333",
        "imgUrl": "http://validlink.com",
        "status": "AVAILABLE",
        "publishedAt": DATETIME,
        "createdAt": DATETIME,
        "updatedAt": DATETIME
      },
      {
        "id": "xxxxxxxxxxx",
        "title": "Book Title",
        "author": "Author",
        (...)
      },
      (...)
    ]
    ```
  - `GET /books/search?q={string}`
    > Rota que retorna um ou mais livros, buscando autores ou títulos que contenham o string informado como um `query param`

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |q              |`Query Param`  |Parâmetro de busca comparativa, podendo representar parte do nome do autor ou do título do livro|

    Exemplo de URL:
    ```shell
    https://leitura-atualizada.rj.r.appspot.com/books/search?q=Neil+Gaiman
    ```

    Exemplo de resposta:
    ```shell
    [
      {
        "title": "American Gods",
        "author": "Neil Gaiman",
        (...)
      },
      {
        "title": "Anansi Boys",
        "author": "Neil Gaiman",
        (...)
      },
      (...)
    ]
    ``` 
  - `GET /books/:id`
    > Rota que retorna um único livro, cujo `id` é informado como parâmetro de URL

    | Propriedade    | Tipo       | Descrição                              |
    |----------------|------------|----------------------------------------|
    |id              |`URL Param` |String representando o id único do livro|

    Exemplo de URL:
    ```shell
    https://www.leituraatualizada.com/books/123
    ```

    Exemplo de resposta:
    ```shell
    {
      "id": "123",
      "title": "Book Title 1",
      (...)
    }
    ```
  - `POST /books`
    > Rota para cadastro de um novo livro no banco de dados, acessível apenas para usuários logados com privilégios de administrador. O funcionário da biblioteca pode inserir dados manualmente e/ou fornecer apenas o ISBN, que populará o restante dos dados do livro com as informações recuperadas da [API Google Books](https://developers.google.com/books/docs/v1/using?hl=pt-br)

    | Propriedade              | Tipo     |Obrigatório |Descrição               |
    |--------------------------|----------|------------|------------------------|
    |title                     |`string`  |não         |Título do livro a ser cadastrado|
    |author                    |`string`  |não         |Autor do livro a ser cadastrado|
    |genre                     |`string`  |não         |Gênero do livro a ser cadastrado|
    |description               |`string`  |não         |Descrição do livro a ser cadastrado|
    |isbn                      |`string`  |preferencial|ISBN do livro a ser cadastrado|
    |imgUrl                    |`string`  |não         |Link da capa do livro a ser cadastrado|
    |access_token              |`Cookie`  |sim         |Token de acesso armazenado como cookie por usuários logados com uma conta do Google|
    |accessToken               |`Bearer Token`| sim    |Token recuperado em login e enviado nas `Headers` da requisição por usuários logados diretamente|

    Exemplo de corpo da requisição:
    ```shell
    {
      "isbn": "333333333333",
      "title": "Jogador n°1",
    }
    ```

    Exemplo de resposta:
    ```shell
    {
      "id": "xxxxxxxxxxx",
      "title": "Jogador n°1",
      "author": "autor retornado da API",
      "genre": "gênero listado na API",
      "description": "Lorem ipsum.",
      "isbn": "333333333333",
      "imgUrl": "link retornado da API",
      "status": "AVAILABLE",
      "publishedAt": DATETIME,
      "createdAt": DATETIME,
      "updatedAt": DATETIME
    }
    ```
  - `PUT /books/:id`
    > Rota para alteração de um livro no banco de dados, acessível apenas para usuários logados com privilégios de administrador, e o funcionário da biblioteca deve inserir os dados manualmente

    | Propriedade              | Tipo     |Obrigatório |Descrição               |
    |--------------------------|----------|------------|------------------------|
    |title                     |`string`  |não         |Título do livro a ser alterado|
    |author                    |`string`  |não         |Autor do livro a ser alterado|
    |genre                     |`string`  |não         |Gênero do livro a ser alterado|
    |description               |`string`  |não         |Descrição do livro a ser alterado|
    |isbn                      |`string`  |não         |ISBN do livro a ser alterado|
    |imgUrl                    |`string`  |não         |Link da capa do livro a ser alterado|
    |id                        |`URL Param`|sim        |String representando o id único do livro|

    Exemplo de corpo da requisição:
    ```shell
    {
      "isbn": "333333333333",
      "title": "Jogador n°2",
    }
    ```

    Exemplo de resposta:
    ```shell
    {
      "id": "123",
      "title": "Book Title 2",
      "isbn": "333333333333"
      (...)
    }
    ```
  - `DELETE /books/:id`
    > Rota que retorna um deleta um livro, cujo `id` é informado como parâmetro de URL e é acessível apenas por usuários com privilégios de administrador

    | Propriedade    | Tipo       | Descrição                              |
    |----------------|------------|----------------------------------------|
    |id              |`URL Param` |String representando o id único do livro|
</details>
<details>
<summary id='empréstimos'>Empréstimos</summary>

  - `POST /loan-requests`
    > Rota para solicitar o empréstimo de um livro disponível na biblioteca para o usuário logado.

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |access_token              |`Cookie`  |Token de acesso armazenado como cookie por usuários logados com uma conta do Google|
    |accessToken               |`Bearer Token`|Token recuperado em login e enviado nas `Headers` da requisição por usuários logados diretamente|
    |bookId                        |`string`|String representando o identificador único do livro|
    
    Exemplo do corpo da requisição:
    ```shell
    {
    "bookId": "ID-do-Livro-Solicitado"
    } 
    ```
    Exemplo de resposta:
    ```shell
    {
      "bookId": "id-do-livro-solicitado",
      "pickupDate": DATETIME
    }
    ```
  - `GET /loan-requests/all`
    >  Rota que retorna todas as solicitações de empréstimo, acessível apenas a usuários com privilégios de administrador

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |access_token              |`Cookie`  |Token de acesso armazenado como cookie por usuários logados com uma conta do Google|
    |accessToken              |`Bearer Token`  |Token recuperado em login e enviado nas `Headers` da requisição por usuários logados diretamente|

    Exemplo de resposta:
    ```shell
    [
      {
        "id": "id-do-empréstimo",
        "userId": "id-do-usuário",
        "bookId": "id-do-livro",
        "pickupDate": DATETIME,
        "dueDate": DATETIME,
        "status": "PENDING",
        "createdAt": DATETIME,
        "updatedAt": DATETIME,
        "user": {
          "name": "nome"
        },
        "book": {
          "title": "título",
          "imgUrl": "http://validlink.com",
        }
      },
      (...)
    ]
    ```
  - `PUT /loan-requests/:id`
    > Rota para alterar o registro dos empréstimos, usada para aprovar ou rejeitar a solicitação do cliente da biblioteca e acessível apenas por usuários com privilégios de administrador, criando uma data para devolução de 3 dias úteis depois da data de retirada

    | Propriedade              | Tipo     | Descrição               |
    |--------------------------|----------|---------------------------|
    |access_token              |`Cookie`  |Token de acesso armazenado como cookie por usuários logados com uma conta do Google|
    |accessToken               |`Bearer Token`|Token recuperado em login e enviado nas `Headers` da requisição por usuários logados diretamente|
    |status                    |`enum`    |String determinando status do empréstimo, podendo ser `APPROVED`, `REJECTED` ou `OVERDUE`|
    
    Exemplo do corpo da requisição:
    ```shell
    {
      "status": "APPROVED"
    }
    ```
    Exemplo de resposta:
    ```shell
    {
      "id": "id-do-registro-do-empréstimo",
      "userId": "id-do-usuário",
      "bookId": "id-do-livro",
      "pickupDate": DATETIME,
      "dueDate": DATETIME,
      "status": "APPROVED",
      "createdAt": DATETIME,
      "updatedAt": DATETIME
    }
    ```
</details>

## Variáveis de ambiente
| Variável               |  Descrição               |
|------------------------|--------------------------|
|`GOOGLE_CLIENT_ID`      |ID do client do Google OAuth|
|`GOOGLE_CLIENT_SECRET`  |Chave secreta utilizada para acessar o Google OAuth|
|`JWT_SECRET`            |Chave usada para assinar e validar os tokens gerados no login|
|`DATABASE_URL`          |URL da instância onde o banco de dados está lançado, caso seja via Docker, a URL será `postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@postgres:3000/{POSTGRES_DB}?schema={POSTGRES_DB}&sslmode=prefer`|
|`SHADOW_DATABASE_URL`   |URL de um banco de dados local para migrations em ambiente de desenvolvimento|
|`BASE_URL`              | Caminho da URL do projeto, podendo ser localhost:porta ou um link de aplicação em deploy|
|`POSTGRES_USER`              | Nome de usuário para criação do banco de dados em uma imagem no Docker|
|`POSTGRES_PASSWORD`              | Senha para criação do banco de dados em uma imagem no Docker|
|`POSTGRES_DB`              | Nome do banco de dados para criação do banco de dados em uma imagem no Docker|
## Colaboradores
- [Iago Ruas](https://github.com/Iago-Ruas)
- [Alexon Granja](https://github.com/alxngrnj)
- [Luiz Davi](https://github.com/Lzdavi13)
- [Leandro Sousa](https://github.com/LeandroSousaDev)
- [Vinicius Marcos](https://github.com/ViniciusFialhus)
