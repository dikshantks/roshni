import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:roshni_app/models/test_model.dart';
import 'package:roshni_app/providers/test_provider.dart';
import 'package:roshni_app/screen/common/quiz_screen.dart';
import 'package:roshni_app/services/api_service.dart';

class QuizListScreen extends StatefulWidget {
  const QuizListScreen({super.key});

  @override
  State<QuizListScreen> createState() => _QuizListScreenState();
}

class _QuizListScreenState extends State<QuizListScreen> {
  List<Test> tests = [];
  @override
  void initState() {
    super.initState();
    tests = Provider.of<TestProvider>(context, listen: false).tests;
    logger.i("tests: $tests");
  }

  @override
  Widget build(BuildContext context) {
    final testProvider = Provider.of<TestProvider>(context, listen: true);
    tests = testProvider.tests;

    return Scaffold(
        appBar: AppBar(
          title: const Text('Available Tests'),
        ),
        body: ListView.builder(
          itemCount: tests.length,
          itemBuilder: (context, index) {
            final test = tests[index];
            return ListTile(
              title: Text(test.subject),
              subtitle: Text(test.testID),
              onTap: () {
                testProvider.currentTest = test;
                logger.i("length of test is ${test.questions.length}");
                Navigator.of(context).pushNamed(
                  QuestionsScreen.routeName,
                  arguments: test.questions,
                );
              },
            );
          },
        ));
  }
}
