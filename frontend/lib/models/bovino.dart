class Bovino {
  Bovino({
    required this.id,
    required this.nome,
    required this.raca,
    required this.nomeMae,
    required this.status,
  });

  final int id;
  final String nome;
  final String raca;
  final String nomeMae;
  final bool status;

  factory Bovino.fromJson(Map<String, dynamic> json) {
    return Bovino(
      id: json['id'],
      nome: json['nome'],
      raca: json['raca'],
      nomeMae: json['nome_mae'],
      status: json['status'],
    );
  }
}
