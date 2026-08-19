import styled from 'styled-components';

import modalCheck from '../../assets/shopping/modal-check.svg';

/**
 * 장보기 완료 확인 모달
 * step: 'confirm'
 */
function ShoppingDoneModal({ step, onClose, onConfirm, count = 0 }) {
  if (step !== 'confirm') return null;

  return (
    // 딤: 화면 full 반투명 직사각형
    <Overlay onClick={onClose}>
      {/* 모달 카드: 가로 312 둥근 직사각형(radius 22) */}
      <Card onClick={(e) => e.stopPropagation()}>
        <Body>
          {/* 체크 아이콘: 40×40 둥근 정사각 */}
          <Icon src={modalCheck} alt="" />
          <Texts>
            {/* 제목: 두 줄 텍스트 블록 */}
            <Title>
              구매한 재료를
              <br />
              보유재료에 추가할까요?
            </Title>
            <Desc>선택한 재료 {count}개를 보유 재료에 추가해요</Desc>
          </Texts>
        </Body>

        {/* 버튼 행: 가로 나란한 둥근 직사각형 두 개 */}
        <Actions>
          <CancelBtn type="button" onClick={onClose}>
            취소
          </CancelBtn>
          <OkBtn type="button" onClick={onConfirm}>
            냉장고에 넣기
          </OkBtn>
        </Actions>
      </Card>
    </Overlay>
  );
}

export default ShoppingDoneModal;

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

/* —— 본문: 아이콘+텍스트 세로 —— */
const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

/* —— 체크 아이콘: 40×40 정사각 —— */
const Icon = styled.img`
  display: block;
  width: 40px;
  height: 40px;
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

/* —— 완료: 130×48 초록 둥근 직사각형 —— */
const OkBtn = styled.button`
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
