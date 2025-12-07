import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getToday, formatDateReadable } from '../utils/dateUtils';
import { saveDiary, getDiaryByDate, imageToBase64 } from '../services/storage';
import { getAllMedications } from '../services/medicationStorage';

function DiaryForm() {
  const navigate = useNavigate();
  const { date } = useParams();
  const targetDate = date || getToday();
  
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [mention, setMention] = useState('');
  
  // 체크 항목 상태
  const [weight, setWeight] = useState('');
  const [dryFood, setDryFood] = useState('');
  const [wetFood, setWetFood] = useState('');
  const [poopCount, setPoopCount] = useState('');
  const [peeCount, setPeeCount] = useState('');
  const [vomitCount, setVomitCount] = useState('');
  const [vomitType, setVomitType] = useState([]);
  const [fluidAmount, setFluidAmount] = useState('');
  const [takenMedications, setTakenMedications] = useState([]); // 투약한 약 ID 배열
  
  const [medications, setMedications] = useState([]); // 등록된 약 목록
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 약 목록 불러오기
    getAllMedications()
      .then((meds) => {
        setMedications(meds);
      })
      .catch((error) => {
        console.error('약 목록 조회 실패:', error);
      });

    // 기존 일기 불러오기
    getDiaryByDate(targetDate)
      .then((diary) => {
        if (diary) {
          setPhoto(diary.photo);
          setPhotoPreview(diary.photo);
          setMention(diary.mention || '');
          setWeight(diary.weight || '');
          setDryFood(diary.dryFood || '');
          setWetFood(diary.wetFood || '');
          setPoopCount(diary.poopCount || '');
          setPeeCount(diary.peeCount || '');
          setVomitCount(diary.vomitCount || '');
          setVomitType(diary.vomitType || []);
          setFluidAmount(diary.fluidAmount || '');
          setTakenMedications(diary.takenMedications || []);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('일기 조회 실패:', error);
        setIsLoading(false);
      });
  }, [targetDate]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    try {
      const base64 = await imageToBase64(file);
      setPhoto(base64);
      setPhotoPreview(base64);
    } catch (error) {
      console.error('이미지 변환 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleVomitTypeToggle = (type) => {
    setVomitType(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleMedicationToggle = (medId) => {
    setTakenMedications(prev =>
      prev.includes(medId)
        ? prev.filter(id => id !== medId)
        : [...prev, medId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      await saveDiary({
        date: targetDate,
        photo,
        mention: mention.trim(),
        weight: weight ? parseFloat(weight) : null,
        dryFood: dryFood ? parseFloat(dryFood) : null,
        wetFood: wetFood ? parseFloat(wetFood) : null,
        poopCount: poopCount ? parseInt(poopCount) : null,
        peeCount: peeCount ? parseInt(peeCount) : null,
        vomitCount: vomitCount ? parseInt(vomitCount) : null,
        vomitType,
        fluidAmount: fluidAmount ? parseFloat(fluidAmount) : null,
        takenMedications,
      });

      navigate('/');
    } catch (error) {
      console.error('일기 저장 실패:', error);
      alert('일기 저장에 실패했습니다.');
      setLoading(false);
    }
  };

  if (isLoading) {
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
          <h1 className="text-xl font-bold text-primary-600">일기 작성</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* 날짜 표시 */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-1">날짜</p>
          <p className="text-lg font-semibold text-gray-800">
            {formatDateReadable(targetDate)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 사진 업로드 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              사진
            </label>
            
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="미리보기"
                  className="w-full h-64 object-cover rounded-xl shadow-md"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="block w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                <div className="text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-600">사진을 선택하세요</p>
                  <p className="text-sm text-gray-400 mt-1">최대 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* 체크 항목들 */}
          <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
            <h3 className="font-semibold text-gray-800 text-lg mb-3">체크 항목</h3>

            {/* 몸무게 */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                1. 몸무게 (kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="예: 4.2"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
            </div>

            {/* 사료량 */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                2. 먹은 사료량 (g)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    step="0.1"
                    value={dryFood}
                    onChange={(e) => setDryFood(e.target.value)}
                    placeholder="건사료"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">건사료</p>
                </div>
                <div>
                  <input
                    type="number"
                    step="0.1"
                    value={wetFood}
                    onChange={(e) => setWetFood(e.target.value)}
                    placeholder="습사료"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">습사료</p>
                </div>
              </div>
            </div>

            {/* 화장실 횟수 */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                3. 총 화장실 횟수
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    value={peeCount}
                    onChange={(e) => setPeeCount(e.target.value)}
                    placeholder="0"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">감자 💧</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={poopCount}
                    onChange={(e) => setPoopCount(e.target.value)}
                    placeholder="0"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">맛동산 💩</p>
                </div>
              </div>
            </div>

            {/* 구토 */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                4. 구토 횟수
              </label>
              <input
                type="number"
                value={vomitCount}
                onChange={(e) => setVomitCount(e.target.value)}
                placeholder="0"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 mb-2"
              />
              <label className="block text-gray-600 text-xs mb-2">특이사항</label>
              <div className="flex flex-wrap gap-2">
                {['공복토', '사료토', '분수토'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleVomitTypeToggle(type)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      vomitType.includes(type)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 수액 */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                5. 수액 (ml)
              </label>
              <input
                type="number"
                step="0.1"
                value={fluidAmount}
                onChange={(e) => setFluidAmount(e.target.value)}
                placeholder="예: 100"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
            </div>

            {/* 투약 체크 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-700 text-sm font-medium">
                  6. 투약 체크
                </label>
                <Link
                  to="/medication"
                  className="text-xs text-primary-500 hover:text-primary-600"
                >
                  약 관리 →
                </Link>
              </div>
              
              {medications.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-2">등록된 약이 없습니다.</p>
                  <Link
                    to="/medication"
                    className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                  >
                    약 추가하기
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* 처방약 */}
                  {medications.filter(m => m.type === 'prescription').length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 font-medium flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                        처방약
                      </p>
                      <div className="space-y-1.5">
                        {medications
                          .filter(m => m.type === 'prescription')
                          .map(med => (
                            <label key={med.id} className="flex items-start cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                              <input
                                type="checkbox"
                                checked={takenMedications.includes(med.id)}
                                onChange={() => handleMedicationToggle(med.id)}
                                className="w-4 h-4 mt-0.5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                              />
                              <div className="ml-2 flex-1">
                                <span className="text-gray-700 text-sm">{med.name}</span>
                                {med.dosage && (
                                  <span className="text-xs text-gray-500 ml-1">({med.dosage})</span>
                                )}
                                {med.note && (
                                  <p className="text-xs text-gray-400 mt-0.5">{med.note}</p>
                                )}
                              </div>
                            </label>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 보조제 */}
                  {medications.filter(m => m.type === 'supplement').length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 font-medium flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        보조제
                      </p>
                      <div className="space-y-1.5">
                        {medications
                          .filter(m => m.type === 'supplement')
                          .map(med => (
                            <label key={med.id} className="flex items-start cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                              <input
                                type="checkbox"
                                checked={takenMedications.includes(med.id)}
                                onChange={() => handleMedicationToggle(med.id)}
                                className="w-4 h-4 mt-0.5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                              />
                              <div className="ml-2 flex-1">
                                <span className="text-gray-700 text-sm">{med.name}</span>
                                {med.dosage && (
                                  <span className="text-xs text-gray-500 ml-1">({med.dosage})</span>
                                )}
                                {med.note && (
                                  <p className="text-xs text-gray-400 mt-0.5">{med.note}</p>
                                )}
                              </div>
                            </label>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 멘션 입력 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              멘션
            </label>
            <textarea
              value={mention}
              onChange={(e) => setMention(e.target.value)}
              placeholder="오늘의 이야기를 적어주세요..."
              className="w-full h-40 p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>

          {/* 저장 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-colors"
          >
            {loading ? '저장 중...' : '저장하기'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default DiaryForm;
