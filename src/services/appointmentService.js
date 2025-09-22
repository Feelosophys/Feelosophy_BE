// src/services/appointmentService.js
// Handles business logic for appointments
const Appointment = require('../models/Appointment');
const WorkingHour = require('../models/WorkingHour');
const Teacher = require('../models/Teacher');
const AppError = require('../utils/customError');

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