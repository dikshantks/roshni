import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/screen/facilitator/facilitator_login_screen.dart';
import 'package:roshni_app/screen/student/student_login_screen.dart';
import 'package:roshni_app/services/api_service.dart';

import '../../widgets/buttons.dart';

class OnboardingScreen extends StatefulWidget {
  static const routeName = '/onboarding';
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  @override
  Widget build(BuildContext context) {
    var authProvider = Provider.of<AuthProvider>(context);
    logger.i(
        "main page| fac:${authProvider.facilitator}| stu:${authProvider.student}| ${authProvider.status}");

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
