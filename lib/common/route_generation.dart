import 'package:flutter/material.dart';

Route<dynamic>? onGenerateRoute(RouteSettings settings) {
  print('Routing: ${settings.name}');

  switch (settings.name) {
    case '/':
      return MaterialPageRoute(
          builder: (_) => const Scaffold(
                body: Center(
                  child: Text('Hello World!'),
                ),
              ));
    // case '/facilitator/profile':
    //   return MaterialPageRoute(builder: (_) => FacilitatorProfile());

    // case '/facilitator/students':
    //   return MaterialPageRoute(builder: (_) => FacilitatorStudents());

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

    // case '/student/take-test':
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
            Icon(Icons.error_outline, size: 100, color: Colors.red),
            SizedBox(height: 20),
            Text(
              message,
              style: TextStyle(fontSize: 20),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 40),
            // Provide a button to navigate back to a safe screen (e.g., home)
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/'),
              child: Text('Go Home'),
            )
          ],
        ),
      ),
    ),
  );
}
