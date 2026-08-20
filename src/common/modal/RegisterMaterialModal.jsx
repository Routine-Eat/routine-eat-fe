import { useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';

import { getCookingEquipments } from '@/api/cookingEquipmentApi';
import { getFoodIngredients } from '@/api/foodIngredientApi';
import PillButton from '@/common/PillButton';

import backIcon from '../../assets/onboarding/register/back.svg';
import checkIcon from '../../assets/onboarding/register/check.svg';
import clearIcon from '../../assets/onboarding/register/clear.svg';
import searchIcon from '../../assets/onboarding/register/search.svg';
import { TOOL_MODAL, TOOL_SECTIONS } from '../../constants/dummyTools';
import { INGREDIENTS } from '../../pages/onboarding/steps/SecondStep';

/* 조미료 목록 — 도구 모달 등 기존 구조 호환용 */
const SEASONINGS = [
  { id: 'salt', name: '소금', type: 'SEASONING' },
  { id: 'sesameSalt', name: '깨소금', type: 'SEASONING' },
  { id: 'gochujang', name: '고추장', type: 'SEASONING' },
  { id: 'soySauce', name: '간장', type: 'SEASONING' },
  { id: 'doenjang', name: '된장', type: 'SEASONING' },
  { id: 'sugar', name: '설탕', type: 'SEASONING' },
  { id: 'oil', name: '식용유', type: 'SEASONING' },
  { id: 'sesameOil', name: '참기름', type: 'SEASONING' },
  { id: 'vinegar', name: '식초', type: 'SEASONING' },
  { id: 'pepper', name: '후추', type: 'SEASONING' },
];

const TOOL_MAP = Object.fromEntries(
  TOOL_SECTIONS.map((s) => [
    s.id,
    {
      ...TOOL_MODAL[s.id],
      catalog: s.catalog,
    },
  ])
);

const TOOL_TYPE_MAP = {
  appliance: ['APPLIANCE'],
  basic: ['UTENSIL', 'ETC'],
  prep: ['PREP_TOOL'],
};

/**
 * 식재료/조미료/도구 등록 모달
 * type: 'ingredient' | 'seasoning' | 'appliance' | 'basic' | 'prep'
 */
function RegisterMaterialModal({ type, open, onClose, onSave }) {
  const [query, setQuery] = useState('');

  // 식재료/조미료 API 검색 결과
  const [apiResults, setApiResults] = useState([]);

  // 사용자가 등록하기 위해 선택한 항목
  const [draft, setDraft] = useState([]);

  // 수량을 입력하고 있는 식재료
  const [qtyTarget, setQtyTarget] = useState(null);

  const [qty, setQty] = useState('');
  const [skipQty, setSkipQty] = useState(false);

  const isIngredient = type === 'ingredient';
  const isSeasoning = type === 'seasoning';
  const isTool = Boolean(TOOL_TYPE_MAP[type]);
  const toolCfg = TOOL_MAP[type];

  /*
   * 식재료 / 조미료 / 조리도구 검색 API
   *
   * 식재료:
   * foodIngredientType !== 'SEASONING'
   *
   * 조미료:
   * foodIngredientType === 'SEASONING'
   *
   * 도구:
   * GET /cooking-equipments?search=
   *
   * 단위는 foodIngredientPrimaryUnit만 사용한다.
   * foodIngredientSecondaryUnit은 사용하지 않는다.
   */
  useEffect(() => {
    if (!open) return;

    const q = query.trim();

    // 검색어가 없다면 결과 초기화
    if (!q) {
      setApiResults([]);
      return;
    }

    if (!isIngredient && !isSeasoning && !isTool) return;

    const fetchSearchResults = async () => {
      try {
        if (isTool) {
          const response = await getCookingEquipments(q);
          const allowed = TOOL_TYPE_MAP[type] ?? [];

          const filtered = (response.data ?? [])
            .filter((item) => allowed.includes(item.cookingEquipmentType))
            .map((item) => ({
              id: item.cookingEquipmentId,
              name: item.cookingEquipmentName,
              type: item.cookingEquipmentType,
            }));

          setApiResults(filtered);
          return;
        }

        const response = await getFoodIngredients(q);

        const filtered = response.data
          .filter((item) => {
            // 조미료 모달
            if (isSeasoning) {
              return item.foodIngredientType === 'SEASONING';
            }

            // 식재료 모달
            return item.foodIngredientType !== 'SEASONING';
          })
          .map((item) => ({
            id: item.foodIngredientId,
            name: item.foodIngredientName,
            type: item.foodIngredientType,

            /*
             * 중요!
             * 수량 단위는 PrimaryUnit만 사용한다.
             *
             * 예:
             * G
             * ML
             *
             * SecondaryUnit은 저장하지 않고 사용하지 않는다.
             */
            unit: item.foodIngredientPrimaryUnit,
          }));

        setApiResults(filtered);
      } catch (error) {
        console.error(isTool ? '조리도구 검색 실패:' : '식재료 검색 실패:', error);
        setApiResults([]);
      }
    };

    fetchSearchResults();
  }, [query, open, isIngredient, isSeasoning, isTool, type]);

  /*
   * 도구 등록 모달에서는 기존 더미 catalog 사용
   *
   * 식재료/조미료는 아래 results에서
   * apiResults를 사용하기 때문에
   * catalog는 도구 기존 기능 호환용으로 유지
   */
  const catalog = isIngredient ? INGREDIENTS : isSeasoning ? SEASONINGS : (toolCfg?.catalog ?? []);

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

  const emptyName = isIngredient ? '식재료' : isSeasoning ? '조미료' : (toolCfg?.empty ?? '항목');

  const q = query.trim();

  /*
   * 검색 결과
   *
   * 식재료/조미료/도구 → 백엔드 API 결과
   */
  const results = useMemo(() => {
    if (!q) return [];

    if (isIngredient || isSeasoning || isTool) {
      return apiResults;
    }

    return catalog.filter((item) => item.name.includes(q));
  }, [q, isIngredient, isSeasoning, isTool, apiResults, catalog]);

  if (!open) return null;

  const close = () => {
    setQuery('');
    setApiResults([]);
    setDraft([]);
    setQtyTarget(null);
    setQty('');
    setSkipQty(false);

    onClose();
  };

  /*
   * 식재료 선택
   *
   * 식재료는 선택하면 바로 등록하지 않고
   * 수량 입력 화면으로 이동
   */
  const pickIngredient = (item) => {
    setQtyTarget(item);
    setQty('');
    setSkipQty(false);
  };

  /*
   * 조미료 / 도구 선택
   */
  const toggleItem = (item) => {
    setDraft((prev) =>
      prev.some((d) => d.id === item.id) ? prev.filter((d) => d.id !== item.id) : [...prev, item]
    );
  };

  /*
   * 식재료 수량 입력 완료
   *
   * 중요:
   * 기존에는 `${qty}개`를 사용했지만
   * 이제 foodIngredientPrimaryUnit을 사용한다.
   *
   * 예:
   * qty = 300
   * unit = G
   *
   * → "300G"
   */
  const confirmQty = () => {
    if (!qtyTarget) return;

    const entry = {
      ...qtyTarget,

      qty: skipQty || !qty ? null : `${qty}${qtyTarget.unit}`,
    };

    setDraft((prev) => [...prev.filter((d) => d.id !== entry.id), entry]);

    setQtyTarget(null);
    setQty('');
    setSkipQty(false);
  };

  /*
   * 모달 최종 등록
   */
  const confirmRegister = () => {
    if (!draft.length) return;

    onSave(draft);
    close();
  };

  return (
    <Overlay onClick={close}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Handle />
        {qtyTarget ? (
          <>
            {/* 수량 입력 화면 뒤로가기 */}
            <BackBtn type="button" onClick={() => setQtyTarget(null)}>
              <BackImg src={backIcon} alt="" />
              재료 다시 선택
            </BackBtn>

            {/* 현재 선택한 식재료 */}
            <ActiveChipWrap>
              <PillButton
                kind="INGREDIENT"
                detailType={qtyTarget.type}
                name={qtyTarget.name}
                isSelected
              />
            </ActiveChipWrap>

            <Title>재료 수량을 입력해주세요</Title>

            <QtyRow>
              <QtyField
                type="number"
                inputMode="numeric"
                value={qty}
                disabled={skipQty}
                onChange={(e) => setQty(e.target.value)}
              />

              {/*
                기존:
                <Unit>개</Unit>

                변경:
                백엔드의 foodIngredientPrimaryUnit 사용
              */}
              <Unit>{qtyTarget.unit}</Unit>
            </QtyRow>

            <SkipRow type="button" onClick={() => setSkipQty((v) => !v)}>
              <CheckBox $on={skipQty}>{skipQty && <CheckImg src={checkIcon} alt="" />}</CheckBox>
              수량입력 안할래요
            </SkipRow>

            <ConfirmBtn type="button" onClick={confirmQty}>
              입력완료
            </ConfirmBtn>
          </>
        ) : (
          <>
            <Title>{title}</Title>

            {/* 검색창 */}
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
              ) : results.length === 0 ? (
                <Empty>찾는 재료가 없어요</Empty>
              ) : (
                <ResultRow>
                  {results.map((item) => {
                    const selected = draft.some((d) => d.id === item.id);

                    const draftItem = draft.find((d) => d.id === item.id);

                    return (
                      <PillButton
                        key={item.id}
                        kind={isTool ? 'EQUIPMENT' : 'INGREDIENT'}
                        detailType={item.type}
                        name={item.name}
                        amountValue={draftItem?.qty}
                        isSelected={selected}
                        onClick={() => (isIngredient ? pickIngredient(item) : toggleItem(item))}
                      />
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
      </Sheet>
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
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  max-width: 390px;
  transform: translateX(-50%);
  padding-bottom: 20px;
  background: rgba(0, 0, 0, 0.2);
`;

/* —— 바텀시트 —— */
const Sheet = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 360px;
  height: 412px;
  padding: 32px 28px 28px;
  overflow: hidden;
  border: 0.5px solid #d9d9da;
  border-radius: 20px;
  background: #fff;
`;

const Handle = styled.div`
  position: absolute;
  top: 7.5px;
  left: 50%;
  width: 48px;
  height: 4px;
  transform: translateX(-50%);
  border-radius: 34px;
  background: #d9d9da;
`;

/* —— 제목 —— */
const Title = styled.p`
  flex-shrink: 0;
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  color: #1a1a1a;
  text-align: center;
`;

/* —— 검색창 —— */
const Search = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
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

/* —— 본문 —— */
const Body = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 0;
  margin-top: 16px;
  overflow-y: auto;
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
  align-content: flex-start;
  gap: 8px 4px;
  width: 100%;
  padding: 16px 12px 24px;
  box-sizing: border-box;
`;

const ActiveChipWrap = styled.div`
  margin: 24px 0 20px;
`;

/* —— 확인 버튼 —— */
const ConfirmBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 296px;
  height: 52px;
  margin-top: auto;
  border: none;
  border-radius: 12px;
  background: ${({ $disabled }) => ($disabled ? '#bebebf' : '#96D960')};
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
  line-height: 1.2;
  color: #5a5a5b;
  cursor: pointer;
`;

const BackImg = styled.img`
  width: 10px;
  height: 20px;
  transform: scaleX(-1);
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
`;

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

/*
 * 실제 표시되는 단위
 *
 * 고정된 "개"가 아니라
 * foodIngredientPrimaryUnit이 들어온다.
 */
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
