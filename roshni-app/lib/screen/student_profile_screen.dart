import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/models/question_model.dart';
import 'package:roshni_app/models/test_model.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/test_provider.dart';

class StudentProfileScreen extends StatefulWidget {
  static const routeName = '/student/profile';
  const StudentProfileScreen({super.key});

  @override
  State<StudentProfileScreen> createState() => _StudentProfileScreen();
}

class _StudentProfileScreen extends State<StudentProfileScreen> {
  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  void _fetchData() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    if (authProvider.status == AuthStatus.authenticated &&
        authProvider.ngoId != null) {
      Provider.of<TestProvider>(context, listen: false).fetchTests();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tests')),
      body: Consumer<TestProvider>(
        builder: (context, testProvider, child) {
          if (testProvider.isLoading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          } else if (testProvider.error != null) {
            return Center(
              child: Text('Error: ${testProvider.error}'),
            );
          } else {
            // print("test length: ${testProvider.tests.length}");
            return ListView.builder(
              itemCount: testProvider.tests.length,
              itemBuilder: (context, index) {
                final test = testProvider.tests[index];
                return ListTile(
                  title: Text(
                    test.subject,
                  ),
                  leading: Text(
                    test.questions.length.toString(),
                  ), // Display test subject
                  onTap: () => _showQuestionPopup(
                    context,
                    test,
                  ),
                );
              },
            );
          }
        },
      ),
    );
  }

  void _showQuestionPopup(BuildContext context, Test test) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Questions for ${test.subject}'),
          content: FutureBuilder<List<Question>>(
            future: Provider.of<TestProvider>(context)
                .fetchQuestionsFromHive(test.testID), // Fetch from Hive
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                print("waiting");
                return Center(child: Text('Loading...'));
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
                onPressed: () => Navigator.pop(context), child: Text('Close')),
          ],
        );
      },
    );
  }
}
