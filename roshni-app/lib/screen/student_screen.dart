import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/test_provider.dart';

class StudentScreen extends StatefulWidget {
  static const routeName = '/student';
  const StudentScreen({super.key});

  @override
  State<StudentScreen> createState() => _StudentScreen();
}

class _StudentScreen extends State<StudentScreen> {
  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  void _fetchData() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final testProvider = Provider.of<TestProvider>(context, listen: false);

    if (authProvider.status == AuthStatus.authenticated &&
        authProvider.ngoId != null) {
      testProvider.fetchTests();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (value) =>
            debugPrint(" sdf  sdf sdf  sdf sdf $value , "),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home), label: "home"),
          NavigationDestination(icon: Icon(Icons.home), label: "home"),
          NavigationDestination(icon: Icon(Icons.home), label: "home"),
        ],
      ),
      backgroundColor: Colors.transparent,
    );
  }
}
