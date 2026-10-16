import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/bovino.dart';
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
                title: const Text('Nome da Mãe'),
                subtitle: Text(bovino.nomeMae),
              ),
              ListTile(
                leading: Icon(bovino.status ? Icons.check_circle : Icons.cancel),
                title: const Text('Status'),
                subtitle: Text(bovino.status ? 'Ativo' : 'Inativo'),
              ),
            ],
          );
        },
      ),
    );
  }
}
