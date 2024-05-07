import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/models/test_model.dart';
import 'package:roshni_app/providers/auth_provider.dart';
import 'package:roshni_app/providers/test_provider.dart';

class FacilitatorProfileScreen extends StatefulWidget {
  const FacilitatorProfileScreen({super.key});

  @override
  State<FacilitatorProfileScreen> createState() => _FacilitatorProfileScreen();
}

class _FacilitatorProfileScreen extends State<FacilitatorProfileScreen> {
  List<Test> tests = [];
  @override
  void initState() {
    super.initState();
    tests = Provider.of<TestProvider>(context, listen: false).tests;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Consumer<AuthProvider>(builder: (context, authprovider, child) {
        final facilitator = authprovider.facilitator;
        return Stack(
          children: [
            Column(
              children: [
                Container(
                  height: 200,
                  width: double.infinity,
                  color: Colors.redAccent,
                  child: Align(
                    child: Consumer<TestProvider>(
                      builder: (context, testProvider, child) {
                        return Center(
                          child: testProvider.isLoading // Check if loading
                              ? CircularProgressIndicator(
                                  // radius: 80.0,
                                  ) // Show indicator
                              : Column(
                                  // Show your normal content when not loading
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    // Your buttons, lists, etc.
                                  ],
                                ),
                        );
                      },
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 75, left: 20, right: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        '${facilitator!.firstname} ${facilitator.lastname}',
                        style: GoogleFonts.openSans(
                          fontSize: 25,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        facilitator.evalID,
                        style: GoogleFonts.openSans(
                          fontSize: 20,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 10),
                      ProfileRow(
                        field: "email",
                        detail: facilitator.email,
                      ),
                      ProfileRow(
                        field: "date of birth",
                        detail: facilitator.dob,
                      ),
                      ProfileRow(
                        field: "Center",
                        detail: facilitator.loc,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const Positioned(
              left: 0,
              right: 0,
              top: 120,
              child: CircleAvatar(
                radius: 75,
              ),
            ),
          ],
        );
      }),
    );
  }
}

class ProfileRow extends StatelessWidget {
  const ProfileRow({
    super.key,
    required this.field,
    required this.detail,
  });
  final String field;

  final String detail;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            field,
            style: GoogleFonts.openSans(
              color: Colors.grey[700],
              fontWeight: FontWeight.w500,
              fontSize: 16,
            ),
          ),
          Text(
            detail,
            style: GoogleFonts.openSans(
              color: Colors.black,
              fontWeight: FontWeight.w500,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}
