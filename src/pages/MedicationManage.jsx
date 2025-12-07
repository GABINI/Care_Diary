import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllMedications,
  addMedication,
  updateMedication,
  deleteMedication,
  initMedicationDB,
} from '../services/medicationStorage';

function MedicationManage() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    type: 'prescription',
    dosage: '',
    note: '',
  });

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      await initMedicationDB();
      const allMeds = await getAllMedications();
      setMedications(allMeds);
    } catch (error) {
      console.error('약 목록 조회 실패:', error);
      alert('약 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('약 이름을 입력해주세요.');
      return;
    }

    try {
      if (editingId) {
        await updateMedication(editingId, formData);
      } else {
        await addMedication(formData);
      }
      
      await loadMedications();
      resetForm();
    } catch (error) {
      console.error('약 저장 실패:', error);
      alert('약 저장에 실패했습니다.');
    }
  };

  const handleEdit = (medication) => {
    setEditingId(medication.id);
    setFormData({
      name: medication.name,
      type: medication.type,
      dosage: medication.dosage || '',
      note: medication.note || '',
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`${name}을(를) 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteMedication(id);
      await loadMedications();
    } catch (error) {
      console.error('약 삭제 실패:', error);
      alert('약 삭제에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'prescription',
      dosage: '',
      note: '',
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const prescriptions = medications.filter(m => m.type === 'prescription');
  const supplements = medications.filter(m => m.type === 'supplement');

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
          <h1 className="text-xl font-bold text-primary-600">약 관리</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* 약 추가 버튼 */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-colors mb-6"
          >
            + 새 약 추가
          </button>
        )}

        {/* 약 추가/수정 폼 */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              {editingId ? '약 수정' : '약 추가'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  약 이름 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 오메가3, 신장약"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  분류 *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="prescription"
                      checked={formData.type === 'prescription'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-4 h-4 text-primary-500"
                    />
                    <span className="ml-2 text-gray-700">처방약</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="supplement"
                      checked={formData.type === 'supplement'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-4 h-4 text-primary-500"
                    />
                    <span className="ml-2 text-gray-700">보조제</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  용량
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  placeholder="예: 1정, 1/2정"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  메모
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="예: 아침 식사 후 복용"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  rows="2"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {editingId ? '수정' : '추가'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 처방약 목록 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            처방약 ({prescriptions.length})
          </h2>
          {prescriptions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-400">
              등록된 처방약이 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {prescriptions.map((med) => (
                <div
                  key={med.id}
                  className="bg-white rounded-xl shadow-md p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{med.name}</h3>
                      {med.dosage && (
                        <p className="text-sm text-gray-600 mt-1">용량: {med.dosage}</p>
                      )}
                      {med.note && (
                        <p className="text-sm text-gray-500 mt-1">{med.note}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => handleEdit(med)}
                        className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(med.id, med.name)}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 보조제 목록 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            보조제 ({supplements.length})
          </h2>
          {supplements.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-400">
              등록된 보조제가 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {supplements.map((med) => (
                <div
                  key={med.id}
                  className="bg-white rounded-xl shadow-md p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{med.name}</h3>
                      {med.dosage && (
                        <p className="text-sm text-gray-600 mt-1">용량: {med.dosage}</p>
                      )}
                      {med.note && (
                        <p className="text-sm text-gray-500 mt-1">{med.note}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => handleEdit(med)}
                        className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(med.id, med.name)}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MedicationManage;

