import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/test_provider.dart';
import 'package:string_similarity/string_similarity.dart';

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
    var authproivder = Provider.of<AuthProvider>(context);
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          'Result',
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Column(
          children: [
            Expanded(
              flex: 2,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Text("Name : ${authproivder.student?.firstName}"),
                      const Spacer(),
                      Text("Pin : ${authproivder.student?.pin}"),
                    ],
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Text("Exam: ${testProvider.currentTest?.subject}"),
                      const Spacer(),
                      Text(
                          "number of questions: ${testProvider.currentTest?.questions.length}"),
                    ],
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: CircularPercentIndicator(
                      radius: 60.0,
                      animation: true,
                      animationDuration: 2000,
                      curve: Curves.easeInToLinear,
                      lineWidth: 15.0,
                      percent: testProvider.score / testProvider.totalmarks,
                      // circularStrokeCap: CircularStrokeCap.round,
                      center: Text(
                        "${(testProvider.score / testProvider.totalmarks) * 100} %",
                      ),
                      rotateLinearGradient: true,
                      arcType: ArcType.FULL,
                      arcBackgroundColor: Colors.grey,
                    ),
                  ),
                  Text(
                    "Score : ${testProvider.score} out of ${testProvider.totalmarks}",
                  ),
                  const Text("Your Answers"),
                ],
              ),
            ),
            Expanded(
              flex: 4,
              child: Container(
                padding: const EdgeInsets.all(2.0),
                child: ListView.builder(
                  itemCount: testProvider.questions.length,
                  itemBuilder: (context, index) {
                    final question = testProvider.questions[index];
                    return question.type == "text"
                        ? ProfileListTiles1(
                            question:
                                "Q${index + 1}) ${question.text} Marks:${question.marks ?? "hmm"}",
                            correctAnswer: question.correct[
                                0], // Assuming the first item is the correct answer
                            userAnswer: question.useranswer ?? "",
                            correctAnswers: question
                                .correct, // Pass the list of correct answers
                          )
                        : ProfileListTiles(
                            question: "Q${index + 1}) ${question.text}",
                            correctAnswer: question.correct[0],
                            userAnswer: question.useranswer ?? "",
                          );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ProfileListTiles extends StatelessWidget {
  final String question;
  final String correctAnswer;
  final String userAnswer;
  const ProfileListTiles({
    super.key,
    required this.question,
    required this.correctAnswer,
    required this.userAnswer,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10.0),
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10.0),
          color: correctAnswer == userAnswer
              ? Colors.greenAccent.shade200
              : Colors.redAccent.shade100),
      child: ListTile(
        title: Text(
          question,
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
                "Correct: $correctAnswer",
                style: GoogleFonts.roboto(
                  textStyle: Theme.of(context).textTheme.bodyMedium,
                ),
              ),
              Text(
                "Your answer: $userAnswer",
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

class ProfileListTiles1 extends StatelessWidget {
  final String question;
  final String correctAnswer;
  final String userAnswer;
  final List<dynamic>
      correctAnswers; // Assuming this is a list of correct answers for text type questions

  const ProfileListTiles1({
    super.key,
    required this.question,
    required this.correctAnswer,
    required this.userAnswer,
    required this.correctAnswers,
  });

  double calculateSimilarityScore(
      String userAnswer, List<dynamic> correctAnswers) {
    double maxSimilarity = 0.0;

    for (String answer in correctAnswers) {
      double similarity =
          StringSimilarity.compareTwoStrings(userAnswer, answer);
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
      }
    }
    return maxSimilarity;
  }

  @override
  Widget build(BuildContext context) {
    // Calculate similarity score for text type questions
    double similarityScore =
        calculateSimilarityScore(userAnswer, correctAnswers);
    bool isCorrect =
        similarityScore >= 0.8; // You can adjust this threshold as needed

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10.0),
        color:
            isCorrect ? Colors.greenAccent.shade200 : Colors.redAccent.shade100,
      ),
      child: ListTile(
        title: Text(
          question,
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
                "Correct: $correctAnswer",
                style: GoogleFonts.roboto(
                  textStyle: Theme.of(context).textTheme.bodyMedium,
                ),
              ),
              Text(
                "Your answer: $userAnswer",
                style: GoogleFonts.roboto(
                  textStyle: Theme.of(context).textTheme.bodyMedium,
                ),
              ),
              if (!isCorrect) ...[
                Text(
                  "Similarity Score: ${similarityScore.toStringAsFixed(2)}",
                  style: GoogleFonts.roboto(
                    textStyle: Theme.of(context).textTheme.bodySmall,
                    color: Colors.grey,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
