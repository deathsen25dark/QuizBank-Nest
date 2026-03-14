import { DataSource } from 'typeorm';
import { User } from 'src/users/users.entity';
import bcrypt from 'bcryptjs';
import { UserRole } from 'src/users/enum/user-role.enum';
import { Topic } from 'src/topics/topics.entity';
import { Question } from 'src/questions/questions.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Topic, Question],
  synchronize: false,
});

async function seedUsers(dataSource: DataSource) {
  const usersRepo = dataSource.getRepository(User);

  const existing = await usersRepo.findOneBy({
    email: 'teacher@gmail.com',
  });

  if (existing) {
    console.log('Teacher already exists');
    return;
  }

  const teacher = usersRepo.create({
    email: 'teacher@gmail.com',
    password: await bcrypt.hash('123456', 10),
    role: UserRole.TEACHER,
    refreshToken: null
  });

  await usersRepo.save(teacher);

  console.log('Teacher created');
}

async function seedTopics(dataSource: DataSource) {
  const topicsRepo = dataSource.getRepository(Topic);

  const topics = [
    { name: 'Toán', description: 'Tính toán, logic, bài toán thực tế, ...' },
    { name: 'Tiếng Anh', description: 'Nghe, nói, đọc, viết, tư duy ngôn ngữ, ...' },
    { name: 'Văn Học', description: 'Chính tả, ngữ pháp, các tác phẩm nghệ thuật, ...' },
    { name: 'Vật Lý', description: 'Vận tốc, thời gian, gia tốc, trọng lực ...' },
    { name: 'Hóa Học', description: 'Nguyên tố, hợp chất, phản ứng, thí nghiệm ...' },
    { name: 'Lịch Sử', description: 'Các sự kiện, nhân vật lịch sử quan trọng' },
    { name: 'Địa Lý', description: 'Địa hình, khí hậu, quốc gia và lãnh thổ' },
    { name: 'Sinh Học', description: 'Cơ thể sống, tế bào, hệ sinh thái' },
    { name: 'Tin Học', description: 'Máy tính, thuật toán, lập trình cơ bản' },
    { name: 'Khoa Học', description: 'Kiến thức khoa học phổ thông và thực tế' },
  ];

  for (const t of topics) {
    const existing = await topicsRepo.findOneBy({ name: t.name });
    if (existing) {
      console.log(`Topic "${t.name}" already existed`);
    } else {
      await topicsRepo.save(topicsRepo.create(t));
      console.log(`Topic "${t.name}" created`);
    }
  }
}

