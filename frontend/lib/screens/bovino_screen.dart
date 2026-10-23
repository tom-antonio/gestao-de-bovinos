import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/bovino.dart';
import '../routes.dart';
import '../services/bovino_service.dart';
import 'bovinos_screen.dart';

// O detalhe de um bovino. Chega só o id, e a tela pede o bovino à API: o dado é
// o de agora, e não o de quando a lista carregou.
class BovinoScreen extends StatefulWidget {
  const BovinoScreen({super.key, this.id});

  // O id que a rota tirou dos arguments. Sem ele (um F5 aqui apaga os
  // arguments, que moram na memória), a tela mostra a lista.
  final int? id;

  @override
  State<BovinoScreen> createState() => _BovinoScreenState();
}

class _BovinoScreenState extends State<BovinoScreen> {
  // O pedido do bovino: como o da lista, nasce uma vez, no initState.
  late Future<Bovino> pedido;
  // A recusa da exclusão (o bovino inativo, por exemplo), para a tela mostrar.
  String? erro;

  @override
  void initState() {
    super.initState();
    if (widget.id != null) {
      pedido = context.read<BovinoService>().buscar(widget.id!);
    }
  }

  void tentarDeNovo() {
    setState(() {
      pedido = context.read<BovinoService>().buscar(widget.id!);
    });
  }

  // Abre o formulário com o bovino, para editar. Se ele voltar com true (salvou),
  // esta tela também fecha com true: passa a notícia para a lista.
  Future<void> editar( Bovino bovino) async {
    final salvou = await Navigator.pushNamed(context, AppRoutes.formulario, arguments: bovino);
    if (salvou == true && mounted) {
      Navigator.pop(context, true);
    }
  }

  // Pergunta antes de excluir. O diálogo é uma tela por cima, e fecha devolvendo
  // um valor: true no Excluir, false no Cancelar, null num toque fora dele.
  Future<void> excluir( Bovino bovino) async {
    final certeza = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Excluir ${bovino.nome}?'),
        content: const Text('Tem certeza? O bovino sai do seu acervo, e não dá para desfazer.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Excluir'),
          ),
        ],
      ),
    );
    if (certeza != true || !mounted) {
      return;
    }
    try {
      await context.read<BovinoService>().excluir(bovino.id);
    } on ErroDeBovinos catch (e) {
      setState(() {
        erro = '$e';
      });
      return;
    }
    if (!mounted) return;
    Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    if (widget.id == null) {
      return const BovinosScreen();
    }
    return Scaffold(
      appBar: AppBar(title: const Text('Bovino')),
      body: FutureBuilder<Bovino>(
        future: pedido,
        builder: (context, snapshot) {
          // Os estados da lista, de novo. O vazio não existe aqui: o bovino que
          // sumiu é um 404 da API, e vira erro.
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.cloud_off, size: 56),
                  const SizedBox(height: 16),
                  const Text('Não consegui carregar o bovino'),
                  const SizedBox(height: 8),
                  Text(
                    '${snapshot.error}',
                    style: const TextStyle(color: Colors.red),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: tentarDeNovo,
                    child: const Text('Tentar de novo'),
                  ),
                ],
              ),
            );
          }
          final bovino = snapshot.data!;
          return ListView(
            children: [
              ListTile(
                leading: const Icon(Icons.pets),
                title: const Text('Nome'),
                subtitle: Text(bovino.nome),
              ),
              ListTile(
                leading: const Icon(Icons.pets),
                title: const Text('Raça'),
                subtitle: Text(bovino.raca),
              ),
              ListTile(
                leading: const Icon(Icons.pets),
                title: const Text('Nome da Mãe'),
                subtitle: Text(bovino.nomeMae),
              ),
              ListTile(
                leading: Icon(bovino.status ? Icons.check_circle : Icons.cancel),
                title: const Text('Status'),
                subtitle: Text(bovino.status ? 'Ativo' : 'Inativo'),
              ),
              const SizedBox(height: 16),
              // Editar e Excluir: o bovino já está na mão, e é o de agora.
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton.icon(
                    onPressed: () => editar(bovino),
                    icon: const Icon(Icons.edit),
                    label: const Text('Editar'),
                  ),
                  const SizedBox(width: 16),
                  OutlinedButton.icon(
                    onPressed: () => excluir(bovino),
                    icon: const Icon(Icons.delete),
                    label: const Text('Excluir'),
                  ),
                ],
              ),
              if (erro != null) ...[
                const SizedBox(height: 16),
                Text(
                  erro!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.red),
                ),
              ],
            ],
          );
        },
      ),
    );
  }
}
