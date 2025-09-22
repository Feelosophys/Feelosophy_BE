// src/services/teacherService.js
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const WorkingHour = require('../models/WorkingHour');
const AppError = require('../utils/customError');

exports.getAllTeachers = async () => {
    const teachers = await Teacher.find().populate('user', 'name email bio');
    return teachers;
};

exports.getTeacherDetails = async (teacherId) => {
    const teacher = await Teacher.findOne({
        user: teacherId
    }).populate('user', 'name email bio');
    if (!teacher) {
        throw new AppError('Teacher not found', 404);
    }

    const workingHours = await WorkingHour.find({
        teacherId
    }).sort({
        date: 1,
        startTime: 1
    });

    return {
        teacher,
        workingHours
    };
};