import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDiaryByDate, deleteDiary } from '../services/storage';
import { formatDateReadable } from '../utils/dateUtils';
import { getAllMedications } from '../services/medicationStorage';

function DiaryDetail() {
  const { date } = useParams();
  const navigate = useNavigate();
  const [diary, setDiary] = useState(null);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadDiary();
    loadMedications();
  }, [date]);

  const loadMedications = async () => {
    try {
      const allMeds = await getAllMedications();
      setMedications(allMeds);
    } catch (error) {
      console.error('약 목록 조회 실패:', error);
    }
  };

  const loadDiary = async () => {
    try {
      const diaryData = await getDiaryByDate(date);
      if (!diaryData) {
        alert('일기를 찾을 수 없습니다.');
        navigate('/list');
        return;
      }
      setDiary(diaryData);
    } catch (error) {
      console.error('일기 조회 실패:', error);
      alert('일기를 불러오는데 실패했습니다.');
      navigate('/list');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 이 일기를 삭제하시겠습니까?')) {
      return;
    }

    setDeleting(true);
    try {
      await deleteDiary(date);
      navigate('/list');
    } catch (error) {
      console.error('일기 삭제 실패:', error);
      alert('일기 삭제에 실패했습니다.');
      setDeleting(false);
    }
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

  if (!diary) {
    return null;
  }

  const hasCheckItems = 
    diary.weight || 
    diary.dryFood || 
    diary.wetFood || 
    diary.poopCount || 
    diary.peeCount || 
    diary.vomitCount || 
    diary.fluidAmount ||
    (diary.takenMedications && diary.takenMedications.length > 0);
  
  const takenMeds = medications.filter(m => diary.takenMedications?.includes(m.id));

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
          <h1 className="text-xl font-bold text-primary-600">일기 상세</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* 날짜 */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-1">날짜</p>
          <p className="text-xl font-semibold text-gray-800">
            {formatDateReadable(diary.date)}
          </p>
        </div>

        {/* 사진 */}
        {diary.photo && (
          <div className="mb-6">
            <img
              src={diary.photo}
              alt={diary.date}
              className="w-full rounded-xl shadow-md"
            />
          </div>
        )}

        {/* 체크 항목 */}
        {hasCheckItems && (
          <div className="mb-6 bg-white rounded-xl shadow-md p-4">
            <h3 className="font-semibold text-gray-800 text-lg mb-3">체크 항목</h3>
            <div className="space-y-3">
              {diary.weight && (
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600 text-sm">몸무게</span>
                  <span className="font-semibold text-gray-800">{diary.weight} kg</span>
                </div>
              )}
              
              {(diary.dryFood || diary.wetFood) && (
                <div className="border-b border-gray-100 pb-2">
                  <span className="text-gray-600 text-sm block mb-1">먹은 사료량</span>
                  <div className="flex gap-3">
                    {diary.dryFood && (
                      <span className="text-sm">건사료: <span className="font-semibold">{diary.dryFood}g</span></span>
                    )}
                    {diary.wetFood && (
                      <span className="text-sm">습사료: <span className="font-semibold">{diary.wetFood}g</span></span>
                    )}
                  </div>
                </div>
              )}
              
              {(diary.poopCount || diary.peeCount) && (
                <div className="border-b border-gray-100 pb-2">
                  <span className="text-gray-600 text-sm block mb-1">화장실 횟수</span>
                  <div className="flex gap-3">
                    {diary.peeCount && (
                      <span className="text-sm">💧 감자: <span className="font-semibold">{diary.peeCount}회</span></span>
                    )}
                    {diary.poopCount && (
                      <span className="text-sm">💩 맛동산: <span className="font-semibold">{diary.poopCount}회</span></span>
                    )}
                  </div>
                </div>
              )}
              
              {diary.vomitCount && (
                <div className="border-b border-gray-100 pb-2">
                  <span className="text-gray-600 text-sm block mb-1">구토</span>
                  <div>
                    <span className="font-semibold text-gray-800">{diary.vomitCount}회</span>
                    {diary.vomitType && diary.vomitType.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {diary.vomitType.map((type) => (
                          <span key={type} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {diary.fluidAmount && (
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600 text-sm">수액</span>
                  <span className="font-semibold text-gray-800">{diary.fluidAmount} ml</span>
                </div>
              )}
              
              {takenMeds.length > 0 && (
                <div className="border-b border-gray-100 pb-2">
                  <span className="text-gray-600 text-sm block mb-2">투약</span>
                  <div className="space-y-1">
                    {takenMeds.map(med => (
                      <div key={med.id} className="flex items-center">
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          med.type === 'prescription' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></span>
                        <span className="text-sm text-gray-700">{med.name}</span>
                        {med.dosage && (
                          <span className="text-xs text-gray-500 ml-1">({med.dosage})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 멘션 */}
        {diary.mention && (
          <div className="mb-6 bg-white rounded-xl shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-2">멘션</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {diary.mention}
            </p>
          </div>
        )}

        {/* 내용이 없는 경우 */}
        {!diary.photo && !diary.mention && !hasCheckItems && (
          <div className="mb-6 bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-400">내용이 없습니다.</p>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="space-y-3">
          <Link
            to={`/write/${diary.date}`}
            className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-colors text-center"
          >
            ✏️ 수정하기
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-colors"
          >
            {deleting ? '삭제 중...' : '🗑️ 삭제하기'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default DiaryDetail;
