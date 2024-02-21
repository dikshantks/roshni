class Exam {
  final int uid;

  Exam({required this.uid});

  factory Exam.fromJson(Map<String, dynamic> json) {
    return Exam(uid: json["uid"]);
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};

    return data;
  }
}
