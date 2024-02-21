class Question {
  final int uid;

  Question({required this.uid});

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(uid: json["uid"]);
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};

    return data;
  }
}
