import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

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
      padding: const EdgeInsets.only(left: 20.0, top: 20.0),
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
              color: Colors.red.shade700,
            ),
            child: Text(
              text,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 19.0,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class RoundButton2 extends StatelessWidget {
  final String text;
  final void Function() onPressed;
  const RoundButton2({
    super.key,
    required this.text,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 15.0),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(20.0),
          child: Ink(
            width: MediaQuery.of(context).size.width * 0.37,
            padding:
                const EdgeInsets.symmetric(horizontal: 10.0, vertical: 16.0),
            decoration: BoxDecoration(
              // border: Border.all(
              //   color: Color(0xff18206f),
              //   width: 2.0,
              // ),
              borderRadius: BorderRadius.circular(20.0),
              color: Color(0xff1b998b),
            ),
            child: Text(
              textAlign: TextAlign.center,
              text,
              style: GoogleFonts.roboto(
                color: Colors.white,
                fontSize: 19.0,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class RoundButton3 extends StatelessWidget {
  final String text;
  final void Function() onPressed;
  const RoundButton3({
    super.key,
    required this.text,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 15.0),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(20.0),
          child: Ink(
            width: MediaQuery.of(context).size.width * 0.37,
            padding:
                const EdgeInsets.symmetric(horizontal: 10.0, vertical: 16.0),
            decoration: BoxDecoration(
              border: Border.all(
                color: Color(0xff18206f),
                width: 2.0,
              ),
              borderRadius: BorderRadius.circular(20.0),
              // color: Color(0xff1b998b),
            ),
            child: Text(
              textAlign: TextAlign.center,
              text,
              style: GoogleFonts.roboto(
                // color: Colors.white,
                color: Color(0xff18206f),

                fontSize: 19.0,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class OptionsButton extends StatelessWidget {
  final String text;
  final void Function() onPressed;
  final BoxDecoration decoration;
  final Widget child;

  const OptionsButton({
    super.key,
    required this.text,
    required this.onPressed,
    required this.decoration,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(20.0),
          child: Container(
            alignment: Alignment.centerLeft,
            width: MediaQuery.of(context).size.width * 0.37,
            padding:
                const EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),
            decoration: decoration,
            child: child,
          ),
        ),
      ),
    );
  }
}
