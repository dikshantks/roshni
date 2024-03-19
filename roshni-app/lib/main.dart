import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/test_provider.dart';
import 'package:roshni_app/services/api_service.dart';
import 'package:roshni_app/utils/route_generation.dart';
import 'package:roshni_app/themes/themes.dart';

const String baseurl = "http://127.0.0.1:5000/api";

void main() {
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
            TestService("$baseurl/students"),
            QuestionService("$baseurl/students"),
          ),
        ),
      ],
      child: MaterialApp(
        theme: theme1,
        debugShowCheckedModeBanner: false,
        initialRoute: '/',
        onGenerateRoute: onGenerateRoute,
        builder: (context, child) => DecoratedBox(
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: AssetImage("assets/images/background.png"),
              fit: BoxFit.cover,
            ),
          ),
          child: child,
        ),
      ),
    ),
  );
}
