// import 'package:intl/intl.dart'; // Import this for date/time handling

import 'package:hive/hive.dart';

part 'test_model.g.dart';

@HiveType(typeId: 0)
class Test {
  @HiveField(0)
  String createDate;
  @HiveField(1)
  String expiry;
  @HiveField(2)
  String imageUrl;
  @HiveField(3)
  List<dynamic> questions;
  @HiveField(4)
  String subject;
  @HiveField(5)
  String testID;
  @HiveField(6)
  String time;
  @HiveField(7)
  @override
  int get key => testID.hashCode;

  Test({
    required this.createDate,
    required this.expiry,
    required this.imageUrl,
    required this.questions,
    required this.subject,
    required this.testID,
    required this.time,
  });

  // Factory method to create a Test object from JSON
  factory Test.fromJson(Map<String, dynamic> json) {
    return Test(
      subject: json['subject'],
      imageUrl: json['imageUrl'],
      testID: json['testID'],
      time: json['time'],
      expiry: json['expiry'], // Parse and reformat
      createDate: json['createDate'],
      questions: json['questions'],
      // expiry: dateFormat.parse(json['expiry']).toString(), // Parse and reformat
    );
  }

  // Method to convert a Test object to JSON
  Map<String, dynamic> toJson() {
    return {
      'createDate': createDate,
      'expiry': expiry,
      'imageUrl': imageUrl,
      'questions': questions,
      'subject': subject,
      'testID': testID,
      'time': time,
    };
  }
}
