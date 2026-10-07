import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../routes.dart';
import '../services/sessao_service.dart';

class CadastroScreen extends StatefulWidget {
  const CadastroScreen({super.key});

  @override
  State<CadastroScreen> createState() => _CadastroScreenState();
}

class _CadastroScreenState extends State<CadastroScreen> {
  final nome = TextEditingController();
  final email = TextEditingController();
  final senha = TextEditingController();
  bool carregando = false;
  String? erro;

  Future<void> cadastrar() async {
    if (nome.text.trim().isEmpty ||
        email.text.trim().isEmpty ||
        senha.text.isEmpty) {
      setState(() => erro = 'Preencha todos os campos');
      return;
    }
    if (senha.text.length < 6) {
      setState(() => erro = 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setState(() {
      carregando = true;
      erro = null;
    });
    try {
      final usuario = await context.read<SessaoService>().repositorio.cadastrar(
        nome.text.trim(),
        email.text.trim(),
        senha.text,
      );
      if (!mounted) return;
      if (usuario == null) {
        setState(() {
          carregando = false;
          erro = 'Não foi possível criar a conta';
        });
        return;
      }
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Conta criada com sucesso')));
      Navigator.pushNamedAndRemoveUntil(
        context,
        AppRoutes.login,
        (route) => false,
      );
    } catch (_) {
      if (!mounted) return;
      setState(() {
        carregando = false;
        erro = 'Não consegui falar com a API. O uvicorn está rodando?';
      });
    }
  }

  @override
  void dispose() {
    nome.dispose();
    email.dispose();
    senha.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bovinos App')),
      body: Center(
        child: SingleChildScrollView(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 400),
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Criar conta',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: nome,
                  decoration: InputDecoration(
                    labelText: 'Nome',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: email,
                  decoration: InputDecoration(
                    labelText: 'E-mail',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: senha,
                  decoration: InputDecoration(
                    labelText: 'Senha',
                    helperText: 'Pelo menos 6 caracteres',
                    border: OutlineInputBorder(),
                  ),
                  obscureText: true,
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: carregando ? null : cadastrar,
                  child: Text(carregando ? 'Cadastrando...' : 'Cadastrar'),
                ),
                if (erro != null) ...[
                  const SizedBox(height: 12),
                  Text(
                    erro!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Colors.red),
                  ),
                ],
                const SizedBox(height: 8),
                TextButton(
                  onPressed: () => Navigator.pushNamedAndRemoveUntil(
                    context,
                    AppRoutes.login,
                    (route) => false,
                  ),
                  child: const Text('Já tenho conta'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
