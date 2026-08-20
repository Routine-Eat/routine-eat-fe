import styled from 'styled-components';

import chefIcon from '../../assets/recipe/chef.svg';
import missingIcon from '../../assets/recipe/missing-ingredients.svg';

/** 요리 시작 확인 — 가능: 피그마 1378:6893 / 부족: 피그마 2060:15461 */
function CookStartModal({
  title,
  open,
  onClose,
  onStart,
  canCook = true,
  missingIngredients = [],
}) {
  if (!open) return null;

  if (!canCook) {
    return (
      // 딤 오버레이: 화면 전체 반투명 사각 — 바텀시트용
      <SheetOverlay onClick={onClose}>
        {/* 바텀시트: 가로 350 둥근 사각(24), 하단 근처 */}
        <Sheet onClick={(e) => e.stopPropagation()}>
          <Handle />
          <SheetBody>
            <SheetHeader>
              <CartIcon src={missingIcon} alt="" />
              <SheetTitle>
                해당 재료가 부족해요
                <br />
                그래도 레시피를 시작할까요?
              </SheetTitle>
            </SheetHeader>
            {missingIngredients.length > 0 && (
              <ChipWrap>
                {missingIngredients.map((name) => (
                  <Chip key={name}>{name}</Chip>
                ))}
              </ChipWrap>
            )}
          </SheetBody>
          <SheetActions>
            <HaveBtn type="button" onClick={onStart}>
              재료가 모두 있어요
            </HaveBtn>
            <WithoutBtn type="button" onClick={onStart}>
              재료 없이 시작할게요
            </WithoutBtn>
          </SheetActions>
        </Sheet>
      </SheetOverlay>
    );
  }

  return (
    // 딤 오버레이: 화면 전체를 덮는 반투명 직사각형(고정 레이어)
    <Overlay onClick={onClose}>
      {/* 모달 카드: 가로 312 둥근 직사각형(radius 22), 흰 배경 + 회색 테두리 */}
      <Card onClick={(e) => e.stopPropagation()}>
        {/* 본문 묶음: 아이콘·텍스트를 세로로 쌓은 직사각형 영역 */}
        <Body>
          {/* 아이콘: 40×40 외곽 / 셰프 */}
          <ChefWrap>
            <Chef src={chefIcon} alt="" />
          </ChefWrap>
          {/* 텍스트 묶음: 제목·설명을 세로로 쌓은 직사각형 */}
          <Texts>
            {/* 제목: 두 줄 텍스트 블록(직사각형 텍스트 영역) */}
            <Title>
              ‘{title}’
              <br />
              요리모드를 시작할까요?
            </Title>
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

/* —— 아이콘 leaf: 28×35 —— */
const Chef = styled.img`
  display: block;
  width: 28px;
  height: 35px;
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
  background: #96d960;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.16px;
  color: #fff;
  cursor: pointer;
`;

/* —— 부족 재료 딤: 하단 정렬 —— */
const SheetOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 20px 28px;
  background: rgba(3, 3, 3, 0.15);
`;

/* —— 부족 재료 바텀시트: 가로 350 둥근 사각(24) —— */
const Sheet = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
  width: 100%;
  max-width: 350px;
  padding: 40px 20px 28px;
  overflow: hidden;
  border-radius: 24px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(3, 3, 3, 0.06),
    0 0 40px 0 rgba(3, 3, 3, 0.08);
`;

/* —— 핸들: 가로 둥근 막대 —— */
const Handle = styled.div`
  position: absolute;
  top: 8px;
  left: 50%;
  width: 48px;
  height: 4px;
  border-radius: 34px;
  background: #d9d9da;
  transform: translateX(-50%);
`;

const SheetBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
`;

const SheetHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const CartIcon = styled.img`
  display: block;
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

const SheetTitle = styled.p`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.18px;
  color: #2e2e2e;
  text-align: center;
`;

const ChipWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Chip = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f5f5f6;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  color: #727272;
`;

const SheetActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const HaveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: #f5f5f6;
  box-shadow: inset 0 0 3px 0 #fff;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: #444;
  cursor: pointer;
`;

const WithoutBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: #d6f3a1;
  box-shadow: inset 0 0 3px 0 #fff;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: #444;
  cursor: pointer;
`;
