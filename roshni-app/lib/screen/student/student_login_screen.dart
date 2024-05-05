import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/screen/student/student_screen.dart';
import 'package:roshni_app/widgets/form_field.dart';
import '../../widgets/buttons.dart';

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
    final screenSize = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Container(
        alignment: Alignment.center,
        padding: const EdgeInsets.all(40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: screenSize.width,
              height: screenSize.width * .7,
              child: Image.asset(
                "assets/images/roshni_black-removebg-preview.png",
              ),
            ),
            FormFields(
              txtinp: TextInputType.number,
              pinController: _pinController,
              text: 'Pin',
            ),
            RoundButton1(
              text: "Log in",
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
