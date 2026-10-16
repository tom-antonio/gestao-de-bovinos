import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/bovino.dart';
import 'usuario_repository.dart';

// O repositório dos bovinos: como o do usuário, o único que sabe endereço,
// HTTP e JSON. O endereço da API e a RecusaDaApi vêm do usuario_repository.
class BovinoRepository {
  BovinoRepository({http.Client? cliente}) : cliente = cliente ?? http.Client();

  final http.Client cliente;

  // GET /bovinos/, com o token no cabeçalho, como o quemSouEu: a API devolve só
  // os bovinos do dono do token. A resposta é uma LISTA em JSON, e cada item
  // vira um Bovino: é o [Bovino.from_json(item) for item in itens] do Python.
  Future<List<Bovino>> listar(String token) async {
    final resposta = await cliente.get(
      Uri.parse('$enderecoDaApi/bovinos/'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (resposta.statusCode != 200) {
      throw RecusaDaApi(resposta.statusCode, jsonDecode(resposta.body)['detail']);
    }
    final itens = jsonDecode(resposta.body);
    return [for (final item in itens) Bovino.fromJson(item)];
  }

  // GET /bovinos/{id}: um bovino só, como ele está AGORA no banco. Bovino de
  // outra pessoa, ou que não existe mais, a API responde 404.
  Future<Bovino> buscar(String token, int id) async {
    final resposta = await cliente.get(
      Uri.parse('$enderecoDaApi/bovinos/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (resposta.statusCode != 200) {
      throw RecusaDaApi(resposta.statusCode, jsonDecode(resposta.body)['detail']);
    }
    return Bovino.fromJson(jsonDecode(resposta.body));
  }
}
