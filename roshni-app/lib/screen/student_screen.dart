import 'package:flutter/material.dart';

class StudentScreen extends StatefulWidget {
  static const routeName = '/student';
  const StudentScreen({super.key});

  @override
  State<StudentScreen> createState() => _StudentScreen();
}

class _StudentScreen extends State<StudentScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (value) => print(value),
        destinations: [
          NavigationDestination(icon: Icon(Icons.home), label: "home"),
          NavigationDestination(icon: Icon(Icons.home), label: "home"),
          NavigationDestination(icon: Icon(Icons.home), label: "home"),
        ],
      ),
      backgroundColor: Colors.transparent,
      // body: SafeArea(
      //   child: Column(
      //     crossAxisAlignment: CrossAxisAlignment.center,
      //     mainAxisAlignment: MainAxisAlignment.center,
      //     children: [],
      //   ),
      // ),
    );
  }
}
