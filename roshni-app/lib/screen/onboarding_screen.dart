import 'package:flutter/material.dart';
import 'package:roshni_app/screen/facilitator_login_screen.dart';
import 'package:roshni_app/screen/student_login_screen.dart';

import '../common/button-1.dart';

class OnboardingScreen extends StatefulWidget {
  static const routeName = '/onboarding';
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset("assets/images/roshni_black-removebg-preview.png"),
            RoundButton1(
              text: "Evaluator Login",
              onPressed: () {
                Navigator.of(context)
                    .pushNamed(FacilitatorLoginScreen.routeName);
              },
            ),
            RoundButton1(
              text: "Student Login",
              onPressed: () {
                Navigator.of(context).pushNamed(StudentLoginScreen.routeName);
              },
            ),
          ],
        ),
      ),
    );
  }
}
