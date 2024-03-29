import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:roshni_app/models/exams_model.dart'; // For JSON handling
import 'package:roshni_app/models/facilitator_model.dart';
import '../models/student_model.dart';

class TestService {
  final String _baseUrl;

  TestService(this._baseUrl);

  Future<List<Test>> fetchAllTests() async {
    final url = Uri.parse('$_baseUrl/tests');
    print("init fetch all test api service ");
    final response = await http.get(url);
    // print(response.body);
    if (response.statusCode == 200) {
      print("status fine: ${response.statusCode} \n ${response.body}");

      final jsonData = jsonDecode(response.body) as List;
      print(jsonData[0]);
      final one = Test.fromJson(jsonData[0]);
      print("printinig one");
      print(one);

      return jsonData.map((data) => Test.fromJson(data)).toList();
    } else {
      print("fethcallexam issue");
      throw Exception('Failed to fetch tests');
    }
  }
}

class QuestionService {
  final String _baseUrl;

  QuestionService(this._baseUrl);

  Future<List<Question>> fetchQuestionsForTest(String testID) async {
    print("init question api service");
    final url = Uri.parse('$_baseUrl/tests/$testID/questions');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final jsonData = jsonDecode(response.body);
      final questionsData = jsonData['questions'] as List;

      return questionsData.map((q) => Question.fromJson(q)).toList();
    } else {
      // Handle errors (consider throwing an exception)
      throw Exception('Failed to fetch questions');
    }
  }
}

class AuthService {
  final String _baseUrl;

  AuthService(this._baseUrl);

  Future<Evaluator?> loginEvaluator(String evalID, String password) async {
    try {
      print("init login evaluator api service");
      print("evalID : $evalID , password : $password ");
      final url =
          Uri.parse('$_baseUrl/evaluators/login'); // Assuming '/login' endpoint
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: json.encode({'evalID': evalID, 'password': password}),
      );
      print(response.body);

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        print(response.body);

        if (responseData['message'] == 'Login successful') {
          responseData['evaluatorData']['password'] = password;

          print(responseData['evaluatorData']);
          final evaluator = Evaluator.fromJson(responseData['evaluatorData']);
          return evaluator;
        } else {
          return null; // Indicate login failure in other cases
        }
      } else {
        return null; // Handle non-200 status codes
      }
    } catch (error) {
      print('Error logging in evaluator: $error');
      return null;
    }
  }

  Future<Student?> loginStudent(String pin) async {
    try {
      final url = Uri.parse('$_baseUrl/students/login');
      print(url);
      print(pin);
      final response = await http.post(url,
          headers: {"Content-Type": "application/json"},
          body: json.encode({'pin': pin}));
      print(response.body);

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);

        if (responseData['message'] == 'Login successful') {
          responseData['studentData']['pin'] = pin;
          print(responseData['studentData']['pin']);
          return Student.fromJson(responseData['studentData']);
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      print('Error logging in student: $error');
      return null;
    }
  }
}
