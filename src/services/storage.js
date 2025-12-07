// IndexedDB를 사용한 데이터 저장 서비스

const DB_NAME = 'CareDiaryDB';
const DB_VERSION = 2; // 버전 업데이트
const STORE_NAME = 'diaries';
const MEDICATION_STORE = 'medications';

let db = null;

// 데이터베이스 초기화
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      // 일기 스토어
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, {
          keyPath: 'id',
        });
        objectStore.createIndex('date', 'date', { unique: false });
      }

      // 약 관리 스토어
      if (!database.objectStoreNames.contains(MEDICATION_STORE)) {
        const medStore = database.createObjectStore(MEDICATION_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        medStore.createIndex('type', 'type', { unique: false });
        medStore.createIndex('name', 'name', { unique: false });
      }
    };
  });
};

// 일기 저장
export const saveDiary = async (diaryData) => {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const diary = {
      id: diaryData.date, // 날짜를 ID로 사용
      date: diaryData.date,
      photo: diaryData.photo || null,
      mention: diaryData.mention || '',
      // 체크 항목들
      weight: diaryData.weight || null,
      dryFood: diaryData.dryFood || null,
      wetFood: diaryData.wetFood || null,
      poopCount: diaryData.poopCount || null,
      peeCount: diaryData.peeCount || null,
      vomitCount: diaryData.vomitCount || null,
      vomitType: diaryData.vomitType || [],
      fluidAmount: diaryData.fluidAmount || null,
      takenMedications: diaryData.takenMedications || [], // 투약한 약 ID 배열
      createdAt: diaryData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const request = store.put(diary);

    request.onsuccess = () => {
      resolve(diary);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// 날짜로 일기 조회
export const getDiaryByDate = async (date) => {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(date);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// 모든 일기 조회 (최신순)
export const getAllDiaries = async () => {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const diaries = request.result || [];
      // 날짜순 정렬 (최신순)
      diaries.sort((a, b) => new Date(b.date) - new Date(a.date));
      resolve(diaries);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// 일기 삭제
export const deleteDiary = async (date) => {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(date);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// 이미지를 Base64로 변환
export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

