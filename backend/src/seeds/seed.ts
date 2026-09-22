import { AppDataSource } from '../ormconfig';
import { GradeEntity } from '../grade/grade.entity';
import { StudentEntity } from '../student/student.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { TeacherEntity } from '../teacher/teacher.entity';

// Every seeded account shares this password so the demo data is easy to log into.
export const DEMO_PASSWORD = 'password123';

export const TEACHERS = [
  {
    firstName: 'Oksana',
    lastName: 'Kovalenko',
    phone: '+380671112233',
    education: 'Lviv National Music Academy, PhD in Musicology',
    email: 'head.teacher@music-school.test',
    isHeadTeacher: true,
  },
  {
    firstName: 'Andriy',
    lastName: 'Melnyk',
    phone: '+380672223344',
    education: 'Kyiv Conservatory, MA in Piano Performance',
    email: 'andriy.melnyk@music-school.test',
    isHeadTeacher: false,
  },
  {
    firstName: 'Iryna',
    lastName: 'Shevchenko',
    phone: '+380673334455',
    education: 'Odesa Music Academy, MA in Violin',
    email: 'iryna.shevchenko@music-school.test',
    isHeadTeacher: false,
  },
  {
    firstName: 'Taras',
    lastName: 'Bondarenko',
    phone: '+380674445566',
    education: 'Kharkiv University of Arts, MA in Guitar',
    email: 'taras.bondarenko@music-school.test',
    isHeadTeacher: false,
  },
];

export const STUDENTS = [
  {
    firstName: 'Sofia',
    lastName: 'Tkachenko',
    phone: '+380501112233',
    parentPhone: '+380501112200',
    address: '12 Shevchenka St, Lviv',
    email: 'sofia.tkachenko@music-school.test',
  },
  {
    firstName: 'Danylo',
    lastName: 'Rudenko',
    phone: '+380502223344',
    parentPhone: '+380502223300',
    address: '48 Franka St, Lviv',
    email: 'danylo.rudenko@music-school.test',
  },
  {
    firstName: 'Mariia',
    lastName: 'Lysenko',
    phone: '+380503334455',
    parentPhone: '+380503334400',
    address: '7 Lesi Ukrainky Blvd, Kyiv',
    email: 'mariia.lysenko@music-school.test',
  },
  {
    firstName: 'Nazar',
    lastName: 'Havryliuk',
    phone: '+380504445566',
    parentPhone: '+380504445500',
    address: '23 Sichovykh Striltsiv St, Kyiv',
    email: 'nazar.havryliuk@music-school.test',
  },
  {
    firstName: 'Kateryna',
    lastName: 'Moroz',
    phone: '+380505556677',
    parentPhone: '+380505556600',
    address: '90 Deribasivska St, Odesa',
    email: 'kateryna.moroz@music-school.test',
  },
  {
    firstName: 'Yurii',
    lastName: 'Pavlenko',
    phone: '+380506667788',
    parentPhone: '+380506667700',
    address: '15 Sumska St, Kharkiv',
    email: 'yurii.pavlenko@music-school.test',
  },
  {
    firstName: 'Anna',
    lastName: 'Kravets',
    phone: '+380507778899',
    parentPhone: '+380507778800',
    address: '3 Soborna St, Vinnytsia',
    email: 'anna.kravets@music-school.test',
  },
  {
    firstName: 'Bohdan',
    lastName: 'Savchuk',
    phone: '+380508889900',
    parentPhone: '+380508889000',
    address: '61 Hrushevskoho St, Lviv',
    email: 'bohdan.savchuk@music-school.test',
  },
];

