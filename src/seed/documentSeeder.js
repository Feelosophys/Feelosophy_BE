// src/seed/documentSeeder.js
const Document = require('../models/Document');
const Lesson = require('../models/Lesson');

async function seedDocuments() {
    // Get existing lessons
    const lessons = await Lesson.find({}).populate('course');

    if (lessons.length === 0) {
        console.log('Warning: No lessons found. Seed lessons first.');
        return;
    }

    const documentsData = [{
            name: 'Mental Health Guide.pdf',
            fileUrl: 'https://example.com/documents/mental-health-guide.pdf'
        },
        {
            name: 'Self-Assessment Worksheet.pdf',
            fileUrl: 'https://example.com/documents/self-assessment.pdf'
        },
        {
            name: 'Anxiety Management Techniques.pdf',
            fileUrl: 'https://example.com/documents/anxiety-techniques.pdf'
        },
        {
            name: 'Breathing Exercise Guide.pdf',
            fileUrl: 'https://example.com/documents/breathing-exercises.pdf'
        },
        {
            name: 'Mindfulness Journal Template.pdf',
            fileUrl: 'https://example.com/documents/mindfulness-journal.pdf'
        },
        {
            name: 'Meditation Progress Tracker.pdf',
            fileUrl: 'https://example.com/documents/meditation-tracker.pdf'
        },
        {
            name: 'Depression Symptom Checklist.pdf',
            fileUrl: 'https://example.com/documents/depression-checklist.pdf'
        },
        {
            name: 'CBT Thought Record.pdf',
            fileUrl: 'https://example.com/documents/cbt-thought-record.pdf'
        },
        {
            name: 'Emotional Resilience Workbook.pdf',
            fileUrl: 'https://example.com/documents/resilience-workbook.pdf'
        },
        {
            name: 'Stress Management Plan.pdf',
            fileUrl: 'https://example.com/documents/stress-management-plan.pdf'
        },
        {
            name: 'Sleep Diary Template.pdf',
            fileUrl: 'https://example.com/documents/sleep-diary.pdf'
        },
        {
            name: 'Nutrition for Mental Health Guide.pdf',
            fileUrl: 'https://example.com/documents/nutrition-guide.pdf'
        },
        {
            name: 'Digital Detox Checklist.pdf',
            fileUrl: 'https://example.com/documents/digital-detox-checklist.pdf'
        },
        {
            name: 'Workplace Wellness Plan.pdf',
            fileUrl: 'https://example.com/documents/workplace-wellness.pdf'
        },
        {
            name: 'Family Communication Guide.pdf',
            fileUrl: 'https://example.com/documents/family-communication.pdf'
        },
        {
            name: 'Trauma Recovery Resources.pdf',
            fileUrl: 'https://example.com/documents/trauma-resources.pdf'
        },
        {
            name: 'Addiction Support Directory.pdf',
            fileUrl: 'https://example.com/documents/addiction-directory.pdf'
        },
        {
            name: 'LGBTQ+ Mental Health Resources.pdf',
            fileUrl: 'https://example.com/documents/lgbtq-resources.pdf'
        },
        {
            name: 'Senior Mental Health Guide.pdf',
            fileUrl: 'https://example.com/documents/senior-mental-health.pdf'
        },
        {
            name: 'Children\'s Mental Health Handbook.pdf',
            fileUrl: 'https://example.com/documents/children-handbook.pdf'
        }
    ];

    for (let i = 0; i < Math.min(lessons.length, documentsData.length); i++) {
        const lesson = lessons[i];
        const documentData = documentsData[i];

        const exists = await Document.findOne({
            lessonId: lesson._id,
            name: documentData.name
        });

        if (!exists) {
            documentData.lessonId = lesson._id;
            const createdDocument = await Document.create(documentData);

            // Update lesson with document reference
            await Lesson.findByIdAndUpdate(
                lesson._id, {
                    $push: {
                        documents: createdDocument._id
                    }
                }
            );

            console.log(`Created document: ${documentData.name} for lesson: ${lesson.title}`);
        } else {
            console.log(`Document exists: ${documentData.name}`);
        }
    }
}

module.exports = {
    seedDocuments
};