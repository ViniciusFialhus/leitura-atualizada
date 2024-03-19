'.src/books/users.service.ts'
- usujiro uma mudança no forma de trata o erro, por exemplo na função createUser ao inves de trata o erro com prisma poderia ser criada uma função no repository chamada findUnique e no service essa seria usada para tratar o erro

async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const existingUser = await userRepository.findUnique(createUserDto.email);
    if (existingUser) {
      throw new HttpException('Usuario já existente', HttpStatus.BAD_REQUEST);
    }
    return await userRepository.create({
      data: createUserDto,
    });
  }

  '.src/books/users.service.ts'
  - todas as funções vão precisa de tratamento de erro?
