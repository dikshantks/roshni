import 'package:flutter/foundation.dart';
import 'package:hive/hive.dart';
import 'package:roshni_app/models/question_model.dart';
import 'package:roshni_app/models/result_model.dart';
import 'package:roshni_app/models/test_model.dart';
import 'package:roshni_app/services/api_service.dart';

class TestProvider extends ChangeNotifier {
  final TestService testService;
  final QuestionService questionService;

  Box<Test>? _testBox;
  Box<Question>? _questionBox;
  Box<Result>? _resultsBox;

  TestProvider(this.testService, this.questionService);

  List<Test> _tests = [];
  List<Test> get tests => _tests;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _error;
  String? get error => _error;

  int _currentQuestionIndex = 0;
  int get currentQuestionIndex => _currentQuestionIndex;

  int _score = 0;
  int get score => _score;

  int _totalMarks = 0;
  int get totalmarks => _totalMarks;

  List<Question> _questions = [];
  List<Question> get questions => _questions;
  Question? get currentQuestion =>
      (_questions.isNotEmpty && _currentQuestionIndex < _questions.length)
          ? _questions[_currentQuestionIndex]
          : null;
  Test? get currentTest => _currentTest;

  Future<void> openHiveBoxes() async {
    _testBox = await Hive.openBox<Test>('testBox');
    _questionBox = await Hive.openBox<Question>('questionBox');
    _resultsBox = await Hive.openBox<Result>('resultBox');
  }

  Future<void> fetchTests() async {
    await Hive.openBox<Test>('testBox');

    _isLoading = true;
    _error = null;
    // try {
    await _loadCachedTests();
    if (_tests.isEmpty) {
      await _fetchAndStoreTestsFromApi();
    }
    // } catch (error) {
    //   _handleError(error);
    // } finally {
    _isLoading = false;
    notifyListeners();
    // }
  }

  void saveResult(String testID, String studentPin) {
    openHiveBoxes();
    final score = calculateScore();
    final timestamp = DateTime.now();
    final answers = _questions.asMap().map(
          (index, question) => MapEntry(
            question.questionID,
            question.useranswer ?? "",
          ),
        );

    final resultKey = (testID + studentPin).hashCode;
    final existingResult = _resultsBox!.get(resultKey);

    if (existingResult != null) {
      // Update the existing result
      existingResult
        ..score = score
        ..timestamp = timestamp
        ..answers = answers;

      _resultsBox!.put(resultKey, existingResult);
    } else {
      // Add a new result
      final result = Result(
        testID: testID,
        studentPin: studentPin,
        score: score,
        timestamp: timestamp,
        answers: answers,
      );

      _resultsBox!.put(resultKey, result);
    }

    logger.i("saved result $resultKey");

    notifyListeners();
  }

  Future<void> _loadCachedTests() async {
    _testBox = await Hive.openBox<Test>('testBox');

    List<Test> cachedTests = _testBox?.values.toList() ?? [];
    if (cachedTests.isNotEmpty) {
      _tests = cachedTests;
    }
    for (final test in cachedTests) {
      await fetchAndStoreQuestionsForTest(test);
    }
    logger.i("cached tests ${_tests.length}  , ${cachedTests.length}");
  }

  Future<void> _fetchAndStoreTestsFromApi() async {
    final fetchedTests = await testService.fetchAllTests();
    await _testBox?.addAll(fetchedTests);
    await _questionBox?.clear(); // Clear the box before adding new data

    for (final test in fetchedTests) {
      await fetchAndStoreQuestionsForTest(test);
    }
    _tests = fetchedTests;
  }

  List<Result>? getAllResults() {
    openHiveBoxes();
    return _resultsBox?.values.toList();
  }

  List<Result>? getResultsForStudent(String studentPin) {
    openHiveBoxes();
    return _resultsBox?.values
        .where((result) => result.studentPin == studentPin)
        .toList();
  }

  Future<void> fetchAndStoreQuestionsForTest(Test test) async {
    // try {
    await openHiveBoxes();
    final questions = await questionService.fetchQuestionsForTest(test.testID);
    logger.i("test : ${test.testID} - ${questions.length} ");
    for (final question in questions) {
      await _questionBox?.put(
          question.key, question); // Use the key when adding data
    }
    print(
        "fetched questions -- ${test.testID} - ${questions.length} - ${_questionBox?.length ?? "hk"}");
  }

  Future<List<Question>> fetchQuestionsFromHive(
      List<dynamic> questionIds) async {
    await openHiveBoxes();

    try {
      final questions = _questionBox!.values
          .where((question) => questionIds.contains(question.questionID))
          .toList();
      logger.i("${questionIds.length} hmm ${questions.length} , ");
      _questions = questions;
    } catch (e) {
      logger.e("error here ${e.toString()}");
      _questions = [];
    }

    return questions;
  }

  void nextQuestion() {
    if (_currentQuestionIndex < _questions.length - 1) {
      _currentQuestionIndex++;
      notifyListeners();
    }
  }

  void previousQuestion() {
    if (_currentQuestionIndex > 0) {
      _currentQuestionIndex--;
      notifyListeners();
    }
  }

  void resetQuiz() {
    _score = 0;
    _currentQuestionIndex = 0;
    notifyListeners();
  }

  void selectAnswer(String answer) {
    _questions[_currentQuestionIndex].useranswer = answer;
    notifyListeners();
  }

  // int calculateScore() {
  //   _score = _questions.fold(
  //     0,
  //     (prev, q) => prev + (q.correct == q.useranswer ? (q.marks ?? 1) : 0),
  //   );

  //   notifyListeners();
  //   return _score;
  // }
  int calculateScore() {
    _score = 0;
    for (Question q in _questions) {
      if (q.type == 'text') {
        // Assuming q.correct is List<String>
        // double similarityScore = calculateSimilarity(q.useranswer, q.correct);
        double similarityScore = .5;
        _score += (similarityScore * (q.marks ?? 0)).toInt();
      } else {
        // Assuming q.correct is a String
        _score += (q.correct[0] == q.useranswer ? q.marks ?? 0 : 0);

        logger.i("score $score");
      }
    }
    notifyListeners();
    return _score;
  }

  int calculateTotalMarks() {
    _totalMarks = _questions.fold(0, (prev, q) => prev + (q.marks ?? 1));
    notifyListeners();
    return _totalMarks;
  }

  Test? getTestById(String testId) {
    openHiveBoxes();
    try {
      logger.i("test found ${_tests.length}");
      return _tests.firstWhere((element) => element.testID == testId);
    } catch (e) {
      logger.e("error in get test by id $e");
      return null;
    }
  }

  Test? _currentTest;
  void selectTest(String testId) {
    openHiveBoxes();
    for (var element in _testBox?.values ?? _tests) {
      logger.i(
          "selcted test from: ${element.subject} ${element.testID} , length=${_testBox!.values.length} , ${_tests.length}");
    }
    try {
      _currentTest = _tests.firstWhere((element) => element.testID == testId);
      logger.i("selefffcted test ${_currentTest?.subject}");
    } catch (e) {
      _currentTest = null;
    }
    notifyListeners();
  }

  // Getter for the currently selected test

  set currentTest(Test? test) {
    _currentTest = test;
    notifyListeners();
  }

  set currentQuestionIndex(int idx) {
    _currentQuestionIndex = idx;
    notifyListeners();
  }
}
