// 약 관리용 IndexedDB 서비스

const DB_NAME = 'CareDiaryDB';
const DB_VERSION = 2; // 버전 업데이트
const MEDICATION_STORE = 'medications';

let db = null;

// 데이터베이스 초기화
export const initMedicationDB = () => {
  return new Promise((resolve, reject) => {
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
      
      // 약 관리 스토어 생성
      if (!database.objectStoreNames.contains(MEDICATION_STORE)) {
        const objectStore = database.createObjectStore(MEDICATION_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        
        // 인덱스 생성
        objectStore.createIndex('type', 'type', { unique: false });
        objectStore.createIndex('name', 'name', { unique: false });
      }
    };
  });
};

// 약 추가
export const addMedication = async (medicationData) => {
  const database = db || await initMedicationDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([MEDICATION_STORE], 'readwrite');
    const store = transaction.objectStore(MEDICATION_STORE);
    
    const medication = {
      name: medicationData.name,
      type: medicationData.type, // 'prescription' 또는 'supplement'
      dosage: medicationData.dosage || '',
      note: medicationData.note || '',
      createdAt: new Date().toISOString(),
    };

    const request = store.add(medication);

    request.onsuccess = () => {
      medication.id = request.result;
      resolve(medication);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// 약 수정
export const updateMedication = async (id, medicationData) => {
  const database = db || await initMedicationDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([MEDICATION_STORE], 'readwrite');
    const store = transaction.objectStore(MEDICATION_STORE);
    
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      const medication = getRequest.result;
      if (!medication) {
        reject(new Error('약을 찾을 수 없습니다.'));
        return;
      }
      
      medication.name = medicationData.name;
      medication.type = medicationData.type;
      medication.dosage = medicationData.dosage || '';
      medication.note = medicationData.note || '';
      medication.updatedAt = new Date().toISOString();
      
      const updateRequest = store.put(medication);
      
      updateRequest.onsuccess = () => {
        resolve(medication);
      };
      
      updateRequest.onerror = () => {
        reject(updateRequest.error);
      };
    };
    
    getRequest.onerror = () => {
      reject(getRequest.error);
    };
  });
};

// 약 삭제
export const deleteMedication = async (id) => {
  const database = db || await initMedicationDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([MEDICATION_STORE], 'readwrite');
    const store = transaction.objectStore(MEDICATION_STORE);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// 모든 약 조회
export const getAllMedications = async () => {
  const database = db || await initMedicationDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([MEDICATION_STORE], 'readonly');
    const store = transaction.objectStore(MEDICATION_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const medications = request.result || [];
      resolve(medications);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// 타입별 약 조회
export const getMedicationsByType = async (type) => {
  const database = db || await initMedicationDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([MEDICATION_STORE], 'readonly');
    const store = transaction.objectStore(MEDICATION_STORE);
    const index = store.index('type');
    const request = index.getAll(type);

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// 약 ID로 조회
export const getMedicationById = async (id) => {
  const database = db || await initMedicationDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([MEDICATION_STORE], 'readonly');
    const store = transaction.objectStore(MEDICATION_STORE);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

