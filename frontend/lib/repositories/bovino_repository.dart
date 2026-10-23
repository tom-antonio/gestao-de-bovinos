import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/bovino.dart';
import 'usuario_repository.dart';

// O repositório dos livros: como o do usuário, o único que sabe endereço,
// HTTP e JSON. O endereço da API e a RecusaDaApi vêm do usuario_repository.
class BovinoRepository {
  BovinoRepository({http.Client? cliente}) : cliente = cliente ?? http.Client();

  final http.Client cliente;

  // GET /livros/, com o token no cabeçalho, como o quemSouEu: a API devolve só
  // os livros do dono do token. A resposta é uma LISTA em JSON, e cada item
  // vira um Bovino: é o [Bovino.from_json(item) for item in itens] do Python.
  Future<List<Bovino>> listar(String token) async {
    final resposta = await cliente.get(
      Uri.parse('$enderecoDaApi/bovinos/'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (resposta.statusCode != 200) {
      throw RecusaDaApi(resposta.statusCode, _frase(resposta.body));
    }
    final itens = jsonDecode(resposta.body);
    return [for (final item in itens) Bovino.fromJson(item)];
  }

  // GET /livros/{id}: um bovino só, como ele está AGORA no banco. Bovino de
  // outra pessoa, ou que não existe mais, a API responde 404.
  Future<Bovino> buscar(String token, int id) async {
    final resposta = await cliente.get(
      Uri.parse('$enderecoDaApi/bovinos/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (resposta.statusCode != 200) {
      throw RecusaDaApi(resposta.statusCode, _frase(resposta.body));
    }
    return Bovino.fromJson(jsonDecode(resposta.body));
  }

  // POST /livros/: o bovino novo vai em JSON no corpo, como no cadastro da
  // conta, e o token no cabeçalho. A API responde 201 e o bovino criado.
  Future<Bovino> criar(
    String token,
    String nome,
    String raca,
    String nomeMae,
    bool status,
  ) async {
    final resposta = await cliente.post(
      Uri.parse('$enderecoDaApi/bovinos/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'nome': nome,
        'raca': raca,
        'nome_mae': nomeMae,
        'status': status,
      }),
    );
    if (resposta.statusCode != 201) {
      throw RecusaDaApi(resposta.statusCode, _frase(resposta.body));
    }
    return Bovino.fromJson(jsonDecode(resposta.body));
  }

  // PATCH /bovinos/{id}: só o que o formulário edita, o título e o ano. A
  // situação (disponivel) não vai: a API não deixa editá-la pelo catálogo.
  Future<Bovino> atualizar(
    String token,
    int id,
    String nome,
    String raca,
    String nomeMae,
    bool status,
  ) async {
    final resposta = await cliente.patch(
      Uri.parse('$enderecoDaApi/bovinos/$id'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'nome': nome,
        'raca': raca,
        'nome_mae': nomeMae,
        'status': status,
      }),
    );
    if (resposta.statusCode != 200) {
      throw RecusaDaApi(resposta.statusCode, _frase(resposta.body));
    }
    return Bovino.fromJson(jsonDecode(resposta.body));
  }

  // DELETE /bovinos/{id}: a API responde 204, sem corpo nenhum.
  Future<void> excluir(String token, int id) async {
    final resposta = await cliente.delete(
      Uri.parse('$enderecoDaApi/bovinos/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (resposta.statusCode != 204) {
      throw RecusaDaApi(resposta.statusCode, _frase(resposta.body));
    }
  }

  // A frase da recusa, como no UsuarioRepository: o "detail" é um texto (404,
  // 409) ou uma lista, com um item por campo errado (422). O Pydantic põe
  // "Value error, " na frente das mensagens dos validadores da API: sai aqui.
  String _frase(String corpo) {
    final detalhe = jsonDecode(corpo)['detail'];
    if (detalhe is String) {
      return detalhe;
    }
    final primeiro = detalhe[0];
    final mensagem = '${primeiro['msg']}'.replaceFirst('Value error, ', '');
    return '${primeiro['loc'].last}: $mensagem';
  }
}
