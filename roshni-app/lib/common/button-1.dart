import 'package:flutter/material.dart';

class RoundButton1 extends StatelessWidget {
  final String text;
  final void Function() onPressed;
  const RoundButton1({
    super.key,
    required this.text,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 20.0),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(16.0),
          child: Ink(
            padding:
                const EdgeInsets.symmetric(horizontal: 70.0, vertical: 16.0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16.0),
              color: Colors.white,
            ),
            child: Text(
              text,
            ),
          ),
        ),
      ),
    );
  }
}
