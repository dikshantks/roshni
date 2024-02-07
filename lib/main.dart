import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/common/route_generation.dart';

void main() {
  runApp(MaterialApp(
    initialRoute: '/',
    onGenerateRoute: onGenerateRoute,
  ));
}
