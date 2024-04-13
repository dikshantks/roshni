import 'package:flutter/material.dart';
import 'package:roshni_app/models/question_model.dart';

class QuestionsScreen extends StatefulWidget {
  const QuestionsScreen({super.key});

  @override
  State<QuestionsScreen> createState() => _QuestionsScreenState();
}

class _QuestionsScreenState extends State<QuestionsScreen> {
  late List<Question> _questions;
  int _currentIndex = 0;
  int _obtainedMarks = 0;

  void _answerQuestion(String answer) {
    setState(() {
      _questions[_currentIndex].useranswer = answer;

      if (answer == _questions[_currentIndex].correct) {
        _obtainedMarks++;
      }

      if (_currentIndex < _questions.length - 1) {
        _currentIndex++;
      } else {
        // Navigate to the result screen or show the obtained marks
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: Text('Quiz Result'),
            content:
                Text('You scored $_obtainedMarks out of ${_questions.length}'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text('OK'),
              ),
            ],
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Question'),
      ),
      body: _questions.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Text(_questions[_currentIndex].text),
                ...List.generate(
                  _questions[_currentIndex].options.length,
                  (index) => ElevatedButton(
                    child: Text(_questions[_currentIndex].options[index]),
                    onPressed: () => _answerQuestion(
                        _questions[_currentIndex].options[index]),
                  ),
                ),
              ],
            ),
    );
  }
}
