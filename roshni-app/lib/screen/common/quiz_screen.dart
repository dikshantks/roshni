import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:logger/logger.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/models/question_model.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/test_provider.dart';
import 'package:roshni_app/screen/common/after_quiz_screen.dart';
import 'package:roshni_app/services/api_service.dart';
import 'package:roshni_app/widgets/buttons.dart';
import 'package:slide_countdown/slide_countdown.dart';

class QuestionsScreen extends StatefulWidget {
  static const routeName = '/student/tests';

  final List<dynamic> testId;

  const QuestionsScreen({Key? key, required this.testId}) : super(key: key);

  @override
  State<QuestionsScreen> createState() => _QuestionsScreenState();
}

class _QuestionsScreenState extends State<QuestionsScreen> {
  void _showBackDialog() {
    showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Are you sure?'),
          content: const Text(
            'Are you sure you want to leave this page?',
          ),
          actions: <Widget>[
            TextButton(
              style: TextButton.styleFrom(
                textStyle: Theme.of(context).textTheme.labelLarge,
              ),
              child: const Text('Nevermind'),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
            TextButton(
              style: TextButton.styleFrom(
                textStyle: Theme.of(context).textTheme.labelLarge,
              ),
              child: const Text('Leave'),
              onPressed: () {
                Navigator.pop(context);
                Navigator.pop(context);
              },
            ),
          ],
        );
      },
    );
  }

  List<Question> _questions = [];
  String pin = "";

  void _fetch() async {
    pin = Provider.of<AuthProvider>(context, listen: false).student!.pin;
    _questions = await Provider.of<TestProvider>(context, listen: false)
        .fetchQuestionsFromHive(widget.testId);
    setState(() {});
    Logger().i('Q $pin uestions: ${_questions.length} for ${widget.testId}');

    if (_questions.isEmpty) {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Error'),
          content: const Text('Exam does not exist.'),
          actions: <Widget>[
            TextButton(
              child: const Text('Okay'),
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

  void onAnswerSelected(String answer) {
    var testProvider = Provider.of<TestProvider>(context, listen: false);
    testProvider.selectAnswer(answer);
  }

  void onQuizFinished() {
    var testProvider = Provider.of<TestProvider>(context, listen: false);
    testProvider.calculateScore();
    testProvider.calculateTotalMarks();
    logger.i('Score: ${testProvider.score}');
    testProvider.saveResult(testProvider.currentTest!.testID, pin);
    testProvider.currentQuestionIndex = 0;
    Navigator.of(context).pushReplacementNamed(AfterQuizScreen.routeName);
  }

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  @override
  Widget build(BuildContext context) {
    final time = Provider.of<TestProvider>(context, listen: false).currentTest!;
    var one = _questions;
    Logger().i("widget is built hmm ${one.length}");
    var testProvider = Provider.of<TestProvider>(context);

    return PopScope(
      canPop: false,
      onPopInvoked: (bool didPop) {
        if (didPop) {
          return;
        }
        _showBackDialog();
      },
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(90),
          child: Container(
            // alignment: Alignment.center,
            alignment: Alignment.bottomCenter,
            height: 100,
            color: Colors.black12,
            width: double.infinity,
            padding: const EdgeInsets.symmetric(
              horizontal: 10,
              vertical: 10,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                SlideCountdown(
                  slideDirection: SlideDirection.none,
                  style: GoogleFonts.roboto(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                    fontSize: 20,
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 15,
                    vertical: 5,
                  ),
                  decoration: const BoxDecoration(
                    color: Colors.green,
                    borderRadius: BorderRadius.all(
                      Radius.circular(
                        25,
                      ),
                    ),
                  ),
                  duration: Duration(minutes: int.parse(time.time)),
                  separator: ":",
                  onDone: () {
                    onQuizFinished();
                  },
                ),
                Container(
                  padding: const EdgeInsets.all(10),
                  child: Text(
                    "${testProvider.currentQuestionIndex + 1} of ${_questions.length}",
                    style: GoogleFonts.roboto(
                      // color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 22,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(10),
                  child: Text(
                    "ID : $pin",
                    style: GoogleFonts.roboto(
                      // color: Colors.white,
                      fontWeight: FontWeight.w500,
                      fontSize: 20,
                    ),
                  ),
                )
              ],
            ),
          ),
        ),
        body: _questions.isEmpty
            ? const Center(
                child: Text(
                  "_questions.isEmpty",
                ),
              )
            : testProvider.currentQuestion == null
                ? const Center(
                    child: Text(
                      "testProvider.currentQuestion == null",
                    ),
                  )
                : doQuiz(testProvider),
      ),
    );
  }

  Widget doQuiz(TestProvider testProvider) {
    final width = MediaQuery.of(context).size.width;
    final height = MediaQuery.of(context).size.height;

    return Padding(
      padding: const EdgeInsets.all(15),
      child: Center(
        child: Container(
          padding: const EdgeInsets.only(
              top: 20, left: 20, right: 10.0, bottom: 15.0),
          width: width,
          height: height * .78,
          decoration: BoxDecoration(
            boxShadow: [
              BoxShadow(
                blurRadius: 10,
                spreadRadius: 1,
                color: const Color(0xff161a1d).withOpacity(.2),
              ),
            ],
            color: const Color(0xfffff0f3),
            borderRadius: const BorderRadius.all(Radius.circular(25)),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              SizedBox(
                width: width,
                child: Text(
                  testProvider.currentQuestion!.text,
                  style: GoogleFonts.roboto(
                    color: Colors.black,
                    fontWeight: FontWeight.w600,
                    fontSize: 20,
                  ),
                ),
              ),
              QuiestionColumn(
                context: context,
                width: width,
                testProvider: testProvider,
              ),
              Expanded(
                flex: 2,
                child: Container(
                  width: width * .85,
                  margin: const EdgeInsets.only(right: 10.0),
                  child: testProvider.currentQuestion!.type == "text"
                      ? TextField(
                          decoration: const InputDecoration(
                            hintText: "Type your answer",
                          ),
                          onChanged: (value) {
                            // testProvider.currentQuestion!.useranswer = value;
                            onAnswerSelected(value);
                          },
                        )
                      : GridView.builder(
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 1.7,
                          ),
                          itemCount:
                              testProvider.currentQuestion!.options.length,
                          itemBuilder: (context, index) {
                            return OptionsButton(
                              decoration: BoxDecoration(
                                border: Border.all(
                                  color: const Color(0xff18206f),
                                  width: 1.3,
                                ),
                                color:
                                    testProvider.currentQuestion!.useranswer ==
                                            testProvider
                                                .currentQuestion!.options[index]
                                        ? Colors.green.shade700
                                        : Colors.white10,
                                borderRadius: const BorderRadius.all(
                                  Radius.circular(10),
                                ),
                              ),
                              text: "${String.fromCharCode(65 + index)}). ",
                              child: Text(
                                textAlign: TextAlign.center,
                                "${String.fromCharCode(65 + index)}) ${testProvider.currentQuestion!.options[index]} ",
                                style: GoogleFonts.roboto(
                                  color: const Color(0xff18206f),
                                  fontSize: 19.0,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              onPressed: () => onAnswerSelected(
                                testProvider.currentQuestion!.options[index],
                              ),
                            );
                          },
                        ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  testProvider.currentQuestionIndex == 0
                      ? const SizedBox(
                          width: 20,
                        )
                      : RoundButton3(
                          onPressed: testProvider.previousQuestion,
                          text: 'Previous',
                        ),
                  RoundButton2(
                    text: testProvider.currentQuestionIndex <
                            testProvider.questions.length - 1
                        ? 'Next'
                        : 'Finish',
                    onPressed: testProvider.currentQuestionIndex <
                            testProvider.questions.length - 1
                        ? testProvider.nextQuestion
                        : onQuizFinished,
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
  }
}

class QuiestionColumn extends StatelessWidget {
  const QuiestionColumn({
    super.key,
    required this.context,
    required this.width,
    required this.testProvider,
  });

  final BuildContext context;
  final double width;
  final TestProvider testProvider;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: () {
          showDialog(
            context: context,
            builder: (BuildContext context) {
              return Dialog(
                child: SizedBox(
                  width: MediaQuery.of(context).size.width,
                  child: testProvider.currentQuestion?.img == null
                      ? const SizedBox(height: 10)
                      : Image.memory(
                          base64Decode(testProvider.currentQuestion!.img!),
                          fit: BoxFit.cover,
                        ),
                ),
              );
            },
          );
        },
        child: Container(
          width: width * .85,
          margin: const EdgeInsets.only(right: 10.0),
          child: testProvider.currentQuestion?.img == null
              ? const SizedBox(height: 10)
              : Image.memory(
                  base64Decode(testProvider.currentQuestion!.img!),
                  fit: BoxFit.cover,
                ),
        ),
      ),
    );
  }
}
