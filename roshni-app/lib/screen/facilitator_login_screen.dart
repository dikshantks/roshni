import 'package:flutter/material.dart';
import 'package:roshni_app/screen/facilitator_screen.dart';

import '../common/button-1.dart';

class FacilitatorLoginScreen extends StatefulWidget {
  static const routeName = '/facilitator/login';
  const FacilitatorLoginScreen({super.key});

  @override
  State<FacilitatorLoginScreen> createState() => _FacilitatorLoginScreen();
}

class _FacilitatorLoginScreen extends State<FacilitatorLoginScreen> {
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
              text: "Login ",
              onPressed: () {
                Navigator.of(context).pushNamed(FacilitatorScreen.routeName);
              },
            ),
          ],
        ),
      ),
    );
  }
}
