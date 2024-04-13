import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/facilitator_provider.dart';

class StudentRegisterScreen extends StatefulWidget {
  static String routename = '/facilitator/register';
  const StudentRegisterScreen({super.key});

  @override
  State<StudentRegisterScreen> createState() => _StudentRegisterScreenState();
}

class _StudentRegisterScreenState extends State<StudentRegisterScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          print('Add Student');
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
      body: const Center(
        child: Text('Student Register Screen'),
      ),
    );
  }
}

// class BottomSheetWidget extends StatelessWidget {
//   const BottomSheetWidget({
//     super.key,
//   });

//   @override
//   Widget build(BuildContext context) {
//     final MediaQueryData mediaQueryData = MediaQuery.of(context);
//     return Padding(

//       padding: mediaQueryData.viewInsets,
//       child: SizedBox(
//         height: 500,
//         child: Center(
//           child: ElevatedButton(
//             child: Text("sdf"),
//             onPressed: () {
//               print("sdf");
//             },
//           ),
//         ),
//       ),
//     );
//   }
// }

class BottomSheetWidget extends StatefulWidget {
  const BottomSheetWidget({Key? key}) : super(key: key);

  @override
  State<BottomSheetWidget> createState() => _BottomSheetWidgetState();
}

class _BottomSheetWidgetState extends State<BottomSheetWidget> {
  final _formKey = GlobalKey<FormState>(); // For form validation
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _dobController = TextEditingController();
  final _genderController = TextEditingController();
  final _locationController = TextEditingController();
  final _gradeController = TextEditingController();
  // ... controllers for dob, gender, location, grade

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: MediaQuery.of(context).viewInsets,
      child: SizedBox(
        height: 500, // Adjust if needed
        child: SingleChildScrollView(
          // To prevent overflow if content is large
          child: Form(
            key: _formKey,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  TextFormField(
                    controller: _firstNameController,
                    decoration: const InputDecoration(labelText: 'First Name'),
                    validator: (value) => value!.isEmpty ? 'Required' : null,
                  ),
                  TextFormField(
                    controller: _lastNameController,
                    decoration: const InputDecoration(labelText: 'Last Name'),
                    validator: (value) => value!.isEmpty ? 'Required' : null,
                  ),
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

                        // Map<String, dynamic> studentData = {
                        //   'firstName': _firstNameController.text,
                        //   'lastName': _lastNameController.text,
                        //   // ... add other fields: dob, gender, location, grade
                        // };
                        Map<String, dynamic> studentData = {
                          'firstName': _firstNameController.text,
                          'lastName': _lastNameController.text,
                          'dob': _dobController.text,
                          'gender': _genderController.text,
                          'location': _locationController.text,
                          'grade': _gradeController.text,
                        };

                        try {
                          await facilitatorProvider
                              .registerStudent(studentData);
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

  // @override
  // void dispose() {
  //   _firstNameController.dispose();
  //   _lastNameController.dispose();
  //   // ... dispose other controllers
  //   super.dispose();
  // }
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
