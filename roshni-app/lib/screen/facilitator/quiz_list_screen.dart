import 'package:expansion_tile_card/expansion_tile_card.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/test_provider.dart';
import 'package:roshni_app/screen/common/quiz_screen.dart';
import 'package:roshni_app/services/api_service.dart';
import 'package:roshni_app/widgets/form_field.dart';

class QuizListScreen extends StatefulWidget {
  const QuizListScreen({super.key});

  @override
  State<QuizListScreen> createState() => _QuizListScreenState();
}

class _QuizListScreenState extends State<QuizListScreen> {
  final _pinController = TextEditingController();

  @override
  void initState() {
    super.initState();
    Provider.of<TestProvider>(context, listen: false).fetchTests();
  }

  @override
  Widget build(BuildContext context) {
    final testProvider = Provider.of<TestProvider>(context);
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Center(child: Text('Available quizes')),
        automaticallyImplyLeading: false,
      ),
      body: () {
        if (testProvider.isLoading) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        } else if (testProvider.error != null) {
          return const Center(
            child: Text('An error occurred!'),
          );
        } else {
          final tests = testProvider.tests;
          logger.i("tests: $tests");
          return ListView.builder(
            itemCount: tests.length,
            itemBuilder: (context, index) {
              final test = tests[index];
              return Padding(
                padding: const EdgeInsets.all(8.0),
                child: ExpansionTileCard(
                  baseColor: Colors.redAccent,
                  expandedColor: Colors.white60,
                  title: SizedBox(
                    height: 50.0,
                    child: Row(
                      children: [
                        Text(
                          "${test.subject}[${test.testID}]",
                        ),
                        const Spacer(),
                        Text(
                          test.expiry,
                        ),
                      ],
                    ),
                  ),
                  children: [
                    const Divider(),
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20.0,
                        vertical: 8.0,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            alignment: Alignment.center,
                            height: 40.0,
                            width: 110.0,
                            decoration: BoxDecoration(
                              color: Colors.redAccent,
                              borderRadius: BorderRadius.circular(10.0),
                            ),
                            child: Text(
                              "Questions: ${test.questions.length.toString()}",
                            ),
                          ),
                          Container(
                            alignment: Alignment.center,
                            height: 40.0,
                            width: 110.0,
                            decoration: BoxDecoration(
                              color: Colors.redAccent,
                              borderRadius: BorderRadius.circular(10.0),
                            ),
                            child: Text(
                              "Time: ${test.time} min",
                            ),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: ElevatedButton(
                        onPressed: () {
                          testProvider.currentTest = test;
                          logger
                              .i("length of test is ${test.questions.length}");

                          showDialog(
                            // barrierDismissible: false,
                            context: context,
                            builder: (context) {
                              return AlertDialog(
                                title: SizedBox(
                                  height: 100,
                                  // width: 00,
                                  child: Column(
                                    children: [
                                      Text(' Attempt ${test.subject} Exam'),
                                      // const CircularProgressIndicator(),
                                      const Divider(),
                                    ],
                                  ),
                                ),
                                content: FormFields1(
                                  pinController: _pinController,
                                  text: "Student ID",
                                  txtinp: TextInputType.number,
                                ),
                                actions: [
                                  TextButton(
                                    onPressed: () async {
                                      await Provider.of<AuthProvider>(context,
                                              listen: false)
                                          .signInStudent(
                                        pin: _pinController.text,
                                        context: context,
                                      )
                                          .whenComplete(() {
                                        Navigator.of(context).pushNamed(
                                          QuestionsScreen.routeName,
                                          arguments: test.questions,
                                        );
                                      });
                                    },
                                    child: const Text('OK'),
                                  ),
                                ],
                              );
                            },
                          );
                        },
                        child: Text("Start Quiz"),
                      ),
                    )
                  ],
                ),
              );
            },
          );
        }
      }(),
    );
  }
}
