import 'package:flutter/material.dart';
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

  AuthProvider(this._authService);

  Future<void> signInEvaluator({
    required String evalID,
    required String password,
    required BuildContext context,
  }) async {
    try {
      _status = AuthStatus.authenticated; // Indicate authentication in progress
      notifyListeners();

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

  // Similar function for signInStudent(...)
  Future<void> signInStudent({
    required String pin,
    required BuildContext context,
  }) async {
    try {
      _status = AuthStatus.authenticated; // Indicate authentication in progress
      notifyListeners();

      final student = await _authService.loginStudent(pin);

      if (student != null) {
        _student = student;
        notifyListeners();
        // Navigate to Student dashboard (implementation below)
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

  // void _showErrorSnackBar(BuildContext context, String errorMessage) {
  //   // ...  Your snackbar implementation
  // }
}
