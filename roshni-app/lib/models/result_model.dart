import 'package:hive/hive.dart';

part 'result_model.g.dart';

@HiveType(typeId: 3)
class Result {
  @HiveField(0)
  String testID;
  @HiveField(1)
  String studentPin; // Use the Student's pin as a foreign key
  @HiveField(2)
  int score;
  @HiveField(3)
  DateTime timestamp;
  @HiveField(4)
  Map<String, String> answers; // Key: questionID, Value: useranswer
  @HiveField(5)
  int get key => (testID + studentPin).hashCode; // Composite key

  Result({
    required this.testID,
    required this.studentPin,
    required this.score,
    required this.timestamp,
    required this.answers,
  });
}
