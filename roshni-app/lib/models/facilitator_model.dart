class Facilitator {
  final int uid;

  Facilitator({required this.uid});

  factory Facilitator.fromJson(Map<String, dynamic> json) {
    return Facilitator(uid: json["uid"]);
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};

    return data;
  }
}
