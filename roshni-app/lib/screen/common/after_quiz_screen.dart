import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/test_provider.dart';

class AfterQuizScreen extends StatefulWidget {
  static const routeName = '/quiz/result';

  const AfterQuizScreen({super.key});
  @override
  State<AfterQuizScreen> createState() => _AfterQuizScreenState();
}

class _AfterQuizScreenState extends State<AfterQuizScreen> {
  @override
  Widget build(BuildContext context) {
    var testProvider = Provider.of<TestProvider>(context);
    return Scaffold(
      appBar: AppBar(
        title: Text('Result'),
      ),
      body: ListView.builder(
        itemCount: testProvider.questions.length,
        itemBuilder: (context, index) {
          var question = testProvider.questions[index];
          return ListTile(
            title: Text(question.text),
            subtitle: Text(
                'Your answer: ${question.useranswer}\nCorrect answer: ${question.correct}'),
          );
        },
      ),
      bottomNavigationBar: BottomAppBar(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text('Total score: ${testProvider.score}'),
        ),
      ),
    );
  }
}
