import 'package:flutter/material.dart';

import 'repositories/usuario_repository.dart';
import 'screens/login_screen.dart';
import 'services/sessao_service.dart';

// Aqui as camadas se montam, como o main.py monta a API no backend:
// o repositório entra no service, e o service entra nas telas.
void main() {
  final sessao = SessaoService(UsuarioRepository());
  runApp(BovinosApp(sessao: sessao));
}

class BovinosApp extends StatelessWidget {
  const BovinosApp({super.key, required this.sessao});

  final SessaoService sessao;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bovinos App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: Colors.indigo),
      home: LoginScreen(sessao: sessao),
    );
  }
}
