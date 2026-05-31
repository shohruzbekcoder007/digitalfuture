require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const JournalIssue = require('./models/JournalIssue');
const Article = require('./models/Article');
const Author = require('./models/Author');
const User = require('./models/User');

const cover = (seed) => `https://picsum.photos/seed/${seed}/600/800`;
const pdfUrl = 'https://www.africau.edu/images/default/sample.pdf';

const authorsSeed = [
  { fullName: 'Otabek Karimov', affiliation: "Toshkent Davlat Iqtisodiyot Universiteti", country: "O'zbekiston", email: 'o.karimov@example.uz', orcid: '0000-0002-1825-0097',
    bio: { uz: "Iqtisodiyot fanlari doktori, raqamli iqtisodiyot bo'yicha mutaxassis.", en: 'Doctor of Economics, expert in digital economy.', ru: 'Доктор экономических наук, эксперт по цифровой экономике.' } },
  { fullName: 'Dilnoza Akhmedova', affiliation: "Toshkent moliya instituti", country: "O'zbekiston", email: 'd.akhmedova@example.uz', orcid: '0000-0003-1415-9265',
    bio: { uz: "Fintech va raqamli to'lov tizimlari bo'yicha tadqiqotchi.", en: 'Researcher in fintech and digital payments.', ru: 'Исследователь в области финтеха и цифровых платежей.' } },
  { fullName: 'Akmal Rasulov', affiliation: "Samarqand iqtisodiyot va servis instituti", country: "O'zbekiston", email: 'a.rasulov@example.uz', orcid: '0000-0001-7890-1234',
    bio: { uz: 'Iqtisodiy modellashtirish va makroiqtisodiyot.', en: 'Economic modeling and macroeconomics.', ru: 'Экономическое моделирование и макроэкономика.' } },
  { fullName: 'Malika Yusupova', affiliation: 'Westminster International University in Tashkent', country: "O'zbekiston", email: 'm.yusupova@example.uz', orcid: '0000-0004-5678-9012',
    bio: { uz: 'Davlat boshqaruvi va e-government sohasi mutaxassisi.', en: 'Public administration and e-government specialist.', ru: 'Специалист по госуправлению и электронному правительству.' } },
  { fullName: 'John Smith', affiliation: 'London School of Economics', country: 'UK', email: 'jsmith@example.com', orcid: '0000-0005-1234-5678',
    bio: { en: 'Professor of digital economy.', uz: 'Raqamli iqtisodiyot professori.', ru: 'Профессор цифровой экономики.' } },
  { fullName: 'Sarah Johnson', affiliation: 'University of Cambridge, Judge Business School', country: 'UK', email: 'sjohnson@example.com', orcid: '0000-0006-2345-6789',
    bio: { en: 'Researcher in innovation policy and digital transformation.', uz: 'Innovatsion siyosat va raqamli transformatsiya tadqiqotchisi.', ru: 'Исследователь в области инновационной политики и цифровой трансформации.' } },
];

