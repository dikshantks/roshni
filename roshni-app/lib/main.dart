import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/models/facilitator_model.dart';
import 'package:roshni_app/models/question_model.dart';
import 'package:roshni_app/models/result_model.dart';
import 'package:roshni_app/models/student_model.dart';
import 'package:roshni_app/models/test_model.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/facilitator_provider.dart';
import 'package:roshni_app/providers/test_provider.dart';
import 'package:roshni_app/screen/common/onboarding_screen.dart';
import 'package:roshni_app/screen/facilitator/facilitator_screen.dart';
import 'package:roshni_app/screen/student/student_screen.dart';
import 'package:roshni_app/services/api_service.dart';
import 'package:roshni_app/utils/route_generation.dart';
import 'package:roshni_app/themes/themes.dart';

const String baseurl = "https://roshni-api.onrender.com/api";

void main() async {
  await Hive.initFlutter();
  Hive.registerAdapter(TestAdapter());
  Hive.registerAdapter(QuestionAdapter());
  Hive.registerAdapter(StudentAdapter());
  Hive.registerAdapter(ResultAdapter());
  Hive.registerAdapter(FacilitatorAdapter());
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (context) => AuthProvider(
            AuthService(baseurl),
          ),
        ),
        ChangeNotifierProvider(
          create: (context) => TestProvider(
            TestService(baseurl),
            QuestionService(baseurl),
          ),
        ),
        ChangeNotifierProvider(
          create: (context) => FacilitatorProvider(
            FacApiService(baseurl),
          ),
        ),
      ],
      // child: MaterialApp(
      //   theme: theme1,
      //   debugShowCheckedModeBanner: false,
      //   initialRoute: '/',
      //   onGenerateRoute: onGenerateRoute,
      //   builder: (context, child) => DecoratedBox(
      //     decoration: const BoxDecoration(
      //       image: DecorationImage(
      //         image: AssetImage(
      //           "assets/images/background.png",
      //         ),
      //         fit: BoxFit.cover,
      //       ),
      //     ),
      //     child: child,
      //   ),
      // ),
      child: MaterialApp(
        theme: theme1,
        debugShowCheckedModeBanner: false,
        home: Consumer<AuthProvider>(
          builder: (context, authProvider, _) {
            logger.i(
                "main page fac ${authProvider.facilitator} : stu ${authProvider.student} ${authProvider.status}");
            if (authProvider.facilitator == null &&
                authProvider.student == null) {
              return const OnboardingScreen();
            } else if (authProvider.facilitator != null) {
              return const FacilitatorScreen();
            } else if (authProvider.student != null) {
              return const StudentScreen();
            } else {
              logger.i(authProvider.status);
              return const Center(
                child: CircularProgressIndicator(),
              ); // Show a loading spinner while waiting for auth state
            }
          },
        ),
        onGenerateRoute: onGenerateRoute,
        builder: (context, child) => DecoratedBox(
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: AssetImage(
                "assets/images/background.png",
              ),
              fit: BoxFit.cover,
            ),
          ),
          child: child,
        ),
      ),
    ),
  );
}
