import 'dart:async';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/models/question_model.dart';
import 'package:roshni_app/providers/test_provider.dart';
import 'package:roshni_app/services/api_service.dart';

class QuestionsScreen extends StatefulWidget {
  static const routeName = '/student/tests';

  final List<dynamic> testId;

  const QuestionsScreen({Key? key, required this.testId}) : super(key: key);

  @override
  State<QuestionsScreen> createState() => _QuestionsScreenState();
}

class _QuestionsScreenState extends State<QuestionsScreen> {
  List<Question> _questions = [];
  int _currentIndex = 0;
  int _obtainedMarks = 0;
  final _timerDuration = const Duration(seconds: 30);
  late Timer _timer;
  int _remainingSeconds = 0;

  @override
  void initState() {
    widget.testId.forEach((element) {
      logger.i("$element");
    });
    super.initState();
    _fetch();
    _startTimer();
  }

  void _fetch() async {
    _questions = await Provider.of<TestProvider>(context, listen: false)
        .fetchQuestionsFromHive(widget.testId);
    Logger().i('Questions: ${_questions.length} for ${widget.testId}');

    if (_questions.isEmpty) {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: Text('Error'),
          content: Text('Exam does not exist.'),
          actions: <Widget>[
            TextButton(
              child: Text('Okay'),
              onPressed: () {
                Navigator.of(ctx).pop();
                Navigator.of(context).pop();
              },
            ),
          ],
        ),
      );
    }
  }

  void _startTimer() {
    _remainingSeconds = _timerDuration.inSeconds;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (_remainingSeconds > 0) {
          _remainingSeconds--;
        } else {
          timer.cancel();
          _answerQuestion(
              null); // Automatically go to the next question when time is up
        }
      });
    });
  }

  void _answerQuestion(String? answer) {
    print("Answer: $answer");
    if (answer != null && answer == _questions[_currentIndex].correct) {
      _obtainedMarks++;
      print("Obtained marks: $_obtainedMarks");
    }
    if (_currentIndex < _questions.length - 1) {
      setState(() {
        _currentIndex++;
        _startTimer();
        // Start a new timer for the next question
      });
    } else {
      _timer.cancel();
      // Navigate to the results screen here
    }
  }

  void onAnswerSelected(String answer) {
    var testProvider = Provider.of<TestProvider>(context, listen: false);
    testProvider.selectAnswer(answer);
    testProvider.nextQuestion();
  }

  void onQuizFinished() {
    var testProvider = Provider.of<TestProvider>(context, listen: false);
    testProvider.calculateScore();
    logger.i('Score: ${testProvider.score}');
    // Navigate to the result screen...
  }

  @override
  Widget build(BuildContext context) {
    var testProvider = Provider.of<TestProvider>(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Question'),
      ),
      body: _questions.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : testProvider.currentQuestion == null
              ? const Center(child: CircularProgressIndicator())
              : Column(
                  children: [
                    Text('Time remaining: $_remainingSeconds seconds'),
                    Text(testProvider.currentQuestion!.text),
                    ...List.generate(
                      testProvider.currentQuestion!.options.length,
                      (index) => ElevatedButton(
                        child:
                            Text(testProvider.currentQuestion!.options[index]),
                        onPressed: () => onAnswerSelected(
                          testProvider.currentQuestion!.options[index],
                        ),
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        ElevatedButton(
                          onPressed: testProvider.previousQuestion,
                          child: const Text('Previous'),
                        ),
                        ElevatedButton(
                          onPressed: testProvider.currentQuestionIndex <
                                  testProvider.questions.length - 1
                              ? testProvider.nextQuestion
                              : onQuizFinished,
                          child: Text(
                            testProvider.currentQuestionIndex <
                                    testProvider.questions.length - 1
                                ? 'Next'
                                : 'Finish',
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
    );
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }
}
