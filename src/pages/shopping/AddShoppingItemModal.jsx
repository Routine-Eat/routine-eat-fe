import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

/** 장보기 목록 — 기타 항목 추가·수정 모달 */
function AddShoppingItemModal({ open, onClose, onAdd, onSave, item = null }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const nameRef = useRef(null);
  const amountRef = useRef(null);
  const isEdit = Boolean(item);
  const isGramOnly = !isEdit || Boolean(item?.isCustom);

  useEffect(() => {
    if (!open) return;
    setName(item?.name ?? '');
    setAmount(
      isGramOnly
        ? String(item?.amount ?? '').replace(/[^0-9.]/g, '')
        : (item?.amount ?? '')
    );
    const t = setTimeout(
      () => (isEdit ? amountRef.current : nameRef.current)?.focus(),
      0
    );
    return () => clearTimeout(t);
  }, [isEdit, isGramOnly, open, item]);

  if (!open) return null;

  const canSubmit =
    name.trim().length > 0 && (!isGramOnly || amount.trim().length > 0);

  const close = () => {
    setName('');
    setAmount('');
    onClose();
  };

  const submit = () => {
    if (!canSubmit) return;
    const savedAmount = isGramOnly ? `${amount.trim()}g` : amount.trim();
    if (isEdit) onSave?.(item.id, item.name, savedAmount);
    else onAdd(name.trim(), savedAmount);
    close();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') submit();
  };

  return (
    // 딤: 화면 full 반투명 직사각형
    <Overlay onClick={close}>
      {/* 모달 카드: 가로 312 둥근 직사각형(radius 22) */}
      <Card onClick={(e) => e.stopPropagation()}>
        <Title>{isEdit ? '항목 수정' : '항목 추가'}</Title>
        <Desc>{isEdit ? '수량만 수정해요' : '기타 목록에 추가돼요'}</Desc>

        {/* 입력 — 항목명 / 수량 네모칸 두 개 */}
        <FieldRow>
          <NameInput
            ref={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onKeyDown}
            readOnly={isEdit}
            placeholder="항목 입력"
            maxLength={30}
          />
          <AmountInput
            ref={amountRef}
            value={amount}
            onChange={(e) => {
              const next = e.target.value;
              if (!isGramOnly || /^\d*\.?\d*$/.test(next)) setAmount(next);
            }}
            onKeyDown={onKeyDown}
            placeholder={isGramOnly ? '수량(g)' : '수량입력'}
            inputMode={isGramOnly ? 'decimal' : undefined}
            maxLength={12}
          />
        </FieldRow>

        {/* 버튼 행: 취소 + 추가 */}
        <Actions>
          <CancelBtn type="button" onClick={close}>
            취소
          </CancelBtn>
          <AddBtn type="button" $disabled={!canSubmit} onClick={submit}>
            {isEdit ? '수정' : '추가'}
          </AddBtn>
        </Actions>
      </Card>
    </Overlay>
  );
}

export default AddShoppingItemModal;

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
  gap: 20px;
  align-items: center;
  box-sizing: border-box;
  width: 312px;
  padding: 28px 24px 20px;
  border: 0.5px solid #d9d9da;
  border-radius: 22px;
  background: #fff;
`;

/* —— 제목 텍스트 —— */
const Title = styled.p`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.18px;
  color: #1a1a1a;
  text-align: center;
`;

/* —— 보조 설명 —— */
const Desc = styled.p`
  margin: -12px 0 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.14px;
  color: #8b8b8b;
  text-align: center;
`;

/* —— 입력 행: 항목명 + 수량 네모칸 —— */
const FieldRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
`;

const fieldBase = `
  box-sizing: border-box;
  height: 44px;
  border: none;
  border-radius: 10px;
  background: #f5f5f6;
  outline: none;
`;

/* —— 항목명 입력: flex 1 둥근 직사각형 —— */
const NameInput = styled.input`
  ${fieldBase}
  flex: 1;
  min-width: 0;
  padding: 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #444;
  &::placeholder {
    color: #444;
  }
`;

/* —— 수량 입력: 72×44 둥근 직사각형 —— */
const AmountInput = styled.input`
  ${fieldBase}
  flex-shrink: 0;
  width: 72px;
  padding: 0 8px;
  font-size: 16px;
  font-weight: 500;
  color: #727272;
  text-align: center;
  &::placeholder {
    color: #727272;
  }
`;

/* —— 버튼 행 —— */
const Actions = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

/* —— 취소: 130×48 —— */
const CancelBtn = styled.button`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
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

/* —— 추가: 130×48 연두 —— */
const AddBtn = styled.button`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: ${({ $disabled }) => ($disabled ? '#d9d9da' : '#d6f3a1')};
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.16px;
  color: ${({ $disabled }) => ($disabled ? '#5a5a5b' : '#444')};
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
`;
