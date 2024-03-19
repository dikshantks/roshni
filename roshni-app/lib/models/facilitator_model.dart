import 'package:intl/intl.dart'; // Import for date handling

class Evaluator {
  String firstname;
  String lastname;
  String dob;
  String email;
  String evalID;
  String loc;
  String password;

  Evaluator({
    required this.firstname,
    required this.lastname,
    required this.dob,
    required this.email,
    required this.evalID,
    required this.loc,
    required this.password,
  });

  factory Evaluator.fromJson(Map<String, dynamic> json) {
    // Parse the DOB date string
    final dateFormat = DateFormat('dd-MM-yyyy');

    return Evaluator(
      firstname: json['firstname'],
      lastname: json['lastname'],
      dob: dateFormat.parse(json['DOB']).toString(),
      email: json['email'],
      evalID: json['evalID'],
      loc: json['loc'],
      password: json['password'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'firstname': firstname,
      'lastname': lastname,
      'DOB': dob,
      'email': email,
      'evalID': evalID,
      'loc': loc,
      'password': password,
    };
  }
}