// teacherIndexes / studentIndexes point into the arrays above.
export const SUBJECTS = [
  {
    name: 'Piano',
    studyYear: 1,
    semester: 1,
    teacherIndexes: [1],
    studentIndexes: [0, 1, 2],
  },
  {
    name: 'Violin',
    studyYear: 1,
    semester: 1,
    teacherIndexes: [2],
    studentIndexes: [3, 4],
  },
  {
    name: 'Solfeggio',
    studyYear: 1,
    semester: 2,
    teacherIndexes: [0, 1],
    studentIndexes: [0, 1, 2, 3, 4],
  },
  {
    name: 'Music Theory',
    studyYear: 2,
    semester: 1,
    teacherIndexes: [0],
    studentIndexes: [5, 6, 7],
  },
  {
    name: 'Classical Guitar',
    studyYear: 2,
    semester: 1,
    teacherIndexes: [3],
    studentIndexes: [5, 6],
  },
  {
    name: 'Choir',
    studyYear: 2,
    semester: 2,
    teacherIndexes: [0, 2],
    studentIndexes: [1, 3, 5, 7],
  },
];

// Spread of grades so averages in the UI have something to show.
export const GRADE_VALUES = [12, 11, 10, 9, 8, 7, 11, 10, 12, 9, 8, 10];

async function seed() {
  const dataSource = await AppDataSource.initialize();

  try {
    console.log('Clearing existing data...');
    // CASCADE also empties the subjects_teachers_teachers / subjects_students_students
    // join tables; RESTART IDENTITY keeps ids predictable across reseeds.
    await dataSource.query(
      'TRUNCATE TABLE "grades", "subjects", "students", "teachers" RESTART IDENTITY CASCADE',
    );

    const teacherRepository = dataSource.getRepository(TeacherEntity);
    const studentRepository = dataSource.getRepository(StudentEntity);
    const subjectRepository = dataSource.getRepository(SubjectEntity);
    const gradeRepository = dataSource.getRepository(GradeEntity);

    console.log('Inserting ' + TEACHERS.length + ' teachers...');
    const teachers: TeacherEntity[] = [];
    for (const teacher of TEACHERS) {
      // Saved one at a time so the @BeforeInsert password hash runs per entity.
      teachers.push(
        await teacherRepository.save(
          teacherRepository.create({ ...teacher, password: DEMO_PASSWORD }),
        ),
      );
    }

    console.log('Inserting ' + STUDENTS.length + ' students...');
    const students: StudentEntity[] = [];
    for (const student of STUDENTS) {
      students.push(
        await studentRepository.save(
          studentRepository.create({ ...student, password: DEMO_PASSWORD }),
        ),
      );
    }

    console.log('Inserting ' + SUBJECTS.length + ' subjects...');
    const subjects: SubjectEntity[] = [];
    for (const { teacherIndexes, studentIndexes, ...subject } of SUBJECTS) {
      // SubjectEntity owns both @JoinTable sides, so saving it writes the links.
      subjects.push(
        await subjectRepository.save(
          subjectRepository.create({
            ...subject,
            teachers: teacherIndexes.map((index) => teachers[index]),
            students: studentIndexes.map((index) => students[index]),
          }),
        ),
      );
    }

    console.log('Inserting grades...');
    const grades: GradeEntity[] = [];
    let cursor = 0;
    SUBJECTS.forEach((subject, subjectIndex) => {
      subject.studentIndexes.forEach((studentIndex) => {
        // Two grades per student per subject, from the subject's first teacher.
        for (let n = 0; n < 2; n++) {
          grades.push(
            gradeRepository.create({
              value: GRADE_VALUES[cursor++ % GRADE_VALUES.length],
              subject: subjects[subjectIndex],
              student: students[studentIndex],
              teacher: teachers[subject.teacherIndexes[0]],
            }),
          );
        }
      });
    });
    await gradeRepository.save(grades);

    console.log('');
    console.log('Seed complete:');
    console.log('  teachers: ' + teachers.length);
    console.log('  students: ' + students.length);
    console.log('  subjects: ' + subjects.length);
    console.log('  grades:   ' + grades.length);
    console.log('');
    console.log('All accounts use the password: ' + DEMO_PASSWORD);
    console.log('  head teacher: ' + TEACHERS[0].email);
    console.log('  teacher:      ' + TEACHERS[1].email);
    console.log('  student:      ' + STUDENTS[0].email);
  } finally {
    await dataSource.destroy();
  }
}

// Guarded so the data above can be imported (e.g. to generate SQL for a managed
// database) without opening a connection.
if (require.main === module) {
  seed().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
}
