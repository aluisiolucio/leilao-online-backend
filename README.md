# API de Leilão Online com Lances em Tempo Real

Este repositório contém a aplicação de leilões online desenvolvida como o projeto de Trabalho de Conclusão de Curso (TCC) em Ciência da Computação. Essa API permite a criação e gerenciamento de leilões, em que os lances são realizados em tempo real através do uso de WebSockets. Veja o <a href="https://github.com/aluisiolucio/leilao-online-frontend">Frontend da Aplicação de Leilão Online com Lances em Tempo Real</a> que consome esta API.

## Tecnologias Utilizadas

[![My Skills](https://skillicons.dev/icons?i=nodejs,ts,prisma,docker,postgres)](https://skillicons.dev)

- **WebSockets**: Para comunicação em tempo real.
- **Fastify**: Como backend para gerenciar requisições e lógica de negócios.

## Funcionalidades

- **Gerenciamento de Leilões**: Crie e visualize leilões e seus respectivos lotes, descrições e horários de início e fim.
- **Lances em Tempo Real**: Utiliza WebSockets para permitir que usuários façam e recebam lances em tempo real.
- **Autenticação e Autorização**: Inclui mecanismos para autenticar e autorizar usuários, garantindo que apenas participantes válidos possam fazer lances.

## Como Começar

1. Clone o repositório.
2. Configure o ambiente seguindo as instruções no arquivo `.env.example`.
3. Execute `docker compose up -d` para subir as instâncias da aplicação e do postgres.

- OBS: Certifique-se de preencher as variáveis de ambiente no arquivo .env.example antes de executar o `docker compose up -d`

## Contribuições

Contribuições são bem-vindas! Se você tiver sugestões de melhorias ou encontrar problemas, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
