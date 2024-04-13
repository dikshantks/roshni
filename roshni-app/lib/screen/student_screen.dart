import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/test_provider.dart';
import 'package:roshni_app/screen/student_profile_screen.dart';

class StudentScreen extends StatefulWidget {
  static const routeName = '/student';
  const StudentScreen({super.key});

  @override
  State<StudentScreen> createState() => _StudentScreen();
}

class _StudentScreen extends State<StudentScreen> {
  @override
  void initState() {
    print("studet screen ");
    super.initState();
    _fetchData();
  }

  void _fetchData() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final testProvider = Provider.of<TestProvider>(context, listen: false);

    // if (authProvider.status == AuthStatus.authenticated &&
    //     authProvider.ngoId != null) {
    testProvider.fetchTests();
    // }
  }

  int selectedindex = 0;
  final _pageController = PageController();

  List<Widget> widgetList = [
    const StudentProfileScreen(),
    // const FacilitatorExamScreen(),
  ];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.camera_enhance),
      ),
      backgroundColor: Colors.transparent,
      bottomNavigationBar: NavigationBar(
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
          // NavigationDestination(
          //   icon: Icon(
          //     Icons.pie_chart,
          //   ),
          //   label: "Circle Chart",
          // ),
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
