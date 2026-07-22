import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CTU Điểm Danh',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        // Cau hinh mau chu de
        primarySwatch: const MaterialColor(0xFF003DA5, <int, Color>{
          50: Color(0xFFE0E8F5),
          100: Color(0xFFB3C5E6),
          200: Color(0xFF809ED5),
          300: Color(0xFF4D77C4),
          400: Color(0xFF265AB7),
          500: Color(0xFF003DA5),
          600: Color(0xFF00379D),
          700: Color(0xFF002F93),
          800: Color(0xFF00278A),
          900: Color(0xFF001A79),
        }),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF003DA5),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        fontFamily: 'Roboto',
      ),
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/home': (context) => const HomeScreen(),
      },
    );
  }
}
