# Leitura atualizada
  API de biblioteca.

## Rotas


#### Autenticação:

- Rota para o usuário fazer login com sua conta do Google

```
POST: /auth/google
```

- Rota para fazer login:
```
POST: /auth/login
```
- Essa Rota deve receber o e-mail e a senha do usuário

Exemplo de requisição:
```
{
  "e-mail": "marcos@email.com"
  "senha": "Marcos-555"
}
```

- Criar um novo e salva um token para o usuário no banco de dados
```
GET: /auth/refresh
```

- Recebe os dados enviados pelo Google
```
GET: /auth/google/callback
```

- Editar e-mail do usuário
```
PACHT: /auth/promote/{email}
```

- Rota para fazer logout no sistema
```
POST: /auth/logout
```


#### Gerenciamento de Livros:

- Retorna a lista de todos os livros disponíveis na biblioteca.
```
GET: /books/all
```

- Busca livros por título e o autor. Utilizando o parâmetro de consulta query.
```
 GET: /books/search?q={query}
```

- Retorna detalhes de um livro específico pelo seu ID.
```
GET: /books/{id}
```

- Adiciona um novo livro à biblioteca. (Apenas para usuário Administrador)
```
POST: /books:
```

Os livros serão puxados da API **Google Books APIs**
```
Link da API: https://developers.google.com/books/docs/v1/using?hl=pt-br
```

Você deverá enviar no body da requisição o isbn do livro que deseja adicionar ao banco dados

Exemplo de requisição:
```
{
  "isbn": "9780307887436"
}
```

- Rota para atualizar os detalhes de um livro existente. (Apenas para usuário Administrador)

```
PUT: /books/{Id}
```
Exemplo de requisição:
```
{
	"title": "jogador n 1",
	"author": "Ernest Cline",
	"genre": "Dystopias",
	"description": "No ano de 2044, a realidade é um lugar feio. A única ocasião em que o adolescente Wade Watts realmente se sente vivo é quando entra na utopia virtual conhecida como OASIS. Wade dedicou sua vida ao estudo dos quebra-cabeças escondidos nos confins digitais deste mundo - quebra-cabeças baseados na obsessão de seu criador pela cultura pop de décadas passadas e que prometem enorme poder e fortuna para quem conseguir desbloqueá-los. Mas quando Wade se depara com a primeira pista, ele se vê cercado por jogadores dispostos a matar para conquistar o prêmio final. A corrida começou, e se Wade quiser sobreviver, ele terá que vencer - e enfrentar o mundo real do qual sempre esteve tão desesperado para escapar.",
  "isbn": "0553459384",
	"imgUrl": "http://books.google.com/books/content?id=pol1rgEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
	"publishedAt": "2011",
}
```

- Rota para remover um livro da biblioteca. (Apenas para usuário Administrador)

```
DELETE: /books/{id}
```


#### Empréstimo de Livros:

- Rota para Solicitar o empréstimo de um livro disponível na biblioteca.

```
POST: /loan-requests
```

Exemplo de requisição:
```
"bookId": "ID do Livro Solicitado",
```

- Rota que retorna a lista de todas as solicitações de empréstimo. (Apenas para usuário Administrador)
```
GET: /loan-requests/all
```

- Rota para aprovar ou rejeitar uma solicitação de empréstimo. (Apenas para usuário Administrador)
```
PUT: /loan-requests/{id}
```

Exemplo de requisição:
```
{
  "book": "a menina que roubava livros"
  "bookId": "ID do usuario Solicitado"
  "status": "approved" ou "rejected"
}
```

#### Perfil de Usuário:

- Rota que retorna as informações do perfil do usuário.
```
GET: /profile
```

- Rota para cadastrar um novo perfil do usuário.
```
POST: /profile
```

Obs. Diferente de cadastrar para realizar o login, já que todos são feitos pelo Google.

Essa Rota deve receber no body da requisição:

- Name,
- email
- password
- username

Exemplo de requisição:
```
{
  name: Marcos
  email: marcos@email.com
  password: Marcos-555
  username: marcos55
}
```

- Atualiza as informações do perfil do usuário.

```
PUT: /profile/
```

Exemplo de requisição:
```
{
  name: Marcos
  email: marcos@email.com
  isAdm: "True" ou "False"
  password: Marcos-555
  username: marcos55
}
```

#### Lista de Desejos:

- Rota que retorna a lista de desejos do usuário.

```
GET: /wishlist
```

- Rota para adicionar um livro a lista de desejos do usuário.

```
POST: /wishlist
```

Exemplo de requisição:
```
{
  "bookId": "ID do Livro a ser Adicionado à Lista de Desejos"
}
```

- Rota que remove um livro da lista de desejos do usuário.

```
DELETE: /wishlist/{bookId}
```

- Rota que retorna uma URL única para compartilhar a lista de desejos do usuário.

```
GET: /wishlist/share
```

- Rota que traz do banco de dados a hash da lista de desejos do usuário
```
GET: /{hash}
```

## Funcionalidades


####  Usuários Cliente

1. Cadastro e login através da conta do Google
2. Cadastro e login nativo
3. Atualizar seus dados de usuários
4. Ver todos os livros disponíveis no banco de dados
5. Buscar livro com título e autor
6. Solicitar empréstimos de livros
7. cria uma lista de desejos e compartilhá-la com outras pessoas

#### Usuários Administrador

1. Cadastro e login através da conta do Google
2. Cadastro e login nativo
3. Atualizar seus dados de usuários
4. Adicionar, editar deletar livros ao banco de dados
5. Ver todos os pedidos de empréstimos
6. Aprovar ou rejeitar empréstimo de livros

Obs. O usuário administrador também tem acesso às funções que o usuário cliente

## Tecnologias

- JavaScript
- Node.js
- PostgreSQL
- Nest.js
- Prisma
- Docker