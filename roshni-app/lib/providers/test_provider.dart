import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';
import 'package:hive/hive.dart';
import 'package:roshni_app/models/question_model.dart';
import 'package:roshni_app/models/test_model.dart';
import 'package:roshni_app/services/api_service.dart';

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

  Box<Test>? _testBox;
  Box<Question>? _questionBox;
  Future<void> openHiveBoxes() async {
    _testBox = await Hive.openBox<Test>('testBox');
    _questionBox = await Hive.openBox<Question>('questionBox');
  }

  Future<void> fetchTests() async {
    _isLoading = true;
    _error = null;
    SchedulerBinding.instance.addPostFrameCallback((_) {
      notifyListeners();
    });
    print("fetch test start runnig ");
    List<Test> cachedTests = _testBox?.values.toList() ?? [];
    print(cachedTests.length);
    if (cachedTests.isNotEmpty) {
      _tests = cachedTests;
      _isLoading = false;
      notifyListeners();
    } else {
      try {
        final fetchedTests = await testService.fetchAllTests();
        await _testBox?.addAll(fetchedTests);
        // Fetch and store questions
        for (final test in fetchedTests) {
          await fetchAndStoreQuestionsForTest(test);
        }
        _tests = _testBox!.values.toList();
        _isLoading = false;
        notifyListeners();
      } catch (error) {
        _error = error.toString();
        if (kDebugMode) {
          print("error in fetch test provider : $error");
        }
        _isLoading = false;
        notifyListeners();
      }
    }
  }

  Future<void> fetchAndStoreQuestionsForTest(Test test) async {
    try {
      final questions =
          await questionService.fetchQuestionsForTest(test.testID);
      await _questionBox?.addAll(questions);
    } catch (error) {
      print("error in fetch question provider : $error");
    }
  }

  Future<List<Question>> fetchQuestionsFromHive(String testID) async {
    await openHiveBoxes();
    final questions = _questionBox!.values
        .where((question) => question.testID == testID)
        .toList();
    return questions;
  }
}
