import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import '../constants.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  bool _isAttending = false;
  bool _isRefreshing = false;
  bool _attended = false;
  String _mssv = 'Sinh viên CTU';
  String _studentName = '';
  String? _selectedRoom;
  String? _checkInMessage;

  List<Map<String, String>> _availableRooms = [];

  @override
  void initState() {
    super.initState();
    _loadMssv();
    _fetchRooms();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.09).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _loadMssv() async {
    final prefs = await SharedPreferences.getInstance();
    final savedMssv = prefs.getString('mssv');
    final savedName = prefs.getString('studentName');
    if (mounted) {
      setState(() {
        if (savedMssv != null && savedMssv.isNotEmpty) {
          _mssv = savedMssv;
        }
        if (savedName != null && savedName.isNotEmpty) {
          _studentName = savedName;
        }
      });
    }
  }

  Future<void> _fetchRooms() async {
    if (mounted) setState(() => _isRefreshing = true);
    try {
      final response = await http.get(Uri.parse('$apiBaseUrl$roomsEndpoint'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['data'] != null && data['data'] is List && (data['data'] as List).isNotEmpty) {
          final fetched = (data['data'] as List).map<Map<String, String>>((item) {
            final activeCourse = item['activeCourse'];
            return {
              'id': item['id'].toString(),
              'name': item['name']?.toString() ?? 'Phòng ${item['id']}',
              'building': item['building']?.toString() ?? 'Khu học tập',
              'isOccupied': (item['isOccupied'] == true).toString(),
              'courseCode': activeCourse != null ? (activeCourse['courseCode']?.toString() ?? '') : '',
              'courseName': activeCourse != null ? (activeCourse['courseName']?.toString() ?? '') : '',
              'teacherName': activeCourse != null ? (activeCourse['teacherName']?.toString() ?? '') : '',
            };
          }).toList();

          if (mounted) {
            setState(() {
              _availableRooms = fetched;
              final selectedIsOccupied = fetched.any((r) => r['id'] == _selectedRoom && r['isOccupied'] == 'true');
              if (!selectedIsOccupied) {
                final firstOccupied = fetched.firstWhere(
                  (r) => r['isOccupied'] == 'true',
                  orElse: () => {},
                );
                _selectedRoom = firstOccupied['id'];
              }
            });
          }
        }
      }
    } catch (_) {
      // Fallback if unreachable
    } finally {
      if (mounted) setState(() => _isRefreshing = false);
    }
  }

  Map<String, String>? _getSelectedRoomDetails() {
    if (_selectedRoom == null) return null;
    try {
      return _availableRooms.firstWhere((r) => r['id'] == _selectedRoom);
    } catch (_) {
      return null;
    }
  }

  void _handleAttendance() async {
    if (_attended) return;

    if (_selectedRoom == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Row(
            children: [
              Icon(Icons.error_outline_rounded, color: Colors.white, size: 20),
              SizedBox(width: 10),
              Text(
                'Vui lòng chọn phòng học đang mở điểm danh!',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ],
          ),
          backgroundColor: const Color(0xFFE74C3C),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          margin: const EdgeInsets.all(16),
          duration: const Duration(seconds: 3),
        ),
      );
      return;
    }

    setState(() => _isAttending = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('jwt_token');
      final mssv = prefs.getString('mssv') ?? _mssv;

      // Fetch TOTP automatically
      String otp = '123456';
      try {
        final otpResponse = await http.get(
          Uri.parse('$apiBaseUrl$debugOtpEndpoint/$_selectedRoom'),
        );
        if (otpResponse.statusCode == 200) {
          final otpData = jsonDecode(otpResponse.body);
          if (otpData['currentOTP'] != null) {
            otp = otpData['currentOTP'].toString();
          }
        }
      } catch (_) {}

      final response = await http.post(
        Uri.parse('$apiBaseUrl$checkInEndpoint'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'studentId': mssv,
          'roomId': _selectedRoom,
          'otp': otp,
        }),
      );

      if (!mounted) return;

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        final message = data['message'] ?? 'Điểm danh thành công!';
        setState(() {
          _isAttending = false;
          _attended = true;
          _checkInMessage = message;
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle_rounded, color: Colors.white, size: 22),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    message,
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                  ),
                ),
              ],
            ),
            backgroundColor: const Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
            ),
            margin: const EdgeInsets.all(16),
            duration: const Duration(seconds: 4),
          ),
        );
      } else if (response.statusCode == 401) {
        if (!mounted) return;
        setState(() => _isAttending = false);
        await prefs.remove('jwt_token');
        await prefs.remove('mssv');
        
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(data['message'] ?? 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.'),
            backgroundColor: const Color(0xFFEF4444),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
            ),
            margin: const EdgeInsets.all(16),
          ),
        );
        
        if (!mounted) return;
        Navigator.pushReplacementNamed(context, '/login');
      } else {
        if (!mounted) return;
        setState(() => _isAttending = false);
        final msg = data['message'] ?? 'Lỗi điểm danh (${response.statusCode})';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error_outline_rounded, color: Colors.white, size: 22),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    msg,
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                  ),
                ),
              ],
            ),
            backgroundColor: const Color(0xFFEF4444),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
            ),
            margin: const EdgeInsets.all(16),
            duration: const Duration(seconds: 4),
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _isAttending = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString().replaceAll('Exception: ', '')),
          backgroundColor: const Color(0xFFEF4444),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          margin: const EdgeInsets.all(16),
        ),
      );
    }
  }

  void _handleLogout() {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.logout_rounded, color: Color(0xFF003DA5), size: 24),
            SizedBox(width: 10),
            Text(
              'Đăng xuất',
              style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
            ),
          ],
        ),
        content: const Text(
          'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống Điểm danh CTU?',
          style: TextStyle(fontSize: 14, color: Color(0xFF4B5563)),
        ),
        actionsPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: Text(
              'Hủy',
              style: TextStyle(color: Colors.grey[600], fontWeight: FontWeight.w600),
            ),
          ),
          ElevatedButton(
            onPressed: () async {
              final prefs = await SharedPreferences.getInstance();
              await prefs.remove('jwt_token');
              await prefs.remove('mssv');
              await prefs.remove('studentName');
              
              if (!dialogContext.mounted || !mounted) return;
              Navigator.pop(dialogContext);
              Navigator.pushReplacementNamed(context, '/login');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            ),
            child: const Text(
              'Đăng xuất',
              style: TextStyle(fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  }

  bool _hasActiveRoom() {
    return _availableRooms.any((r) => r['isOccupied'] == 'true');
  }

  @override
  Widget build(BuildContext context) {
    final bool hasActiveClass = _hasActiveRoom();
    final selectedRoomInfo = _getSelectedRoomDetails();

    return Scaffold(
      backgroundColor: const Color(0xFFF3F4F6),
      body: CustomScrollView(
        slivers: [
          // Custom App Bar / Hero Header
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFF091E42), // Dark Navy
                    Color(0xFF003DA5), // CTU Blue
                    Color(0xFF0256D0), // Accent Cyan Blue
                  ],
                ),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(32),
                  bottomRight: Radius.circular(32),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Color(0x33003DA5),
                    blurRadius: 20,
                    offset: Offset(0, 10),
                  ),
                ],
              ),
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 16, 24, 28),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Top Row: App Title & Action Buttons
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.15),
                                      blurRadius: 10,
                                    ),
                                  ],
                                ),
                                child: const Center(
                                  child: Text(
                                    'CTU',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFF003DA5),
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              const Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'CTU SMART ATTENDANCE',
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w800,
                                      color: Color(0xFF93C5FD),
                                      letterSpacing: 1.2,
                                    ),
                                  ),
                                  Text(
                                    'Điểm Danh Sinh Viên',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              IconButton(
                                onPressed: _isRefreshing ? null : _fetchRooms,
                                icon: _isRefreshing
                                    ? const SizedBox(
                                        width: 18,
                                        height: 18,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          color: Colors.white,
                                        ),
                                      )
                                    : const Icon(Icons.refresh_rounded, color: Colors.white, size: 22),
                                tooltip: 'Làm mới',
                              ),
                              if (kIsWeb) IconButton(
                                onPressed: _handleLogout,
                                icon: const Icon(Icons.logout_rounded, color: Colors.white, size: 22),
                                tooltip: 'Đăng xuất',
                              ),
                            ],
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      // User Info & Date Pill Banner
                      Row(
                        children: [
                          if (false) Container(
                            width: 52,
                            height: 52,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: const LinearGradient(
                                colors: [Color(0xFF3B82F6), Color(0xFF60A5FA)],
                              ),
                              border: Border.all(color: Colors.white.withValues(alpha: 0.4), width: 2),
                            ),
                            child: Center(
                              child: Text(
                                _studentName.isNotEmpty
                                    ? _studentName[0].toUpperCase()
                                    : (_mssv.isNotEmpty ? _mssv[0].toUpperCase() : 'S'),
                                style: const TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${_getGreeting()} 👋',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.white.withValues(alpha: 0.8),
                                    fontWeight: FontWeight.w400,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  _studentName.isNotEmpty ? _studentName : _mssv,
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w800,
                                    color: Colors.white,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                                if (_studentName.isNotEmpty)
                                  Padding(
                                    padding: const EdgeInsets.only(top: 2),
                                    child: Text(
                                      'MSSV: $_mssv',
                                      style: TextStyle(
                                        fontSize: 13,
                                        color: Colors.white.withValues(alpha: 0.85),
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),

                      // Date Pill Tag
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.calendar_month_rounded,
                              size: 15,
                              color: Color(0xFF93C5FD),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              _getFormattedDate(),
                              style: const TextStyle(
                                fontSize: 13,
                                color: Colors.white,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Main Body Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 30),
              child: Column(
                children: [
                  // Quick Summary Status Cards Row
                  if (false) Row(
                    children: [
                      Expanded(
                        child: _buildSummaryCard(
                          title: 'Trạng thái ca học',
                          subtitle: hasActiveClass ? 'Đang có lớp mở' : 'Chưa mở lớp',
                          icon: Icons.sensors_rounded,
                          accentColor: hasActiveClass ? const Color(0xFF10B981) : const Color(0xFF9CA3AF),
                          badgeText: hasActiveClass ? 'LIVE' : 'IDLE',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildSummaryCard(
                          title: 'Điểm danh',
                          subtitle: _attended ? 'Đã hoàn thành' : 'Chưa điểm danh',
                          icon: _attended ? Icons.check_circle_rounded : Icons.pending_actions_rounded,
                          accentColor: _attended ? const Color(0xFF10B981) : const Color(0xFF003DA5),
                          badgeText: _attended ? 'OK' : 'WAITING',
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Room Selector Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.05),
                          blurRadius: 15,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: const Color(0xFF003DA5).withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.meeting_room_rounded,
                                color: Color(0xFF003DA5),
                                size: 20,
                              ),
                            ),
                            const SizedBox(width: 12),
                            const Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Phòng học',
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700,
                                      color: Color(0xFF1F2937),
                                    ),
                                  ),
                                  if (false) Text(
                                    'Chỉ cho phép chọn phòng đang có ca điểm danh',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Color(0xFF6B7280),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 16),

                        DropdownButtonFormField<String>(
                          value: _selectedRoom,
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: const Color(0xFFF9FAFB),
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 14,
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14),
                              borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14),
                              borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14),
                              borderSide: const BorderSide(
                                color: Color(0xFF003DA5),
                                width: 1.5,
                              ),
                            ),
                          ),
                          hint: const Text(
                            '-- Không có phòng nào đang mở ca điểm danh --',
                            style: TextStyle(fontSize: 13, color: Color(0xFF9CA3AF)),
                          ),
                          icon: const Icon(
                            Icons.keyboard_arrow_down_rounded,
                            color: Color(0xFF003DA5),
                          ),
                          items: _availableRooms.map((room) {
                            final isOccupied = room['isOccupied'] == 'true';
                            final statusLabel = isOccupied ? '[Đang mở điểm danh]' : '[Chưa mở lớp]';
                            return DropdownMenuItem<String>(
                              value: room['id'],
                              enabled: isOccupied,
                              child: Text(
                                '${room['name']} - $statusLabel',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: isOccupied ? FontWeight.w700 : FontWeight.normal,
                                  color: isOccupied ? const Color(0xFF059669) : const Color(0xFF9CA3AF),
                                ),
                              ),
                            );
                          }).toList(),
                          onChanged: _attended || _isAttending
                              ? null
                              : (String? newValue) {
                                  setState(() {
                                    _selectedRoom = newValue;
                                  });
                                },
                        ),
                      ],
                    ),
                  ),

                  // Active Course Details Card
                  if (selectedRoomInfo != null)
                    _buildActiveCourseCard(selectedRoomInfo),

                  const SizedBox(height: 32),

                  // Core Animated Interactive Check-In Button Zone
                  Column(
                    children: [
                      AnimatedBuilder(
                        animation: _pulseAnimation,
                        builder: (context, child) {
                          return Transform.scale(
                            scale: (_attended || _isAttending || _selectedRoom == null)
                                ? 1.0
                                : _pulseAnimation.value,
                            child: child,
                          );
                        },
                        child: GestureDetector(
                          onTap: (_attended || _isAttending || _selectedRoom == null)
                              ? null
                              : _handleAttendance,
                          child: Container(
                            width: 190,
                            height: 190,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: _attended
                                    ? [
                                        const Color(0xFF10B981),
                                        const Color(0xFF059669),
                                      ]
                                    : (_selectedRoom == null
                                        ? [
                                            const Color(0xFF9CA3AF),
                                            const Color(0xFF6B7280),
                                          ]
                                        : [
                                            const Color(0xFF003DA5),
                                            const Color(0xFF0256D0),
                                          ]),
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: _attended
                                      ? const Color(0xFF10B981).withValues(alpha: 0.4)
                                      : (_selectedRoom == null
                                          ? Colors.transparent
                                          : const Color(0xFF003DA5).withValues(alpha: 0.4)),
                                  blurRadius: 36,
                                  offset: const Offset(0, 14),
                                ),
                              ],
                            ),
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                // Inner Ring Detail
                                Container(
                                  width: 164,
                                  height: 164,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: Colors.white.withValues(alpha: 0.25),
                                      width: 2,
                                    ),
                                  ),
                                ),
                                Center(
                                  child: _isAttending
                                      ? const Column(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            SizedBox(
                                              width: 44,
                                              height: 44,
                                              child: CircularProgressIndicator(
                                                color: Colors.white,
                                                strokeWidth: 3.5,
                                              ),
                                            ),
                                            SizedBox(height: 12),
                                            Text(
                                              'ĐANG XỬ LÝ...',
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w700,
                                                color: Colors.white,
                                                letterSpacing: 1.2,
                                              ),
                                            ),
                                          ],
                                        )
                                      : Column(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(
                                              _attended
                                                  ? Icons.check_circle_rounded
                                                  : (_selectedRoom == null
                                                      ? Icons.block_rounded
                                                      : Icons.fingerprint_rounded),
                                              size: 58,
                                              color: Colors.white,
                                            ),
                                            const SizedBox(height: 8),
                                            Text(
                                              _attended
                                                  ? 'ĐÃ ĐIỂM DANH'
                                                  : (_selectedRoom == null
                                                      ? 'CHƯA CHỌN PHÒNG'
                                                      : 'ĐIỂM DANH'),
                                              style: const TextStyle(
                                                fontSize: 14,
                                                fontWeight: FontWeight.w800,
                                                color: Colors.white,
                                                letterSpacing: 1.4,
                                              ),
                                            ),
                                          ],
                                        ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),

                      Text(
                        _attended
                            ? (_checkInMessage ?? 'Điểm danh thành công!')
                            : (_selectedRoom == null
                                ? 'Hiện không có phòng nào đang mở ca điểm danh'
                                : 'Chạm nút để hoàn thành điểm danh ca học'),
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: _attended ? FontWeight.w700 : FontWeight.w500,
                          color: _attended ? const Color(0xFF059669) : const Color(0xFF6B7280),
                        ),
                      ),
                    ],
                  ),

                  if(false) const SizedBox(height: 32),

                  // Bottom Technical Info Card
                  if(false) Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFE5E7EB)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF003DA5).withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.verified_user_rounded,
                            color: Color(0xFF003DA5),
                            size: 22,
                          ),
                        ),
                        const SizedBox(width: 14),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Xác thực thông minh (BLE + TOTP)',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF1F2937),
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                'Đồng bộ thời gian chuẩn NTP với máy chủ CTU',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFF6B7280),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveCourseCard(Map<String, String> roomInfo) {
    final courseCode = roomInfo['courseCode'] ?? '';
    final courseName = roomInfo['courseName'] ?? '';
    final teacherName = roomInfo['teacherName'] ?? '';
    final roomName = roomInfo['name'] ?? '';
    final building = roomInfo['building'] ?? '';

    if (courseCode.isEmpty && courseName.isEmpty) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.only(top: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF0F172A), // Dark slate
            Color(0xFF1E3A8A), // Deep Navy
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E3A8A).withValues(alpha: 0.3),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.4)),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.circle, color: Color(0xFF10B981), size: 8),
                    SizedBox(width: 6),
                    Text(
                      'ĐANG GIẢNG DẠY',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF34D399),
                        letterSpacing: 0.8,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                courseCode,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF93C5FD),
                  letterSpacing: 1,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            courseName,
            style: const TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 12),
          const Divider(color: Colors.white12, height: 1),
          const SizedBox(height: 12),
          Row(
            children: [
              const Icon(Icons.person_rounded, color: Color(0xFF93C5FD), size: 18),
              const SizedBox(width: 8),
              Text(
                'Giảng viên: ${teacherName.isNotEmpty ? teacherName : "Chưa cập nhật"}',
                style: const TextStyle(
                  fontSize: 13,
                  color: Colors.white70,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.location_on_rounded, color: Color(0xFF93C5FD), size: 18),
              const SizedBox(width: 8),
              Text(
                '$roomName • Tòa nhà $building',
                style: const TextStyle(
                  fontSize: 13,
                  color: Colors.white70,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color accentColor,
    required String badgeText,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: accentColor, size: 22),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: accentColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  badgeText,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: accentColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF6B7280),
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1F2937),
            ),
          ),
        ],
      ),
    );
  }

  String _getFormattedDate() {
    final now = DateTime.now();
    final weekdays = [
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy',
      'Chủ Nhật',
    ];
    final weekday = weekdays[now.weekday - 1];
    return '$weekday, ${now.day.toString().padLeft(2, '0')}/${now.month.toString().padLeft(2, '0')}/${now.year}';
  }
}

class AnimatedBuilder extends AnimatedWidget {
  final Widget Function(BuildContext context, Widget? child) builder;
  final Widget? child;

  const AnimatedBuilder({
    super.key,
    required Animation<double> animation,
    required this.builder,
    this.child,
  }) : super(listenable: animation);

  @override
  Widget build(BuildContext context) {
    return builder(context, child);
  }
}
