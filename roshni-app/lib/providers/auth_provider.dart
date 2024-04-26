import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:roshni_app/models/facilitator_model.dart';
import 'package:roshni_app/models/student_model.dart';
import 'package:roshni_app/services/api_service.dart';

enum AuthStatus { unknown, authenticated, unauthenticated }

class AuthProvider extends ChangeNotifier {
  final AuthService _authService;

  AuthStatus _status = AuthStatus.unknown;
  Facilitator? _facilitator;
  Student? _student;

  AuthStatus get status => _status;
  Facilitator? get facilitator => _facilitator;
  Student? get student => _student;
  String? get ngoId {
    if (_facilitator != null) {
      return _facilitator!.evalID;
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
    final box = await Hive.openBox<Facilitator>('facilitators');
    Facilitator? fac;
    try {
      fac = box.values.firstWhere((s) => s.evalID == evalID);
    } catch (e) {
      fac = null;
    }
    logger.i("box length = ${box.values.length}");

    if (fac != null && fac.password == password) {
      _facilitator = fac;
      _status = AuthStatus.authenticated;
      logger.i("from hive box");
      notifyListeners();
    } else {
      try {
        _status = AuthStatus.unknown; // Indicate authentication in progress
        notifyListeners();

        logger.i("provider evalID : $evalID , password : $password");

        fac = await _authService.loginEvaluator(evalID, password);

        if (fac != null) {
          fac.password = password;
          await box.put(fac.evalID, fac);
          logger.i("added ${fac.evalID} hive box");
          _facilitator = fac;
          _status = AuthStatus.authenticated;
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
  }

  Future<void> signInStudent({
    required String pin,
    required BuildContext context,
  }) async {
    final box = await Hive.openBox<Student>('students');

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
      logger.i("provider pin : $pin");

      if (student == null) {
        student = await _authService.loginStudent(pin);
        if (student != null) {
          box.put(student.pin, student);
        }
      }

      if (student != null) {
        logger.i("from hive box");
        _student = student;
        _status = AuthStatus.authenticated;
        // print(_status);
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
