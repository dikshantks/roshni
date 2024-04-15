import 'package:flutter/material.dart';
import 'package:roshni_app/screen/facilitator/facilitator_login_screen.dart';
import 'package:roshni_app/screen/facilitator/facilitator_screen.dart';
import 'package:roshni_app/screen/facilitator/facilitator_examscreen_screen.dart';
import 'package:roshni_app/screen/facilitator/facilitator_students_screen.dart';
import 'package:roshni_app/screen/common/onboarding_screen.dart';
import 'package:roshni_app/screen/common/quiz_screen.dart';
import 'package:roshni_app/screen/student/student_login_screen.dart';
import 'package:roshni_app/screen/student/student_profile_screen.dart';
import 'package:roshni_app/screen/student/student_scan_screen.dart';
import 'package:roshni_app/screen/student/student_screen.dart';

Route<dynamic>? onGenerateRoute(RouteSettings settings) {
  print('Routing: ${settings.name} with arguments: ${settings.arguments}');

  switch (settings.name) {
    case '/':
      return MaterialPageRoute(
        builder: (_) => const OnboardingScreen(),
      );
    case '/facilitator/login':
      return MaterialPageRoute(
        builder: (_) => const FacilitatorLoginScreen(),
      );
    case '/student/login':
      return MaterialPageRoute(
        builder: (_) => const StudentLoginScreen(),
      );
    case '/facilitator':
      return MaterialPageRoute(
        builder: (_) => const FacilitatorScreen(),
      );
    case '/facilitator/register':
      return MaterialPageRoute(
        builder: (_) => const StudentRegisterScreen(),
      );

    case '/facilitator/exams':
      return MaterialPageRoute(
        builder: (_) => const FacilitatorExamScreen(),
      );

    case '/student':
      return MaterialPageRoute(
        builder: (_) => const StudentScreen(),
      );
    case '/student/profile':
      return MaterialPageRoute(
        builder: (_) => const StudentProfileScreen(),
      );
    case '/student/tests':
      print(settings.arguments);
      final testId = settings.arguments as List<dynamic>;
      print('testId: $testId');
      return MaterialPageRoute(
        builder: (_) => QuestionsScreen(
          testId: testId,
        ),
      );
    case '/student/scan':
      return MaterialPageRoute(
        builder: (_) => const StudentScanScreen(),
      );

    // case '/student/past-results':
    //   return MaterialPageRoute(builder: (_) => StudentPastResults());

    // case '/student/give-exam':
    //   final testId = settings.arguments as String;
    //   return MaterialPageRoute(builder: (_) => StudentTakeTest(testId: testId));

    default:
      return _errorRoute(message: 'Route not found: ${settings.name}');
  }
}

Route<dynamic> _errorRoute({required String message}) {
  return MaterialPageRoute(
    builder: (context) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Display a visually appealing error icon or image
            const Icon(Icons.error_outline, size: 100, color: Colors.red),
            const SizedBox(height: 20),
            Text(
              message,
              style: const TextStyle(fontSize: 20),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            // Provide a button to navigate back to a safe screen (e.g., home)
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/'),
              child: const Text('Go Home'),
            )
          ],
        ),
      ),
    ),
  );
}
