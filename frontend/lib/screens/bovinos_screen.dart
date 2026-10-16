import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/bovino.dart';
import '../routes.dart';
import '../services/bovino_service.dart';
import '../widgets/app_drawer.dart';

// A lista dos bovinos de quem está logado, vinda da API. A tela tem quatro
// estados, um de cada vez: carregando, erro, lista vazia e a lista.
class BovinosScreen extends StatefulWidget {
  const BovinosScreen({super.key});

  @override
  State<BovinosScreen> createState() => _BovinosScreenState();
}

class _BovinosScreenState extends State<BovinosScreen> {
  // O pedido à API: nasce UMA vez, quando a tela nasce, e só é refeito no
  // Tentar de novo. Criado dentro do build, sairia de novo a cada redesenho.
  late Future<List<Bovino>> bovinos;

  @override
  void initState() {
    super.initState();
    bovinos = context.read<BovinoService>().listar();
  }

  void tentarDeNovo() {
    setState(() {
      bovinos = context.read<BovinoService>().listar();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bovinos')),
      drawer: const AppDrawer(),
      body: FutureBuilder<List<Bovino>>(
        future: bovinos,
        builder: (context, snapshot) {
          // 1. Carregando: a resposta ainda não chegou.
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          // 2. Erro: a API recusou, ou nem respondeu.
          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.cloud_off, size: 56),
                  const SizedBox(height: 16),
                  const Text('Não consegui carregar os bovinos'),
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
          final lista = snapshot.data!;
          // 3. Vazia: o pedido deu certo, mas não há bovino nenhum.
          if (lista.isEmpty) {
            return const Center(child: Text('Nenhum bovino ainda.'));
          }
          // 4. A lista: um ListTile por bovino. O toque abre o detalhe e leva só
          // o id: a tela do bovino busca o bovino de agora na API.
          return ListView.builder(
            itemCount: lista.length,
            itemBuilder: (context, i) {
              final bovino = lista[i];
              return ListTile(
                leading: const Icon(Icons.pets),
                title: Text(bovino.nome),
                subtitle: Text(bovino.nomeMae),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  Navigator.pushNamed(context, AppRoutes.bovino, arguments: bovino.id);
                },
              );
            },
          );
        },
      ),
    );
  }
}
