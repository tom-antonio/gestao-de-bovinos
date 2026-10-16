import '../models/bovino.dart';
import '../repositories/bovino_repository.dart';
import '../repositories/usuario_repository.dart';
import 'sessao_service.dart';

// A recusa dos livros, com a frase que a tela mostra.
class ErroDeBovinos implements Exception {
  ErroDeBovinos(this.mensagem);

  final String mensagem;

  // O texto do erro quando a tela o mostra: é o __str__ do Python.
  @override
  String toString() => mensagem;
}

// As regras dos bovinos. Não guarda estado (não é um ChangeNotifier): quem
// lembra se está carregando, se deu erro ou qual é a lista é a própria tela.
// O service pega o token na sessão, pede ao repositório e traduz a recusa.
class BovinoService {
  BovinoService(this.repositorio, this.sessao);

  final BovinoRepository repositorio;
  final SessaoService sessao;

  Future<List<Bovino>> listar() async {
    try {
      // O guarda só abre a tela de bovinos com sessão: o token nunca é null aqui.
      return await repositorio.listar(sessao.token!);
    } on RecusaDaApi catch (e) {
      throw ErroDeBovinos(e.mensagem);
    } on Exception {
      // Uma falha de fora, como a rede: a API nem respondeu (o uvicorn parado).
      // Um erro do próprio código não é Exception: passa direto, e a tela o
      // mostra inteiro.
      throw ErroDeBovinos('Não consegui falar com a API. O uvicorn está rodando?');
    }
  }

  // Um livro só, pelo id: as mesmas regras do listar.
  Future<Bovino> buscar(int id) async {
    try {
      return await repositorio.buscar(sessao.token!, id);
    } on RecusaDaApi catch (e) {
      throw ErroDeBovinos(e.mensagem);
    } on Exception {
      throw ErroDeBovinos('Não consegui falar com a API. O uvicorn está rodando?');
    }
  }
}
