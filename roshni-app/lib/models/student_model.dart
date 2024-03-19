class Student {
  String firstName;
  String lastName;
  String gender;
  String dob;
  String location;
  String pin;

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
