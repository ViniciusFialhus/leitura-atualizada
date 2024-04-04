# Leitura atualizada
  API de biblioteca.

## Rotas


#### Autenticação:

- Rota para realizar login com uma conta do Google:
```
POST: /auth/google
```


#### Gerenciamento de Livros:
- Retorna a lista de todos os livros disponíveis na biblioteca.
```
GET: /books
```

- Busca livros por titulo, autor e genero. substituindo o parâmetro de consulta "q" pelo paramentro pesquisado.
```
 /books/search?q={query}
```
Por exemplo.
```
GET: /books/search?title={query}
GET: /books/search?author={query}
GET: /books/search?genre={query}
```
- Retorna detalhes de um livro específico pelo seu ID.
```
GET: /books/{id}
```
- Adiciona um novo livro à biblioteca. (Apenas para usuario Adinistrador)
```
POST: /books:
```
lembrando que já vamos ter vários livros puxados da api **Google Books APIs**

```
Link da API: https://developers.google.com/books/docs/v1/using?hl=pt-br
```

exemplo de requisição:
```
{
  "isbn": "9780307887436"
}
```
- Atualiza os detalhes de um livro existente. (Apenas para usuario Adinistrador)

```
PUT: /books/{id}
```
- Remove um livro da biblioteca. (Apenas para usuario Adinistrador)
```
DELETE: /books/{id}
```


#### Empréstimo de Livros:

- Solicita empréstimo de um livro disponível na biblioteca.

exemplo de resposta:
```
"bookId": "ID do Livro Solicitado",
"pickupDate": "Data de Retirada do Livro"

```
- Retorna a lista de todas as solicitações de empréstimo. (Apenas para usuario Adinistrador)
```
GET: /loan-requests
```

- Aprova ou reprova uma solicitação de empréstimo. (Apenas para usuario Adinistrador)
```
PUT: /loan-requests/{id}
```
exemplo de requisição:
```
{
  "status": "approved" // ou "rejected"
}

```


#### Perfil de Usuário:

- Retorna as informações do perfil do usuário.
```
GET: /profile
```

- Cria as informações do perfil do usuário.
```
POST: /profile
```
Obs. diferente de cadastrar para realizar o login, já que todos são feitos pelo google.


- Atualiza as informações do perfil do usuário.

```
PUT: /profile
```

exemplo de requisição:

```
{
  "name": "Novo Nome do Usuário",
  "email": "Novo Email do Usuário",
  "phone": "Novo Número de Telefone do Usuário",
  "address": "Nova Endereço do Usuário"
}
```

- Retorna a lista de desejos do usuário.

```
GET: /wishlist
```

-  Adiciona um livro à lista de desejos do usuário.

```
POST: /wishlist
```

exemplo de requisição:

```
{
  "bookId": "ID do Livro a ser Adicionado à Lista de Desejos"
}
```

- Remove um livro da lista de desejos do usuário.

```
DELETE: /wishlist/{id}
```

- Retorna uma URL única para compartilhar a lista de desejos do usuário.

```
GET: /wishlist/share
```



## Funcionalidades


####  Usuarios Cliente

1. Cadastro e login atraves da conta do Google
2. Cadastro e login nativo
3. Atualizar seus dados de usuários
4. Ver todos os livros disponiveis no banco de dados
5. Buscar livro com titulo, autor ou genero
6. Solicitar emprestimos de livros


#### usuarios Administrador

1. Cadastro e login atraves da conta do Google
2. Cadastro e login nativo
3. Atualizar seus dados de usuários
4. Adicionar, editar deletar livros ao banco de dados
5. Ver todos os pedidos de emprestimos
6. Aprovar ou rejeitar eprestimo de livros


## Funcionalidades

- JavaScript
- Node.js
- PostgreSQL
- Nest.js
- Prisma
- Docker