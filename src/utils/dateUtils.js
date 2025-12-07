import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

// 날짜를 YYYY-MM-DD 형식으로 변환
export const formatDate = (date) => {
  if (typeof date === 'string') {
    return date;
  }
  return format(date, 'yyyy-MM-dd');
};

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
export const getToday = () => {
  return formatDate(new Date());
};

// 날짜를 읽기 쉬운 형식으로 변환 (예: 2024년 1월 15일)
export const formatDateReadable = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'yyyy년 M월 d일', { locale: ko });
  } catch (error) {
    return dateString;
  }
};

// 날짜를 상대적 표현으로 변환 (오늘, 어제, 그저께 등)
export const formatDateRelative = (dateString) => {
  const today = new Date();
  const targetDate = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = today - targetDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays === 2) return '그저께';
  if (diffDays < 7) return `${diffDays}일 전`;
  
  return formatDateReadable(dateString);
};

