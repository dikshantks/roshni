import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/screen/facilitator/facilitator_screen.dart';
import '../../utils/button-1.dart';

class FacilitatorLoginScreen extends StatefulWidget {
  static const routeName = '/facilitator/login';
  const FacilitatorLoginScreen({super.key});

  @override
  State<FacilitatorLoginScreen> createState() => _FacilitatorLoginScreen();
}

class _FacilitatorLoginScreen extends State<FacilitatorLoginScreen> {
  final _pinController = TextEditingController();
  final _passwordcontroller = TextEditingController();

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
              controller: _pinController,
              decoration: const InputDecoration(
                hintText: "PIN",
              ),
            ),
            TextField(
              controller: _passwordcontroller,
              decoration: const InputDecoration(
                hintText: "Password",
              ),
            ),
            RoundButton1(
              text: "Login ",
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
    final password = _passwordcontroller.text;

    await authProvider.signInEvaluator(
      evalID: pin,
      password: password,
      context: context,
    );

    // Navigate if login successful
    if (authProvider.status == AuthStatus.authenticated) {
      Navigator.of(context).pushReplacementNamed(FacilitatorScreen.routeName);
    }
  }
}
