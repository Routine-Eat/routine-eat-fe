import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import arrowIcon from '../../assets/mypage/arrow.svg';
import cartIcon from '../../assets/mypage/cart.svg';
import plusIcon from '../../assets/mypage/plus.svg';
import resetIcon from '../../assets/mypage/reset.svg';
import trashIcon from '../../assets/mypage/trash.svg';
import {
  CATEGORY_FILTERS,
  DUMMY_INGREDIENTS,
  SECTION_META,
} from '../../constants/dummyIngredients';

function IngredientIcon({ icon }) {
  // 우유처럼 레이어가 2개인 아이콘 처리
  if (Array.isArray(icon)) {
    return (
      <IconFrame>
        {icon.map((src) => (
          <IconImg key={src} src={src} alt="" />
        ))}
      </IconFrame>
    );
  }

  return <IconImg src={icon} alt="" />;
}

function IngredientsTab({ isEditing, selectedIds, setSelectedIds }) {
  const navigate = useNavigate();
  const [items, setItems] = useState(DUMMY_INGREDIENTS);
  const [filter, setFilter] = useState('all');

  // 필터에 맞는 섹션만 보여줌
  const sections = useMemo(() => {
    return SECTION_META.map((section) => ({
      ...section,
      items: items.filter((item) => {
        if (item.category !== section.id) return false;
        if (filter === 'all') return true;
        return item.category === filter;
      }),
    })).filter((section) => section.items.length > 0);
  }, [filter, items]);

  const toggleSelect = (id) => {
    if (!isEditing) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const resetSelection = () => setSelectedIds([]);

  // 선택 삭제 (프론트 더미 상태만 갱신)
  const deleteSelected = () => {
    setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  return (
    <Wrap>
      {/* 카테고리 필터 */}
      <FilterRow>
        {CATEGORY_FILTERS.map((item) => (
          <FilterBtn
            key={item.id}
            type="button"
            $active={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </FilterBtn>
        ))}
      </FilterRow>

      <List>
        {sections.map((section) => (
          <Section key={section.id}>
            <SectionTitle>{section.label}</SectionTitle>
            <ChipRow>
              {section.items.map((item) => {
                const selected = isEditing && selectedIds.includes(item.id);

                return (
                  <Chip
                    key={item.id}
                    type="button"
                    $selected={selected}
                    $editing={isEditing}
                    onClick={() => toggleSelect(item.id)}
                  >
                    {/* 아이콘 + 이름 묶음 — 피그마 gap 6 */}
                    <ChipLabel>
                      <IngredientIcon icon={item.icon} />
                      <ChipName $selected={selected}>{item.name}</ChipName>
                    </ChipLabel>
                    <ChipAmount $selected={selected}>{item.amount}</ChipAmount>
                  </Chip>
                );
              })}

              {/* 추가 칩(+ 버튼) — 피그마 1056:2493 */}
              <AddChip type="button">
                <ChipLabel>
                  <PlusIconWrap>
                    <PlusIcon src={plusIcon} alt="" />
                  </PlusIconWrap>
                  <AddName>추가</AddName>
                </ChipLabel>
              </AddChip>
            </ChipRow>
          </Section>
        ))}
      </List>

      {/* 하단 액션 — 편집: 초기화·삭제 / 일반: CTA */}
      <BottomBar>
        {isEditing ? (
          <ActionRow>
            <ResetBtn type="button" onClick={resetSelection}>
              <ResetIcon src={resetIcon} alt="" />
              초기화
            </ResetBtn>
            <DeleteBtn type="button" onClick={deleteSelected}>
              <DeleteIcon src={trashIcon} alt="" />
              삭제({selectedIds.length})
            </DeleteBtn>
          </ActionRow>
        ) : (
          <ShopBtn type="button" onClick={() => navigate('/market')}>
            <CartIcon src={cartIcon} alt="" />
            필요한 재료 사러 갈까요?
            <ArrowIcon src={arrowIcon} alt="" />
          </ShopBtn>
        )}
      </BottomBar>
    </Wrap>
  );
}

/* 재료 탭 전체 영역 */
const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

/* 상단 카테고리 필터 가로 줄 */
const FilterRow = styled.div`
  display: flex;
  gap: 18px;
  padding: 16px 20px 8px;
  overflow-x: auto;
`;

/* 카테고리 텍스트 버튼 (전체/냉장 등) */
const FilterBtn = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  white-space: nowrap;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ $active }) => ($active ? '#72d472' : '#616161')};
  cursor: pointer;
