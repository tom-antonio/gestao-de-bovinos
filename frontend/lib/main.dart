import 'package:flutter/material.dart';

import 'screens/login_screen.dart';

void main() {
  runApp(const BovinosApp());
}

class BovinosApp extends StatelessWidget {
  const BovinosApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bovinos App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: Colors.indigo),
      home: const LoginScreen(),
    );
  }
}
