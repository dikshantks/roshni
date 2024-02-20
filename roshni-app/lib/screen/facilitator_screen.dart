import 'package:flutter/material.dart';

class FacilitatorScreen extends StatefulWidget {
  static const routeName = '/facilitator';
  const FacilitatorScreen({super.key});

  @override
  State<FacilitatorScreen> createState() => _FacilitatorScreen();
}

class _FacilitatorScreen extends State<FacilitatorScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (value) => print(value),
        destinations: [
          NavigationDestination(icon: Icon(Icons.home), label: "home"),
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
