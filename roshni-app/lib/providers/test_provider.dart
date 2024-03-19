import 'package:flutter/material.dart';
import 'package:roshni_app/models/exams_model.dart';
import 'package:roshni_app/services/api_service.dart';

// State Management for Tests
class TestProvider extends ChangeNotifier {
  List<Test> _tests = [];
  bool _isLoading = false;
  String? _error;

  List<Test> get tests => _tests;
  bool get isLoading => _isLoading;
  String? get error => _error;

  final TestService testService;
  final QuestionService questionService;

  TestProvider(this.testService, this.questionService);

  Future<void> fetchTests() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final fetchedTests = await testService.fetchAllTests();
      _tests = await _populateQuestionsForTests(fetchedTests);
      _isLoading = false;
      notifyListeners();
    } catch (error) {
      _error = error.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<List<Test>> _populateQuestionsForTests(List<Test> tests) async {
    return Future.wait(tests.map((test) async {
      test.questions = await questionService.fetchQuestionsForTest(test.testID);
      return test;
    }));
  }
}
