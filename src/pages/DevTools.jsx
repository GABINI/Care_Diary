import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateDummyData } from '../utils/createDummyData';

function DevTools() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerateDummyData = async () => {
    if (!confirm('더미 데이터를 생성하시겠습니까?\n\n약 5개, 일기 8개가 생성됩니다.')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await generateDummyData();
      setResult(res);
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-primary-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            ← 뒤로
          </button>
          <h1 className="text-xl font-bold text-primary-600">개발자 도구</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">테스트 데이터</h2>
          
          <p className="text-sm text-gray-600 mb-4">
            테스트를 위한 더미 데이터를 생성합니다.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-gray-700 mb-2">생성될 데이터:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 약 5개 (처방약 2개, 보조제 3개)</li>
              <li>• 일기 8개 (오늘부터 과거 2주간)</li>
              <li>• 체크 항목 포함 (몸무게, 사료, 화장실 등)</li>
              <li>• 투약 기록 포함</li>
            </ul>
          </div>

          <button
            onClick={handleGenerateDummyData}
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-colors"
          >
            {loading ? '생성 중...' : '더미 데이터 생성'}
          </button>

          {result && (
            <div className={`mt-4 p-4 rounded-lg ${
              result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {result.success ? (
                <>
                  <p className="font-semibold mb-2">✅ 생성 완료!</p>
                  <p className="text-sm">약 {result.medications}개, 일기 {result.diaries}개가 생성되었습니다.</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-3 text-sm underline hover:no-underline"
                  >
                    홈으로 이동하기
                  </button>
                </>
              ) : (
                <>
                  <p className="font-semibold mb-2">❌ 생성 실패</p>
                  <p className="text-sm">{result.error}</p>
                </>
              )}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 Tip: 브라우저 개발자 도구(F12) → Application → IndexedDB에서 데이터를 직접 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DevTools;

