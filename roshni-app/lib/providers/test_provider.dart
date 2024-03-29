import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
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
    print("provider fetch test init");
    _isLoading = true;
    _error = null;
    // notifyListeners();
    SchedulerBinding.instance.addPostFrameCallback((_) {
      notifyListeners();
    });

    try {
      final fetchedTests = await testService.fetchAllTests();
      print("paper fethced");
      _tests = await _populateQuestionsForTests(fetchedTests);
      print("questions added");
      _isLoading = false;
      print(_tests);
      notifyListeners();
    } catch (error) {
      _error = error.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<List<Test>> _populateQuestionsForTests(List<Test> tests) async {
    print("populating questions form provider");
    return Future.wait(tests.map((test) async {
      test.questions = await questionService.fetchQuestionsForTest(test.testID);
      return test;
    }));
  }
}
