import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/screen/facilitator/facilitator_screen.dart';

import 'package:roshni_app/widgets/form_field.dart';
import '../../widgets/buttons.dart';

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
    final screenSize = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Container(
        margin: const EdgeInsets.only(
          top: 30,
          left: 10.0,
          right: 10.0,
          bottom: 10.0,
        ),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                height: screenSize.height * .15,
              ),
              SizedBox(
                width: screenSize.width,
                height: screenSize.width * .7,
                child: Image.asset(
                  "assets/images/roshni_black-removebg-preview.png",
                ),
              ),
              FormFields(
                pinController: _pinController,
                text: "PIN",
                txtinp: TextInputType.number,
              ),
              FormFields(
                pinController: _passwordcontroller,
                text: "PASSWORD",
                txtinp: TextInputType.visiblePassword,
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
