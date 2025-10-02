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
            fileUrl: 'https://www.globalfamilydoctor.com/site/DefaultSite/filesystem/documents/resources/MHGuidebook-EBookDownload.pdf'
        },
        {
            name: 'Self-Assessment Worksheet.pdf',
            fileUrl: 'https://www.mentoring.org/wp-content/uploads/2020/03/MARCH_2015_Self_Care_Assessment.pdf'
        },
        {
            name: 'Anxiety Management Techniques.pdf',
            fileUrl: 'https://medicine.umich.edu/sites/default/files/content/downloads/Relaxation-Skills-for-Anxiety.pdf'
        },
        {
            name: 'Breathing Exercise Guide.pdf',
            fileUrl: 'https://uhs.berkeley.edu/sites/default/files/breathing_exercises_0.pdf'
        },
        {
            name: 'Mindfulness Journal Template.pdf',
            fileUrl: 'https://youthrex.com/wp-content/uploads/2020/04/7-Day-Mindfulness-Journal.pdf'
        },
        {
            name: 'Meditation Progress Tracker.pdf',
            fileUrl: 'https://dn720006.ca.archive.org/0/items/meditationsofmar00marc/meditationsofmar00marc.pdf'
        },
        {
            name: 'Depression Symptom Checklist.pdf',
            fileUrl: 'https://www.uwgb.edu/UWGBCMS/media/Continueing-Professional-Education/files/Assess-Pkt-1-Burns-Depression-Checklist.pdf'
        },
        {
            name: 'CBT Thought Record.pdf',
            fileUrl: 'https://www.mcgill.ca/counselling/files/counselling/thought_record_sheet_0.pdf'
        },
        {
            name: 'Emotional Resilience Workbook.pdf',
            fileUrl: 'https://www.working-minds.org.uk/uploaded/materials/emotional-resilience-workbook_880423_51091.pdf'
        },
        {
            name: 'Stress Management Plan.pdf',
            fileUrl: 'https://www.algonquincollege.com/pembroke/files/2017/11/Stress-Management-Package.pdf'
        },
        {
            name: 'Sleep Diary Template.pdf',
            fileUrl: 'https://pa-foundation.org/wp-content/uploads/NSF-Sleep-Diary.pdf'
        },
        {
            name: 'Nutrition for Mental Health Guide.pdf',
            fileUrl: 'https://femalehealthawareness.org/site/wp-content/uploads/2020/02/Nutrition-for-Mental-Health_FFHA2020.pdf'
        },
        {
            name: 'Digital Detox Checklist.pdf',
            fileUrl: 'https://butfirstjoy.com/wp-content/uploads/2019/06/digital-detox-checklist.pdf'
        },
        {
            name: 'Workplace Wellness Plan.pdf',
            fileUrl: 'https://www.mind.org.uk/media/lbahso3x/mind-wellness-action-plan-workplace.pdf'
        },
        {
            name: 'Family Communication Guide.pdf',
            fileUrl: 'https://api.pageplace.de/preview/DT0400.9781000513332_A42211177/preview-9781000513332_A42211177.pdf'
        },
        {
            name: 'Trauma Recovery Resources.pdf',
            fileUrl: 'https://www.camh.ca/-/media/education-files/community-resource-sheets/trauma-resources-pdf.pdf'
        },
        {
            name: 'Addiction Support Directory.pdf',
            fileUrl: 'https://www.brightshores.ca/wp/wp-content/uploads/2024/04/MHA-Directory-April-24.pdf'
        },
        {
            name: 'LGBTQ+ Mental Health Resources.pdf',
            fileUrl: 'https://www.mwcscot.org.uk/sites/default/files/2022-08/LGBT-InclusiveServices-GoodPractice_2022.pdf'
        },
        {
            name: 'Senior Mental Health Guide.pdf',
            fileUrl: 'https://mentalhealthcommission.ca/wp-content/uploads/2021/08/Summary_Senior_Guidelines_Eng.pdf'
        },
        {
            name: 'Children\'s Mental Health Handbook.pdf',
            fileUrl: 'https://www.unicef.org/laos/media/6531/file/Mental%20Health%20and%20Psychosocial%20Wellbeing%20Booklet%20for%20Children%20and%20Adolescents%20During%20Emergencies.pdf'
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