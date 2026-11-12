import { learningLessons } from "@/data/dummy/lessons";

export type QuizOption = {
  id: "A" | "B" | "C" | "D";
  text: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
};

export type LearningQuiz = {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  passingScore: number;
  questions: QuizQuestion[];
};

const optionIds = ["A", "B", "C", "D"] as const;
type QuestionOptions = readonly [string, string, string, string];
type QuestionArguments =
  | [
      id: string,
      question: string,
      options: QuestionOptions,
      correctAnswer: QuizQuestion["correctAnswer"],
      explanation: string,
    ]
  | [
      question: string,
      options: QuestionOptions,
      correctAnswer: QuizQuestion["correctAnswer"],
      explanation: string,
    ];

let generatedQuestionNumber = 0;

function createQuestion(...args: QuestionArguments): QuizQuestion {
  let id: string;
  let question: string;
  let options: QuestionOptions;
  let correctAnswer: QuizQuestion["correctAnswer"];
  let explanation: string;

  if (args.length === 5) {
    [id, question, options, correctAnswer, explanation] = args;
  } else {
    [question, options, correctAnswer, explanation] = args;
    generatedQuestionNumber += 1;
    id = `generated-question-${generatedQuestionNumber}`;
  }

  return {
    id,
    question,
    options: options.map((text, index) => ({
      id: optionIds[index],
      text,
    })),
    correctAnswer,
    explanation,
  };
}

function createQuiz(
  id: string,
  lessonId: string,
  title: string,
  questions: QuizQuestion[],
): LearningQuiz {
  return {
    id,
    lessonId,
    title: `Kuis: ${title}`,
    description: `Uji pemahaman Anda tentang ${title.toLowerCase()}.`,
    passingScore: 80,
    questions,
  };
}

