"""
Aplicação Flask para recomendação de cursos.
Fornece API para busca e filtragem de cursos de diversos níveis acadêmicos.
"""

from flask import Flask, jsonify, request, send_from_directory
from course_data import COURSES, NIVEIS, AREAS, HORARIOS, MODALIDADES, CIDADES, INSTITUICOES

app = Flask(__name__, static_folder="static")


@app.route("/")
def index():
    """Serve a página principal."""
    return send_from_directory("static", "index.html")


@app.route("/static/<path:filename>")
def serve_static(filename):
    """Serve arquivos estáticos."""
    return send_from_directory("static", filename)


@app.route("/api/filtros")
def get_filtros():
    """Retorna todas as opções de filtros disponíveis."""
    return jsonify({
        "niveis": NIVEIS,
        "areas": AREAS,
        "horarios": HORARIOS,
        "modalidades": MODALIDADES,
        "cidades": CIDADES,
        "instituicoes": INSTITUICOES
    })


@app.route("/api/recomendar", methods=["POST"])
def recomendar():
    """
    Recebe os critérios do usuário e retorna cursos recomendados.
    
    Parâmetros esperados (JSON):
    - nivel: string (nível desejado)
    - area: string (área de interesse)
    - assuntos: string (palavras-chave separadas por vírgula)
    - duracao_max: int (duração máxima em meses)
    - horario: string (horário preferido)
    - modalidade: string (presencial, EAD, híbrido)
    - preco_max: float (preço máximo mensal)
    - cidade: string (cidade preferida)
    """
    dados = request.get_json()

    if not dados:
        return jsonify({"erro": "Dados não fornecidos"}), 400

    resultados = filtrar_cursos(dados)
    resultados_pontuados = pontuar_cursos(resultados, dados)

    # Ordena por pontuação (maior primeiro)
    resultados_pontuados.sort(key=lambda x: x["pontuacao"], reverse=True)

    return jsonify({
        "total": len(resultados_pontuados),
        "cursos": resultados_pontuados
    })


def filtrar_cursos(criterios):
    """
    Filtra cursos com base nos critérios fornecidos.
    Retorna apenas cursos que atendem aos filtros obrigatórios.
    """
    resultados = COURSES.copy()

    # Filtro por nível
    nivel = criterios.get("nivel", "").strip()
    if nivel:
        resultados = [c for c in resultados if c["nivel"] == nivel]

    # Filtro por área
    area = criterios.get("area", "").strip()
    if area:
        resultados = [c for c in resultados if c["area"] == area]

    # Filtro por horário
    horario = criterios.get("horario", "").strip()
    if horario:
        resultados = [c for c in resultados if c["horario"] == horario]

    # Filtro por modalidade
    modalidade = criterios.get("modalidade", "").strip()
    if modalidade:
        resultados = [c for c in resultados if c["modalidade"] == modalidade]

    # Filtro por cidade
    cidade = criterios.get("cidade", "").strip()
    if cidade:
        resultados = [c for c in resultados if c["cidade"] == cidade]

    # Filtro por duração máxima
    duracao_max = criterios.get("duracao_max")
    if duracao_max:
        try:
            duracao_max = int(duracao_max)
            resultados = [c for c in resultados if c["duracao_meses"] <= duracao_max]
        except (ValueError, TypeError):
            pass

    # Filtro por preço máximo
    preco_max = criterios.get("preco_max")
    if preco_max:
        try:
            preco_max = float(preco_max)
            resultados = [c for c in resultados if c["preco_mensal"] <= preco_max]
        except (ValueError, TypeError):
            pass

    return resultados


def pontuar_cursos(cursos, criterios):
    """
    Atribui uma pontuação de relevância a cada curso com base
    na correspondência com os assuntos de interesse do usuário.
    """
    assuntos_usuario = criterios.get("assuntos", "").strip().lower()
    palavras_chave = [p.strip() for p in assuntos_usuario.split(",") if p.strip()]

    resultados_pontuados = []

    for curso in cursos:
        pontuacao = 0

        # Pontuação por correspondência de assuntos
        if palavras_chave:
            assuntos_curso = " ".join(curso["assuntos"]).lower()
            nome_curso = curso["nome"].lower()
            descricao_curso = curso["descricao"].lower()

            for palavra in palavras_chave:
                if palavra in assuntos_curso:
                    pontuacao += 3  # Match direto em assuntos
                elif palavra in nome_curso:
                    pontuacao += 2  # Match no nome
                elif palavra in descricao_curso:
                    pontuacao += 1  # Match na descrição

        # Bônus por nota MEC
        pontuacao += curso.get("nota_mec", 0) * 0.5

        # Bônus por curso gratuito (bolsa)
        if curso["preco_mensal"] == 0:
            pontuacao += 2

        curso_resultado = curso.copy()
        curso_resultado["pontuacao"] = round(pontuacao, 1)

        resultados_pontuados.append(curso_resultado)

    return resultados_pontuados


if __name__ == "__main__":
    app.run(debug=True, port=5000)
