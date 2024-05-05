import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/test_provider.dart';
import 'package:roshni_app/screen/common/after_quiz_screen.dart';
import 'package:roshni_app/services/api_service.dart';

class ResultsScreen extends StatefulWidget {
  static const routeName = '/student/results';

  const ResultsScreen({super.key});
  @override
  State<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends State<ResultsScreen> {
  @override
  Widget build(BuildContext context) {
    var studetntprovider = Provider.of<AuthProvider>(context);
    return Scaffold(
          appBar: AppBar(
        centerTitle: true,
        title: const Text("Past Results"),
      ),
      body: Consumer<TestProvider>(
        builder: (context, testProvider, child) {
          final results =
              testProvider.getResultsForStudent(studetntprovider.student!.pin);

          if (results == null) {
            return const Center(
              child: Text("no test"),
            );
          }
          return results.isEmpty
              ? const Center(
                  child: Text("no test"),
                )
              : ListView.builder(
                  itemCount: results.length,
                  itemBuilder: (context, index) {
                    final result = results[index];

                    return ProfileListTiles1(
                        question: result.testID,
                        correctAnswer: result.score.toString(),
                        userAnswer: DateFormat('EEEE, MMMM d, yyyy h:mm a')
                            .format(result.timestamp));
                  },
                );
        },
      ),
    );
  }
}

class ProfileListTiles1 extends StatelessWidget {
  final String question;
  final String correctAnswer;
  final String userAnswer;
  const ProfileListTiles1({
    super.key,
    required this.question,
    required this.correctAnswer,
    required this.userAnswer,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 10.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10.0),
        color: Colors.redAccent,
      ),
      child: ListTile(
        onTap: () {
          var testProvider = Provider.of<TestProvider>(context, listen: false);
          testProvider.currentTest = testProvider.getTestById(question);
          testProvider.calculateScore();
          testProvider.calculateTotalMarks();
          logger.i('Score: ${testProvider.score}');
          logger.i('Total Marks: ${testProvider.currentTest}');
          Navigator.of(context).pushReplacementNamed(AfterQuizScreen.routeName);
        },
        title: Text(
          "Test ID: $question",
          style: GoogleFonts.roboto(
            textStyle: Theme.of(context).textTheme.titleLarge,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Score obtained : $correctAnswer",
                style: GoogleFonts.roboto(
                  textStyle: Theme.of(context).textTheme.bodyMedium,
                ),
              ),
              Text(
                "Time of Attmepting : $userAnswer",
                style: GoogleFonts.roboto(
                  textStyle: Theme.of(context).textTheme.bodyMedium,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
