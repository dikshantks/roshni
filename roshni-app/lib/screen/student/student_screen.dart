import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/test_provider.dart';
import 'package:roshni_app/screen/quiz_list_screen.dart';
import 'package:roshni_app/screen/student/student_profile_screen.dart';
import 'package:roshni_app/screen/student/student_scan_screen.dart';

class StudentScreen extends StatefulWidget {
  static const routeName = '/student';
  const StudentScreen({super.key});

  @override
  State<StudentScreen> createState() => _StudentScreen();
}

class _StudentScreen extends State<StudentScreen> {
  final _pageController = PageController();
  int selectedindex = 0;

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

  List<Widget> widgetList = [
    const StudentProfileScreen(),
    const QuizListScreen(),
  ];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Logger().i("route");
          Navigator.of(context).pushNamed(StudentScanScreen.routeName);
        },
        child: const Icon(Icons.camera_enhance),
      ),
      backgroundColor: Colors.transparent,
      bottomNavigationBar: NavigationBar(
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
              Icons.book,
            ),
            label: "Open Book",
          ),
        ],
        onDestinationSelected: (index) {
          setState(
            () => selectedindex = index,
          );
          _pageController.animateToPage(
              curve: Curves.ease,
              duration: Duration(milliseconds: 300),
              selectedindex);
        },
      ),
      body: PageView.builder(
        controller: _pageController,
        itemCount: widgetList.length,
        itemBuilder: (context, index) => widgetList[index],
        onPageChanged: (index) {
          setState(() => selectedindex = index); // Update selected tab
        },

        // children: widgetList,
        // onPageChanged: (value) {
        //   setState(() {
        //     selectedindex = value;
        //   });
        //   _pageController.jumpToPage(selectedindex);
        // },
      ),
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }
}
