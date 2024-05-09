import 'dart:convert';

import 'package:expansion_tile_card/expansion_tile_card.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/facilitator_provider.dart';
import 'package:roshni_app/screen/student/past_results_screen.dart';
import 'package:roshni_app/services/api_service.dart';
import 'package:roshni_app/widgets/form_field.dart';

class StudentRegisterScreen extends StatefulWidget {
  static String routename = '/facilitator/register';
  const StudentRegisterScreen({super.key});

  @override
  State<StudentRegisterScreen> createState() => _StudentRegisterScreenState();
}

class _StudentRegisterScreenState extends State<StudentRegisterScreen> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<FacilitatorProvider>(context, listen: false).fetchStudents();
    });
  }

  @override
  Widget build(BuildContext context) {
    var authprovier = Provider.of<AuthProvider>(context);
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Center(child: Text('Register Student')),
        automaticallyImplyLeading: false,
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color.fromARGB(255, 255, 120, 120),
        onPressed: () {
          logger.i('Add Student');
          showModalBottomSheet(
            isScrollControlled: true,
            context: context,
            builder: (BuildContext buildContext) {
              return const BottomSheetWidget();
            },
          );
        },
        child: const Icon(Icons.add),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Consumer<FacilitatorProvider>(
          builder: (context, facilitatorProvider, child) {
            if (facilitatorProvider.isLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (facilitatorProvider.error != null) {
              return const Center(child: Text('An error occurred!'));
            } else {
              return ListView.builder(
                itemBuilder: (context, index) {
                  final student = facilitatorProvider.students[index];
                  return Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: ExpansionTileCard(
                      baseColor: Colors.redAccent,
                      expandedColor: Colors.white,
                      title: Container(
                        height: 50.0,
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 25,
                              backgroundImage: AssetImage(
                                  student.gender == "M" ||
                                          student.gender == "male"
                                      ? "assets/images/boy.png"
                                      : "assets/images/girl.png"),
                            ),
                            Spacer(),
                            Text(
                              '${student.firstName} ${student.lastName}',
                              style: GoogleFonts.roboto(),
                            ),
                            const Spacer(),
                            Text(
                              "Pin: ${student.pin}",
                            ),
                            // const Spacer(),
                          ],
                        ),
                      ),
                      children: [
                        const Divider(
                          thickness: 1.0,
                          height: 1.0,
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            Text(
                              "Center: ${student.location}",
                              style: GoogleFonts.openSans(
                                // color: Colors.grey[700],
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              "DOB: ${student.dob}",
                              style: GoogleFonts.openSans(
                                // color: Colors.grey[700],
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                        Align(
                          alignment: Alignment.center,
                          child: Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16.0,
                              vertical: 14.0,
                            ),
                            child: InkWell(
                                onTap: () {
                                  authprovier.setStudent(
                                    student.pin,
                                  );
                                  Navigator.of(context)
                                      .pushNamed(ResultsScreen.routeName);
                                },
                                borderRadius: BorderRadius.circular(16.0),
                                child: Ink(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 20.0, vertical: 10.0),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(10.0),
                                    color: Colors.red.shade700,
                                  ),
                                  child: Text(
                                    "Check Past Results",
                                    style: GoogleFonts.openSans(
                                      color: Colors.white,
                                      fontSize: 19.0,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                )),
                            // child: ElevatedButton(
                            //   onPressed: () {
                            //     authprovier.setStudent(
                            //       student.pin,
                            //     );
                            //     Navigator.of(context)
                            //         .pushNamed(ResultsScreen.routeName);
                            //   },
                            //   child: Text(
                            //     "check past results ",
                            //   ),
                            // ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
                itemCount: facilitatorProvider.students.length,
              );
            }
          },
        ),
      ),
    );
  }
}

class BottomSheetWidget extends StatefulWidget {
  const BottomSheetWidget({Key? key}) : super(key: key);

  @override
  State<BottomSheetWidget> createState() => _BottomSheetWidgetState();
}

//
class _BottomSheetWidgetState extends State<BottomSheetWidget> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _dobController = TextEditingController();
  final _genderController = TextEditingController();
  final _locationController = TextEditingController();
  final _gradeController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: MediaQuery.of(context).viewInsets,
      child: SizedBox(
        height: 500, // Adjust if needed
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Row(
                    children: [
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 30),
                        height: 50.0,
                        width: 100.0,
                        // margin: const EdgeInsets.symmetric(vertical: 5, horizontal: 5.0),
                        child: TextFormField(
                          validator: (value) =>
                              value!.isEmpty ? 'Required' : null,
                          style: const TextStyle(color: Colors.black),
                          controller: _firstNameController,
                          textCapitalization: TextCapitalization.words,
                          decoration: textFieldDecoration1("hmm"),
                        ),
                      ),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 30),
                        height: 50.0,
                        width: 100.0,
                        // margin: const EdgeInsets.symmetric(vertical: 5, horizontal: 5.0),
                        child: TextFormField(
                          validator: (value) =>
                              value!.isEmpty ? 'Required' : null,

                          // controller: _pinController,
                          style: const TextStyle(color: Colors.black),
                          // keyboardType: txtinp,
                          textCapitalization: TextCapitalization.words,
                          decoration: textFieldDecoration1("hmm"),
                        ),
                      ),
                    ],
                  ),
                  // TextFormField(
                  //   controller: _firstNameController,
                  //   decoration: const InputDecoration(labelText: 'First Name'),
                  //   validator: (value) => value!.isEmpty ? 'Required' : null,
                  // ),
                  // TextFormField(
                  //   controller: _lastNameController,
                  //   decoration: const InputDecoration(labelText: 'Last Name'),
                  //   validator: (value) => value!.isEmpty ? 'Required' : null,
                  // ),
                  // ... Add fields for dob, gender, location, grade with suitable widgets
                  TextFormField(
                    controller: _dobController,
                    decoration:
                        const InputDecoration(labelText: 'Date of Birth'),
                    validator: (value) => value!.isEmpty ? 'Required' : null,
                  ),
                  TextFormField(
                    controller: _genderController,
                    decoration: const InputDecoration(labelText: 'Gender'),
                    validator: (value) => value!.isEmpty ? 'Required' : null,
                  ),
                  TextFormField(
                    controller: _locationController,
                    decoration: const InputDecoration(labelText: 'Location'),
                    validator: (value) => value!.isEmpty ? 'Required' : null,
                  ),
                  TextFormField(
                    controller: _gradeController,
                    decoration: const InputDecoration(labelText: 'Grade'),
                    validator: (value) => value!.isEmpty ? 'Required' : null,
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        final facilitatorProvider =
                            Provider.of<FacilitatorProvider>(
                          context,
                          listen: false,
                        );

                        Map<String, dynamic> studentData = {
                          'firstName': _firstNameController.text,
                          'lastName': _lastNameController.text,
                          'dob': _dobController.text,
                          'gender': _genderController.text,
                          'location': _locationController.text,
                          'grade': _gradeController.text,
                        };

                        try {
                          var responseBody = await facilitatorProvider
                              .registerStudent(studentData);
                          var one = jsonDecode(responseBody);
                          showDialog(
                            // ignore: use_build_context_synchronously
                            context: context,
                            builder: (context) => AlertDialog(
                              title: const Text('Registration Response'),
                              content: Text(
                                  " ${one['message']} \n Student ID: ${one['studentId']}"),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.of(context).pop(),
                                  child: const Text('OK'),
                                ),
                              ],
                            ),
                          );
                          // Success! (Handle as needed)
                        } catch (error) {
                          // Handle registration error
                        }
                      }
                    },
                    child: const Text('Add Student'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _dobController.dispose();
    _genderController.dispose();
    _locationController.dispose();
    _gradeController.dispose();
    super.dispose();
  }
}
