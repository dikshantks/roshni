import 'package:flutter/material.dart';

class StudentRegisterScreen extends StatefulWidget {
  static String routename = '/facilitator/register';
  const StudentRegisterScreen({super.key});

  @override
  State<StudentRegisterScreen> createState() => _StudentRegisterScreenState();
}

class _StudentRegisterScreenState extends State<StudentRegisterScreen> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Student Register Screen'),
      ),
    );
  }
}
