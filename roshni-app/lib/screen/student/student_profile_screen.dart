import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/models/test_model.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/test_provider.dart';

class StudentProfileScreen extends StatefulWidget {
  const StudentProfileScreen({super.key});

  @override
  State<StudentProfileScreen> createState() => _StudentProfileScreen();
}

class _StudentProfileScreen extends State<StudentProfileScreen> {
  List<Test> tests = [];
  @override
  void initState() {
    super.initState();
    tests = Provider.of<TestProvider>(context, listen: false).tests;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Consumer<AuthProvider>(builder: (context, authprovider, child) {
        final student = authprovider.student;
        return Stack(
          children: [
            Column(
              children: [
                Container(
                  height: 200,
                  width: double.infinity,
                  color: Colors.redAccent,
                  child: Positioned(
                    top: 10.0,
                    left: 10.0,
                    child: Consumer<TestProvider>(
                      builder: (context, testProvider, child) {
                        return testProvider.isLoading // Check if loading
                            ? CircularProgressIndicator(
                                // radius: 80.0,
                                ) // Show indicator
                            : Column(
                                // Show your normal content when not loading
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  // Your buttons, lists, etc.
                                ],
                              );
                      },
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 75, left: 20, right: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        '${student!.firstName} ${student.lastName}',
                        style: GoogleFonts.openSans(
                          fontSize: 25,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        student.pin,
                        style: GoogleFonts.openSans(
                          fontSize: 20,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 10),
                      ProfileRow(
                        field: "Gender",
                        detail: student.gender == 'M' ? "Male" : 'Female',
                      ),
                      ProfileRow(
                        field: "date of birth",
                        detail: student.dob,
                      ),
                      ProfileRow(
                        field: "Center",
                        detail: student.location,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            Positioned(
              left: 0,
              right: 0,
              top: 120,
              child: Column(
                children: [
                  CircleAvatar(
                    radius:
                        75, // Adjust this value to change the size of the CircleAvatar
                    // child: ClipOval(
                    backgroundImage: AssetImage(
                      student.gender == 'M'
                          ? "assets/images/boy.png"
                          : "assets/images/girl.png",
                    ),
                    //   child: Image.asset(
                    //     // fit: boxfi,
                    //     scale: 3.0,
                    //     // fit: BoxFit.contain,
                    //     student.gender == 'M'
                    //         ? "assets/images/boy.png"
                    //         : "assets/images/girl.png",
                    //   ),
                    // ),
                  ),
                ],
              ),
            ),
          ],
        );
      }),
    );
  }
}

class ProfileRow extends StatelessWidget {
  const ProfileRow({
    super.key,
    required this.field,
    required this.detail,
  });
  final String field;

  final String detail;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            field,
            style: GoogleFonts.openSans(
              color: Colors.grey[700],
              fontWeight: FontWeight.w500,
              fontSize: 16,
            ),
          ),
          Text(
            detail,
            style: GoogleFonts.openSans(
              color: Colors.black,
              fontWeight: FontWeight.w500,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}

// void _showQuestionPopup(BuildContext context, Test test) {
//   showDialog(
//     context: context,
//     builder: (context) {
//       return AlertDialog(
//         title: Text('Questions for ${test.subject}'),
//         content: FutureBuilder<List<Question>>(
//           future: Provider.of<TestProvider>(context)
//               .fetchQuestionsFromHive(test.questions), // Fetch from Hive
//           builder: (context, snapshot) {
//             if (snapshot.connectionState == ConnectionState.waiting) {
//               print("waiting");
//               return const Center(child: Text('Loading...'));
//             }
//             if (snapshot.hasError) {
//               print("error");
//               return Center(child: Text('Error: ${snapshot.error}'));
//             }
//             if (snapshot.hasData) {
//               print(
//                   " hereeererer he${snapshot.data!.length}"); // Print number of questions
//               return Column(
//                 mainAxisSize:
//                     MainAxisSize.min, // Important for scrollable list
//                 children: snapshot.data!
//                     .map((question) => Text(question.questionID))
//                     .toList(),
//               );
//             } else {
//               return Center(child: CircularProgressIndicator());
//             }
//           },
//         ),
//         actions: [
//           TextButton(
//               onPressed: () => Navigator.pop(context), child: Text('Close')),
//         ],
//       );
//     },
//   );
// }
