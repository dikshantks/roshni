import 'package:flutter/material.dart';

ThemeData theme1 = ThemeData(
  // Background colors
  primaryColor: Color(0xFF001650), // Dark blue
  primaryColorDark: Color(0xFF01B3EF), // Light blue
  primaryColorLight: Color(0xFF0C0C0D), // Dark gray
  canvasColor: Color(0xFF6C6C6C), // Gray
  cardColor: Color(0xFF6DCFFB), // Light blue-green
  dividerColor: Color(0xFFBBBBBB), // Light gray
  // Text colors (based on contrast with background colors)
  // textTheme: TextTheme(
  //   bodyText1: TextStyle(color: Colors.white), // White for better contrast
  //   bodyText2: TextStyle(color: Colors.black), // Black for better contrast
  //   headline1: TextStyle(color: Colors.white), // White for better contrast
  //   headline2: TextStyle(color: Colors.black), // Black for better contrast
  //   headline3: TextStyle(color: Colors.white), // White for better contrast
  //   headline4: TextStyle(color: Colors.black), // Black for better contrast
  //   headline5: TextStyle(color: Colors.white), // White for better contrast
  //   headline6: TextStyle(color: Colors.black), // Black for better contrast
  //   subtitle1: TextStyle(color: Colors.white), // White for better contrast
  //   subtitle2: TextStyle(color: Colors.black), // Black for better contrast
  //   caption: TextStyle(color: Colors.white), // White for better contrast
  // ),
  // Other properties you might want to customize
  appBarTheme: AppBarTheme(
    backgroundColor: Color(0xFF001650), // Dark blue
  ),
  // ...other themes like buttonTheme, dialogTheme, etc.
);
