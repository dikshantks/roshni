import 'package:flutter/material.dart';
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
    final Size = MediaQuery.of(context).size;
    final testprovider = Provider.of<TestProvider>(context, listen: true);
    void doingsomething(Test test) {
      showDialog(
          barrierDismissible: false,
          context: context,
          builder: (context) {
            return AlertDialog(
              title: SizedBox(
                height: 100,
                // width: 100,
                child: Column(
                  children: [
                    Text('${test.subject} Exam'),
                    // const CircularProgressIndicator(),
                    const Divider(),
                  ],
                ),
              ),
              content: const Text('Invalid Exam Code'),
              // actionsOverflowAlignment: OverflowBar().overflowAlignment,
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop(); //pop the dialog
                  },
                  child: const Text('K'),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pushNamed(
                      QuestionsScreen.routeName,
                      arguments: test.questions,
                    );
                  },
                  child: const Text('OK'),
                ),
              ],
            );
            // return Dialog(
            //   child: Container(
            //     height: 200,
            //     width: 200,
            //     child: Column(
            //       children: [
            //         const Text('Please wait'),
            //         const CircularProgressIndicator(),
            //       ],
            //     ),
            //   ),
            // );
          });
    }

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        automaticallyImplyLeading: false,
        title: const Center(child: Text('Scan')),
      ),
      backgroundColor: Colors.transparent,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 100),
            Container(
              width: Size.width * .7,
              height: Size.width * .7,
              decoration: const BoxDecoration(
                shape: BoxShape.rectangle,
                borderRadius: BorderRadius.all(Radius.circular(20)),
                color: Colors.grey,
                // color: Colors.redAccent,
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
                logger.i("${test?.testID ?? testprovider.currentTest}");
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
