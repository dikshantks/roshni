import 'package:flutter/material.dart';
import 'package:roshni_app/screen/student_screen.dart';

import '../common/button-1.dart';

class StudentLoginScreen extends StatefulWidget {
  static const routeName = '/student/login';
  const StudentLoginScreen({super.key});

  @override
  State<StudentLoginScreen> createState() => _StudentLoginScreen();
}

class _StudentLoginScreen extends State<StudentLoginScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              decoration: InputDecoration(
                hintText: "Email",
              ),
            ),
            TextField(
              decoration: InputDecoration(
                hintText: "Password",
              ),
            ),
            RoundButton1(
              text: "Log ",
              onPressed: () {
                Navigator.of(context).pushNamed(StudentScreen.routeName);
              },
            ),
          ],
        ),
      ),
    );
  }
}
