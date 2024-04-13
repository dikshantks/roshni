import 'package:hive/hive.dart';

part 'question_model.g.dart';

@HiveType(typeId: 1)
class Question {
  @HiveField(0)
  String questionID;

  @HiveField(1)
  String testID;
  @HiveField(2)
  String text;
  @HiveField(3)
  String type;
  @HiveField(4)
  String correct;
  @HiveField(5)
  String difficulty;
  @HiveField(6)
  List<dynamic> options;
  @HiveField(7)
  String? useranswer;
  @HiveField(8)
  @override
  int get key => questionID.hashCode;
  Question({
    required this.questionID,
    required this.testID,
    required this.text,
    required this.type,
    required this.correct,
    required this.difficulty,
    required this.options,
    this.useranswer,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      questionID: json['questionID'],
      testID: json['testID'],
      text: json['text'],
      type: json['type'],
      correct: json['correct'],
      difficulty: json['difficulty'],
      options: json['options'],
      useranswer: null,
    );
  }
}
