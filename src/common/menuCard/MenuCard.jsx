import styled from 'styled-components';

import heartEmpty from '../../assets/feed/heart-empty.svg';
import heartFilled from '../../assets/feed/heart-filled.svg';
import starFilled from '../../assets/feed/star-filled.svg';

/**
 * 피드/목록용 메뉴(레시피) 카드 — 피그마 1317:7888
 * variant: 'default' | 'completed' (마이페이지 완료한 레시피 1699:7047)
 */
function MenuCard({
  image,
  title,
  time,
  utilization,
  difficulty = 1,
  isSaved = false,
  onToggleSave,
  onClick,
  variant = 'default',
  completedDate,
  feedback,
  ingredientCount,
}) {
  const isCompleted = variant === 'completed';

  return (
    // 카드 루트 — 세로 flex, 고정 폭 168
    <Card onClick={onClick}>
      {/* 썸네일 프레임 — 둥근 사각형 168×129 */}
      <Thumb>
        {/* 음식 사진 — 프레임을 덮는 사각 이미지 */}
        <ThumbImg src={image} alt={title} />
        {/* 완료 뱃지 — 썸네일 좌상단 텍스트 */}
        {isCompleted && <DoneBadge>완료</DoneBadge>}
        {/* 하트(저장) 버튼 — 썸네일 우상단 벡터 아이콘 */}
        <HeartBtn
          type="button"
          aria-label="저장"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave?.();
          }}
        >
          <HeartImg src={isSaved ? heartFilled : heartEmpty} alt="" />
        </HeartBtn>
      </Thumb>

      {/* 텍스트 영역 — 제목·메타 세로 스택 */}
      <Body>
        <Title>{title}</Title>
        {isCompleted ? (
          <>
            {/* 완료 메타 행 — 날짜(금색) + 피드백(회색) */}
            <Meta $gap={4}>
              <Time>{completedDate}</Time>
              {feedback && <Rate>{feedback}</Rate>}
            </Meta>
            {ingredientCount && <Rate>{ingredientCount}</Rate>}
          </>
        ) : (
          <>
            {/* 메타 행 — 소요시간(금색) + 재료 활용률(회색) */}
            <Meta>
              <Time>{time}</Time>
              {utilization && <Rate>{utilization}</Rate>}
            </Meta>
            {/* 난이도 행 — 라벨 + 별(노란 채움) */}
            <Diff>
              <DiffLabel>난이도</DiffLabel>
              {Array.from({ length: difficulty }, (_, i) => (
                <Star key={i} src={starFilled} alt="" />
              ))}
            </Diff>
          </>
        )}
      </Body>
    </Card>
  );
}

export default MenuCard;

/* —— 카드 루트: 세로 직사각형 컨테이너 —— */
const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 0 0 auto;
  width: 168px;
  cursor: pointer;
`;

/* —— 썸네일: 모서리 둥근 사각 프레임(그림자) —— */
const Thumb = styled.div`
  position: relative;
  width: 168px;
  height: 129px;
  overflow: hidden;
  border-radius: 20px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(3, 3, 3, 0.03),
    0 0 40px 0 rgba(3, 3, 3, 0.05);
`;

/* —— 음식 사진: 프레임을 채우는 사각 이미지 —— */
const ThumbImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/* —— 완료 뱃지: 좌상단 텍스트 —— */
const DoneBadge = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: #72d472;
`;

/* —— 하트 버튼: 투명 히트영역(아이콘만 보임) —— */
const HeartBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

/* —— 하트 아이콘: 저장 토글 벡터 —— */
const HeartImg = styled.img`
  display: block;
  width: 16px;
  height: 14px;
  object-fit: contain;
`;

/* —— 텍스트 블록: 왼쪽 4px 패딩 세로 스택 —— */
const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 4px;
`;

/* —— 제목 텍스트 —— */
const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.32px;
  color: #444;
  word-break: keep-all;
`;

/* —— 메타 가로 줄 —— */
const Meta = styled.div`
  display: flex;
  gap: ${({ $gap }) => ($gap != null ? `${$gap}px` : '8px')};
  align-items: flex-start;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
`;

/* —— 소요시간/완료일 텍스트(서브브랜드 금색, SemiBold) —— */
const Time = styled.span`
  font-weight: 600;
  color: #997000;
`;

/* —— 재료 활용률·피드백·개수 텍스트(회색) —— */
const Rate = styled.span`
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  color: #8b8b8b;
  white-space: nowrap;
`;

/* —— 난이도 가로 줄 —— */
const Diff = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

/* —— 난이도 라벨 텍스트 —— */
const DiffLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  color: #8b8b8b;
  white-space: nowrap;
`;

/* —— 별 아이콘: 약 15×15 정사각 —— */
const Star = styled.img`
  display: block;
  width: 15px;
  height: 15px;
  flex-shrink: 0;
`;
