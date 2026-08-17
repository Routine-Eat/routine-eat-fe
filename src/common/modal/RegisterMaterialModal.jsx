import { useMemo, useState } from 'react';
import styled from 'styled-components';

import backIcon from '../../assets/onboarding/register/back.svg';
import checkIcon from '../../assets/onboarding/register/check.svg';
import clearIcon from '../../assets/onboarding/register/clear.svg';
import sauceIcon from '../../assets/onboarding/register/sauce.svg';
import searchIcon from '../../assets/onboarding/register/search.svg';
import { TOOL_MODAL, TOOL_SECTIONS } from '../../constants/dummyTools';
import { INGREDIENTS, IngredientIcon } from '../../pages/onboarding/steps/SecondStep';

/* 조미료 목록 — 온보딩 4단계와 동일 */
const SEASONINGS = [
  { id: 'salt', name: '소금', icon: sauceIcon },
  { id: 'sesameSalt', name: '깨소금', icon: sauceIcon },
  { id: 'gochujang', name: '고추장', icon: sauceIcon },
  { id: 'soySauce', name: '간장', icon: sauceIcon },
  { id: 'doenjang', name: '된장', icon: sauceIcon },
  { id: 'sugar', name: '설탕', icon: sauceIcon },
  { id: 'oil', name: '식용유', icon: sauceIcon },
  { id: 'sesameOil', name: '참기름', icon: sauceIcon },
  { id: 'vinegar', name: '식초', icon: sauceIcon },
  { id: 'pepper', name: '후추', icon: sauceIcon },
];

const TOOL_MAP = Object.fromEntries(
  TOOL_SECTIONS.map((s) => [s.id, { ...TOOL_MODAL[s.id], catalog: s.catalog }]),
);

/**
 * 식재료/조미료/도구 등록 모달
 * type: 'ingredient' | 'seasoning' | 'appliance' | 'basic' | 'prep'
 */
function RegisterMaterialModal({ type, open, onClose, onSave }) {
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState([]);
  const [qtyTarget, setQtyTarget] = useState(null);
  const [qty, setQty] = useState('');
  const [skipQty, setSkipQty] = useState(false);

  const isIngredient = type === 'ingredient';
  const isSeasoning = type === 'seasoning';
  const toolCfg = TOOL_MAP[type];

  const catalog = isIngredient
    ? INGREDIENTS
    : isSeasoning
      ? SEASONINGS
      : (toolCfg?.catalog ?? []);
  const title = isIngredient
    ? '식재료 등록'
    : isSeasoning
      ? '조미료 등록'
      : (toolCfg?.title ?? '등록');
  const placeholder = isIngredient
    ? '식재료명으로 검색'
    : isSeasoning
      ? '조미료명으로 검색'
      : (toolCfg?.placeholder ?? '검색');
  const emptyName = isIngredient
    ? '식재료'
    : isSeasoning
      ? '조미료'
      : (toolCfg?.empty ?? '항목');

  const q = query.trim();
  const results = useMemo(
    () => (q ? catalog.filter((i) => i.name.includes(q)) : []),
    [catalog, q],
  );

  if (!open) return null;

  const close = () => {
    setQuery('');
    setDraft([]);
    setQtyTarget(null);
    onClose();
  };

  const pickIngredient = (item) => {
    setQtyTarget(item);
    setQty('');
    setSkipQty(false);
  };

  const toggleItem = (item) => {
    setDraft((prev) =>
      prev.some((d) => d.id === item.id)
        ? prev.filter((d) => d.id !== item.id)
        : [...prev, item],
    );
  };

  const confirmQty = () => {
    if (!qtyTarget) return;
    const entry = {
      ...qtyTarget,
      qty: skipQty || !qty ? null : `${qty}개`,
    };
    setDraft((prev) => [...prev.filter((d) => d.id !== entry.id), entry]);
    setQtyTarget(null);
  };

  const confirmRegister = () => {
    if (!draft.length) return;
    onSave(draft);
    close();
  };

  return (
    // 딤: 화면 full 반투명 직사각형
    <Overlay onClick={close}>
      {/* 모달 카드: 350×412 둥근 직사각형(radius 20) */}
      <Card onClick={(e) => e.stopPropagation()}>
        {qtyTarget ? (
          <>
            <BackBtn type="button" onClick={() => setQtyTarget(null)}>
              <BackImg src={backIcon} alt="" />
              뒤로가기
            </BackBtn>
            <ActiveChip>
              <IngredientIcon icon={qtyTarget.icon} />
              <ChipText>{qtyTarget.name}</ChipText>
            </ActiveChip>
            <Title>재료 수량을 입력해주세요</Title>
            <QtyRow>
              <QtyField
                type="number"
                inputMode="numeric"
                value={qty}
                disabled={skipQty}
                onChange={(e) => setQty(e.target.value)}
              />
              <Unit>개</Unit>
            </QtyRow>
            <SkipRow type="button" onClick={() => setSkipQty((v) => !v)}>
              <CheckBox $on={skipQty}>
                {skipQty && <CheckImg src={checkIcon} alt="" />}
              </CheckBox>
              수량입력 안할래요
            </SkipRow>
            <ConfirmBtn type="button" onClick={confirmQty}>
              입력완료
            </ConfirmBtn>
          </>
        ) : (
          <>
            <Title>{title}</Title>
            {/* 검색창: 296×48 둥근 직사각형 */}
            <Search>
              <SearchImg src={searchIcon} alt="" />
              <SearchInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
              />
              {q && (
                <ClearBtn type="button" onClick={() => setQuery('')}>
                  <ClearImg src={clearIcon} alt="" />
                </ClearBtn>
              )}
            </Search>
            <Body>
              {!q ? (
                <Empty>
                  아직 등록된 {emptyName}가 없어요
                  <br />
                  검색을 통해 추가해주세요
                </Empty>
              ) : (
                <ResultRow>
                  {results.map((item) => {
                    const selected = draft.some((d) => d.id === item.id);
                    const draftItem = draft.find((d) => d.id === item.id);
                    return (
                      <PickChip
                        key={item.id}
                        type="button"
                        $active={selected}
                        onClick={() =>
                          isIngredient ? pickIngredient(item) : toggleItem(item)
                        }
                      >
                        {isIngredient && <IngredientIcon icon={item.icon} />}
                        {isSeasoning && <SauceImg src={item.icon} alt="" />}
                        <ChipText>{item.name}</ChipText>
                        {draftItem?.qty && <QtyText>{draftItem.qty}</QtyText>}
                      </PickChip>
                    );
                  })}
                </ResultRow>
              )}
            </Body>
            <ConfirmBtn
              type="button"
              $disabled={!draft.length}
              disabled={!draft.length}
              onClick={confirmRegister}
            >
              {draft.length ? `등록완료(${draft.length})` : '확인'}
            </ConfirmBtn>
          </>
        )}
      </Card>
    </Overlay>
  );
}

