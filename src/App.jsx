import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import DiaryForm from './pages/DiaryForm';
import DiaryList from './pages/DiaryList';
import DiaryDetail from './pages/DiaryDetail';
import MedicationManage from './pages/MedicationManage';
import DevTools from './pages/DevTools';
import { initDB } from './services/storage';
import { initMedicationDB } from './services/medicationStorage';

function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    // 데이터베이스 초기화
    Promise.all([initDB(), initMedicationDB()])
      .then(() => {
        setDbReady(true);
      })
      .catch((error) => {
        console.error('데이터베이스 초기화 실패:', error);
        alert('데이터베이스 초기화에 실패했습니다. 브라우저가 IndexedDB를 지원하는지 확인해주세요.');
      });
  }, []);

  if (!dbReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-primary-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write" element={<DiaryForm />} />
          <Route path="/write/:date" element={<DiaryForm />} />
          <Route path="/list" element={<DiaryList />} />
          <Route path="/detail/:date" element={<DiaryDetail />} />
          <Route path="/medication" element={<MedicationManage />} />
          <Route path="/dev" element={<DevTools />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

