`.src/books/books.service.ts [10]`
- A linha das props da função poderia ter sido quebrada para melhor legibilidade

`.src/books/books.service.ts [26][32][37][44][53][61][68]`
- Book, escrito com "b" maiúsculo, é o nome da entidade, e não pode ser chamado em PrismaService dessa forma.

`.src/books/books.service.ts [27][39][46][63]`
- Caso o problema citado acima seja consertado, surge um conflito de tipos a ser resolvido.

`.src/books/entities/book.entity.ts [2][3][4][5][6][8]`
- O tipo da propriedade deve ser "string", com "s" minúsculo.

`.src/books/dto/create-book.dto.ts [17][22][29][34][39][44]`
- O tipo da propriedade deve ser "string", com "s" minúsculo.

`.src/books`
- O módulo `books` deve ter uma pasta `repository` para conexão com o banco de dados, e a lógica deve ser revista quando a pasta for implementada, para testagem.