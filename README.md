# 🎓 EduMatch - Sistema de Recomendação de Cursos

Sistema inteligente de recomendação de cursos acadêmicos que abrange todos os níveis de formação, desde cursos técnicos até pós-doutorado.

🔗 **Acesse o site:** [https://edumatch-course-recommender.onrender.com](https://edumatch-course-recommender.onrender.com)

---

## 📋 Sobre o Projeto

O **EduMatch** é uma aplicação web que ajuda estudantes e profissionais a encontrar o curso ideal com base em suas preferências pessoais. O sistema utiliza um algoritmo de pontuação que ranqueia os cursos por relevância, considerando múltiplos critérios de busca.

### Níveis de Formação Disponíveis

| Nível | Descrição |
|-------|-----------|
| Técnico | Cursos profissionalizantes de curta duração |
| Graduação | Bacharelado, Licenciatura e Tecnólogo |
| Pós-graduação | Especializações e MBAs |
| Mestrado | Mestrado acadêmico e profissional |
| Doutorado | Formação para pesquisa e docência |
| Pós-doutorado | Pesquisa avançada e especializada |

---

## 🚀 Funcionalidades

- **Filtros avançados:** Nível, área de interesse, assuntos, duração, horário, modalidade, preço e cidade
- **Sistema de pontuação:** Algoritmo que ranqueia cursos por relevância com base nos critérios do usuário
- **Busca por palavras-chave:** Pesquise por assuntos específicos (ex: "inteligência artificial, programação")
- **Design responsivo:** Funciona em desktop, tablet e celular
- **Interface intuitiva:** Cards com informações completas de cada curso

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| **Python 3.11** | Linguagem principal do backend |
| **Flask** | Framework web para API REST |
| **Gunicorn** | Servidor WSGI para produção |
| **HTML5** | Estrutura da página |
| **CSS3** | Estilização com design moderno e responsivo |
| **JavaScript (ES6+)** | Interatividade e comunicação com a API |
| **Render** | Hospedagem e deploy contínuo |

---

## 📁 Estrutura do Projeto

```
courserecommender/
├── app.py              # Backend Flask (API de filtros e recomendação)
├── course_data.py      # Base de dados com 32 cursos de todos os níveis
├── requirements.txt    # Dependências Python
├── Procfile            # Configuração para deploy
├── render.yaml         # Configuração do Render
├── .gitignore          # Arquivos ignorados pelo Git
└── static/
    ├── index.html      # Página principal
    ├── styles.css      # Estilos CSS
    └── app.js          # JavaScript frontend
```

---

## ⚙️ Como Executar Localmente

### Pré-requisitos

- Python 3.9 ou superior
- pip (gerenciador de pacotes Python)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/monica1602/courserecommender.git
cd courserecommender

# Instale as dependências
pip install -r requirements.txt

# Execute a aplicação
python app.py
```

Acesse em: **http://127.0.0.1:5000**

---

## 🌐 Deploy no Render

O projeto está configurado para deploy automático no [Render](https://render.com).

### Como foi feito o deploy:

1. Repositório conectado ao Render via GitHub
2. Configurações utilizadas:
   - **Runtime:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`
   - **Plano:** Free

### Deploy automático

A cada `git push` na branch `main`, o Render faz o redeploy automaticamente.

---

## 🔍 Como Funciona o Algoritmo de Recomendação

O sistema utiliza um algoritmo de pontuação em duas etapas:

### 1. Filtragem
Remove cursos que não atendem aos critérios obrigatórios (nível, área, preço máximo, etc.)

### 2. Pontuação
Atribui pontos com base em:
- **+3 pontos** — Palavra-chave encontrada nos assuntos do curso
- **+2 pontos** — Palavra-chave encontrada no nome do curso
- **+1 ponto** — Palavra-chave encontrada na descrição
- **+0.5 × nota** — Bônus pela nota MEC do curso
- **+2 pontos** — Bônus para cursos gratuitos (com bolsa)

Os cursos são ordenados da maior para a menor pontuação.

---

## 📊 API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Página principal |
| GET | `/api/filtros` | Retorna opções de filtros disponíveis |
| POST | `/api/recomendar` | Recebe critérios e retorna cursos recomendados |

### Exemplo de requisição POST `/api/recomendar`:

```json
{
  "nivel": "Graduação",
  "area": "Tecnologia",
  "assuntos": "programação, inteligência artificial",
  "duracao_max": 48,
  "horario": "Noturno",
  "modalidade": "Presencial",
  "preco_max": 2000,
  "cidade": "São Paulo"
}
```

---

## 👩‍💻 Autora

Desenvolvido por **Monica** — [GitHub](https://github.com/monica1602)

---

## 📄 Licença

Este projeto é de uso livre para fins educacionais e pessoais.
