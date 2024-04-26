import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:roshni_app/models/test_model.dart'; // For JSON handling
import 'package:roshni_app/models/facilitator_model.dart';
import 'package:roshni_app/models/question_model.dart';
import '../models/student_model.dart';
import 'package:logger/logger.dart';

var logger = Logger();

class TestService {
  final String _baseUrl;

  TestService(this._baseUrl);

  Future<List<Test>> fetchAllTests() async {
    final url = Uri.parse('$_baseUrl/tests');
    logger.i("init fetch all test api service ");
    print(url);
    final response = await http.get(url);
    // print("response : $response");
    if (response.statusCode == 200) {
      print("status fine: ${response.statusCode} -> ${response.body}");

      final jsonData = jsonDecode(response.body) as List;
      // print(jsonData[0]);
      // final one = Test.fromJson(jsonData[0]);

      print(" prinit one : ${jsonData.length}");

      return jsonData.map((data) => Test.fromJson(data)).toList();
    } else {
      print("fetch all exam issue");
      throw Exception('Failed to fetch tests');
    }
  }
}

class QuestionService {
  final String _baseUrl;

  QuestionService(this._baseUrl);

  Future<List<Question>> fetchQuestionsForTest(String testID) async {
    // print("init question api service");
    final url = Uri.parse('$_baseUrl/tests/$testID/questions');
    final response = await http.get(url);
    if (response.statusCode == 200) {
      final jsonData = jsonDecode(response.body);

      final questionsData = jsonData['questions'] as List;
      final one = questionsData.map((q) => Question.fromJson(q)).toList();
      print("question api done : ${questionsData.length} ${one.length}");
      return one;
    } else {
      // Handle errors (consider throwing an exception)
      if (kDebugMode) {
        print("fetch question issue");
      }
      throw Exception('Failed to fetch questions');
    }
  }
}

class AuthService {
  final String _baseUrl;

  AuthService(this._baseUrl);

  Future<Facilitator?> loginEvaluator(String evalID, String password) async {
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
          final evaluator = Facilitator.fromJson(responseData['evaluatorData']);
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
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: json.encode(
          {'pin': pin},
        ),
      );
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

class FacApiService {
  final String _baseUrl;

  FacApiService(this._baseUrl);

  Future<String> registerStudent(Map<String, dynamic> studentData) async {
    final url = Uri.parse('$_baseUrl/students/signup');
    print("init register student api service : $studentData");
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode(studentData),
    );
    print(response.body);

    if (response.statusCode != 200) {
      throw Exception('Failed to register student: ${response.body}');
    } // else registration successful (consider handling detailed responses)

    return response.body;
  }

  Future<List<Student>> fetchStudents() async {
    final url = Uri.parse('$_baseUrl/students/');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final jsonData = jsonDecode(response.body) as List;
      return jsonData.map((data) => Student.fromJson(data)).toList();
    } else {
      throw Exception('Failed to fetch students');
    }
  }
}
