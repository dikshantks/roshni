import 'package:hive/hive.dart';
part 'student_model.g.dart';

@HiveType(typeId: 2)
class Student {
  @HiveField(0)
  String firstName;
  @HiveField(1)
  String lastName;
  @HiveField(2)
  String gender;
  @HiveField(3)
  String dob;
  @HiveField(4)
  String location;
  @HiveField(5)
  String pin;
  @HiveField(6)
  int get key => pin.hashCode;
  Student({
    required this.firstName,
    required this.lastName,
    required this.gender,
    required this.dob,
    required this.location,
    required this.pin,
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      firstName: json['firstName'],
      lastName: json['lastName'],
      gender: json['gender'],
      dob: json['dob'],
      location: json['location'],
      pin: json['pin'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'firstName': firstName,
      'lastName': lastName,
      'gender': gender,
      'dob': dob,
      'location': location,
      'pin': pin,
    };
  }
}
