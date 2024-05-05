import 'package:hive/hive.dart';
import 'package:intl/intl.dart'; // Import for date handling

part 'facilitator_model.g.dart';

@HiveType(typeId: 4)
class Facilitator {
  @HiveField(0)
  String firstname;
  @HiveField(1)
  String lastname;
  @HiveField(2)
  String dob;
  @HiveField(3)
  String email;
  @HiveField(4)
  String evalID;
  @HiveField(5)
  String loc;
  @HiveField(6)
  String password;
  @HiveField(7)
  int get key => evalID.hashCode;

  Facilitator({
    required this.firstname,
    required this.lastname,
    required this.dob,
    required this.email,
    required this.evalID,
    required this.loc,
    required this.password,
  });

  factory Facilitator.fromJson(Map<String, dynamic> json) {
    // Parse the DOB date string
    final dateFormat = DateFormat('dd-MM-yyyy');

    return Facilitator(
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
