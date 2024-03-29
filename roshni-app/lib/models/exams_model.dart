// import 'package:intl/intl.dart'; // Import this for date/time handling

class Test {
  String createDate;
  String expiry;
  String imageUrl;
  List<Question>
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
    // final dateFormat = DateFormat('yyyy-MM-ddTHH:mm');

    print("working test.fromjson");
    print(json);
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

class Question {
  String questionID;
  String testID;
  String text;
  String type;
  String correct;
  String difficulty;
  List<String> options;

  Question({
    required this.questionID,
    required this.testID,
    required this.text,
    required this.type,
    required this.correct,
    required this.difficulty,
    required this.options,
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
    );
  }
}
