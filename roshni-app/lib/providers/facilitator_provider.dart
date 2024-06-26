import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:roshni_app/models/student_model.dart';
import 'package:roshni_app/services/api_service.dart';

class FacilitatorProvider extends ChangeNotifier {
  final FacApiService _apiService;
  List<Student> _students = [];
  bool _isLoading = false;
  String? _error;

  FacilitatorProvider(this._apiService);

  // Getters
  List<Student> get students => _students;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Registration function
  Future<String> registerStudent(Map<String, dynamic> studentData) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    String responseBody = '';

    try {
      logger.i('Registering student... provider ');
      responseBody = await _apiService.registerStudent(studentData);
    } catch (error) {
      _error = error.toString();
      print('Error registering student: $_error');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return responseBody;
  }

  Future<void> fetchStudents() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final box = await Hive.openBox<Student>('students');
    logger.i('Fetching students... provider ');
    try {
      final fetchedStudents = await _apiService.fetchStudents();
      for (var student in fetchedStudents) {
        box.put(student.pin, student);
      }
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
