// src/services/workingHourService.js
const WorkingHour = require('../models/WorkingHour');
const Teacher = require('../models/Teacher');
const AppError = require('../utils/customError');

exports.createWorkingHour = async ({
    teacherId,
    date,
    startTime,
    endTime,
    note
}) => {
    // Kiểm tra teacher có tồn tại không
    const teacher = await Teacher.findOne({
        user: teacherId
    });
    if (!teacher) {
        throw new AppError('Teacher profile not found', 404);
    }

    // Tạo working hour
    const workingHour = await WorkingHour.create({
        teacherId,
        date,
        startTime,
        endTime,
        note
    });

    return workingHour;
};

exports.getWorkingHoursByTeacher = async (teacherId) => {
    return await WorkingHour.find({
        teacherId
    }).sort({
        date: 1,
        startTime: 1
    });
};