export default RegisterMaterialModal;

/* —— 딤: 화면 full 반투명 직사각형 —— */
const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 50%;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 390px;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.2);
`;

/* —— 모달 카드: 350×412 둥근 직사각형 —— */
const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 350px;
  height: 412px;
  padding: 32px 28px 28px;
  overflow: hidden;
  border: 0.5px solid #d9d9da;
  border-radius: 20px;
  background: #fff;
`;

/* —— 제목 텍스트 —— */
const Title = styled.p`
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  color: #1a1a1a;
  text-align: center;
`;

/* —— 검색창: 296×48 둥근 직사각형 —— */
const Search = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 296px;
  height: 48px;
  border-radius: 12px;
  background: #fff;
  box-shadow:
    0 0 8px rgba(3, 3, 3, 0.05),
    0 0 30px rgba(3, 3, 3, 0.05);
`;

const SearchImg = styled.img`
  position: absolute;
  left: 12px;
  width: 22px;
  height: 22px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  padding: 0 44px 0 42px;
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  outline: none;
  &::placeholder {
    color: #bebebf;
  }
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 16px;
  display: flex;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const ClearImg = styled.img`
  width: 16px;
  height: 16px;
`;

/* —— 본문: 세로 flex 직사각형 —— */
const Body = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 0;
  margin-top: 16px;
`;

const Empty = styled.p`
  margin: auto 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  color: #bebebf;
  text-align: center;
`;

const ResultRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 4px;
  width: 100%;
  max-width: 284px;
  align-content: flex-start;
`;

/* —— 선택 칩: 알약(둥근 직사각) —— */
const PickChip = styled.button`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  /* 미선택도 2px 투명 테두리 → 선택 시 크기 흔들림 방지 */
  border: 2px solid ${({ $active }) => ($active ? '#c2ee73' : 'transparent')};
  border-radius: 30px;
  background: ${({ $active }) => ($active ? '#d6f3a1' : '#fff')};
  box-shadow:
    0 0 8px rgba(3, 3, 3, 0.05),
    0 0 30px rgba(3, 3, 3, 0.05);
  cursor: pointer;
`;

const ActiveChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  margin: 24px 0 20px;
  padding: 0 16px;
  border: 2px solid #c2ee73;
  border-radius: 30px;
  background: #d6f3a1;
  box-shadow:
    0 0 8px rgba(3, 3, 3, 0.05),
    0 0 30px rgba(3, 3, 3, 0.05);
`;

const SauceImg = styled.img`
  width: 19px;
  height: 19px;
  object-fit: contain;
`;

const ChipText = styled.span`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  color: #1a1a1a;
`;

const QtyText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #5a5a5b;
`;

/* —— 확인 버튼: 296×52 둥근 직사각형 —— */
const ConfirmBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 296px;
  height: 52px;
  margin-top: auto;
  border: none;
  border-radius: 12px;
  background: ${({ $disabled }) => ($disabled ? '#bebebf' : '#72d472')};
  color: ${({ $disabled }) => ($disabled ? '#f5f5f6' : '#fff')};
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.18px;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
`;

const BackBtn = styled.button`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: -4px 0 0;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 500;
  color: #5a5a5b;
  cursor: pointer;
`;

const BackImg = styled.img`
  width: 10px;
  height: 20px;
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
`;

/* —— 수량 입력: 100×36 둥근 직사각형 —— */
const QtyField = styled.input`
  width: 100px;
  height: 36px;
  border: 1px solid #d9d9da;
  border-radius: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  outline: none;
  &:disabled {
    background: #f5f5f6;
  }
`;

const Unit = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
`;

const SkipRow = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 500;
  color: #8b8b8b;
  cursor: pointer;
`;

/* —— 체크박스: 26×26 둥근 정사각 —— */
const CheckBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  overflow: hidden;
  border-radius: 6px;
  border: ${({ $on }) => ($on ? 'none' : '1.5px solid #d9d9da')};
  background: ${({ $on }) => ($on ? 'transparent' : '#fff')};
`;

const CheckImg = styled.img`
  width: 26px;
  height: 26px;
`;
