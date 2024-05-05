import 'package:flutter/material.dart';

class FormFields extends StatelessWidget {
  const FormFields({
    super.key,
    required TextEditingController pinController,
    required this.text,
    required this.txtinp,
  }) : _pinController = pinController;

  final TextEditingController _pinController;
  final String text;
  final TextInputType txtinp;

  @override
  Widget build(BuildContext context) {
    return Container(
      // padding: EdgeInsets.symmetric(horizontal: 30),
      margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 10.0),
      child: TextFormField(
        controller: _pinController,
        style: const TextStyle(color: Colors.black),
        keyboardType: txtinp,
        textCapitalization: TextCapitalization.words,
        decoration: textFieldDecoration(text),
      ),
    );
  }
}

InputDecoration textFieldDecoration(String label) {
  return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Colors.black),
      errorBorder: textFieldBorder(),
      focusedErrorBorder: textFieldBorder(),
      errorStyle: const TextStyle(fontSize: 14),
      border: textFieldBorder(),
      enabledBorder: textFieldBorder(),
      focusedBorder: textFieldBorder());
}

OutlineInputBorder textFieldBorder() {
  return OutlineInputBorder(
    borderRadius: BorderRadius.circular(20),
    borderSide: const BorderSide(
      color: Colors.black,
      style: BorderStyle.solid,
      width: 2,
    ),
  );
}

class FormFields1 extends StatelessWidget {
  const FormFields1({
    super.key,
    required TextEditingController pinController,
    required this.text,
    required this.txtinp,
  }) : _pinController = pinController;

  final TextEditingController _pinController;
  final String text;
  final TextInputType txtinp;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 30),
      height: 50.0,
      // margin: const EdgeInsets.symmetric(vertical: 5, horizontal: 5.0),
      child: TextFormField(
        controller: _pinController,
        style: const TextStyle(color: Colors.black),
        keyboardType: txtinp,
        textCapitalization: TextCapitalization.words,
        decoration: textFieldDecoration1(text),
      ),
    );
  }
}

InputDecoration textFieldDecoration1(String label) {
  return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Colors.black),
      errorBorder: textFieldBorder1(),
      focusedErrorBorder: textFieldBorder1(),
      errorStyle: const TextStyle(fontSize: 14),
      border: textFieldBorder1(),
      enabledBorder: textFieldBorder1(),
      focusedBorder: textFieldBorder1());
}

OutlineInputBorder textFieldBorder1() {
  return OutlineInputBorder(
    borderRadius: BorderRadius.circular(10),
    borderSide: const BorderSide(
      color: Colors.black,
      style: BorderStyle.solid,
      width: 1.5,
    ),
  );
}
