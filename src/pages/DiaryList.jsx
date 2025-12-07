import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllDiaries } from '../services/storage';
import { getAllMedications } from '../services/medicationStorage';
import { formatDateReadable, formatDateRelative } from '../utils/dateUtils';

function DiaryList() {
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiaries();
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const allMeds = await getAllMedications();
      setMedications(allMeds);
    } catch (error) {
      console.error('약 목록 조회 실패:', error);
    }
  };

  const loadDiaries = async () => {
    try {
      const allDiaries = await getAllDiaries();
      setDiaries(allDiaries);
    } catch (error) {
      console.error('일기 목록 조회 실패:', error);
      alert('일기 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getTakenMeds = (diary) => {
    return medications.filter(m => diary.takenMedications?.includes(m.id));
  };

  const hasCheckItems = (diary) => {
    return diary.weight || 
      diary.dryFood || 
      diary.wetFood || 
      diary.poopCount || 
      diary.peeCount || 
      diary.vomitCount || 
      diary.fluidAmount ||
      (diary.takenMedications && diary.takenMedications.length > 0);
  };

  if (loading) {
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
    <div className="min-h-screen pb-20">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            ← 뒤로
          </button>
          <h1 className="text-xl font-bold text-primary-600">전체 일기</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-4 py-6">
        {diaries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 mb-2">아직 작성된 일기가 없습니다.</p>
            <Link
              to="/write"
              className="inline-block mt-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-colors"
            >
              첫 일기 작성하기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {diaries.map((diary) => {
              const takenMeds = getTakenMeds(diary);
              const hasItems = hasCheckItems(diary);
              
              return (
                <Link
                  key={diary.id}
                  to={`/detail/${diary.date}`}
                  className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {diary.photo && (
                    <img
                      src={diary.photo}
                      alt={diary.date}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">
                        {formatDateReadable(diary.date)}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatDateRelative(diary.date)}
                      </span>
                    </div>

                    {/* 체크 항목 요약 */}
                    {hasItems && (
                      <div className="bg-primary-50 rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {diary.weight && (
                            <div className="flex items-center">
                              <span className="text-gray-600">⚖️ 몸무게:</span>
                              <span className="ml-1 font-semibold">{diary.weight}kg</span>
                            </div>
                          )}
                          {(diary.dryFood || diary.wetFood) && (
                            <div className="flex items-center">
                              <span className="text-gray-600">🍽️ 사료:</span>
                              <span className="ml-1 font-semibold">
                                {[
                                  diary.dryFood && `건${diary.dryFood}g`,
                                  diary.wetFood && `습${diary.wetFood}g`
                                ].filter(Boolean).join(', ')}
                              </span>
                            </div>
                          )}
                          {(diary.poopCount || diary.peeCount) && (
                            <div className="flex items-center">
                              <span className="text-gray-600">🚽 화장실:</span>
                              <span className="ml-1 font-semibold">
                                {[
                                  diary.peeCount && `💧${diary.peeCount}`,
                                  diary.poopCount && `💩${diary.poopCount}`
                                ].filter(Boolean).join(' ')}
                              </span>
                            </div>
                          )}
                          {diary.vomitCount > 0 && (
                            <div className="flex items-center">
                              <span className="text-gray-600">🤮 구토:</span>
                              <span className="ml-1 font-semibold text-red-600">{diary.vomitCount}회</span>
                            </div>
                          )}
                          {diary.fluidAmount && (
                            <div className="flex items-center">
                              <span className="text-gray-600">💉 수액:</span>
                              <span className="ml-1 font-semibold">{diary.fluidAmount}ml</span>
                            </div>
                          )}
                          {takenMeds.length > 0 && (
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

                    {/* 멘션 */}
                    {diary.mention && (
                      <p className="text-gray-600 text-sm line-clamp-2 whitespace-pre-wrap">
                        {diary.mention}
                      </p>
                    )}
                    
                    {/* 내용 없음 */}
                    {!diary.photo && !diary.mention && !hasItems && (
                      <p className="text-gray-400 text-sm">내용 없음</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default DiaryList;

