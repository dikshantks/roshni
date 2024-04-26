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
          color: Colors.black, style: BorderStyle.solid, width: 2));
}
