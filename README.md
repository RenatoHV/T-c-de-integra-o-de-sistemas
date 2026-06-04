# api-clima-geo
trabalho universitário 

# API de Agregação de Dados Climáticos e Geográficos

Descrição:
API REST que integra dados de localização (IBGE) e clima (Open-Meteo). Desenvolvida para a disciplina Técnicas de Integração de Sistemas (N703).

Porta padrão: 3000

Como executar:
1. Instale dependências:
   npm install
2. Executar em desenvolvimento:
   npm run dev
   ou produção:
   npm start
3. Testes:
   npm test

Endpoints principais:
- GET /api/v1/health
- GET /api/v1/clima/{nome_cidade}
- GET /api/v1/cidades/{sigla_uf}?limite=10

Observações:
- O nome da cidade pode ser parcial; a API busca ocorrências e seleciona a melhor correspondência (prioriza mesmo nome, caso contrário primeira ocorrência).
- Não são utilizadas coordenadas fixas no código; são obtidas dinamicamente via IBGE.
- Coleção Postman disponível em docs/postman_collection.json

Estrutura do repositório:
/
├── README.md
├── INTEGRANTES.md
├── src/
│   ├── index.js
│   ├── app.js
│   ├── routes/
│   │   ├── health.js
│   │   ├── cidades.js
│   │   └── clima.js
│   └── services/
│       ├── ibgeService.js
│       └── climaService.js
├── tests/
│   ├── clima.test.js
│   └── cidades.test.js
└── docs/
    └── postman_collection.json

Exemplo para teste: curl.exe http://localhost:3000/api/v1/clima/Fortaleza

Resultado: {"nome":"Fortaleza","estado":"CE","clima":{"temperatura":28,"temperatura_min":23,"temperatura_max":33,"condicao":"Parcialmente Nublado","unidades":{"temperatura":"°C"}},"consultado_em":"2026-06-04T20:07:44.951Z"}
