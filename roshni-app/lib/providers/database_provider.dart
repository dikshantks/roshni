import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DatabaseProvider extends ChangeNotifier {
  final Future<SharedPreferences> _pref = SharedPreferences.getInstance();

  final String _token = '';

  String get token => _token;

  Future<int?> getLogoutTimestamp() async {
    SharedPreferences value = await _pref;

    // Get saved timestamp
    return value.getInt('logoutTimestamp');
  }
}
