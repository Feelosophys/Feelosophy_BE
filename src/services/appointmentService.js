// src/services/appointmentService.js
// Handles business logic for appointments
const Appointment = require('../models/Appointment');
const WorkingHour = require('../models/WorkingHour');
const Teacher = require('../models/Teacher');
const AppError = require('../utils/customError');
const {
    generateZegoToken
} = require('../utils/zegoUtils');

exports.bookAppointment = async ({
    userId,
    teacherId,
    workingHourId,
    notes
}) => {
    // Kiểm tra working hour tồn tại và chưa booked
    const workingHour = await WorkingHour.findById(workingHourId);
    if (!workingHour) {
        throw new AppError('Working hour not found', 404);
    }
    if (workingHour.isBooked) {
        throw new AppError('Working hour already booked', 400);
    }

    // Kiểm tra teacher hợp lệ
    const teacher = await Teacher.findOne({
        user: teacherId
    });
    if (!teacher) {
        throw new AppError('Teacher not found', 404);
    }

    // Đặt working hour thành booked
    workingHour.isBooked = true;
    await workingHour.save();

    // Tạo appointment
    const appointment = await Appointment.create({
        userId,
        teacherId,
        workingHourId,
        notes
    });

    return appointment;
};

exports.getUserAppointments = async (userId) => {
    return await Appointment.find({
            userId
        })
        .populate('teacherId', 'name email')
        .populate('workingHourId', 'date startTime endTime note')
        .sort({
            createdAt: -1
        });
};

exports.getTeacherAppointments = async (teacherId) => {
    return await Appointment.find({
            teacherId
        })
        .populate('userId', 'name email')
        .populate('workingHourId', 'date startTime endTime note')
        .sort({
            createdAt: -1
        });
};

exports.joinAppointment = async (userId, appointmentId) => {
    // Tìm appointment
    const appointment = await Appointment.findById(appointmentId).populate('teacherId userId');
    if (!appointment) {
        throw new AppError('Appointment not found', 404);
    }

    // Kiểm tra quyền: chỉ user sở hữu hoặc teacher mới được join
    if (appointment.userId._id.toString() !== userId && appointment.teacherId._id.toString() !== userId) {
        throw new AppError('Forbidden: Not authorized to join this appointment', 403);
    }

    // Tạo room ID dựa trên appointment ID
    const roomId = `appointment_${appointmentId}`;

    // Lấy thông tin từ env
    const appId = process.env.ZEGO_APP_ID;
    const appSign = process.env.ZEGO_APP_SIGN;

    if (!appId || !appSign) {
        throw new AppError('Zego configuration missing', 500);
    }

    // Tạo token Zego
    const token = generateZegoToken(parseInt(appId), userId, appSign, roomId);

    // Trả về thông tin cho frontend
    return {
        roomId,
        token,
        appId: parseInt(appId),
        userId: userId,
        // Thêm server URL nếu cần
        serverUrl: process.env.ZEGO_SERVER_URL || 'wss://webliveroom-test.zego.im/ws' // Default test server
    };
};