async function seedQuestions(dataSource: DataSource) {
  const questionsRepo = dataSource.getRepository(Question);
  const topicsRepo = dataSource.getRepository(Topic);

  const allTopics = await topicsRepo.find(); // lấy ra toàn bộ topics
  const allTopicsMap = new Map(allTopics.map((topic) => [topic.name, topic]));
  // lấy ra allTopicsMap theo kiểu key - value, với key là topic name và value là toàn bộ topic đó.

  const questions = [
    {
      content: '2 + 1 * 0 + 1 * 3 = ?', answersJson: ['3', '5', '6', '0'],
      correctAnswer: '5', explaination: 'nhân chia trước, cộng trừ sau', topicName: 'Toán'
    },
    {
      content: 'Điền vào chỗ trống: I ... out last night', answersJson: ['go', 'gone', 'have gone', 'went'],
      correctAnswer: 'went', explaination: 'last night là dấu hiệu của thì quá khứ đơn, động từ chia ở v2', topicName: 'Tiếng Anh'
    },
    {
      content: 'Đất Nước là tác phẩm của ai?', answersJson: ['Tố Hữu', 'Hồ Xuân Hương', 'Nguyễn Khoa Điềm', 'Xuân Quỳnh'],
      correctAnswer: 'Nguyễn Khoa Điềm', explaination: 'Đoạn trích Đất Nước nằm ở phần đầu chương V của trường ca “Mặt đường khát vọng”, được Nguyễn Khoa Điềm sáng tác năm 1971 tại chiến khu Trị - Thiên', topicName: 'Văn Học'
    },
    {
      content: 'Tính vận tốc của xe máy khi đi đoạn đường 90 km trong 1 giờ 30 phút?', answersJson: ['50', '60', '70', '80'],
      correctAnswer: '60', explaination: 'Công thức tính vận tốc = quãng đường / thời gian. Vận tốc xe máy = 90/1.5 = 60 km/h', topicName: 'Vật Lý'
    },
    {
      content: 'Số hiệu nguyên tử của Thủy Ngân là?', answersJson: ['80', '18', '36', '79'],
      correctAnswer: '80', explaination: 'Thủy ngân nằm ở ô số 80 trong bảng tuần hoàn các nguyên tố hóa học, thuộc nhóm 12, chu kỳ 6', topicName: 'Hóa Học'
    },
    {
      content: 'Ai là người đọc bản Tuyên ngôn Độc lập của Việt Nam năm 1945?',
      answersJson: ['Võ Nguyên Giáp', 'Hồ Chí Minh', 'Phạm Văn Đồng', 'Trường Chinh'],
      correctAnswer: 'Hồ Chí Minh',
      explaination: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập ngày 2/9/1945',
      topicName: 'Lịch Sử'
    },
    {
      content: 'Thủ đô của Nhật Bản là gì?',
      answersJson: ['Osaka', 'Kyoto', 'Tokyo', 'Nagoya'],
      correctAnswer: 'Tokyo',
      explaination: 'Tokyo là thủ đô và thành phố lớn nhất của Nhật Bản',
      topicName: 'Địa Lý'
    },
    {
      content: 'Đơn vị cơ bản của sự sống là gì?',
      answersJson: ['Tế bào', 'Mô', 'Cơ quan', 'Phân tử'],
      correctAnswer: 'Tế bào',
      explaination: 'Tế bào là đơn vị cơ bản của sự sống',
      topicName: 'Sinh Học'
    },
    {
      content: 'CPU là viết tắt của cụm từ nào?',
      answersJson: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Control Processing Unit'],
      correctAnswer: 'Central Processing Unit',
      explaination: 'CPU là bộ xử lý trung tâm của máy tính',
      topicName: 'Tin Học'
    },
    {
      content: 'Nước sôi ở nhiệt độ bao nhiêu độ C (ở áp suất thường)?',
      answersJson: ['90', '95', '100', '110'],
      correctAnswer: '100',
      explaination: 'Ở áp suất khí quyển tiêu chuẩn, nước sôi ở 100°C',
      topicName: 'Khoa Học'
    },
    {
      content: '5 + 7 = ?',
      answersJson: ['10', '11', '12', '13'],
      correctAnswer: '12',
      explaination: '5 + 7 = 12',
      topicName: 'Toán'
    },
    {
      content: '9 - 3 = ?',
      answersJson: ['3', '4', '5', '6'],
      correctAnswer: '6',
      explaination: '9 trừ 3 bằng 6',
      topicName: 'Toán'
    },
    {
      content: '4 × 3 = ?',
      answersJson: ['7', '10', '12', '14'],
      correctAnswer: '12',
      explaination: '4 nhân 3 bằng 12',
      topicName: 'Toán'
    },
    {
      content: '12 ÷ 4 = ?',
      answersJson: ['2', '3', '4', '6'],
      correctAnswer: '3',
      explaination: '12 chia 4 bằng 3',
      topicName: 'Toán'
    },
    {
      content: '15 + 5 = ?',
      answersJson: ['18', '19', '20', '21'],
      correctAnswer: '20',
      explaination: '15 + 5 = 20',
      topicName: 'Toán'
    },
    {
      content: 'Choose the correct word: She ___ a student.',
      answersJson: ['am', 'is', 'are', 'be'],
      correctAnswer: 'is',
      explaination: 'She đi với "is"',
      topicName: 'Tiếng Anh'
    },
    {
      content: 'Plural of "book" is?',
      answersJson: ['book', 'books', 'bookes', 'bookies'],
      correctAnswer: 'books',
      explaination: 'Danh từ số nhiều thêm s',
      topicName: 'Tiếng Anh'
    },
    {
      content: 'Opposite of "big" is?',
      answersJson: ['tall', 'large', 'small', 'long'],
      correctAnswer: 'small',
      explaination: 'Small là trái nghĩa của big',
      topicName: 'Tiếng Anh'
    },
  ]
  // mảng questions này chỉ lưu topicName, chưa lưu hẳn Topic (như thuộc tính topic trong entity Question)

  for (const q of questions) {
    const currentTopic = allTopicsMap.get(q.topicName); // lấy ra đối tượng Topic bằng cách get theo key (key là topic name)

    if (!currentTopic) {
      console.log(`Không tồn tại topic "${q.topicName}"`); // nếu đối tượng Topic không tồn tại => skip không tạo question
      continue
    }

    const newQuestion: Question = questionsRepo.create({ // tạo ra đối tượng Question với trường topic chứa đối tượng Topic
      content: q.content,
      answersJson: q.answersJson,
      correctAnswer: q.correctAnswer,
      explanation: q.explaination,
      topic: currentTopic,
    })

    await questionsRepo.save(newQuestion);
    console.log(`Question "${q.content}" created`)
  }
}


async function seed() {
  try {
    await dataSource.initialize();

    await seedUsers(dataSource);
    await seedTopics(dataSource);
    await seedQuestions(dataSource);

  } catch (error) {
    console.log(`Lỗi khi seed: ${error}`)
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

seed();