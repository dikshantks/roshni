import 'dart:convert';
import 'package:bcrypt/bcrypt.dart';
import 'package:http/http.dart' as http;
import 'package:roshni_app/models/exams_model.dart'; // For JSON handling

import 'package:roshni_app/models/facilitator_model.dart';

import '../models/student_model.dart';

class TestService {
  final String _baseUrl;

  TestService(this._baseUrl);

  Future<List<Test>> fetchAllTests() async {
    final url = Uri.parse('$_baseUrl/tests');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final jsonData = jsonDecode(response.body) as List;
      return jsonData.map((data) => Test.fromJson(data)).toList();
    } else {
      throw Exception('Failed to fetch tests');
    }
  }
}

class QuestionService {
  final String _baseUrl;

  QuestionService(this._baseUrl);

  Future<List<Question>> fetchQuestionsForTest(String testID) async {
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
      final url = Uri.parse('$_baseUrl/login'); // Assuming '/login' endpoint
      final response =
          await http.post(url, body: {'evalID': evalID, 'password': password});

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);

        if (responseData['message'] == 'Login successful') {
          // Verify password using Bcrypt
          final hashedPassword = responseData['evaluatorData']['password'];
          final passwordMatch = await BCrypt.checkpw(password, hashedPassword);

          if (passwordMatch) {
            responseData['evaluatorData']['password']; // Remove password
            return Evaluator.fromJson(responseData['evaluatorData']);
          } else {
            return null; // Indicate incorrect password
          }
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
      // final url = Uri.parse('$_baseUrl/students/login');
      final url = Uri.parse('http://127.0.0.1:5000/api/students/login');
      print(url);
      print(pin);
      final response = await http.post(url, body: {'pin': pin});
      print(response.body);

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);

        if (responseData['message'] == 'Login successful') {
          responseData['studentData']['pin'];
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
