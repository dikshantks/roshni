import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:roshni_app/providers/test_provider.dart';

class ResultsScreen extends StatefulWidget {
  static const routeName = '/student/results';

  const ResultsScreen({super.key});
  @override
  State<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends State<ResultsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<TestProvider>(
        builder: (context, testProvider, child) {
          final results = testProvider.getAllResults();

          if (results == null) {
            return const Center(
              child: Text("no test"),
            );
          }
          return results.isEmpty
              ? const Center(
                  child: Text("no test"),
                )
              : ListView.builder(
                  itemCount: results.length,
                  itemBuilder: (context, index) {
                    final result = results[index];

                    return ListTile(
                      title: Text(
                          'Test ID: ${result.testID}, Student Pin: ${result.studentPin}'),
                      subtitle: Text(
                          'Score: ${result.score}, Timestamp: ${result.timestamp}'),
                    );
                  },
                );
        },
      ),
    );
  }
}
