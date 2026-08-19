import styled from 'styled-components';

import chefIcon from '../../assets/recipe/chef.svg';
import missingIcon from '../../assets/recipe/missing-ingredients.svg';

/** 요리 시작 확인 모달 — 피그마 1378:6893 / 부족 시 1382:7344 */
function CookStartModal({ title, open, onClose, onStart, canCook = true }) {
  if (!open) return null;

  return (
    // 딤 오버레이: 화면 전체를 덮는 반투명 직사각형(고정 레이어)
    <Overlay onClick={onClose}>
      {/* 모달 카드: 가로 312 둥근 직사각형(radius 22), 흰 배경 + 회색 테두리 */}
      <Card onClick={(e) => e.stopPropagation()}>
        {/* 본문 묶음: 아이콘·텍스트를 세로로 쌓은 직사각형 영역 */}
        <Body>
          {/* 아이콘: 40×40 외곽 / 가능=셰프, 부족=장바구니 */}
          <ChefWrap>
            <Chef src={canCook ? chefIcon : missingIcon} alt="" $missing={!canCook} />
          </ChefWrap>
          {/* 텍스트 묶음: 제목·설명을 세로로 쌓은 직사각형 */}
          <Texts>
            {/* 제목: 두 줄 텍스트 블록(직사각형 텍스트 영역) */}
            {canCook ? (
              <Title>
                ‘{title}’
                <br />
                요리모드를 시작할까요?
              </Title>
            ) : (
              <Title>
                부족한 재료가 있어요.
                <br />
                그래도 요리를 시작할까요?
              </Title>
            )}
            {/* 보조 설명: 한 줄 텍스트 블록 */}
            <Desc>중간에 이탈하면 기록으로 남지 않아요</Desc>
          </Texts>
        </Body>
        {/* 버튼 행: 가로로 나란한 직사각형 두 개(갭 8) */}
        <Actions>
          {/* 취소: 가로 130×세로 48 둥근 직사각형(radius 12), 회색 채움 */}
          <CancelBtn type="button" onClick={onClose}>
            취소
          </CancelBtn>
          {/* 시작: 가로 130×세로 48 둥근 직사각형(radius 12), 초록 채움 */}
          <StartBtn type="button" onClick={onStart}>
            시작
          </StartBtn>
        </Actions>
      </Card>
    </Overlay>
  );
}

export default CookStartModal;

/* —— 딤: 화면 full 반투명 직사각형 —— */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(3, 3, 3, 0.15);
`;

/* —— 모달 카드: 가로 312 둥근 직사각형(radius 22) —— */
const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  box-sizing: border-box;
  width: 312px;
  padding: 24px 28px 20px;
  overflow: hidden;
  border: 0.5px solid #d9d9da;
  border-radius: 22px;
  background: #fff;
`;

/* —— 본문: 아이콘+텍스트 세로 직사각형 —— */
const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

/* —— 아이콘 외곽: 40×40 정사각(피그마 1382:7542) —— */
const ChefWrap = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  overflow: hidden;
`;

/* —— 아이콘 leaf: 가능 28×35 / 부족 32×32 —— */
const Chef = styled.img`
  display: block;
  width: ${({ $missing }) => ($missing ? '32px' : '28px')};
  height: ${({ $missing }) => ($missing ? '32px' : '35px')};
  object-fit: contain;
`;

/* —— 텍스트 묶음: 세로 직사각형 —— */
const Texts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  text-align: center;
`;

/* —— 제목 텍스트 블록 —— */
const Title = styled.p`
  margin: 0;
  width: 256px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.18px;
  color: #1a1a1a;
`;

/* —— 보조 설명 텍스트 블록 —— */
const Desc = styled.p`
  margin: 0;
  width: 256px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.14px;
  color: #8b8b8b;
`;

/* —— 버튼 행: 가로 직사각형 —— */
const Actions = styled.div`
  display: flex;
  gap: 8px;
  width: 268px;
`;

/* —— 취소: 130×48 둥근 직사각형(radius 12) —— */
const CancelBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: #f5f5f6;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.16px;
  color: #8b8b8b;
  cursor: pointer;
`;

/* —— 시작: 130×48 둥근 직사각형(radius 12) —— */
const StartBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: #96D960;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.16px;
  color: #fff;
  cursor: pointer;
`;
