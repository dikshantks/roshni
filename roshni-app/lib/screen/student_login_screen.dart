import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/screen/student_screen.dart';

import '../utils/button-1.dart';

class StudentLoginScreen extends StatefulWidget {
  static const routeName = '/student/login';
  const StudentLoginScreen({super.key});

  @override
  State<StudentLoginScreen> createState() => _StudentLoginScreen();
}

class _StudentLoginScreen extends State<StudentLoginScreen> {
  final _pinController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const TextField(
              decoration: InputDecoration(
                hintText: "Password",
              ),
            ),
            RoundButton1(
              text: "Log ",
              onPressed: () async {
                await _handleLogin(context);
              },
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _handleLogin(BuildContext context) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final pin = _pinController.text;

    await authProvider.signInStudent(pin: pin, context: context);

    // Navigate if login successful
    if (authProvider.status == AuthStatus.authenticated) {
      Navigator.of(context).pushReplacementNamed(StudentScreen.routeName);
    }
  }
}
