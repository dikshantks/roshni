import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/test_provider.dart';
import 'package:roshni_app/screen/facilitator/facilitator_profile_screen.dart';

import 'package:roshni_app/screen/facilitator/facilitator_students_screen.dart';
import 'package:roshni_app/screen/facilitator/quiz_list_screen.dart';

class FacilitatorScreen extends StatefulWidget {
  static const routeName = '/facilitator';
  const FacilitatorScreen({super.key});

  @override
  State<FacilitatorScreen> createState() => _FacilitatorScreen();
}

class _FacilitatorScreen extends State<FacilitatorScreen> {
  int selectedindex = 0;
  final _pageController = PageController();

  List<Widget> widgetList = [
    const FacilitatorProfileScreen(),
    const StudentRegisterScreen(),
    const QuizListScreen(),
  ];

  @override
  void initState() {
    // TODO: implement initState
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
      backgroundColor: Colors.transparent,
      bottomNavigationBar: NavigationBar(
        indicatorColor: const Color.fromARGB(255, 255, 196, 196),
        onDestinationSelected: (value) {
          setState(() {
            selectedindex = value;
            _pageController.animateToPage(
              value,
              duration: const Duration(
                milliseconds: 300,
              ),
              curve: Curves.ease,
            );

            if (kDebugMode) {
              print("$value , $selectedindex , ${_pageController.page}");
            }
          });
        },
        labelBehavior: NavigationDestinationLabelBehavior.onlyShowSelected,
        selectedIndex: selectedindex,
        destinations: const [
          NavigationDestination(
            icon: Icon(
              Icons.person,
            ),
            label: "Profile",
          ),
          NavigationDestination(
            icon: Icon(
              Icons.menu_book_outlined,
            ),
            label: "Circle Chart",
          ),
          NavigationDestination(
            icon: Icon(
              Icons.book,
            ),
            label: "Open Book",
          ),
        ],
      ),
      body: PageView(
        controller: _pageController,
        children: widgetList,
        onPageChanged: (value) {
          setState(() {
            selectedindex = value;
          });
        },
      ),
    );
  }
}