`;

/* 재료 섹션 스크롤 리스트 — 피그마 좌우 20px, 섹션 간격 48px */
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  flex: 1;
  padding: 12px 20px 140px;
  overflow-y: auto;
`;

/* 한 카테고리 섹션 (냉장식품 등) */
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* 섹션 제목 텍스트 */
const SectionTitle = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #6d6d6d;
`;

/* 재료 칩들이 나열되는 줄 */
const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 4px;
`;

/* 재료 칩 공통(흰 알약) — 피그마 shadow + inset */
const ChipBase = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  border: none;
  border-radius: 30px;
  background: #fff;
  box-shadow:
    0 0 7.9px -1px rgba(72, 28, 0, 0.08),
    0 0 40px 0 rgba(17, 0, 0, 0.05),
    inset 0 0 5px 0 #fff;
`;

/* 재료 칩 — 편집·선택 시 초록, 일반 모드는 클릭 불가 */
const Chip = styled(ChipBase)`
  background: ${({ $selected }) => ($selected ? '#72d472' : '#fff')};
  box-shadow: ${({ $selected }) =>
    $selected
      ? '0 0 7.9px -1px rgba(50, 40, 0, 0.08), 0 0 40px 0 rgba(128, 83, 0, 0.05), inset 0 0 2.5px 0 #fff'
      : '0 0 7.9px -1px rgba(72, 28, 0, 0.08), 0 0 40px 0 rgba(17, 0, 0, 0.05), inset 0 0 5px 0 #fff'};
  pointer-events: ${({ $editing }) => ($editing ? 'auto' : 'none')};
  cursor: ${({ $editing }) => ($editing ? 'pointer' : 'default')};
`;

/* 재료 추가 칩(+ 버튼) — 피그마 1056:2493 흰 알약 */
const AddChip = styled(ChipBase)`
  justify-content: center;
  cursor: pointer;
`;

/* + 아이콘 20×20 프레임 */
const PlusIconWrap = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

/* + 아이콘 — 피그마 약 11×11 */
const PlusIcon = styled.img`
  width: 11px;
  height: 11px;
  object-fit: contain;
`;

/* 추가 텍스트 — 피그마 14px SemiBold #2a2a2a */
const AddName = styled.span`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.14px;
  color: #2a2a2a;
`;

/* 칩 안 아이콘+이름 묶음 */
const ChipLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

/* 칩 안 재료 이름 — 피그마 14px SemiBold */
const ChipName = styled.span`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.14px;
  color: ${({ $selected }) => ($selected ? '#fff' : '#2a2a2a')};
`;

/* 칩 안 수량 — 피그마 12px Medium #a9a9a9 */
const ChipAmount = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ $selected }) => ($selected ? '#fff' : '#a9a9a9')};
`;

/* 겹친 아이콘용 정사각 프레임 */
const IconFrame = styled.span`
  position: relative;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

/* 재료/플러스 아이콘 이미지 */
const IconImg = styled.img`
  display: block;
  width: 20px;
  height: 20px;
  object-fit: contain;

  ${IconFrame} & {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
`;

/* 하단 고정 바 (둥근 상단 패널) */
const BottomBar = styled.div`
  position: fixed;
  left: 50%;
  bottom: 56px;
  z-index: 15;
  width: 100%;
  max-width: 390px;
  transform: translateX(-50%);
  padding: 16px 20px 20px;
  background: #fff;
  box-shadow: 0 -1px 14.6px 0 rgba(201, 201, 189, 0.25);
  border-radius: 22px 22px 0 0;
`;

/* 초록 CTA 버튼 — 재료 사러가기 */
const ShopBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #72d472;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

/* CTA 오른쪽 화살표 아이콘 */
const ArrowIcon = styled.img`
  width: 16px;
  height: 16px;
  transform: rotate(90deg);
`;

/* CTA 왼쪽 장바구니 아이콘 */
const CartIcon = styled.img`
  width: 22px;
  height: 22px;
  object-fit: contain;
`;

/* 선택 모드 하단 버튼 가로 줄 — 피그마 160+160 */
const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

/* 회색 초기화 버튼(둥근 사각형) */
const ResetBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 160px;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #e7e7e7;
  color: #3e3e3e;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

/* 초록 삭제 버튼(둥근 사각형) */
const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 160px;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #72d472;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

/* 초기화 아이콘 — 피그마 14×14 */
const ResetIcon = styled.img`
  width: 14px;
  height: 14px;
`;

/* 삭제 아이콘 — 피그마 16×16 */
const DeleteIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export default IngredientsTab;
