import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/models/question_model.dart';
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
    tests = Provider.of<TestProvider>(context, listen: true).tests;

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
                logger.i("length of test is ${test.questions.length}");
                Navigator.of(context).pushNamed(
                  QuestionsScreen.routeName,
                  arguments: test.questions as List<dynamic>,
                );
              },
            );
          },
        ));
  }

  void _showQuestionPopup(BuildContext context, Test test) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Questions for ${test.subject}'),
          content: FutureBuilder<List<Question>>(
            future: Provider.of<TestProvider>(context)
                .fetchQuestionsFromHive(test.questions), // Fetch from Hive
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                print("waiting");
                return const Center(child: Text('Loading...'));
              }
              if (snapshot.hasError) {
                print("error");
                return Center(child: Text('Error: ${snapshot.error}'));
              }
              if (snapshot.hasData) {
                print(
                    " hereeererer he${snapshot.data!.length}"); // Print number of questions
                return Column(
                  mainAxisSize:
                      MainAxisSize.min, // Important for scrollable list
                  children: snapshot.data!
                      .map((question) => Text(question.questionID))
                      .toList(),
                );
              } else {
                return Center(child: CircularProgressIndicator());
              }
            },
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Close'),
            ),
          ],
        );
      },
    );
  }
}
