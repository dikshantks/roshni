import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:roshni_app/models/facilitator_model.dart';
import 'package:roshni_app/models/student_model.dart';
import 'package:roshni_app/services/api_service.dart';

enum AuthStatus { unknown, authenticated, unauthenticated }

class AuthProvider extends ChangeNotifier {
  final AuthService _authService;

  AuthStatus _status = AuthStatus.unknown;
  Evaluator? _evaluator;
  Student? _student;

  AuthStatus get status => _status;
  Evaluator? get evaluator => _evaluator;
  Student? get student => _student;
  String? get ngoId {
    if (_evaluator != null) {
      return _evaluator!.evalID;
    } else if (_student != null) {
      return _student!.firstName;
    } else {
      return null;
    }
  }

  AuthProvider(this._authService);

  Future<void> signInEvaluator({
    required String evalID,
    required String password,
    required BuildContext context,
  }) async {
    try {
      _status = AuthStatus.authenticated; // Indicate authentication in progress
      notifyListeners();
      print("provider evalID : $evalID , password : $password");

      final evaluator = await _authService.loginEvaluator(evalID, password);

      if (evaluator != null) {
        _evaluator = evaluator;
        notifyListeners();
        // Navigate to Evaluator dashboard (implementation below)
      } else {
        _status = AuthStatus.unauthenticated;
        notifyListeners();
        // _showErrorSnackBar(context, 'Invalid ID or password');
      }
    } catch (error) {
      _status = AuthStatus.unauthenticated;
      notifyListeners();
      // _showErrorSnackBar(context, error.toString());
    }
  }

  // // Similar function for signInStudent(...)
  // Future<void> signInStudent({
  //   required String pin,
  //   required BuildContext context,
  // }) async {
  //   final box = await Hive.openBox<Student>('students');

  //   Student? studentb = box.values.firstWhere(
  //     (s) => s.pin == pin,
  //   );
  //   if (studentb == null) {}

  //   try {
  //     _status = AuthStatus.unknown; // Indicate authentication in progress
  //     notifyListeners();
  //     print("provider pin : $pin");

  //     final student = await _authService.loginStudent(pin);

  //     if (student != null) {
  //       _student = student;
  //       box.put(student.pin, student);
  //       _status =
  //           AuthStatus.authenticated; // Indicate authentication in progress
  //       print(_status);

  //       notifyListeners();
  //     } else {
  //       _status = AuthStatus.unauthenticated;
  //       notifyListeners();
  //       // _showErrorSnackBar(context, 'Invalid PIN');
  //     }
  //   } catch (error) {
  //     _status = AuthStatus.unauthenticated;
  //     notifyListeners();
  //     // _showErrorSnackBar(context, error.toString());
  //   }
  // }
  Future<void> signInStudent({
    required String pin,
    required BuildContext context,
  }) async {
    final box = await Hive.openBox<Student>('students');

    // Student? student = box.values.firstWhere(
    //   (s) => s.pin == pin,
    //   orElse: () => null,
    // );
    Student? student;
    try {
      student = box.values.firstWhere((s) => s.pin == pin);
    } catch (e) {
      student = null;
    }
    logger.i("box length = ${box.values.length}");

    try {
      _status = AuthStatus.unknown; // Indicate authentication in progress
      notifyListeners();
      print("provider pin : $pin");

      if (student == null) {
        student = await _authService.loginStudent(pin);
        if (student != null) {
          box.put(student.pin, student);
        }
      }

      if (student != null) {
        logger.i("from hive box");
        _student = student;
        _status =
            AuthStatus.authenticated; // Indicate authentication in progress
        print(_status);
        notifyListeners();
      } else {
        _status = AuthStatus.unauthenticated;
        notifyListeners();
        // _showErrorSnackBar(context, 'Invalid PIN');
      }
    } catch (error) {
      _status = AuthStatus.unauthenticated;
      notifyListeners();
      // _showErrorSnackBar(context, error.toString());
    }
  }
}
