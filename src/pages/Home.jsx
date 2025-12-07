import { Link } from 'react-router-dom';
import { getToday, formatDateReadable } from '../utils/dateUtils';
import { getDiaryByDate } from '../services/storage';
import { getAllMedications } from '../services/medicationStorage';
import { useState, useEffect } from 'react';

function Home() {
  const [todayDiary, setTodayDiary] = useState(null);
  const [medications, setMedications] = useState([]);
  const today = getToday();

  useEffect(() => {
    // 오늘 일기 확인
    getDiaryByDate(today)
      .then((diary) => {
        setTodayDiary(diary);
      })
      .catch((error) => {
        console.error('일기 조회 실패:', error);
      });
    
    // 약 목록 불러오기
    getAllMedications()
      .then((meds) => {
        setMedications(meds);
      })
      .catch((error) => {
        console.error('약 목록 조회 실패:', error);
      });
  }, [today]);

  const hasCheckItems = todayDiary && (
    todayDiary.weight || 
    todayDiary.dryFood || 
    todayDiary.wetFood || 
    todayDiary.poopCount || 
    todayDiary.peeCount || 
    todayDiary.vomitCount || 
    todayDiary.fluidAmount ||
    (todayDiary.takenMedications && todayDiary.takenMedications.length > 0)
  );
  
  const takenMeds = todayDiary && medications.filter(m => todayDiary.takenMedications?.includes(m.id));

  return (
    <div className="min-h-screen pb-20">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-600">🐱 환묘 케어 일기</h1>
          <Link to="/dev" className="text-xs text-gray-400 hover:text-gray-600">
            🛠️
          </Link>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* 오늘 날짜 */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-2">오늘은</p>
          <p className="text-2xl font-semibold text-gray-800">{formatDateReadable(today)}</p>
        </div>

        {/* 오늘 일기 작성/수정 버튼 */}
        <Link
          to="/write"
          className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-colors mb-6 text-center"
        >
          {todayDiary ? '✏️ 오늘 일기 수정하기' : '📝 오늘 일기 작성하기'}
        </Link>

        {/* 오늘 일기 미리보기 */}
        {todayDiary && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800">오늘의 기록</h2>
                <Link
                  to="/write"
                  className="text-primary-500 text-sm hover:text-primary-600"
                >
                  수정
                </Link>
              </div>

              {todayDiary.photo && (
                <img
                  src={todayDiary.photo}
                  alt="오늘의 사진"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}

              {/* 체크 항목 요약 */}
              {hasCheckItems && (
                <div className="bg-primary-50 rounded-lg p-3 mb-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {todayDiary.weight && (
                      <div className="flex items-center">
                        <span className="text-gray-600">⚖️ 몸무게:</span>
                        <span className="ml-1 font-semibold">{todayDiary.weight}kg</span>
                      </div>
                    )}
                    {(todayDiary.dryFood || todayDiary.wetFood) && (
                      <div className="flex items-center">
                        <span className="text-gray-600">🍽️ 사료:</span>
                        <span className="ml-1 font-semibold">
                          {[
                            todayDiary.dryFood && `건${todayDiary.dryFood}g`,
                            todayDiary.wetFood && `습${todayDiary.wetFood}g`
                          ].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                    {(todayDiary.poopCount || todayDiary.peeCount) && (
                      <div className="flex items-center">
                        <span className="text-gray-600">🚽 화장실:</span>
                        <span className="ml-1 font-semibold">
                          {[
                            todayDiary.peeCount && `💧${todayDiary.peeCount}`,
                            todayDiary.poopCount && `💩${todayDiary.poopCount}`
                          ].filter(Boolean).join(' ')}
                        </span>
                      </div>
                    )}
                    {todayDiary.vomitCount > 0 && (
                      <div className="flex items-center">
                        <span className="text-gray-600">🤮 구토:</span>
                        <span className="ml-1 font-semibold text-red-600">{todayDiary.vomitCount}회</span>
                      </div>
                    )}
                    {todayDiary.fluidAmount && (
                      <div className="flex items-center">
                        <span className="text-gray-600">💉 수액:</span>
                        <span className="ml-1 font-semibold">{todayDiary.fluidAmount}ml</span>
                      </div>
                    )}
                    {takenMeds && takenMeds.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-gray-600 text-sm block mb-1">💊 투약</span>
                        <div className="flex flex-wrap gap-1">
                          {takenMeds.map(med => (
                            <span key={med.id} className={`px-2 py-0.5 rounded-full text-xs ${
                              med.type === 'prescription' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {med.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {todayDiary.mention && (
                <p className="text-gray-700 whitespace-pre-wrap line-clamp-3">{todayDiary.mention}</p>
              )}

              {!todayDiary.photo && !todayDiary.mention && !hasCheckItems && (
                <p className="text-gray-400 text-sm">내용 없음</p>
              )}
            </div>
          </div>
        )}

        {/* 메뉴 버튼들 */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/list"
            className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl shadow-md transition-colors text-center border-2 border-gray-200"
          >
            📚 전체 일기
          </Link>
          <Link
            to="/medication"
            className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl shadow-md transition-colors text-center border-2 border-gray-200"
          >
            💊 약 관리
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
