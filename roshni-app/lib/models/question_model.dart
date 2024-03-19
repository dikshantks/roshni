// class Question {
//   final int uid;

//   Question({required this.uid});

//   factory Question.fromJson(Map<String, dynamic> json) {
//     return Question(uid: json["uid"]);
//   }

//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = <String, dynamic>{};

//     return data;
//   }
// }

import 'package:intl/intl.dart'; // Import this for date/time handling

class Test {
  String createDate;
  String expiry;
  String imageUrl;
  List<dynamic>
      questions; // Use dynamic if you're unsure of the question structure
  String subject;
  String testID;
  int time;

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
    // Parse the expiry date/time
    final dateFormat = DateFormat('yyyy-MM-ddTHH:mm');

    return Test(
      createDate: json['createDate'],
      expiry: dateFormat.parse(json['expiry']).toString(), // Parse and reformat
      imageUrl: json['imageUrl'],
      questions: json['questions'],
      subject: json['subject'],
      testID: json['testID'],
      time: json['time'],
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
