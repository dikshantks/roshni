import 'package:flutter/material.dart';
import 'package:roshni_app/screen/facilitator_login_screen.dart';
import 'package:roshni_app/screen/facilitator_screen.dart';
import 'package:roshni_app/screen/onboarding_screen.dart';
import 'package:roshni_app/screen/student_login_screen.dart';
import 'package:roshni_app/screen/student_screen.dart';

Route<dynamic>? onGenerateRoute(RouteSettings settings) {
  print('Routing: ${settings.name}');

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
    case '/student':
      return MaterialPageRoute(
        builder: (_) => const StudentScreen(),
      );

    // case '/facilitator/exams':
    //   return MaterialPageRoute(builder: (_) => FacilitatorExams());

    // case '/facilitator/exams/:examId':
    //   final examId = settings.arguments as String;
    //   return MaterialPageRoute(
    //       builder: (_) => FacilitatorExamDetails(examId: examId));

    // case '/student/home':
    //   return MaterialPageRoute(builder: (_) => StudentHome());

    // case '/student/past-results':
    //   return MaterialPageRoute(builder: (_) => StudentPastResults());

    // case '/student/give-exam':
    //   final testId = settings.arguments as String;
    //   return MaterialPageRoute(builder: (_) => StudentTakeTest(testId: testId));

    // case '/student/results/:testId':
    //   final testId = settings.arguments as String;
    //   return MaterialPageRoute(
    //       builder: (_) => StudentTestResult(testId: testId));

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
