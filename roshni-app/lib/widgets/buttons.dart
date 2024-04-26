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

String imagetest =
    "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";

// String imagetest = "";