export const learningQuizzes: LearningQuiz[] = [
  createQuiz("quiz-pancasila-01", "pancasila-01", "Sejarah Lahirnya Pancasila", [
    createQuestion(
      "pancasila-01-q01",
      "Apa yang diperingati setiap tanggal 1 Juni dalam sejarah Pancasila?",
      ["Hari Lahir Pancasila", "Hari Kesaktian Pancasila", "Hari Konstitusi", "Hari Kebangkitan Nasional"],
      "A",
      "Tanggal 1 Juni diperingati sebagai Hari Lahir Pancasila, merujuk pada pidato Soekarno dalam sidang BPUPKI.",
    ),
    createQuestion(
      "pancasila-01-q02",
      "Dalam forum apa Soekarno menyampaikan pidato tentang dasar negara pada 1 Juni 1945?",
      ["Sidang PPKI", "Sidang BPUPKI", "Sidang MPR", "Sidang KNIP"],
      "B",
      "Pidato tersebut disampaikan dalam sidang BPUPKI yang membahas dasar negara.",
    ),
    createQuestion(
      "pancasila-01-q03",
      "Apa tujuan utama pembahasan dasar negara sebelum Indonesia merdeka?",
      ["Menentukan mata uang negara", "Menyusun pembagian provinsi", "Menyiapkan landasan bagi negara merdeka", "Memilih kepala daerah"],
      "C",
      "Para tokoh membahas dasar negara sebagai landasan kehidupan negara Indonesia yang akan merdeka.",
    ),
    createQuestion(
      "pancasila-01-q04",
      "Siapa yang menyampaikan pidato pada 1 Juni 1945 yang kemudian dikenal sebagai pidato lahirnya Pancasila?",
      ["Mohammad Hatta", "Mohammad Yamin", "Soepomo", "Soekarno"],
      "D",
      "Soekarno menyampaikan pidato tentang dasar negara pada 1 Juni 1945.",
    ),
    createQuestion(
      "pancasila-01-q05",
      "Apa nama badan yang bersidang untuk membahas persiapan kemerdekaan dan dasar negara?",
      ["BPUPKI", "BKR", "DPR", "BPK"],
      "A",
      "BPUPKI bertugas menyelidiki dan mempersiapkan hal-hal penting bagi kemerdekaan, termasuk dasar negara.",
    ),
    createQuestion(
      "pancasila-01-q06",
      "Mengapa gagasan dasar negara dibahas oleh para tokoh sebelum kemerdekaan?",
      ["Untuk menentukan lagu daerah", "Agar negara memiliki pedoman bersama", "Untuk mengganti bahasa Indonesia", "Agar setiap daerah memiliki negara sendiri"],
      "B",
      "Dasar negara diperlukan sebagai pedoman bersama dalam kehidupan bernegara.",
    ),
    createQuestion(
      "pancasila-01-q07",
      "Pancasila sebagai dasar negara terutama berfungsi sebagai...",
      ["Nama lembaga pemerintahan", "Batas wilayah Indonesia", "Landasan penyelenggaraan negara", "Sistem perdagangan"],
      "C",
      "Dasar negara menjadi landasan bagi penyelenggaraan kehidupan dan pemerintahan negara.",
    ),
    createQuestion(
      "pancasila-01-q08",
      "Peristiwa sejarah yang menjadi latar lahirnya Pancasila berkaitan erat dengan...",
      ["Pembentukan ASEAN", "Pemilu pertama Indonesia", "Perubahan ibu kota", "Persiapan kemerdekaan Indonesia"],
      "D",
      "Perumusan Pancasila berlangsung dalam rangka persiapan kemerdekaan Indonesia.",
    ),
    createQuestion(
      "pancasila-01-q09",
      "Apa sikap yang tepat saat mempelajari sejarah lahirnya Pancasila?",
      ["Menghargai musyawarah dan kontribusi para tokoh", "Menganggap hanya satu tokoh yang berperan", "Mengabaikan proses perumusan", "Menolak kesepakatan bersama"],
      "A",
      "Sejarah perumusan menunjukkan adanya kontribusi para tokoh dan proses mencari kesepakatan.",
    ),
    createQuestion(
      "pancasila-01-q10",
      "Pancasila disebut dasar negara karena...",
      ["Menjadi nama ibu kota", "Menjadi landasan kehidupan bernegara", "Mengatur jadwal sekolah", "Menggantikan seluruh kebudayaan daerah"],
      "B",
      "Pancasila menjadi landasan utama dalam kehidupan bernegara Indonesia.",
    ),
  ]),
  createQuiz("quiz-pancasila-02", "pancasila-02", "Proses Perumusan Pancasila", [
    createQuestion(
      "pancasila-02-q01",
      "Badan yang membahas rancangan dasar negara dalam persiapan kemerdekaan adalah...",
      ["DPA", "MPR", "BPUPKI", "BPK"],
      "C",
      "BPUPKI membahas berbagai persiapan kemerdekaan, termasuk rancangan dasar negara.",
    ),
    createQuestion(
      "pancasila-02-q02",
      "Panitia Sembilan menghasilkan naskah yang dikenal dengan nama...",
      ["Dekret Presiden", "Naskah Proklamasi", "Konstitusi RIS", "Piagam Jakarta"],
      "D",
      "Panitia Sembilan menyusun Piagam Jakarta pada 22 Juni 1945.",
    ),
    createQuestion(
      "pancasila-02-q03",
      "Kapan Piagam Jakarta disepakati oleh Panitia Sembilan?",
      ["22 Juni 1945", "1 Juni 1945", "17 Agustus 1945", "18 Agustus 1945"],
      "A",
      "Piagam Jakarta disepakati pada 22 Juni 1945.",
    ),
    createQuestion(
      "pancasila-02-q04",
      "Lembaga yang menetapkan UUD 1945 dan Pancasila sebagai dasar negara setelah proklamasi adalah...",
      ["BPUPKI", "PPKI", "KNIP", "DPR"],
      "B",
      "PPKI menetapkan UUD 1945 pada 18 Agustus 1945, dengan rumusan Pancasila dalam Pembukaan.",
    ),
    createQuestion(
      "pancasila-02-q05",
      "Apa yang dilakukan para tokoh dalam proses perumusan Pancasila?",
      ["Menentukan batas setiap rumah", "Menyusun daftar perdagangan", "Bertukar gagasan dan bermusyawarah", "Menetapkan bahasa daerah sebagai bahasa negara"],
      "C",
      "Perumusan dasar negara melibatkan penyampaian gagasan dan musyawarah.",
    ),
    createQuestion(
      "pancasila-02-q06",
      "Perubahan rumusan pada proses penetapan Pancasila menunjukkan pentingnya...",
      ["Keputusan sepihak", "Kepentingan kelompok", "Persaingan antardaerah", "Persatuan dan kesepakatan"],
      "D",
      "Penyesuaian rumusan dilakukan untuk menjaga persatuan dan mencapai kesepakatan bersama.",
    ),
    createQuestion(
      "pancasila-02-q07",
      "Kapan PPKI menetapkan UUD 1945?",
      ["18 Agustus 1945", "22 Juni 1945", "1 Juni 1945", "17 Agustus 1945"],
      "A",
      "PPKI menetapkan UUD 1945 pada 18 Agustus 1945, sehari setelah proklamasi.",
    ),
    createQuestion(
      "pancasila-02-q08",
      "Siapa yang terlibat dalam Panitia Sembilan?",
      ["Hanya anggota tentara", "Tokoh-tokoh yang mewakili beragam pandangan", "Seluruh kepala daerah", "Perwakilan negara asing"],
      "B",
      "Panitia Sembilan terdiri dari tokoh-tokoh bangsa dengan latar dan pandangan yang beragam.",
    ),
    createQuestion(
      "pancasila-02-q09",
      "Hubungan Piagam Jakarta dengan Pancasila adalah...",
      ["Piagam Jakarta menggantikan proklamasi", "Piagam Jakarta merupakan nama lain UUDS", "Piagam Jakarta menjadi salah satu tahap perumusan dasar negara", "Piagam Jakarta dibentuk setelah amendemen UUD"],
      "C",
      "Piagam Jakarta merupakan salah satu tahap penting dalam proses perumusan dasar negara.",
    ),
    createQuestion(
      "pancasila-02-q10",
      "Nilai yang dapat diteladani dari proses perumusan Pancasila adalah...",
      ["Memaksakan pendapat", "Menghindari dialog", "Mementingkan kelompok sendiri", "Bermusyawarah demi kepentingan bersama"],
      "D",
      "Para tokoh mengutamakan musyawarah dan kepentingan bangsa untuk mencapai kesepakatan.",
    ),
  ]),
  createQuiz("quiz-pancasila-03", "pancasila-03", "Kedudukan dan Fungsi Pancasila", [
    createQuestion(
      "Pancasila sebagai dasar negara berarti Pancasila menjadi...",
      ["Landasan penyelenggaraan negara", "Nama kabinet", "Lambang setiap provinsi", "Sistem pemilihan kepala desa"],
      "A",
      "Sebagai dasar negara, Pancasila menjadi landasan penyelenggaraan negara.",
    ),
    createQuestion(
      "Pancasila sebagai pandangan hidup bangsa berfungsi sebagai...",
      ["Aturan teknis perdagangan", "Pedoman bersikap dalam kehidupan", "Pengganti seluruh hukum", "Daftar lembaga negara"],
      "B",
      "Pandangan hidup memberi pedoman bagi bangsa dalam bersikap dan bertindak.",
    ),
    createQuestion(
      "Apa arti Pancasila sebagai ideologi negara?",
      ["Pancasila hanya berlaku di sekolah", "Pancasila adalah nama wilayah", "Pancasila memuat cita-cita dan nilai dasar negara", "Pancasila hanya mengatur kegiatan ekonomi"],
      "C",
      "Ideologi negara memuat nilai dasar dan cita-cita yang menjadi arah kehidupan bernegara.",
    ),
    createQuestion(
      "Kedudukan Pancasila dalam pembentukan peraturan perundang-undangan adalah sebagai...",
      ["Peraturan tingkat desa", "Keputusan kepala sekolah", "Pengganti semua pasal UUD", "Sumber dari segala sumber hukum negara"],
      "D",
      "Pancasila merupakan sumber dari segala sumber hukum negara.",
    ),
    createQuestion(
      "Pancasila sebagai kepribadian bangsa tercermin dalam...",
      ["Nilai dan sikap yang menjadi ciri bangsa Indonesia", "Pergantian nama lembaga", "Jumlah pulau", "Jenis mata uang"],
      "A",
      "Kepribadian bangsa tampak pada nilai dan sikap yang menjadi ciri khas kehidupan bangsa.",
    ),
    createQuestion(
      "Jika kebijakan negara disusun, nilai apa yang seharusnya menjadi pedoman dasarnya?",
      ["Kepentingan pribadi pejabat", "Nilai-nilai Pancasila", "Keinginan satu kelompok saja", "Kebiasaan negara lain tanpa pertimbangan"],
      "B",
      "Kebijakan negara harus sejalan dengan nilai Pancasila sebagai dasar negara.",
    ),
    createQuestion(
      "Fungsi Pancasila sebagai pemersatu bangsa berarti Pancasila...",
      ["Menghapus seluruh perbedaan budaya", "Membatasi hubungan antardaerah", "Menjadi titik temu di tengah keberagaman", "Mengutamakan satu golongan"],
      "C",
      "Nilai Pancasila menjadi titik temu yang mempersatukan masyarakat Indonesia yang beragam.",
    ),
    createQuestion(
      "Pancasila disebut ideologi terbuka karena...",
      ["Nilainya dapat diganti setiap saat", "Hanya berlaku pada masa tertentu", "Tidak memiliki nilai dasar", "Nilai dasarnya tetap dan penerapannya dapat menyesuaikan perkembangan"],
      "D",
      "Ideologi terbuka mempertahankan nilai dasar, sementara penerapannya dapat menjawab perubahan zaman.",
    ),
    createQuestion(
      "Contoh penggunaan Pancasila sebagai pedoman hidup adalah...",
      ["Bersikap adil dan menghormati orang lain", "Mengutamakan diri sendiri dalam semua keadaan", "Menolak musyawarah", "Membedakan teman berdasarkan asal daerah"],
      "A",
      "Bersikap adil dan menghormati sesama mencerminkan penerapan nilai Pancasila.",
    ),
    createQuestion(
      "Mengapa Pancasila penting bagi kehidupan bernegara?",
      ["Karena mengatur semua kegiatan pribadi secara rinci", "Karena memberi dasar dan arah bagi kehidupan bangsa", "Karena menggantikan seluruh budaya", "Karena menentukan pekerjaan setiap warga"],
      "B",
      "Pancasila memberikan dasar dan arah bersama bagi kehidupan bangsa dan negara.",
    ),
  ]),
  createQuiz("quiz-pancasila-04", "pancasila-04", "Makna Nilai Setiap Sila Pancasila", [
    createQuestion(
      "Sila pertama Pancasila terutama mengandung nilai...",
      ["Persatuan wilayah", "Musyawarah perwakilan", "Ketuhanan dan penghormatan terhadap kebebasan beragama", "Keadilan ekonomi saja"],
      "C",
      "Sila pertama mengandung nilai ketuhanan serta penghormatan terhadap kehidupan beragama.",
    ),
    createQuestion(
      "Sikap yang paling sesuai dengan sila kedua adalah...",
      ["Memaksakan kehendak", "Mengabaikan hak orang lain", "Membedakan teman berdasarkan status", "Memperlakukan setiap orang secara manusiawi dan bermartabat"],
      "D",
      "Sila kedua menekankan kemanusiaan yang adil dan beradab serta penghormatan terhadap martabat manusia.",
    ),
    createQuestion(
      "Sila ketiga mengajak warga untuk...",
      ["Menjaga persatuan Indonesia", "Mementingkan kelompok sendiri", "Menolak kerja sama antardaerah", "Menghapus semua kebudayaan lokal"],
      "A",
      "Persatuan Indonesia merupakan nilai utama sila ketiga.",
    ),
    createQuestion(
      "Pengambilan keputusan melalui musyawarah mencerminkan sila...",
      ["Pertama", "Keempat", "Kedua", "Kelima"],
      "B",
      "Sila keempat mengandung nilai kerakyatan dan permusyawaratan/perwakilan.",
    ),
    createQuestion(
      "Pembagian kesempatan secara adil bagi seluruh warga mencerminkan sila...",
      ["Kedua", "Ketiga", "Kelima", "Pertama"],
      "C",
      "Sila kelima menekankan keadilan sosial bagi seluruh rakyat Indonesia.",
    ),
    createQuestion(
      "Menghormati teman yang menjalankan ibadah merupakan contoh nilai...",
      ["Persatuan", "Keadilan sosial", "Musyawarah", "Ketuhanan"],
      "D",
      "Menghormati ibadah orang lain mencerminkan nilai Ketuhanan Yang Maha Esa.",
    ),
    createQuestion(
      "Menolong korban bencana tanpa membedakan latar belakang mencerminkan nilai...",
      ["Kemanusiaan", "Persaingan", "Kepentingan golongan", "Kekuasaan"],
      "A",
      "Memberi pertolongan dengan menghormati martabat setiap orang mencerminkan nilai kemanusiaan.",
    ),
    createQuestion(
      "Mendahulukan kepentingan bangsa daripada kepentingan golongan sesuai dengan nilai...",
      ["Keadilan", "Persatuan Indonesia", "Ketuhanan", "Perwakilan"],
      "B",
      "Sila ketiga mengutamakan persatuan dan kepentingan bangsa.",
    ),
    createQuestion(
      "Dalam musyawarah, pendapat minoritas sebaiknya...",
      ["Langsung diabaikan", "Dilarang disampaikan", "Didengar dan dipertimbangkan dengan hormat", "Dianggap selalu salah"],
      "C",
      "Musyawarah menghormati setiap peserta dan mempertimbangkan pendapat secara bijaksana.",
    ),
    createQuestion(
      "Perilaku yang paling mencerminkan keadilan sosial adalah...",
      ["Memberi hak hanya kepada teman dekat", "Mengambil hak orang lain", "Membiarkan ketimpangan tanpa kepedulian", "Memperlakukan orang secara adil dan menghormati haknya"],
      "D",
      "Keadilan sosial diwujudkan dengan perlakuan adil dan penghormatan terhadap hak setiap orang.",
    ),
  ]),
  createQuiz("quiz-pancasila-05", "pancasila-05", "Penerapan Pancasila Sehari-hari", [
    createQuestion(
      "Saat teman berbeda agama merayakan hari besar, sikap yang tepat adalah...",
      ["Menghormati dan memberi kesempatan beribadah", "Mengganggu perayaannya", "Memaksa mengikuti ibadah kita", "Menjauhinya"],
      "A",
      "Menghormati ibadah orang lain merupakan penerapan nilai Ketuhanan.",
    ),
    createQuestion(
      "Jika terjadi perbedaan pendapat dalam kelompok, tindakan yang sesuai Pancasila adalah...",
      ["Membubarkan kelompok", "Bermusyawarah untuk mencari kesepakatan", "Memaksakan pendapat ketua", "Menghina pihak yang berbeda"],
      "B",
      "Musyawarah membantu menyelesaikan perbedaan dengan menghormati semua pihak.",
    ),
    createQuestion(
      "Apa contoh penerapan sila kemanusiaan di lingkungan sekolah?",
      ["Memilih teman berdasarkan kekayaan", "Mengejek teman yang berbeda", "Menolong teman yang membutuhkan tanpa merendahkan", "Membiarkan perundungan"],
      "C",
      "Menolong dengan menghormati martabat orang lain mencerminkan nilai kemanusiaan.",
    ),
    createQuestion(
      "Cara menjaga persatuan di lingkungan yang beragam adalah...",
      ["Menolak berteman dengan kelompok lain", "Menganggap budaya sendiri paling tinggi", "Memperbesar perbedaan", "Bekerja sama dan menghormati perbedaan"],
      "D",
      "Kerja sama dan saling menghormati memperkuat persatuan di tengah keberagaman.",
    ),
    createQuestion(
      "Dalam pemilihan ketua kelas, tindakan yang mencerminkan demokrasi Pancasila adalah...",
      ["Menghargai pilihan dan hasil pemilihan", "Mengancam teman agar memilih calon tertentu", "Merusak kotak suara", "Melarang teman menyampaikan pilihan"],
      "A",
      "Menghargai proses dan hasil pemilihan menunjukkan sikap demokratis dan bertanggung jawab.",
    ),
    createQuestion(
      "Contoh sikap adil saat kerja kelompok adalah...",
      ["Membebankan seluruh tugas kepada satu orang", "Membagi tugas secara wajar dan menghargai kontribusi", "Mengambil pujian untuk diri sendiri", "Mengabaikan anggota tertentu"],
      "B",
      "Pembagian tugas yang wajar dan penghargaan terhadap kontribusi menunjukkan keadilan.",
    ),
    createQuestion(
      "Ketika menemukan barang milik teman, sebaiknya kita...",
      ["Menyimpannya tanpa memberi tahu", "Memberikannya kepada orang lain", "Mengembalikan kepada pemilik atau pihak yang berwenang", "Membuangnya"],
      "C",
      "Mengembalikan barang menunjukkan kejujuran dan penghormatan terhadap hak orang lain.",
    ),
    createQuestion(
      "Sikap yang tepat saat berbeda pilihan dalam pemilihan umum adalah...",
      ["Memutus hubungan dengan pemilih lain", "Menyebarkan kebencian", "Memaksa orang mengubah pilihan", "Menghormati hak pilih dan perbedaan pilihan"],
      "D",
      "Menghormati hak dan pilihan orang lain menjaga persatuan dalam kehidupan demokratis.",
    ),
    createQuestion(
      "Melaksanakan piket kelas bersama-sama terutama menunjukkan...",
      ["Tanggung jawab dan gotong royong", "Persaingan pribadi", "Sikap tidak peduli", "Keinginan menguasai teman"],
      "A",
      "Piket bersama merupakan bentuk gotong royong dan tanggung jawab terhadap lingkungan.",
    ),
    createQuestion(
      "Saat menyampaikan kritik kepada teman, cara yang sesuai nilai Pancasila adalah...",
      ["Mempermalukannya di depan umum", "Menyampaikannya dengan santun dan alasan yang jelas", "Menggunakan ancaman", "Menyebarkan kabar yang belum benar"],
      "B",
      "Kritik yang santun menjaga martabat orang lain dan mendukung penyelesaian yang baik.",
    ),
  ]),
  createQuiz("quiz-uud-1945-01", "uud-1945-01", "Sejarah UUD 1945", [
    createQuestion(
      "Apa kepanjangan UUD?",
      ["Undang-Undang Daerah", "Urusan Umum Dalam", "Undang-Undang Dasar", "Undang-Undang Demokrasi"],
      "C",
      "UUD adalah singkatan dari Undang-Undang Dasar.",
    ),
    createQuestion(
      "Lembaga yang mengesahkan UUD 1945 pada 18 Agustus 1945 adalah...",
      ["BPUPKI", "DPR", "KNIP", "PPKI"],
      "D",
      "PPKI mengesahkan UUD 1945 pada 18 Agustus 1945.",
    ),
    createQuestion(
      "UUD 1945 disahkan sehari setelah peristiwa...",
      ["Proklamasi Kemerdekaan Indonesia", "Kongres Pemuda", "Sumpah Pemuda", "Pembentukan ASEAN"],
      "A",
      "Proklamasi kemerdekaan berlangsung pada 17 Agustus 1945 dan UUD 1945 disahkan keesokan harinya.",
    ),
    createQuestion(
      "Siapa yang memproklamasikan kemerdekaan Indonesia pada 17 Agustus 1945?",
      ["Soepomo dan Mohammad Yamin", "Soekarno dan Mohammad Hatta", "Sutan Sjahrir dan Ki Hajar Dewantara", "Soekarno dan Soepomo"],
      "B",
      "Proklamasi kemerdekaan dibacakan oleh Soekarno didampingi Mohammad Hatta.",
    ),
    createQuestion(
      "UUD 1945 pertama kali berlaku sejak...",
      ["1 Juni 1945", "22 Juni 1945", "ditetapkan PPKI pada 18 Agustus 1945", "Konferensi Asia Afrika"],
      "C",
      "PPKI menetapkan UUD 1945 pada 18 Agustus 1945 sebagai konstitusi negara.",
    ),
    createQuestion(
      "Apa arti konstitusi dalam kehidupan negara?",
      ["Daftar seluruh penduduk", "Lambang daerah", "Rencana pembangunan tahunan", "Aturan dasar penyelenggaraan negara"],
      "D",
      "Konstitusi memuat aturan dasar tentang penyelenggaraan negara dan hubungan kenegaraan.",
    ),
    createQuestion(
      "Sebelum UUD 1945 ditetapkan, rancangan konstitusi dibahas oleh...",
      ["BPUPKI", "Mahkamah Agung", "Bank Indonesia", "Pemerintah daerah"],
      "A",
      "BPUPKI membahas rancangan konstitusi sebagai bagian dari persiapan kemerdekaan.",
    ),
    createQuestion(
      "Mengapa konstitusi diperlukan oleh negara?",
      ["Agar semua warga memiliki pekerjaan yang sama", "Untuk menjadi pedoman dasar penyelenggaraan negara", "Untuk menggantikan seluruh aturan sosial", "Agar tidak ada lembaga negara"],
      "B",
      "Konstitusi memberi pedoman dasar bagi penyelenggaraan kehidupan bernegara.",
    ),
    createQuestion(
      "Perubahan UUD 1945 setelah reformasi dilakukan melalui...",
      ["Penggantian nama negara", "Keputusan setiap pemerintah daerah", "Amendemen oleh MPR", "Pemungutan suara di sekolah"],
      "C",
      "Perubahan UUD 1945 dilakukan melalui amendemen oleh MPR.",
    ),
    createQuestion(
      "Sikap yang tepat terhadap UUD 1945 adalah...",
      ["Menganggapnya tidak berlaku", "Mematuhinya hanya saat diawasi", "Menggantinya dengan aturan pribadi", "Memahami dan menaati ketentuannya"],
      "D",
      "Warga negara perlu memahami dan menaati konstitusi yang berlaku.",
    ),
  ]),
  createQuiz("quiz-uud-1945-02", "uud-1945-02", "Kedudukan UUD 1945", [
    createQuestion(
      "UUD 1945 berkedudukan sebagai...",
      ["Konstitusi tertulis Negara Republik Indonesia", "Peraturan sekolah nasional", "Peraturan pemerintah daerah", "Lambang negara"],
      "A",
      "UUD 1945 merupakan konstitusi tertulis yang menjadi hukum dasar negara Indonesia.",
    ),
    createQuestion(
      "Salah satu fungsi konstitusi adalah...",
      ["Menentukan pilihan pribadi setiap warga", "Membatasi dan mengatur kewenangan lembaga negara", "Menghapus hak warga negara", "Menggantikan seluruh peraturan teknis"],
      "B",
      "Konstitusi mengatur kewenangan lembaga negara dan mencegah kekuasaan berjalan tanpa batas.",
    ),
    createQuestion(
      "Menurut UUD 1945, kedaulatan berada di tangan...",
      ["Presiden saja", "Satu partai politik", "Rakyat dan dilaksanakan menurut Undang-Undang Dasar", "Pemerintah daerah saja"],
      "C",
      "Pasal 1 ayat (2) menyatakan kedaulatan berada di tangan rakyat dan dilaksanakan menurut UUD.",
    ),
    createQuestion(
      "UUD 1945 menjadi pedoman bagi pembentukan...",
      ["Kebiasaan pribadi", "Aturan keluarga saja", "Peraturan organisasi asing", "Peraturan perundang-undangan di bawahnya"],
      "D",
      "Peraturan di bawah konstitusi disusun agar selaras dengan UUD 1945.",
    ),
    createQuestion(
      "Ketentuan bahwa Indonesia adalah negara hukum tercantum dalam...",
      ["Pasal 1 ayat (3) UUD 1945", "Pasal 2 ayat (1) UUD 1945", "Pasal 5 ayat (1) UUD 1945", "Pasal 10 UUD 1945"],
      "A",
      "Pasal 1 ayat (3) UUD 1945 menyatakan bahwa Indonesia adalah negara hukum.",
    ),
    createQuestion(
      "Dalam negara hukum, penyelenggaraan kekuasaan harus...",
      ["Berdasarkan kehendak pribadi", "Berdasarkan hukum yang berlaku", "Mengabaikan konstitusi", "Hanya mengikuti kebiasaan pejabat"],
      "B",
      "Negara hukum menempatkan hukum sebagai dasar penyelenggaraan kekuasaan.",
    ),
    createQuestion(
      "Mengapa kewenangan lembaga negara diatur dalam UUD?",
      ["Agar satu lembaga dapat menguasai semuanya", "Agar warga tidak memiliki hak", "Agar kekuasaan dan tanggung jawab memiliki batas yang jelas", "Agar hukum dapat diabaikan"],
      "C",
      "Pengaturan kewenangan memperjelas batas dan tanggung jawab lembaga negara.",
    ),
    createQuestion(
      "Jika suatu kebijakan bertentangan dengan konstitusi, prinsip yang harus diutamakan adalah...",
      ["Kepentingan pribadi pejabat", "Keinginan kelompok terbesar", "Kebiasaan tanpa dasar hukum", "Kepatuhan pada UUD dan mekanisme hukum"],
      "D",
      "Kebijakan negara harus sesuai dengan konstitusi dan dapat diuji melalui mekanisme hukum.",
    ),
    createQuestion(
      "Perubahan UUD 1945 disebut amendemen. Amendemen berarti...",
      ["Perubahan terhadap ketentuan konstitusi melalui prosedur yang berlaku", "Penghapusan seluruh negara", "Pergantian nama semua lembaga", "Pembuatan peraturan sekolah"],
      "A",
      "Amendemen adalah perubahan terhadap konstitusi melalui prosedur yang ditetapkan.",
    ),
    createQuestion(
      "Kedudukan UUD 1945 membantu menjamin...",
      ["Kekuasaan tanpa batas", "Tertib penyelenggaraan negara dan perlindungan hak", "Penghapusan semua perbedaan", "Kebebasan mengabaikan hukum"],
      "B",
      "Konstitusi mengatur penyelenggaraan negara sekaligus memuat jaminan hak warga.",
    ),
  ]),
  createQuiz("quiz-uud-1945-03", "uud-1945-03", "Struktur UUD 1945", [
    createQuestion(
      "Bagian UUD 1945 yang memuat tujuan negara dan dasar negara adalah...",
      ["Aturan Tambahan", "Bab tentang kekuasaan kehakiman", "Pembukaan", "Lampiran daerah"],
      "C",
      "Pembukaan UUD 1945 memuat tujuan negara dan rumusan Pancasila.",
    ),
    createQuestion(
      "Setelah perubahan, bagian utama UUD 1945 terdiri atas...",
      ["Pembukaan dan lampiran provinsi", "Pancasila dan peraturan desa", "Proklamasi dan undang-undang daerah", "Pembukaan dan pasal-pasal"],
      "D",
      "UUD 1945 tersusun atas Pembukaan dan pasal-pasal.",
    ),
    createQuestion(
      "Pasal-pasal UUD 1945 dikelompokkan ke dalam...",
      ["Bab", "Kabupaten", "Kementerian", "Daerah pemilihan"],
      "A",
      "Pasal-pasal UUD 1945 disusun dalam bab-bab berdasarkan pokok bahasan.",
    ),
    createQuestion(
      "Apa fungsi Aturan Peralihan dalam UUD 1945?",
      ["Mengatur jadwal libur nasional", "Mengatur peralihan pelaksanaan ketentuan saat perubahan tata negara", "Menetapkan lagu daerah", "Menentukan harga barang"],
      "B",
      "Aturan Peralihan mengatur hal yang diperlukan dalam peralihan agar ketentuan tetap dapat dijalankan.",
    ),
    createQuestion(
      "Aturan Tambahan dalam UUD 1945 berisi...",
      ["Daftar seluruh warga", "Pembagian tugas sekolah", "Ketentuan tambahan untuk melaksanakan UUD", "Rencana kegiatan partai"],
      "C",
      "Aturan Tambahan memuat ketentuan tambahan yang diperlukan dalam pelaksanaan UUD.",
    ),
    createQuestion(
      "Rumusan Pancasila dalam UUD 1945 terdapat pada...",
      ["Pasal tentang pendidikan", "Aturan Peralihan", "Aturan Tambahan", "alinea keempat Pembukaan"],
      "D",
      "Rumusan Pancasila termuat dalam alinea keempat Pembukaan UUD 1945.",
    ),
    createQuestion(
      "Alinea pertama Pembukaan UUD 1945 menegaskan bahwa...",
      ["Kemerdekaan adalah hak segala bangsa", "Indonesia berbentuk kerajaan", "Semua warga harus bekerja di pemerintahan", "Negara tidak memerlukan hukum"],
      "A",
      "Alinea pertama menyatakan bahwa kemerdekaan ialah hak segala bangsa dan penjajahan harus dihapuskan.",
    ),
    createQuestion(
      "Tujuan negara Indonesia tercantum dalam...",
      ["Pasal tentang lambang daerah", "Alinea keempat Pembukaan UUD 1945", "Aturan Peralihan saja", "Keputusan pemerintah daerah"],
      "B",
      "Alinea keempat Pembukaan memuat tujuan negara Indonesia.",
    ),
    createQuestion(
      "Mengapa sistematika UUD disusun dalam bagian dan bab?",
      ["Agar isinya sulit ditemukan", "Agar pasal dapat diabaikan", "Agar ketentuan tersusun teratur dan mudah dirujuk", "Agar setiap daerah membuat konstitusi sendiri"],
      "C",
      "Susunan yang sistematis membantu pembaca memahami dan merujuk ketentuan UUD.",
    ),
    createQuestion(
      "Pembukaan UUD 1945 memiliki kedudukan penting karena...",
      ["Hanya berisi daftar nama", "Mengatur seluruh kegiatan harian warga", "Dapat diganti dengan aturan sekolah", "Memuat pokok pikiran dan tujuan negara"],
      "D",
      "Pembukaan memuat pokok-pokok pikiran, tujuan negara, dan dasar negara.",
    ),
  ]),
  createQuiz("quiz-uud-1945-04", "uud-1945-04", "Hak dan Kewajiban Warga Negara", [
    createQuestion(
      "Hak warga negara adalah...",
      ["Sesuatu yang layak diterima atau dimiliki menurut ketentuan", "Tugas yang harus dilakukan orang lain", "Larangan untuk berpartisipasi", "Kewenangan tanpa tanggung jawab"],
      "A",
      "Hak merupakan sesuatu yang dapat diterima atau dimiliki seseorang sesuai ketentuan.",
    ),
    createQuestion(
      "Kewajiban warga negara berarti...",
      ["Keuntungan yang selalu diterima", "Tindakan atau tanggung jawab yang harus dilaksanakan", "Kebebasan tanpa batas", "Hak untuk melanggar aturan"],
      "B",
      "Kewajiban adalah tanggung jawab yang harus dilaksanakan oleh warga negara.",
    ),
    createQuestion(
      "Contoh kewajiban warga negara terhadap hukum adalah...",
      ["Memilih aturan yang ingin ditaati", "Mengabaikan keputusan pengadilan", "Menaati hukum yang berlaku", "Menyebarkan informasi palsu"],
      "C",
      "Setiap warga negara wajib menaati hukum dan pemerintahan sesuai ketentuan.",
    ),
    createQuestion(
      "Hak memperoleh pendidikan dijamin dalam UUD 1945, terutama pada...",
      ["Pasal 27", "Pasal 29", "Pasal 30", "Pasal 31"],
      "D",
      "Pasal 31 UUD 1945 mengatur hak warga negara untuk mendapat pendidikan.",
    ),
    createQuestion(
      "Pasal 27 ayat (1) UUD 1945 menegaskan persamaan warga negara di dalam...",
      ["Hukum dan pemerintahan", "Kepemilikan rumah", "Pekerjaan yang sama", "Organisasi kemasyarakatan"],
      "A",
      "Pasal 27 ayat (1) menyatakan persamaan kedudukan warga negara di dalam hukum dan pemerintahan.",
    ),
    createQuestion(
      "Kebebasan memeluk agama dan beribadat menurut agama dijamin oleh...",
      ["Pasal 23", "Pasal 29 UUD 1945", "Pasal 33", "Aturan Peralihan"],
      "B",
      "Pasal 29 UUD 1945 mengatur negara berdasar Ketuhanan Yang Maha Esa dan jaminan kebebasan beragama.",
    ),
    createQuestion(
      "Mengapa hak dan kewajiban perlu dilaksanakan secara seimbang?",
      ["Agar seseorang dapat menuntut tanpa batas", "Agar kewajiban hanya berlaku bagi orang lain", "Agar kehidupan bersama berlangsung tertib dan saling menghormati", "Agar hukum tidak diperlukan"],
      "C",
      "Keseimbangan hak dan kewajiban mendukung ketertiban serta penghormatan terhadap hak orang lain.",
    ),
    createQuestion(
      "Contoh penggunaan hak berpendapat yang bertanggung jawab adalah...",
      ["Menyebarkan fitnah", "Mengancam orang yang berbeda", "Menghalangi orang berbicara", "Menyampaikan pendapat dengan santun dan tidak melanggar hukum"],
      "D",
      "Hak berpendapat harus dijalankan dengan menghormati hak orang lain dan ketentuan hukum.",
    ),
    createQuestion(
      "Salah satu kewajiban warga negara yang disebut dalam UUD 1945 adalah ikut serta dalam...",
      ["Usaha pertahanan dan keamanan negara sesuai ketentuan", "Penghapusan hak orang lain", "Pengangkatan semua pejabat", "Pembuatan keputusan pengadilan"],
      "A",
      "UUD 1945 mengatur hak dan kewajiban warga untuk ikut serta dalam usaha pertahanan dan keamanan.",
    ),
    createQuestion(
      "Sikap yang tepat ketika menggunakan hak adalah...",
      ["Mengabaikan kepentingan umum", "Menghormati hak orang lain dan menjalankan kewajiban", "Memaksakan keinginan kepada semua orang", "Menolak semua aturan"],
      "B",
      "Penggunaan hak perlu disertai tanggung jawab dan penghormatan terhadap hak orang lain.",
    ),
  ]),
  createQuiz("quiz-uud-1945-05", "uud-1945-05", "Penerapan UUD 1945", [
    createQuestion(
      "Penerapan prinsip persamaan di hadapan hukum berarti...",
      ["Semua warga diperlakukan sama menurut hukum", "Pejabat bebas dari hukum", "Hukum hanya berlaku bagi warga tertentu", "Setiap orang dapat membuat hukum sendiri"],
      "A",
      "Persamaan di hadapan hukum mengharuskan hukum berlaku tanpa membedakan kedudukan warga.",
    ),
    createQuestion(
      "Contoh penerapan hak pendidikan adalah...",
      ["Melarang anak lain bersekolah", "Mendukung kesempatan belajar bagi setiap warga", "Mengabaikan kewajiban belajar", "Membatasi pendidikan berdasarkan asal daerah"],
      "B",
      "Hak pendidikan diterapkan dengan mendukung kesempatan belajar yang setara bagi warga.",
    ),
    createQuestion(
      "Dalam kehidupan bernegara, penyelenggara pemerintahan wajib...",
      ["Bertindak tanpa aturan", "Mengutamakan kepentingan pribadi", "Melaksanakan kewenangan sesuai UUD dan hukum", "Mengabaikan hak warga"],
      "C",
      "Pemerintah harus menjalankan kewenangannya berdasarkan konstitusi dan hukum.",
    ),
    createQuestion(
      "Jika warga tidak setuju terhadap kebijakan, cara yang sesuai prinsip konstitusi adalah...",
      ["Melakukan kekerasan", "Merusak fasilitas umum", "Mengancam petugas", "Menyampaikan keberatan melalui cara yang sah"],
      "D",
      "Keberatan dapat disampaikan melalui jalur hukum dan cara damai yang tersedia.",
    ),
    createQuestion(
      "Menghormati hak beribadah warga lain merupakan penerapan...",
      ["Jaminan kebebasan beragama", "Larangan berpendapat", "Kewajiban membayar pajak", "Kewenangan lembaga peradilan"],
      "A",
      "Menghormati ibadah orang lain sejalan dengan jaminan kebebasan beragama dalam UUD.",
    ),
    createQuestion(
      "Contoh menaati UUD dan hukum di lingkungan masyarakat adalah...",
      ["Mengambil hak tetangga", "Mematuhi aturan lalu lintas", "Menyelesaikan masalah dengan kekerasan", "Mengabaikan aturan lingkungan"],
      "B",
      "Mematuhi aturan lalu lintas merupakan contoh sederhana menaati hukum.",
    ),
    createQuestion(
      "Apa yang sebaiknya dilakukan saat hak seseorang dilanggar?",
      ["Membalas dengan melanggar hak orang lain", "Menyebarkan identitas orang tanpa bukti", "Mencari penyelesaian melalui jalur yang sah", "Mengabaikan keselamatan"],
      "C",
      "Pelanggaran hak sebaiknya ditangani melalui mekanisme yang sah dan tidak melanggar hak lain.",
    ),
    createQuestion(
      "Mengapa warga perlu memahami UUD 1945?",
      ["Agar dapat menghindari semua kewajiban", "Agar dapat mengganti aturan sendiri", "Agar tidak perlu menghormati orang lain", "Agar memahami hak, kewajiban, dan dasar penyelenggaraan negara"],
      "D",
      "Pemahaman UUD membantu warga mengetahui hak dan kewajiban serta cara negara diselenggarakan.",
    ),
    createQuestion(
      "Pengawasan terhadap jalannya pemerintahan secara bertanggung jawab merupakan...",
      ["Partisipasi warga dalam kehidupan demokratis", "Larangan mengikuti hukum", "Pengganti lembaga negara", "Pelanggaran terhadap semua kewenangan"],
      "A",
      "Partisipasi dan pengawasan warga dapat menjadi bagian dari kehidupan demokratis bila dilakukan secara sah.",
    ),
    createQuestion(
      "Sikap yang sesuai dengan prinsip negara hukum saat terjadi sengketa adalah...",
      ["Menggunakan kekerasan untuk menang", "Menyelesaikan melalui proses hukum yang berlaku", "Mengabaikan bukti", "Memaksakan keputusan pribadi"],
      "B",
      "Sengketa seharusnya diselesaikan melalui proses hukum yang berlaku.",
    ),
  ]),
  createQuiz("quiz-nkri-01", "nkri-01", "Sejarah Negara Kesatuan Republik Indonesia", [
    createQuestion(
      "Kapan Indonesia memproklamasikan kemerdekaannya?",
      ["1 Juni 1945", "18 Agustus 1945", "17 Agustus 1945", "22 Juni 1945"],
      "C",
      "Proklamasi Kemerdekaan Indonesia dibacakan pada 17 Agustus 1945.",
    ),
    createQuestion(
      "Apa kepanjangan NKRI?",
      ["Negara Kerakyatan Republik Indonesia", "Negeri Kesatuan Rakyat Indonesia", "Negara Kedaulatan Republik Indonesia", "Negara Kesatuan Republik Indonesia"],
      "D",
      "NKRI adalah singkatan dari Negara Kesatuan Republik Indonesia.",
    ),
    createQuestion(
      "Indonesia memproklamasikan kemerdekaan sebagai...",
      ["Negara merdeka dan berdaulat", "Wilayah pemerintahan negara lain", "Organisasi perdagangan", "Kerajaan daerah"],
      "A",
      "Proklamasi menyatakan kemerdekaan Indonesia sebagai negara yang merdeka.",
    ),
    createQuestion(
      "Salah satu hasil penting sidang PPKI pada 18 Agustus 1945 adalah...",
      ["Membentuk ASEAN", "Mengesahkan UUD 1945", "Menetapkan Konferensi Asia Afrika", "Membuat Sumpah Pemuda"],
      "B",
      "Pada 18 Agustus 1945, PPKI mengesahkan UUD 1945.",
    ),
    createQuestion(
      "Bentuk negara Indonesia menurut UUD 1945 adalah...",
      ["Federasi permanen", "Kerajaan konstitusional", "Negara kesatuan berbentuk republik", "Konfederasi"],
      "C",
      "Pasal 1 ayat (1) UUD 1945 menyatakan Indonesia ialah negara kesatuan yang berbentuk republik.",
    ),
    createQuestion(
      "Peristiwa yang menandai berdirinya Indonesia sebagai negara merdeka adalah...",
      ["Sidang pertama BPUPKI", "Pembentukan Panitia Sembilan", "Kongres Pemuda", "Proklamasi Kemerdekaan"],
      "D",
      "Proklamasi pada 17 Agustus 1945 menandai kemerdekaan Indonesia.",
    ),
    createQuestion(
      "Apa makna negara kesatuan?",
      ["Kedaulatan negara tetap satu meskipun wilayah dibagi menjadi daerah", "Setiap daerah menjadi negara berdaulat sendiri", "Pemerintah pusat tidak memiliki kewenangan", "Tidak ada pemerintahan daerah"],
      "A",
      "Dalam negara kesatuan, kedaulatan negara tetap satu, sementara daerah menjalankan urusan sesuai aturan.",
    ),
    createQuestion(
      "Mengapa sejarah terbentuknya NKRI penting dipelajari?",
      ["Untuk menghapus sejarah daerah", "Untuk menghargai perjuangan dan menjaga kemerdekaan", "Untuk membedakan warga berdasarkan asal", "Untuk menolak persatuan"],
      "B",
      "Memahami sejarah menumbuhkan penghargaan terhadap perjuangan dan tanggung jawab menjaga kemerdekaan.",
    ),
    createQuestion(
      "Siapa yang membacakan teks Proklamasi Kemerdekaan Indonesia?",
      ["Mohammad Yamin", "Soepomo", "Soekarno", "Ki Hajar Dewantara"],
      "C",
      "Teks Proklamasi dibacakan oleh Soekarno.",
    ),
    createQuestion(
      "Setelah merdeka, Indonesia memerlukan dasar hukum untuk...",
      ["Menghapus seluruh lembaga", "Menentukan budaya setiap keluarga", "Membatasi pendidikan", "Mengatur kehidupan bernegara"],
      "D",
      "Konstitusi diperlukan untuk menjadi dasar pengaturan kehidupan negara yang baru merdeka.",
    ),
  ]),
  createQuiz("quiz-nkri-02", "nkri-02", "Bentuk dan Sistem Pemerintahan Indonesia", [
    createQuestion(
      "Bentuk negara Indonesia adalah...",
      ["Negara kesatuan", "Negara konfederasi", "Negara koloni", "Negara protektorat"],
      "A",
      "UUD 1945 menyatakan Indonesia sebagai negara kesatuan.",
    ),
    createQuestion(
      "Bentuk pemerintahan Indonesia adalah...",
      ["Monarki absolut", "Republik", "Kekaisaran", "Persemakmuran"],
      "B",
      "Pasal 1 ayat (1) UUD 1945 menyatakan bentuk pemerintahan Indonesia adalah republik.",
    ),
    createQuestion(
      "Ciri utama sistem pemerintahan presidensial adalah...",
      ["Perdana menteri memimpin kabinet dan menjadi kepala negara", "Raja memimpin pemerintahan", "Presiden memegang kedudukan kepala negara sekaligus kepala pemerintahan", "Pemerintah dipilih oleh negara lain"],
      "C",
      "Dalam sistem presidensial, presiden berkedudukan sebagai kepala negara sekaligus kepala pemerintahan.",
    ),
    createQuestion(
      "Presiden dan wakil presiden Indonesia dipilih...",
      ["Oleh kepala daerah", "Oleh Mahkamah Agung", "Oleh kabinet", "Secara langsung oleh rakyat"],
      "D",
      "Presiden dan wakil presiden dipilih langsung oleh rakyat melalui pemilihan umum.",
    ),
    createQuestion(
      "Pemerintahan daerah dalam negara kesatuan menjalankan kewenangan...",
      ["Sesuai pembagian urusan dan peraturan perundang-undangan", "Tanpa batas dari negara", "Untuk membentuk negara sendiri", "Hanya berdasarkan keputusan pribadi"],
      "A",
      "Pemerintahan daerah menjalankan urusan yang diatur dalam kerangka hukum negara kesatuan.",
    ),
    createQuestion(
      "Mengapa Indonesia disebut republik?",
      ["Kepala negara diwariskan turun-temurun", "Kepala negara tidak ditetapkan melalui pewarisan kerajaan", "Negara tidak memiliki konstitusi", "Setiap wilayah memiliki raja"],
      "B",
      "Republik bukan monarki turun-temurun; jabatan pemerintahan diatur melalui konstitusi dan mekanisme yang berlaku.",
    ),
    createQuestion(
      "Tujuan pembagian kekuasaan dalam pemerintahan adalah...",
      ["Menghilangkan semua lembaga", "Membuat satu pihak tidak dapat diawasi", "Mencegah pemusatan kekuasaan dan mengatur fungsi lembaga", "Menghapus tanggung jawab pemerintah"],
      "C",
      "Pembagian kekuasaan mengatur fungsi lembaga dan membantu mencegah pemusatan kekuasaan.",
    ),
    createQuestion(
      "Pemilihan umum dalam sistem demokrasi berfungsi sebagai...",
      ["Cara menghapus hak warga", "Penunjukan pejabat oleh negara asing", "Pengganti seluruh hukum", "Sarana rakyat menggunakan hak politiknya"],
      "D",
      "Pemilu memberi sarana bagi rakyat untuk memilih wakil dan pemimpin sesuai ketentuan.",
    ),
    createQuestion(
      "Hubungan pemerintah pusat dan daerah dalam NKRI seharusnya...",
      ["Berjalan sesuai konstitusi dan pembagian urusan", "Saling meniadakan", "Membuat daerah berdaulat sendiri", "Tidak memiliki aturan"],
      "A",
      "Hubungan pusat dan daerah diatur dalam kerangka negara kesatuan dan hukum.",
    ),
    createQuestion(
      "Sikap warga yang mendukung pemerintahan demokratis adalah...",
      ["Menghalangi warga menggunakan hak pilih", "Berpartisipasi secara bertanggung jawab dan menaati hukum", "Menyebarkan ancaman", "Menolak semua hasil proses hukum"],
      "B",
      "Partisipasi yang bertanggung jawab dan ketaatan pada hukum mendukung demokrasi.",
    ),
  ]),
  createQuiz("quiz-nkri-03", "nkri-03", "Wilayah dan Kedaulatan Indonesia", [
    createQuestion(
      "Kedaulatan negara berarti...",
      ["Kekuasaan tertinggi untuk mengatur negara secara merdeka", "Kekuasaan setiap orang tanpa batas", "Hak negara lain memerintah Indonesia", "Kewenangan hanya untuk pemerintah daerah"],
      "A",
      "Kedaulatan adalah kekuasaan tertinggi negara untuk mengatur urusan dalam dan luar negeri secara merdeka.",
    ),
    createQuestion(
      "Wilayah negara Indonesia meliputi ruang darat, laut, dan...",
      ["Ruang bawah tanah saja", "Ruang udara sesuai ketentuan hukum", "Wilayah negara lain", "Ruang pribadi warga"],
      "B",
      "Wilayah negara mencakup daratan, perairan, dan ruang udara sesuai hukum.",
    ),
    createQuestion(
      "Sikap yang menunjukkan penghormatan terhadap kedaulatan Indonesia adalah...",
      ["Membiarkan pelanggaran wilayah", "Mengabaikan hukum nasional", "Menjaga wilayah dan menaati hukum negara", "Menyerahkan keputusan negara kepada pihak asing"],
      "C",
      "Menjaga wilayah dan menaati hukum merupakan wujud penghormatan terhadap kedaulatan.",
    ),
    createQuestion(
      "Indonesia disebut negara kepulauan karena...",
      ["Hanya terdiri atas satu pulau", "Seluruh wilayahnya berupa daratan", "Tidak memiliki wilayah laut", "Wilayahnya terdiri atas banyak pulau yang dihubungkan perairan"],
      "D",
      "Indonesia merupakan negara kepulauan yang wilayahnya terdiri atas banyak pulau dan perairan.",
    ),
    createQuestion(
      "Apa arti batas wilayah negara?",
      ["Garis atau ketentuan yang menandai cakupan wilayah suatu negara", "Batas antara dua rumah", "Daftar pulau wisata", "Aturan pembagian kelas"],
      "A",
      "Batas wilayah menentukan cakupan wilayah negara menurut ketentuan yang berlaku.",
    ),
    createQuestion(
      "Kedaulatan ke dalam berarti negara memiliki kewenangan untuk...",
      ["Mengatur seluruh dunia", "Mengatur urusan dalam wilayahnya berdasarkan hukum", "Menghapus hak warga", "Memerintah negara lain"],
      "B",
      "Kedaulatan ke dalam adalah kewenangan negara mengatur urusan di wilayahnya.",
    ),
    createQuestion(
      "Menjaga laut Indonesia penting karena...",
      ["Laut tidak termasuk wilayah negara", "Laut hanya digunakan untuk rekreasi", "Perairan merupakan bagian wilayah dan sumber kehidupan masyarakat", "Semua kapal bebas mengabaikan hukum"],
      "C",
      "Perairan merupakan bagian wilayah negara serta menopang kehidupan dan kegiatan masyarakat.",
    ),
    createQuestion(
      "Sengketa batas wilayah sebaiknya ditangani melalui...",
      ["Tindakan sepihak tanpa bukti", "Kekerasan terhadap warga sipil", "Pengabaian perjanjian", "Diplomasi dan mekanisme hukum yang berlaku"],
      "D",
      "Sengketa antarnegara perlu ditangani secara damai melalui diplomasi dan hukum.",
    ),
    createQuestion(
      "Kedaulatan rakyat di Indonesia dilaksanakan menurut...",
      ["Undang-Undang Dasar", "Keputusan pribadi satu orang", "Aturan negara asing", "Kebiasaan tanpa hukum"],
      "A",
      "UUD 1945 menyebut kedaulatan berada di tangan rakyat dan dilaksanakan menurut Undang-Undang Dasar.",
    ),
    createQuestion(
      "Perilaku yang mencerminkan tanggung jawab terhadap wilayah Indonesia adalah...",
      ["Merusak lingkungan pesisir", "Menjaga lingkungan dan melaporkan ancaman melalui jalur yang tepat", "Menyebarkan lokasi sensitif tanpa izin", "Mengabaikan keselamatan pelayaran"],
      "B",
      "Menjaga lingkungan dan menyampaikan laporan melalui jalur yang benar mendukung perlindungan wilayah.",
    ),
  ]),
  createQuiz("quiz-nkri-04", "nkri-04", "Persatuan dan Kesatuan Bangsa", [
    createQuestion(
      "Persatuan bangsa berarti...",
      ["Bersatunya berbagai kelompok sebagai satu bangsa", "Hilangnya seluruh identitas daerah", "Kewajiban semua warga memiliki pendapat sama", "Pemisahan wilayah"],
      "A",
      "Persatuan menyatukan berbagai kelompok tanpa harus menghapus keragaman identitas.",
    ),
    createQuestion(
      "Semboyan yang menggambarkan persatuan dalam keberagaman Indonesia adalah...",
      ["Tut Wuri Handayani", "Bhinneka Tunggal Ika", "Ing Ngarsa Sung Tuladha", "Jalesveva Jayamahe"],
      "B",
      "Bhinneka Tunggal Ika berarti berbeda-beda tetapi tetap satu.",
    ),
    createQuestion(
      "Salah satu hal yang dapat mengancam persatuan adalah...",
      ["Gotong royong", "Musyawarah", "Sikap intoleran dan menyebarkan kebencian", "Kerja sama"],
      "C",
      "Intoleransi dan kebencian dapat merusak kepercayaan serta persatuan masyarakat.",
    ),
    createQuestion(
      "Cara memperkuat persatuan di tengah perbedaan adalah...",
      ["Memaksakan budaya sendiri", "Menghindari semua kelompok lain", "Menyebarkan prasangka", "Membangun kerja sama dan saling menghormati"],
      "D",
      "Kerja sama dan saling menghormati memperkuat ikatan kebangsaan.",
    ),
    createQuestion(
      "Bahasa Indonesia berperan dalam persatuan karena...",
      ["Menjadi sarana komunikasi bersama", "Menghapus bahasa daerah", "Menggantikan semua tradisi", "Hanya digunakan dalam pemerintahan"],
      "A",
      "Bahasa Indonesia menjadi bahasa persatuan dan sarana komunikasi antarkelompok.",
    ),
    createQuestion(
      "Apa makna gotong royong bagi persatuan?",
      ["Mengerjakan semua hal sendiri", "Bekerja bersama untuk kepentingan bersama", "Bersaing untuk menguasai warga", "Menghindari tanggung jawab"],
      "B",
      "Gotong royong menumbuhkan kepedulian dan kerja sama demi kepentingan bersama.",
    ),
    createQuestion(
      "Ketika muncul perbedaan pandangan di masyarakat, sikap yang mendukung persatuan ialah...",
      ["Menyebarkan fitnah", "Mengancam pihak lain", "Berdialog dan mencari penyelesaian damai", "Menolak mendengar siapa pun"],
      "C",
      "Dialog yang damai membantu menyelesaikan perbedaan tanpa merusak persatuan.",
    ),
    createQuestion(
      "Mengapa persatuan tidak berarti menyeragamkan semua kebudayaan?",
      ["Karena perbedaan harus selalu dipertentangkan", "Karena budaya daerah tidak penting", "Karena hanya satu budaya boleh ada", "Karena keberagaman dapat hidup dalam satu kesatuan bangsa"],
      "D",
      "Persatuan menghimpun keragaman dalam satu bangsa, bukan menghapus identitas budaya.",
    ),
    createQuestion(
      "Contoh menjaga persatuan di lingkungan sekolah adalah...",
      ["Bekerja sama dengan teman yang berbeda latar belakang", "Membentuk kelompok yang menolak teman lain", "Mengejek bahasa daerah", "Menyebarkan rumor antarkelas"],
      "A",
      "Kerja sama lintas latar belakang membangun rasa kebersamaan.",
    ),
    createQuestion(
      "Sikap yang tepat ketika mendengar informasi provokatif yang belum jelas adalah...",
      ["Langsung menyebarkannya", "Memeriksa kebenaran dan tidak ikut memecah belah", "Menambah cerita agar menarik", "Menggunakannya untuk menyerang kelompok tertentu"],
      "B",
      "Memeriksa informasi sebelum menyebarkannya mencegah provokasi yang dapat merusak persatuan.",
    ),
  ]),
  createQuiz("quiz-nkri-05", "nkri-05", "Menjaga Keutuhan NKRI", [
    createQuestion(
      "Salah satu cara warga menjaga keutuhan NKRI adalah...",
      ["Menaati hukum dan menghormati sesama warga", "Menyebarkan permusuhan", "Merusak fasilitas umum", "Mengabaikan kepentingan bangsa"],
      "A",
      "Ketaatan pada hukum dan sikap saling menghormati membantu menjaga kehidupan bangsa yang utuh.",
    ),
    createQuestion(
      "Jika menemukan ajakan kekerasan yang mengancam warga, tindakan tepat adalah...",
      ["Ikut menyebarkannya", "Melaporkan melalui saluran yang berwenang dan tidak bertindak sendiri", "Membalas dengan kekerasan", "Menyebarkan identitas orang tanpa bukti"],
      "B",
      "Ancaman perlu ditangani melalui pihak berwenang, bukan tindakan main hakim sendiri.",
    ),
    createQuestion(
      "Menghargai perbedaan suku dan budaya membantu...",
      ["Meningkatkan konflik", "Menghapus hukum", "Memperkuat persatuan nasional", "Membatasi kerja sama"],
      "C",
      "Penghargaan terhadap keberagaman menumbuhkan saling percaya dan memperkuat persatuan.",
    ),
    createQuestion(
      "Menjaga fasilitas umum merupakan bentuk...",
      ["Kepentingan pribadi", "Penolakan terhadap masyarakat", "Persaingan antardaerah", "Tanggung jawab sebagai warga"],
      "D",
      "Fasilitas umum digunakan bersama sehingga menjaganya merupakan tanggung jawab warga.",
    ),
    createQuestion(
      "Apa yang sebaiknya dilakukan untuk mencegah konflik di lingkungan?",
      ["Membangun komunikasi dan menyelesaikan masalah secara damai", "Menyebarkan prasangka", "Menghindari dialog", "Membalas kesalahan dengan kekerasan"],
      "A",
      "Komunikasi dan penyelesaian damai dapat mencegah konflik berkembang.",
    ),
    createQuestion(
      "Sikap bela negara bagi warga dapat diwujudkan melalui...",
      ["Melanggar hukum", "Belajar, bekerja, dan berkontribusi secara bertanggung jawab", "Merusak lingkungan", "Menghasut permusuhan"],
      "B",
      "Bela negara dapat diwujudkan melalui kontribusi positif sesuai peran dan kemampuan warga.",
    ),
    createQuestion(
      "Mengapa penyebaran berita bohong berbahaya bagi keutuhan bangsa?",
      ["Selalu meningkatkan pengetahuan", "Tidak berpengaruh pada masyarakat", "Dapat menimbulkan salah paham dan perpecahan", "Menggantikan fungsi hukum"],
      "C",
      "Berita bohong dapat memicu ketidakpercayaan, konflik, dan perpecahan.",
    ),
    createQuestion(
      "Ketika terjadi perbedaan pendapat antarkelompok, cara yang sesuai untuk menjaga NKRI adalah...",
      ["Mengancam kelompok lain", "Memaksakan keputusan sepihak", "Memutus semua komunikasi", "Mengedepankan dialog, hukum, dan kepentingan bersama"],
      "D",
      "Dialog dan hukum membantu mengelola perbedaan tanpa mengorbankan persatuan.",
    ),
    createQuestion(
      "Tanggung jawab menjaga keutuhan NKRI berada pada...",
      ["Seluruh warga dan penyelenggara negara sesuai perannya", "Pemerintah pusat saja", "Warga di wilayah perbatasan saja", "Satu kelompok masyarakat"],
      "A",
      "Menjaga keutuhan negara merupakan tanggung jawab bersama sesuai peran masing-masing.",
    ),
    createQuestion(
      "Perilaku yang mencerminkan cinta tanah air adalah...",
      ["Merendahkan daerah lain", "Merawat lingkungan dan ikut berkontribusi bagi masyarakat", "Menolak aturan bersama", "Mengutamakan konflik"],
      "B",
      "Kontribusi positif dan kepedulian terhadap lingkungan merupakan wujud cinta tanah air.",
    ),
  ]),
  createQuiz("quiz-bhinneka-tunggal-ika-01", "bhinneka-tunggal-ika-01", "Sejarah Bhinneka Tunggal Ika", [
    createQuestion(
      "Apa arti semboyan Bhinneka Tunggal Ika?",
      ["Bersatu untuk menjadi sama", "Berbeda-beda tetapi tetap satu", "Satu budaya untuk semua", "Berbeda berarti terpisah"],
      "B",
      "Bhinneka Tunggal Ika berarti berbeda-beda tetapi tetap satu.",
    ),
    createQuestion(
      "Semboyan Bhinneka Tunggal Ika berasal dari karya sastra...",
      ["Negarakertagama", "Arjunawiwaha", "Sutasoma", "Pararaton"],
      "C",
      "Ungkapan Bhinneka Tunggal Ika terdapat dalam Kakawin Sutasoma.",
    ),
    createQuestion(
      "Tokoh yang menulis Kakawin Sutasoma adalah...",
      ["Mpu Prapanca", "Mpu Kanwa", "Mpu Sedah", "Mpu Tantular"],
      "D",
      "Kakawin Sutasoma ditulis oleh Mpu Tantular.",
    ),
    createQuestion(
      "Semboyan Bhinneka Tunggal Ika menjadi bagian dari...",
      ["Lambang Negara Garuda Pancasila", "Bendera Merah Putih", "Peta Indonesia", "Lagu Indonesia Raya"],
      "A",
      "Bhinneka Tunggal Ika tercantum pada pita yang dicengkeram Garuda Pancasila.",
    ),
    createQuestion(
      "Apa pesan utama Bhinneka Tunggal Ika bagi masyarakat Indonesia?",
      ["Perbedaan harus dihilangkan", "Keberagaman dapat hidup dalam persatuan", "Setiap kelompok harus terpisah", "Hanya satu tradisi yang boleh berkembang"],
      "B",
      "Semboyan ini mengajarkan persatuan tanpa menghapus keberagaman.",
    ),
    createQuestion(
      "Semboyan Bhinneka Tunggal Ika berasal dari masa...",
      ["Kerajaan Sriwijaya abad ke-7", "Masa reformasi", "Kerajaan Majapahit", "Masa pendudukan Jepang"],
      "C",
      "Kakawin Sutasoma yang memuat ungkapan tersebut berasal dari masa Majapahit.",
    ),
    createQuestion(
      "Dalam lambang negara, semboyan Bhinneka Tunggal Ika ditulis pada...",
      ["Perisai di dada Garuda", "Sayap Garuda", "Mahkota Garuda", "Pita yang dicengkeram Garuda"],
      "D",
      "Semboyan Bhinneka Tunggal Ika tertulis pada pita yang dicengkeram Garuda.",
    ),
    createQuestion(
      "Bhinneka Tunggal Ika mengajarkan bahwa persatuan...",
      ["Tidak mengharuskan semua orang memiliki identitas yang sama", "Hanya dapat tercapai jika budaya daerah dihapus", "Berarti semua warga harus berpikir sama", "Tidak membutuhkan sikap saling menghormati"],
      "A",
      "Persatuan tetap dapat terjaga meskipun warga memiliki identitas dan kebudayaan yang beragam.",
    ),
    createQuestion(
      "Semboyan Bhinneka Tunggal Ika secara konstitusional disebut pada...",
      ["Pasal 1 UUD 1945", "Pasal 36A UUD 1945", "Pasal 27 UUD 1945", "Aturan Peralihan"],
      "B",
      "Pasal 36A UUD 1945 menyebut lambang negara Garuda Pancasila dengan semboyan Bhinneka Tunggal Ika.",
    ),
    createQuestion(
      "Sikap yang sesuai dengan makna semboyan tersebut adalah...",
      ["Mengutamakan prasangka", "Menolak berinteraksi dengan kelompok lain", "Menghargai perbedaan sambil menjaga kebersamaan", "Memaksakan kebiasaan sendiri"],
      "C",
      "Menghargai perbedaan dan memelihara kebersamaan mencerminkan makna semboyan.",
    ),
  ]),
  createQuiz("quiz-bhinneka-tunggal-ika-02", "bhinneka-tunggal-ika-02", "Keberagaman Suku, Agama, Ras, dan Budaya", [
    createQuestion(
      "Keberagaman suku, agama, ras, dan budaya di Indonesia merupakan...",
      ["Kenyataan sosial yang perlu dihargai", "Alasan untuk memisahkan masyarakat", "Hambatan yang harus dihapus seluruhnya", "Tanda bahwa persatuan tidak mungkin"],
      "A",
      "Keberagaman merupakan kenyataan sosial Indonesia yang harus dikelola dengan sikap saling menghargai.",
    ),
    createQuestion(
      "Suku bangsa biasanya memiliki...",
      ["Hak untuk menguasai suku lain", "Identitas dan kebudayaan yang berkembang dalam masyarakat", "Bahasa yang wajib digunakan semua warga", "Kewenangan negara sendiri"],
      "B",
      "Suku bangsa memiliki identitas budaya yang berkembang dalam kehidupan masyarakat.",
    ),
    createQuestion(
      "Contoh keragaman budaya Indonesia adalah...",
      ["Satu jenis pakaian untuk semua daerah", "Satu bahasa daerah di seluruh nusantara", "Bahasa daerah, tarian, dan tradisi yang beragam", "Tidak adanya adat istiadat"],
      "C",
      "Bahasa daerah, tarian, dan tradisi merupakan contoh keragaman budaya.",
    ),
    createQuestion(
      "Sikap tepat terhadap teman yang memiliki latar suku berbeda adalah...",
      ["Meminta ia meninggalkan identitasnya", "Membuat lelucon yang merendahkan", "Menghindarinya dalam semua kegiatan", "Berteman dan bekerja sama tanpa diskriminasi"],
      "D",
      "Perbedaan suku bukan alasan untuk membedakan perlakuan atau menghalangi kerja sama.",
    ),
    createQuestion(
      "Mengapa stereotip terhadap kelompok tertentu perlu dihindari?",
      ["Karena dapat menimbulkan prasangka dan perlakuan tidak adil", "Karena membuat semua orang sama", "Karena menghapus keberagaman", "Karena menggantikan aturan hukum"],
      "A",
      "Stereotip dapat memicu prasangka, diskriminasi, dan kesalahpahaman.",
    ),
    createQuestion(
      "Sikap terhadap perbedaan agama yang sesuai dengan kehidupan berbangsa adalah...",
      ["Memaksa orang mengikuti agama lain", "Menghormati hak setiap orang untuk beragama dan beribadah", "Mengganggu kegiatan ibadah", "Membatasi pertemanan berdasarkan agama"],
      "B",
      "Menghormati kebebasan beragama dan beribadah mendukung kehidupan yang damai.",
    ),
    createQuestion(
      "Keberagaman dapat menjadi kekuatan bangsa apabila warga...",
      ["Saling mencurigai", "Menolak kerja sama", "Saling menghormati dan bekerja sama", "Menganggap kelompok sendiri paling unggul"],
      "C",
      "Saling menghormati dan bekerja sama membuat perbedaan menjadi kekuatan bersama.",
    ),
    createQuestion(
      "Bahasa Indonesia dalam masyarakat yang memiliki banyak bahasa daerah berfungsi sebagai...",
      ["Pengganti semua bahasa daerah", "Bahasa yang hanya boleh dipakai di rumah", "Alat untuk merendahkan bahasa lain", "Bahasa persatuan dan komunikasi bersama"],
      "D",
      "Bahasa Indonesia menjadi bahasa persatuan tanpa menghilangkan keberadaan bahasa daerah.",
    ),
    createQuestion(
      "Cara mengenal budaya daerah lain secara positif adalah...",
      ["Belajar dan berdialog dengan sikap terbuka", "Membandingkan untuk merendahkan", "Menyebarkan informasi tanpa memeriksa", "Menganggap semua tradisi sama"],
      "A",
      "Belajar dengan terbuka membantu memahami kebudayaan lain secara tepat dan hormat.",
    ),
    createQuestion(
      "Prinsip yang harus dipegang dalam keberagaman adalah...",
      ["Hak kelompok mayoritas boleh menghapus hak lain", "Persamaan martabat dan penghormatan terhadap hak semua warga", "Perbedaan harus selalu dipertentangkan", "Satu kelompok menentukan identitas semua orang"],
      "B",
      "Semua warga memiliki martabat dan hak yang harus dihormati tanpa diskriminasi.",
    ),
  ]),
  createQuiz("quiz-bhinneka-tunggal-ika-03", "bhinneka-tunggal-ika-03", "Makna Toleransi", [
    createQuestion(
      "Toleransi dalam masyarakat berarti...",
      ["Membiarkan diskriminasi", "Menghormati perbedaan dan hak orang lain", "Menyetujui semua pendapat", "Menghapus keyakinan pribadi"],
      "B",
      "Toleransi adalah sikap menghormati perbedaan dan hak orang lain tanpa harus menyamakan keyakinan.",
    ),
    createQuestion(
      "Toleransi tidak berarti...",
      ["Menghormati orang lain", "Bersikap terbuka", "Harus menyetujui semua keyakinan dan pendapat", "Menjaga hubungan baik"],
      "C",
      "Toleransi tidak menuntut seseorang menyetujui semua pandangan, tetapi tetap menghormati hak orang lain.",
    ),
    createQuestion(
      "Contoh toleransi beragama adalah...",
      ["Memaksa teman mengikuti ibadah kita", "Mengganggu perayaan agama lain", "Mengejek keyakinan orang lain", "Memberi kesempatan orang lain beribadah dengan tenang"],
      "D",
      "Memberi ruang bagi orang lain untuk beribadah merupakan bentuk penghormatan.",
    ),
    createQuestion(
      "Saat tetangga mengadakan kegiatan budaya yang berbeda, sikap tepat adalah...",
      ["Menghormati selama kegiatan berlangsung sesuai aturan", "Mengganggu agar kegiatan berhenti", "Menyebarkan ejekan", "Melarang tanpa alasan"],
      "A",
      "Penghormatan terhadap kegiatan budaya yang sah mendukung kerukunan.",
    ),
    createQuestion(
      "Mengapa toleransi penting di lingkungan yang beragam?",
      ["Agar satu kelompok menguasai kelompok lain", "Untuk menjaga kerukunan dan mencegah konflik", "Agar tidak ada komunikasi", "Untuk menghapus identitas warga"],
      "B",
      "Toleransi membantu menjaga kerukunan dan mengurangi potensi konflik.",
    ),
    createQuestion(
      "Ketika mendengar pendapat yang berbeda, sikap toleran adalah...",
      ["Langsung memutus pembicaraan", "Menghina orang yang berbicara", "Mendengarkan dengan hormat dan menanggapi secara santun", "Memaksa pembicara mengubah keyakinan"],
      "C",
      "Mendengarkan dan menanggapi dengan santun menunjukkan penghormatan terhadap perbedaan.",
    ),
    createQuestion(
      "Tindakan yang bertentangan dengan toleransi adalah...",
      ["Berdialog dengan terbuka", "Menghormati hari besar agama lain", "Bekerja sama dalam kegiatan lingkungan", "Mendiskriminasi seseorang karena identitasnya"],
      "D",
      "Diskriminasi menolak persamaan martabat dan hak orang lain.",
    ),
    createQuestion(
      "Dalam menyelesaikan perbedaan, toleransi mendorong warga untuk...",
      ["Mencari jalan tengah tanpa melanggar hak", "Menggunakan kekerasan", "Mengucilkan pihak yang berbeda", "Menyebarkan kebencian"],
      "A",
      "Dialog dan pencarian solusi yang menghormati hak membantu mengelola perbedaan.",
    ),
    createQuestion(
      "Apa hubungan toleransi dengan persatuan?",
      ["Toleransi membuat semua budaya hilang", "Toleransi membantu warga hidup bersama meskipun berbeda", "Toleransi melarang adanya pendapat", "Toleransi hanya berlaku untuk keluarga"],
      "B",
      "Toleransi memungkinkan masyarakat yang berbeda hidup bersama dalam persatuan.",
    ),
    createQuestion(
      "Jika candaan tentang identitas teman membuatnya tersinggung, tindakan yang tepat adalah...",
      ["Mengulanginya agar dianggap biasa", "Menyalahkan teman tersebut", "Meminta maaf dan berhenti merendahkan identitasnya", "Mengajak orang lain ikut mengejek"],
      "C",
      "Meminta maaf dan menghentikan perilaku tersebut menunjukkan empati dan penghormatan.",
    ),
  ]),
  createQuiz("quiz-bhinneka-tunggal-ika-04", "bhinneka-tunggal-ika-04", "Menghargai Perbedaan dan Menjaga Persatuan", [
    createQuestion(
      "Menghargai perbedaan dapat dilakukan dengan...",
      ["Mendengarkan pandangan orang lain tanpa merendahkan", "Menganggap perbedaan sebagai ancaman", "Memaksakan kebiasaan sendiri", "Menolak kerja sama"],
      "A",
      "Mendengarkan dengan hormat merupakan cara menghargai pandangan yang berbeda.",
    ),
    createQuestion(
      "Dalam kerja kelompok yang beragam, sikap yang menjaga persatuan adalah...",
      ["Memilih anggota berdasarkan kesamaan saja", "Membagi peran secara adil dan bekerja sama", "Mengejek kebiasaan anggota", "Mengabaikan pendapat anggota lain"],
      "B",
      "Pembagian peran yang adil dan kerja sama membuat semua anggota merasa dihargai.",
    ),
    createQuestion(
      "Jika terjadi salah paham antarteman dari latar berbeda, langkah awal yang baik adalah...",
      ["Menyebarkan kabar ke seluruh kelas", "Membalas dengan hinaan", "Berkomunikasi langsung dengan tenang", "Mengakhiri pertemanan tanpa penjelasan"],
      "C",
      "Komunikasi yang tenang membantu mengetahui masalah dan mencegah salah paham membesar.",
    ),
    createQuestion(
      "Perbedaan pendapat sebaiknya diselesaikan dengan...",
      ["Ancaman", "Pemaksaan", "Pengucilan", "Musyawarah dan saling menghormati"],
      "D",
      "Musyawarah menyediakan cara damai untuk menyelesaikan perbedaan.",
    ),
    createQuestion(
      "Mengapa tidak boleh menilai seseorang hanya berdasarkan asal sukunya?",
      ["Karena setiap orang harus dinilai dari sikap dan tindakannya, bukan prasangka kelompok", "Karena suku menentukan semua perilaku", "Karena semua orang memiliki pengalaman sama", "Karena identitas tidak boleh dibicarakan"],
      "A",
      "Menilai individu dari stereotip kelompok dapat menimbulkan prasangka dan ketidakadilan.",
    ),
    createQuestion(
      "Apa yang perlu dilakukan ketika melihat teman dikucilkan karena perbedaan?",
      ["Ikut mengucilkan", "Mengajak bersikap inklusif dan mencari bantuan bila diperlukan", "Merekam lalu menyebarkannya", "Menganggapnya bukan urusan siapa pun"],
      "B",
      "Sikap inklusif melindungi martabat teman dan mencegah diskriminasi berlanjut.",
    ),
    createQuestion(
      "Menghargai perbedaan budaya bukan berarti...",
      ["Bersedia mempelajari tradisi lain", "Menjaga kesopanan saat berdialog", "Meninggalkan seluruh budaya sendiri", "Menghindari penghinaan terhadap budaya lain"],
      "C",
      "Menghargai budaya lain tidak mengharuskan seseorang meninggalkan identitas budayanya sendiri.",
    ),
    createQuestion(
      "Persatuan dalam masyarakat dapat dibangun melalui...",
      ["Persaingan antarkelompok", "Penyebaran prasangka", "Pemaksaan keseragaman", "Kegiatan bersama yang melibatkan warga beragam"],
      "D",
      "Kegiatan bersama mempertemukan warga dan membangun rasa kebersamaan.",
    ),
    createQuestion(
      "Sikap adil terhadap warga yang berbeda latar belakang berarti...",
      ["Memberikan kesempatan dan perlakuan tanpa diskriminasi", "Memberi hak hanya kepada kelompok sendiri", "Mengutamakan prasangka", "Membatasi partisipasi kelompok tertentu"],
      "A",
      "Keadilan menuntut perlakuan setara dan kesempatan tanpa diskriminasi.",
    ),
    createQuestion(
      "Apa yang sebaiknya dilakukan sebelum membagikan pesan yang menyalahkan kelompok tertentu?",
      ["Langsung meneruskannya", "Memeriksa kebenaran dan mempertimbangkan dampaknya", "Menambah tuduhan", "Mengirimkannya ke sebanyak mungkin grup"],
      "B",
      "Memeriksa fakta dan dampak pesan mencegah penyebaran prasangka serta konflik.",
    ),
  ]),
  createQuiz("quiz-bhinneka-tunggal-ika-05", "bhinneka-tunggal-ika-05", "Penerapan Bhinneka Tunggal Ika Sehari-hari", [
    createQuestion(
      "Contoh penerapan Bhinneka Tunggal Ika di sekolah adalah...",
      ["Berteman dan belajar bersama tanpa membedakan latar belakang", "Membuat kelompok yang menolak siswa lain", "Mengejek bahasa daerah teman", "Memaksa semua siswa memiliki kebiasaan sama"],
      "A",
      "Belajar bersama tanpa diskriminasi menunjukkan persatuan dalam keberagaman.",
    ),
    createQuestion(
      "Saat teman menggunakan bahasa daerah yang belum kita pahami, sebaiknya...",
      ["Menertawakannya", "Bertanya dengan sopan dan tetap menghargai bahasanya", "Meminta ia berhenti menggunakan bahasanya", "Menganggap bahasanya tidak penting"],
      "B",
      "Bertanya dengan sopan menunjukkan rasa ingin tahu sekaligus penghormatan terhadap bahasa daerah.",
    ),
    createQuestion(
      "Dalam kegiatan warga, cara melibatkan masyarakat yang beragam adalah...",
      ["Hanya mengundang kelompok sendiri", "Membatasi partisipasi berdasarkan agama", "Membuka kesempatan berpartisipasi secara adil", "Memilih peserta berdasarkan prasangka"],
      "C",
      "Kesempatan yang terbuka dan adil mendukung kebersamaan seluruh warga.",
    ),
    createQuestion(
      "Jika jadwal kegiatan bersama bertepatan dengan waktu ibadah sebagian warga, tindakan bijak adalah...",
      ["Mengabaikan keberatan mereka", "Membatalkan hak beribadah", "Memaksa semua warga hadir", "Mencari waktu yang menghormati kebutuhan warga"],
      "D",
      "Penyesuaian yang wajar dapat menghormati kebebasan beribadah dan menjaga partisipasi bersama.",
    ),
    createQuestion(
      "Cara merayakan keberagaman budaya secara positif adalah...",
      ["Mengenal tradisi dengan hormat dan tidak menjadikannya bahan ejekan", "Menilai tradisi lain lebih rendah", "Mengubah makna tradisi tanpa izin", "Menganggap semua tradisi sama"],
      "A",
      "Mempelajari tradisi dengan hormat menunjukkan penghargaan terhadap keragaman budaya.",
    ),
    createQuestion(
      "Saat ada teman baru dari daerah lain, sikap yang tepat adalah...",
      ["Menguji apakah ia pantas diterima", "Menyambut dan mengajaknya berinteraksi", "Meminta ia mengubah logatnya", "Menghindarinya karena berbeda"],
      "B",
      "Menyambut teman baru mendukung lingkungan yang inklusif dan bersatu.",
    ),
    createQuestion(
      "Mengunggah komentar yang menghina suatu kelompok di media sosial dapat...",
      ["Memperkuat toleransi", "Menyelesaikan perbedaan", "Menyakiti orang dan memicu perpecahan", "Menjamin informasi benar"],
      "C",
      "Penghinaan di media sosial dapat melukai pihak lain dan memperbesar konflik.",
    ),
    createQuestion(
      "Jika menerima pesan yang berisi ujaran kebencian, tindakan yang bertanggung jawab adalah...",
      ["Menyebarkannya agar ramai", "Menambahkan hinaan", "Menganggapnya selalu benar", "Tidak menyebarkannya dan menggunakan fitur pelaporan yang sesuai"],
      "D",
      "Tidak menyebarkan ujaran kebencian dan melaporkannya melalui mekanisme yang tepat membantu mencegah dampak.",
    ),
    createQuestion(
      "Gotong royong lintas warga dengan latar berbeda mencerminkan...",
      ["Persatuan dalam keberagaman", "Penyeragaman budaya", "Persaingan identitas", "Pemisahan masyarakat"],
      "A",
      "Gotong royong mempertemukan warga yang beragam untuk bekerja demi tujuan bersama.",
    ),
    createQuestion(
      "Tujuan menerapkan Bhinneka Tunggal Ika dalam kehidupan sehari-hari adalah...",
      ["Menghapus identitas pribadi", "Membangun kehidupan rukun dan bersatu di tengah perbedaan", "Membatasi pertemanan", "Mengutamakan satu budaya"],
      "B",
      "Penerapan semboyan bertujuan menjaga kerukunan dan persatuan tanpa menghapus perbedaan.",
    ),
  ]),
];