(async () => {
  try {
    await connectDB();

    await Promise.all([
      Article.collection.drop().catch(() => {}),
      JournalIssue.deleteMany({}),
      Author.deleteMany({}),
    ]);
    console.log("Eski yozuvlar tozalandi");

    const authors = [];
    for (const a of authorsSeed) authors.push(await Author.create(a));
    console.log(`${authors.length} ta muallif qo'shildi`);

    const issuesSeed = [
      { volume: 5, issueNumber: 1, year: 2026, isCurrent: true,
        title: { uz: '5-Tom, 1-son (2026)', ru: 'Том 5, Выпуск 1 (2026)', en: 'Vol. 5, Issue 1 (2026)' },
        description: {
          uz: 'Raqamli iqtisodiyot, fintech va davlat boshqaruvidagi raqamli transformatsiya bo\'yicha yangi son.',
          ru: 'Новый выпуск по цифровой экономике, финтеху и цифровой трансформации в госуправлении.',
          en: 'New issue covering digital economy, fintech and digital transformation in public administration.',
        },
        publicationDate: new Date('2026-04-15'), pages: 145, issn: '2181-1234',
        coverImage: cover('issue-v5-i1'), pdfUrl,
      },
      { volume: 4, issueNumber: 4, year: 2025,
        title: { uz: '4-Tom, 4-son (2025)', ru: 'Том 4, Выпуск 4 (2025)', en: 'Vol. 4, Issue 4 (2025)' },
        description: { uz: '2025-yilning yakuniy soni.', ru: 'Завершающий выпуск 2025 года.', en: 'Final issue of 2025.' },
        publicationDate: new Date('2025-12-20'), pages: 132, issn: '2181-1234',
        coverImage: cover('issue-v4-i4'), pdfUrl,
      },
      { volume: 4, issueNumber: 3, year: 2025,
        title: { uz: '4-Tom, 3-son (2025)', ru: 'Том 4, Выпуск 3 (2025)', en: 'Vol. 4, Issue 3 (2025)' },
        description: { uz: 'Kuzgi son.', ru: 'Осенний выпуск.', en: 'Autumn issue.' },
        publicationDate: new Date('2025-09-10'), pages: 128, issn: '2181-1234',
        coverImage: cover('issue-v4-i3'), pdfUrl,
      },
      { volume: 4, issueNumber: 2, year: 2025,
        title: { uz: '4-Tom, 2-son (2025)', ru: 'Том 4, Выпуск 2 (2025)', en: 'Vol. 4, Issue 2 (2025)' },
        description: { uz: 'Yozgi son.', ru: 'Летний выпуск.', en: 'Summer issue.' },
        publicationDate: new Date('2025-06-15'), pages: 120, issn: '2181-1234',
        coverImage: cover('issue-v4-i2'), pdfUrl,
      },
      { volume: 4, issueNumber: 1, year: 2025,
        title: { uz: '4-Tom, 1-son (2025)', ru: 'Том 4, Выпуск 1 (2025)', en: 'Vol. 4, Issue 1 (2025)' },
        description: { uz: 'Yil boshi soni.', ru: 'Первый выпуск года.', en: 'First issue of the year.' },
        publicationDate: new Date('2025-03-20'), pages: 118, issn: '2181-1234',
        coverImage: cover('issue-v4-i1'), pdfUrl,
      },
      { volume: 3, issueNumber: 4, year: 2024,
        title: { uz: '3-Tom, 4-son (2024)', ru: 'Том 3, Выпуск 4 (2024)', en: 'Vol. 3, Issue 4 (2024)' },
        description: { uz: '2024-yilning yakuniy soni.', ru: 'Завершающий выпуск 2024.', en: 'Final issue of 2024.' },
        publicationDate: new Date('2024-12-15'), pages: 124, issn: '2181-1234',
        coverImage: cover('issue-v3-i4'), pdfUrl,
      },
    ];

    const issues = [];
    for (const s of issuesSeed) issues.push(await JournalIssue.create(s));
    console.log(`${issues.length} ta son qo'shildi`);

    const articlesData = [
      {
        title: {
          uz: "O'zbekistonda raqamli iqtisodiyotning rivojlanish istiqbollari",
          ru: 'Перспективы развития цифровой экономики в Узбекистане',
          en: 'Prospects for digital economy development in Uzbekistan',
        },
        abstract: {
          uz: "Ushbu maqolada O'zbekistonda raqamli iqtisodiyotning hozirgi holati, asosiy ko'rsatkichlari va kelajakdagi rivojlanish istiqbollari tahlil qilingan. Davlat dasturlari va xususiy sektorning roli baholangan.",
          ru: 'В статье анализируется текущее состояние цифровой экономики Узбекистана, основные показатели и перспективы развития. Оценена роль госпрограмм и частного сектора.',
          en: 'This paper analyzes the current state of the digital economy in Uzbekistan, key indicators and development prospects. The role of government programs and the private sector is evaluated.',
        },
        authors: [authors[0]._id, authors[2]._id], language: 'uz',
        keywords: ['digital economy', 'Uzbekistan', 'GDP', 'innovation', 'policy'],
        category: 'research', pages: '1-15', doi: '10.1234/journal.v5i1.001',
        featured: true,
      },
      {
        title: {
          uz: "Fintech ekotizimining rivojlanishi: Markaziy Osiyo tajribasi",
          ru: 'Развитие финтех-экосистемы: опыт Центральной Азии',
          en: 'Fintech ecosystem development: Central Asian experience',
        },
        abstract: {
          uz: "Markaziy Osiyo davlatlarida fintech sektorining shakllanishi, regulyatsiya muammolari va xalqaro standartlarga moslashish jarayoni o'rganildi.",
          ru: 'Изучено формирование финтех-сектора в странах Центральной Азии, проблемы регулирования и адаптация к международным стандартам.',
          en: 'The formation of the fintech sector in Central Asian countries, regulatory challenges and adaptation to international standards are studied.',
        },
        authors: [authors[1]._id], language: 'en',
        keywords: ['fintech', 'Central Asia', 'regulation', 'digital payments'],
        category: 'review', pages: '16-32', doi: '10.1234/journal.v5i1.002',
        featured: true,
      },
      {
        title: {
          uz: "Elektron hukumat xizmatlarining samaradorligini baholash",
          ru: 'Оценка эффективности услуг электронного правительства',
          en: 'Assessing the effectiveness of e-government services',
        },
        abstract: {
          uz: "Davlat raqamli xizmatlarining iqtisodiy va ijtimoiy samaradorligi, fuqarolar qoniqishi va xalqaro reytinglardagi o'rni o'rganildi.",
          ru: 'Изучена экономическая и социальная эффективность государственных цифровых услуг, удовлетворённость граждан и место в международных рейтингах.',
          en: 'Economic and social effectiveness of digital government services, citizen satisfaction and position in international rankings are studied.',
        },
        authors: [authors[3]._id], language: 'uz',
        keywords: ['e-government', 'public services', 'digital transformation', 'KPI'],
        category: 'case-study', pages: '33-48', doi: '10.1234/journal.v5i1.003',
      },
      {
        title: {
          uz: "Blockchain texnologiyasi va davlat boshqaruvi: shaffoflik samaradorligi",
          ru: 'Блокчейн и государственное управление: эффективность прозрачности',
          en: 'Blockchain and public administration: the effectiveness of transparency',
        },
        abstract: {
          uz: 'Davlat xizmatlarida blockchain ishlatilishining iqtisodiy ta\'siri va korrupsiya darajasiga ta\'siri tahlil qilindi.',
          ru: 'Проанализировано экономическое влияние блокчейна в государственных услугах и его влияние на уровень коррупции.',
          en: 'The economic impact of blockchain in government services and its effect on corruption levels is analyzed.',
        },
        authors: [authors[4]._id, authors[2]._id], language: 'en',
        keywords: ['blockchain', 'e-government', 'transparency', 'governance'],
        category: 'research', pages: '49-65', doi: '10.1234/journal.v5i1.004',
      },
      {
        title: {
          uz: "Sun'iy intellekt va mehnat bozori transformatsiyasi",
          ru: 'Искусственный интеллект и трансформация рынка труда',
          en: 'Artificial intelligence and labor market transformation',
        },
        abstract: {
          uz: "AI tufayli mehnat bozorida yuz beradigan o'zgarishlar, yangi kasblar va malakaviy talablar tahlil qilingan.",
          ru: 'Проанализированы изменения на рынке труда из-за ИИ, новые профессии и квалификационные требования.',
          en: 'Labor market changes due to AI, new professions and skill requirements are analyzed.',
        },
        authors: [authors[1]._id, authors[5]._id], language: 'en',
        keywords: ['AI', 'labor market', 'automation', 'skills'],
        category: 'short-communication', pages: '66-78', doi: '10.1234/journal.v5i1.005',
      },
      {
        title: {
          uz: "Yashil iqtisodiyot va ESG investitsiyalari",
          ru: 'Зелёная экономика и ESG-инвестиции',
          en: 'Green economy and ESG investments',
        },
        abstract: {
          uz: "ESG mezonlari asosida investitsiya jarayonlarini boshqarish va barqaror rivojlanishga ta'siri ko'rib chiqildi.",
          ru: 'Рассмотрено управление инвестиционными процессами на основе ESG-критериев и их влияние на устойчивое развитие.',
          en: 'Management of investment processes based on ESG criteria and their impact on sustainable development is examined.',
        },
        authors: [authors[0]._id], language: 'uz',
        keywords: ['ESG', 'sustainability', 'green economy', 'investment'],
        category: 'review', pages: '79-92', doi: '10.1234/journal.v5i1.006',
      },
      {
        title: {
          uz: "Raqamli marketplace platformalari va iqtisodiy o'sish",
          ru: 'Цифровые маркетплейс-платформы и экономический рост',
          en: 'Digital marketplace platforms and economic growth',
        },
        abstract: {
          uz: "Marketplace platformalarining KO'B sektoriga ta'siri va iqtisodiyotga qo'shilgan qiymati tahlil qilindi.",
          ru: 'Проанализировано влияние маркетплейсов на сектор МСБ и их вклад в экономику.',
          en: 'The impact of marketplace platforms on the SME sector and their contribution to the economy is analyzed.',
        },
        authors: [authors[1]._id], language: 'en',
        keywords: ['marketplace', 'platform economy', 'SME', 'e-commerce'],
        category: 'research', pages: '1-18', doi: '10.1234/journal.v4i4.001',
        featured: true,
      },
      {
        title: {
          uz: "Markaziy bank raqamli valyutasi (CBDC): nazariya va amaliyot",
          ru: 'Цифровая валюта центрального банка (CBDC): теория и практика',
          en: 'Central Bank Digital Currency (CBDC): theory and practice',
        },
        abstract: {
          uz: "CBDC ning makroiqtisodiy oqibatlari, monetar siyosatga ta'siri va xalqaro tajribalar ko'rib chiqildi.",
          ru: 'Рассмотрены макроэкономические последствия CBDC, влияние на монетарную политику и международный опыт.',
          en: 'Macroeconomic consequences of CBDC, its impact on monetary policy and international experience are examined.',
        },
        authors: [authors[4]._id], language: 'en',
        keywords: ['CBDC', 'monetary policy', 'central bank', 'digital currency'],
        category: 'case-study', pages: '19-34', doi: '10.1234/journal.v4i4.002',
      },
      {
        title: {
          uz: "Bayes ekonometrikasi: makroprognoz uchun yondashuv",
          ru: 'Байесовская эконометрика: подход к макропрогнозированию',
          en: 'Bayesian econometrics: an approach to macro forecasting',
        },
        abstract: {
          uz: 'O\'zbekiston iqtisodiyoti uchun Bayes ekonometrik modellarini qo\'llash tajribasi.',
          ru: 'Опыт применения байесовских эконометрических моделей для экономики Узбекистана.',
          en: 'Experience of applying Bayesian econometric models for the Uzbek economy.',
        },
        authors: [authors[5]._id, authors[2]._id], language: 'en',
        keywords: ['Bayesian', 'econometrics', 'forecasting', 'macroeconomics'],
        category: 'research', pages: '35-52', doi: '10.1234/journal.v4i4.003',
      },
      {
        title: {
          uz: "Tahririyat: Raqamli transformatsiya yangi davri",
          ru: 'Редакция: Новая эра цифровой трансформации',
          en: 'Editorial: A new era of digital transformation',
        },
        abstract: {
          uz: "Tahririyatdan: jurnalning yangi yo'nalishi va strategik vazifalari.",
          ru: 'От редакции: новое направление журнала и стратегические задачи.',
          en: 'From the editor: new direction of the journal and strategic objectives.',
        },
        authors: [authors[0]._id], language: 'uz',
        keywords: ['editorial', 'digital transformation', 'strategy'],
        category: 'editorial', pages: '1-4', doi: '10.1234/journal.v4i3.001',
      },
      {
        title: {
          uz: "Smart-shaharlar va shahar iqtisodiyotining samaradorligi",
          ru: 'Умные города и эффективность городской экономики',
          en: 'Smart cities and the efficiency of the urban economy',
        },
        abstract: {
          uz: 'Smart-shahar texnologiyalarining shahar iqtisodiy samaradorligiga va aholi turmush sifatiga ta\'siri.',
          ru: 'Влияние технологий умного города на экономическую эффективность и качество жизни.',
          en: 'The impact of smart city technologies on urban economic efficiency and quality of life.',
        },
        authors: [authors[1]._id, authors[3]._id], language: 'uz',
        keywords: ['smart city', 'urban economy', 'IoT', 'sustainability'],
        category: 'research', pages: '5-22', doi: '10.1234/journal.v4i3.002',
        featured: true,
      },
      {
        title: {
          uz: "Innovatsion ekotizim va startaplarning iqtisodiy ta'siri",
          ru: 'Инновационная экосистема и экономическое влияние стартапов',
          en: 'Innovation ecosystem and the economic impact of startups',
        },
        abstract: {
          uz: "Innovatsion ekotizimning rivojlanishi, venchur kapital va startap iqtisodiyotining ahamiyati ko'rib chiqildi.",
          ru: 'Рассмотрено развитие инновационной экосистемы, венчурного капитала и значимость стартап-экономики.',
          en: 'The development of the innovation ecosystem, venture capital and the importance of the startup economy are examined.',
        },
        authors: [authors[2]._id], language: 'en',
        keywords: ['innovation', 'startup', 'venture capital', 'ecosystem'],
        category: 'review', pages: '1-20', doi: '10.1234/journal.v4i2.001',
      },
    ];

    let aIdx = 0;
    for (const issue of issues) {
      const count = issue.volume === 5 ? 6 : issue.volume === 4 && issue.issueNumber === 4 ? 3 : issue.issueNumber === 3 ? 2 : 1;
      for (let i = 0; i < count && aIdx < articlesData.length; i++) {
        const data = articlesData[aIdx++];
        const authorObjs = await Author.find({ _id: { $in: data.authors } });
        await Article.create({
          ...data,
          issue: issue._id,
          publicationDate: issue.publicationDate,
          authorNames: authorObjs.map((a) => a.fullName),
          pdfUrl,
        });
      }
    }
    console.log(`${aIdx} ta maqola qo'shildi`);

    const adminExists = await User.findOne({ email: 'admin@journal.uz' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@journal.uz',
        password: 'admin123456',
        role: 'admin',
      });
      console.log('Admin yaratildi: admin@journal.uz / admin123456');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed xato:', err);
    process.exit(1);
  }
})();
