import 'package:flutter/material.dart';
import 'package:roshni_app/screen/common/quiz_screen.dart';
import 'package:roshni_app/utils/button-1.dart';

class StudentScanScreen extends StatefulWidget {
  static String routeName = '/student/scan';
  const StudentScanScreen({super.key});

  @override
  State<StudentScanScreen> createState() => _StudentScanScreenState();
}

class _StudentScanScreenState extends State<StudentScanScreen> {
  final _pinController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _pinController,
              decoration: const InputDecoration(
                hintText: "Exam Code",
              ),
            ),
            RoundButton1(
              text: "Log in",
              onPressed: () {
                Navigator.of(context).pushNamed(
                  QuestionsScreen.routeName,
                  arguments: _pinController.text as String,
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
