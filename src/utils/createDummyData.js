// 더미 데이터 생성 스크립트
import { saveDiary } from '../services/storage';
import { addMedication } from '../services/medicationStorage';

// 날짜 생성 헬퍼
const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

// 더미 약 데이터
const dummyMedications = [
  {
    name: '신장약',
    type: 'prescription',
    dosage: '1정',
    note: '아침 식사 후 복용',
  },
  {
    name: '간 보호제',
    type: 'prescription',
    dosage: '1/2정',
    note: '저녁 식사 후 복용',
  },
  {
    name: '오메가3',
    type: 'supplement',
    dosage: '1캡슐',
    note: '관절 건강',
  },
  {
    name: '유산균',
    type: 'supplement',
    dosage: '1포',
    note: '장 건강',
  },
  {
    name: '타우린',
    type: 'supplement',
    dosage: '1ml',
    note: '심장 건강',
  },
];

// 더미 일기 데이터
const createDummyDiaries = (medicationIds) => [
  {
    date: getDaysAgo(0), // 오늘
    photo: null,
    mention: '오늘은 컨디션이 좋아 보여요. 밥도 잘 먹고 활발하게 놀았어요.',
    weight: 4.2,
    dryFood: 45,
    wetFood: 80,
    peeCount: 3,
    poopCount: 2,
    vomitCount: 0,
    vomitType: [],
    fluidAmount: 100,
    takenMedications: medicationIds.slice(0, 3), // 첫 3개 약
  },
  {
    date: getDaysAgo(1), // 어제
    photo: null,
    mention: '아침에 구토가 있었지만 이후 괜찮았어요.',
    weight: 4.15,
    dryFood: 40,
    wetFood: 70,
    peeCount: 2,
    poopCount: 1,
    vomitCount: 1,
    vomitType: ['공복토'],
    fluidAmount: 100,
    takenMedications: [medicationIds[0], medicationIds[1]], // 처방약만
  },
  {
    date: getDaysAgo(2), // 2일 전
    photo: null,
    mention: '식욕이 좀 떨어져서 걱정이에요. 수액을 좀 더 넣었어요.',
    weight: 4.1,
    dryFood: 30,
    wetFood: 60,
    peeCount: 2,
    poopCount: 1,
    vomitCount: 0,
    vomitType: [],
    fluidAmount: 150,
    takenMedications: medicationIds.slice(0, 4),
  },
  {
    date: getDaysAgo(3), // 3일 전
    photo: null,
    mention: '오늘은 기분이 좋아보여요. 창가에서 햇볕 쬐는 걸 좋아했어요.',
    weight: 4.18,
    dryFood: 50,
    wetFood: 85,
    peeCount: 4,
    poopCount: 2,
    vomitCount: 0,
    vomitType: [],
    fluidAmount: 100,
    takenMedications: medicationIds,
  },
  {
    date: getDaysAgo(5), // 5일 전
    photo: null,
    mention: '밤에 토를 두 번 했어요. 내일 병원 가야할 것 같아요.',
    weight: 4.05,
    dryFood: 25,
    wetFood: 50,
    peeCount: 2,
    poopCount: 1,
    vomitCount: 2,
    vomitType: ['사료토', '분수토'],
    fluidAmount: 120,
    takenMedications: [medicationIds[0], medicationIds[1]],
  },
  {
    date: getDaysAgo(7), // 일주일 전
    photo: null,
    mention: '정기 검진 다녀왔어요. 전반적으로 괜찮다고 하셨어요.',
    weight: 4.25,
    dryFood: 48,
    wetFood: 80,
    peeCount: 3,
    poopCount: 2,
    vomitCount: 0,
    vomitType: [],
    fluidAmount: 100,
    takenMedications: medicationIds.slice(0, 3),
  },
  {
    date: getDaysAgo(10), // 10일 전
    photo: null,
    mention: '새 장난감을 샀는데 무척 좋아해요!',
    weight: 4.22,
    dryFood: 50,
    wetFood: 85,
    peeCount: 4,
    poopCount: 2,
    vomitCount: 0,
    vomitType: [],
    fluidAmount: 100,
    takenMedications: medicationIds,
  },
  {
    date: getDaysAgo(14), // 2주 전
    photo: null,
    mention: '오늘은 평온한 하루였어요.',
    weight: 4.28,
    dryFood: 45,
    wetFood: 75,
    peeCount: 3,
    poopCount: 1,
    vomitCount: 0,
    vomitType: [],
    fluidAmount: 100,
    takenMedications: [medicationIds[0], medicationIds[2], medicationIds[3]],
  },
];

// 더미 데이터 생성 실행
export const generateDummyData = async () => {
  try {
    console.log('더미 데이터 생성 시작...');
    
    // 1. 약 데이터 생성
    console.log('약 데이터 생성 중...');
    const medicationIds = [];
    for (const med of dummyMedications) {
      const created = await addMedication(med);
      medicationIds.push(created.id);
      console.log(`약 추가됨: ${med.name} (ID: ${created.id})`);
    }
    
    // 2. 일기 데이터 생성
    console.log('일기 데이터 생성 중...');
    const diaries = createDummyDiaries(medicationIds);
    for (const diary of diaries) {
      await saveDiary(diary);
      console.log(`일기 추가됨: ${diary.date}`);
    }
    
    console.log('✅ 더미 데이터 생성 완료!');
    console.log(`- 약 ${medicationIds.length}개 생성`);
    console.log(`- 일기 ${diaries.length}개 생성`);
    
    return {
      success: true,
      medications: medicationIds.length,
      diaries: diaries.length,
    };
  } catch (error) {
    console.error('❌ 더미 데이터 생성 실패:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

