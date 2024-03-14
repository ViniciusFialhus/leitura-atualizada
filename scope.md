---> Daily: 14:30 <---

TODOS:

- Passport: Luiz & Alexon

- Arquivo Docker: Iago

- Conferencia de Rotas: Leandro [books] & Vinicius [loans & users]

Conferencia geral:

Duvidas:

    - Identificação do que é isbn [ funcionalidade ]
    - JOI ou Class-validator
    - Qual a entrega

Modulos:

    - Auth:
      > POST /auth/google: Rota para realizar login com uma conta do Google.

      > ADM

    - Books:
      > GET /books: Retorna a lista de todos os livros disponíveis na biblioteca.

      > GET /books/search?q={query}: Busca livros por nome ou autor, utilizando o parâmetro de consulta "q".

      > GET /books/{id}: Retorna detalhes de um livro específico pelo seu ID.

      > POST /books: Adiciona um novo livro à biblioteca (apenas para administradores, lembrando que já vamos ter vários livros puxados da api).

        [Exemplo do body:

          {
          "id": "id do livro"
          "title": "Título do Livro",
          "author": "Autor do Livro",
          "genre": "Gênero do Livro",
          "description": "Descrição do Livro",
          "isbn": "ISBN do Livro",
          "imageUrl": "URL da Imagem do Livro`}
          ---> Identificação do que é isbn <---
        ]

      > PUT /books/{id}: Atualiza os detalhes de um livro existente (apenas para administradores).

      > DELETE /books/{id}: Remove um livro da biblioteca (apenas para administradores).

    - Loans:"
      > POST /loan-requests: Solicita empréstimo de um livro disponível na biblioteca (para clientes).
        {
          "bookId": "ID do Livro Solicitado",
          "pickupDate": "Data de Retirada do Livro"
        }

      > GET /loan-requests: Retorna a lista de todas as solicitações de empréstimo (apenas para administradores).

      > PUT /loan-requests/{id}: Aprova ou reprova uma solicitação de empréstimo (apenas para administradores).
        {
          "status": "approved" // ou "rejected"
        }

    - Users:

      > GET /profile: Retorna as informações do perfil do usuário.

      > POST /profile: Cria as informações do perfil do usuário (diferente de cadastrar para realizar o login, já que todos são feitos pelo google).


      > PUT /profile: Atualiza as informações do perfil do usuário.
        {
        "name": "Novo Nome do Usuário",
        "email": "Novo Email do Usuário",
        "phone": "Novo Número de Telefone do Usuário",
        "address": "Nova Endereço do Usuário"
        }

      > GET /wishlist: Retorna a lista de desejos do usuário.

      > POST /wishlist: Adiciona um livro à lista de desejos do usuário.
        {
          "bookId": "ID do Livro a ser Adicionado à Lista de Desejos"
        }

      > DELETE /wishlist/{id}: Remove um livro da lista de desejos do usuário.

      > GET /wishlist/share: Retorna uma URL única para compartilhar a lista de desejos do usuário.