export function getQuizByLessonId(lessonId: string) {
  return learningQuizzes.find((quiz) => quiz.lessonId === lessonId);
}

export function calculateQuizScore(
  questions: QuizQuestion[],
  answers: Record<string, string>,
) {
  const correctCount = questions.filter(
    (question) => answers[question.id] === question.correctAnswer,
  ).length;
  const score =
    questions.length === 0
      ? 0
      : Math.round((correctCount / questions.length) * 100);

  return {
    correctCount,
    totalQuestions: questions.length,
    score,
    passed: score >= 80,
  };
}

export function validateLearningQuizzes() {
  const quizIds = learningQuizzes.map((quiz) => quiz.id);
  const questionIds = learningQuizzes.flatMap((quiz) =>
    quiz.questions.map((question) => question.id),
  );
  const lessonIds = new Set(learningLessons.map((lesson) => lesson.id));
  const unique = (values: string[]) => new Set(values).size === values.length;

  return {
    quizCount: learningQuizzes.length,
    questionCount: questionIds.length,
    hasTwoHundredQuestions: questionIds.length === 200,
    hasTwentyQuizzes: learningQuizzes.length === 20,
    hasTenQuestionsPerQuiz: learningQuizzes.every(
      (quiz) => quiz.questions.length === 10,
    ),
    hasUniqueQuizIds: unique(quizIds),
    hasUniqueQuestionIds: unique(questionIds),
    hasValidLessonIds: learningQuizzes.every((quiz) =>
      lessonIds.has(quiz.lessonId),
    ),
    hasFourOptionsPerQuestion: learningQuizzes.every((quiz) =>
      quiz.questions.every(
        (question) =>
          question.options.length === 4 &&
          question.options.map((option) => option.id).join("") === "ABCD",
      ),
    ),
    hasValidCorrectAnswers: learningQuizzes.every((quiz) =>
      quiz.questions.every((question) =>
        question.options.some(
          (option) => option.id === question.correctAnswer,
        ),
      ),
    ),
    hasPassingScoreEighty: learningQuizzes.every(
      (quiz) => quiz.passingScore === 80,
    ),
  };
}
