import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
// import 'package:provider/provider.dart';
import 'package:roshni_app/common/route_generation.dart';
import 'package:roshni_app/providers/facilitator_provider.dart';
import 'package:roshni_app/themes/themes.dart';

void main() {
  runApp(MultiProvider(
    providers: [
      ChangeNotifierProvider(
        create: (context) => FacilitatorProvider(),
      ),
    ],
    child: MaterialApp(

        //  builder: (context, child) => DecoratedBox(
        // decoration: BoxDecoration(
        //   image: DecorationImage(
        //     image: AssetImage('assets/images/background.jpg'),
        //     fit: BoxFit.cover, // Or other BoxFit values
        //   ),
        // ),
        theme: theme1,
        debugShowCheckedModeBanner: false,
        initialRoute: '/',
        onGenerateRoute: onGenerateRoute,
        builder: (context, child) => DecoratedBox(
              decoration: const BoxDecoration(
                image: DecorationImage(
                  image: AssetImage("assets/images/background.png"),
                  fit: BoxFit.cover, // Or other BoxFit values
                ),
              ),
              child: child,
            )),
  ));
}
