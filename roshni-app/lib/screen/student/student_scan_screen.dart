import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/models/test_model.dart';
import 'package:roshni_app/providers/test_provider.dart';
import 'package:roshni_app/screen/common/quiz_screen.dart';
import 'package:roshni_app/services/api_service.dart';
import 'package:roshni_app/widgets/buttons.dart';
import 'package:roshni_app/widgets/form_field.dart';

class StudentScanScreen extends StatefulWidget {
  static String routeName = '/student/scan';
  const StudentScanScreen({super.key});

  @override
  State<StudentScanScreen> createState() => _StudentScanScreenState();
}

class _StudentScanScreenState extends State<StudentScanScreen> {
  final _pinController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final testprovider = Provider.of<TestProvider>(context, listen: true);
    void doingsomething(Test test) {
      showDialog(
        barrierDismissible: false,
        context: context,
        builder: (context) {
          return AlertDialog(
            title: SizedBox(
              // height: 150,
              width: size.width * .8,
              child: Column(
                children: [
                  Text('${test.subject} Exam'),
                  const Divider(),
                ],
              ),
            ),
            content: SizedBox(
              height: 200.0,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        alignment: Alignment.center,
                        height: 40.0,
                        width: 110.0,
                        decoration: BoxDecoration(
                          color: Colors.redAccent,
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                        child: Text(
                          "Questions: ${test.questions.length.toString()}",
                        ),
                      ),
                      Container(
                        alignment: Alignment.center,
                        height: 40.0,
                        width: 110.0,
                        decoration: BoxDecoration(
                          color: Colors.redAccent,
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                        child: Text(
                          "Time: ${test.time} min",
                        ),
                      ),
                    ],
                  ),
                  // SizedBox(
                  //   height: 40.0,
                  // ),
                  const Center(
                    child: Text(
                      "Proceed?",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Row(
                    children: [
                      ElevatedButton(
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                        child: const Text('No'),
                      ),
                      const Spacer(),
                      ElevatedButton(
                        onPressed: () {
                          logger.i(" hmssdfsm ${test.questions}");
                          Navigator.of(context).pushNamed(
                            QuestionsScreen.routeName,
                            arguments: test.questions,
                          );
                        },
                        child: const Text('Yes'),
                      ),
                    ],
                  )
                ],
              ),
            ),
            // actions: [

            // ],
          );
        },
      );
    }

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        automaticallyImplyLeading: false,
        title: const Center(child: Text('Attempt Exam')),
      ),
      backgroundColor: Colors.transparent,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 100),
            Container(
              width: size.width * .7,
              height: size.width * .7,
              decoration: const BoxDecoration(
                shape: BoxShape.rectangle,
                borderRadius: BorderRadius.all(Radius.circular(20)),
                color: Colors.grey,

                // color: Colors.redAccent,
              ),
              child: const Center(
                child: FaIcon(
                  FontAwesomeIcons.camera,
                  size: 75.0,
                  color: Colors.white70,
                ),
              ),
            ),
            const SizedBox(height: 30),
            const Text(
              "OR",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            FormFields(
              pinController: _pinController,
              text: "Exam Code",
              txtinp: TextInputType.number,
            ),
            RoundButton1(
              text: "Log in",
              onPressed: () {
                testprovider.selectTest(_pinController.text);
                final test = testprovider.currentTest;
                logger.i(" hmm ${test?.testID ?? testprovider.currentTest}");
                if (testprovider.currentTest == null) {
                  showDialog(
                    context: context,
                    builder: (context) {
                      return AlertDialog(
                        title: const Text('Error'),
                        content: const Text('Invalid Exam Code'),
                        actions: [
                          TextButton(
                            onPressed: () {
                              Navigator.of(context).pop();
                            },
                            child: const Text('OK'),
                          ),
                        ],
                      );
                    },
                  );
                } else {
                  // Navigator.of(context).pushNamed(
                  //   QuestionsScreen.routeName,
                  //   arguments: test!.questions,
                  // );
                  doingsomething(test!);
                }
              },
            ),
            const SizedBox(
              height: 10.0,
            )
          ],
        ),
      ),
    );
  }
}
