import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/bovino.dart';
import '../services/bovino_service.dart';
import 'bovinos_screen.dart';

enum Status { ativo, inativo }

// Uma tela só para criar e para editar: sem bovino, cria; com o bovino, edita.
// Os campos e as regras são os mesmos; muda o nome da barra, o que vem
// preenchido e o pedido que sai (POST para criar, PATCH para editar).
class FormularioScreen extends StatefulWidget {
  const FormularioScreen({super.key, this.bovino});

  // O bovino a editar, que veio nos arguments; null é um bovino novo.
  final Bovino? bovino;

  @override
  State<FormularioScreen> createState() => _FormularioScreenState();
}

class _FormularioScreenState extends State<FormularioScreen> {
  // A chave do Form: é por ela que o Salvar alcança o formulário e confere
  // todos os campos de uma vez.
  final chave = GlobalKey<FormState>();
  final nome = TextEditingController();
  final raca = TextEditingController();
  final nomeMae = TextEditingController();
  Status status = Status.ativo;
  bool salvando = false;
  String? erro;

  @override
  void initState() {
    super.initState();
    // Editando: os campos já começam com o que o bovino tem.
    if (widget.bovino != null) {
      nome.text = widget.bovino!.nome;
      raca.text = widget.bovino!.raca;
      nomeMae.text = widget.bovino!.nomeMae;
      status = widget.bovino!.status ? Status.ativo : Status.inativo;
    }
  }

  Future<void> salvar() async {
    // A ponta do app: cada validator confere o seu campo. Se algum devolver
    // uma frase, ela aparece embaixo do campo, e nada vai para a API.
    if (!chave.currentState!.validate()) {
      return;
    }
    setState(() {
      salvando = true;
      erro = null;
    });
    // A ponta da API: ela confere tudo de novo, e pode recusar (422, 409).
    // O servico é o LivroService, pego uma vez para as duas chamadas abaixo.
    final servico = context.read<BovinoService>();
    try {
      if (widget.bovino == null) {
        await servico.criar(
          nome.text,
          raca.text,
          nomeMae.text,
          status == Status.ativo,
        );
      } else {
        await servico.atualizar(
          widget.bovino!.id,
          nome.text,
          raca.text,
          nomeMae.text,
          status == Status.ativo,
        );
      }
    } on ErroDeBovinos catch (e) {
      setState(() {
        salvando = false;
        erro = '$e';
      });
      return;
    }
    if (!mounted) return;
    // Deu certo: o formulário fecha com true, e quem o abriu pede de novo.
    Navigator.pop(context, true);
  }

  @override
  void dispose() {
    nome.dispose();
    raca.dispose();
    nomeMae.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Depois de um F5, o formulário é a primeira tela da pilha: ninguém o
    // abriu, e não há quem receba o true. Aí, ele mostra a lista, como o detalhe.
    if (ModalRoute.of(context)!.isFirst) {
      return const BovinosScreen();
    }
    final editando = widget.bovino != null;
    return Scaffold(
      appBar: AppBar(title: Text(editando ? 'Editar bovino' : 'Novo bovino')),
      body: Center(
        child: SingleChildScrollView(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 400),
            padding: const EdgeInsets.all(24),
            child: Form(
              key: chave,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TextFormField(
                    controller: nome,
                    decoration: const InputDecoration(
                      labelText: 'Nome',
                      border: OutlineInputBorder(),
                    ),
                    validator: (valor) {
                      if ((valor ?? '').trim().isEmpty) {
                        return 'Informe o nome do bovino';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: raca,
                    decoration: const InputDecoration(
                      labelText: 'Raça',
                      border: OutlineInputBorder(),
                    ),
                    validator: (valor) {
                      if ((valor ?? '').trim().isEmpty) {
                        return 'Informe a raça do bovino';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: nomeMae,
                    decoration: const InputDecoration(
                      labelText: 'Nome da mãe',
                      border: OutlineInputBorder(),
                    ),
                    validator: (valor) {
                      if ((valor ?? '').trim().isEmpty) {
                        return 'Informe o nome da mãe do bovino';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<Status>(
                    initialValue: status,
                    decoration: const InputDecoration(
                      labelText: 'Status',
                      border: OutlineInputBorder(),
                    ),
                    items: const [
                      DropdownMenuItem(
                        value: Status.ativo,
                        child: Text('Ativo'),
                      ),
                      DropdownMenuItem(
                        value: Status.inativo,
                        child: Text('Inativo'),
                      ),
                    ],
                    onChanged: (valor) {
                      if (valor != null) {
                        setState(() => status = valor);
                      }
                    },
                  ),
                  if (erro != null) ...[
                    const SizedBox(height: 16),
                    Text(
                      erro!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.red),
                    ),
                  ],
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: salvando ? null : salvar,
                    child: Text(salvando ? 'Salvando...' : 'Salvar'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
