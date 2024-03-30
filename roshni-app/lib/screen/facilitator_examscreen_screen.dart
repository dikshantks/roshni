import 'package:flutter/material.dart';

class FacilitatorExamScreen extends StatefulWidget {
  static String routename = '/facilitator/exam';
  const FacilitatorExamScreen({super.key});

  @override
  State<FacilitatorExamScreen> createState() => FacilitatorExamScreenState();
}

class FacilitatorExamScreenState extends State<FacilitatorExamScreen> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('fac exam  Screen'),
      ),
    );
  }
}
