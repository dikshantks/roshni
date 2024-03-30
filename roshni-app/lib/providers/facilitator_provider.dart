import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:roshni_app/models/student_model.dart';
import 'package:roshni_app/services/api_service.dart';

class FacilitatorProvider extends ChangeNotifier {
  final ApiService _apiService;
  List<Student> _students = [];
  bool _isLoading = false;
  String? _error;

  FacilitatorProvider(this._apiService);

  // Getters
  List<Student> get students => _students;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Registration function
  Future<void> registerStudent(Map<String, dynamic> studentData) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      print('Registering student... provider ');
      await _apiService.registerStudent(studentData);
      // Optionally refetch students if you want an immediate update:
      // await fetchStudents();
    } catch (error) {
      _error = error.toString();
      print('Error registering student: $_error');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Fetch Students
  Future<void> fetchStudents() async {
    _isLoading = true;
    _error = null;
    SchedulerBinding.instance.addPostFrameCallback((_) {
      notifyListeners();
    });

    try {
      final fetchedStudents = await _apiService.fetchStudents();
      _students = fetchedStudents;
      _isLoading = false;
      notifyListeners();
    } catch (error) {
      _error = error.toString();
      _isLoading = false;
      notifyListeners();
    }
  }
}
