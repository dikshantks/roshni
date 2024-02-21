import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DatabaseProvider extends ChangeNotifier {
  final Future<SharedPreferences> _pref = SharedPreferences.getInstance();

  String _token = '';

  String _userId = '';
  String _emailId = ''; // New field for email ID

  String _result = 'false';

  String get result => _result;

  String get token => _token;

  String get userId => _userId;

  String get emailId => _emailId; // Getter for email ID

  Future<int?> getLogoutTimestamp() async {
    SharedPreferences value = await _pref;

    // Get saved timestamp
    return value.getInt('logoutTimestamp');
  }
}
