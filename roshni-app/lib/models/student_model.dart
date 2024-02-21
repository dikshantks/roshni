class Student {
  final int uid;

  Student({required this.uid});

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(uid: json["uid"]);
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};

    return data;
  }
}
