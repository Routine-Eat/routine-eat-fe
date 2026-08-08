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

function IngredientsTab({ selectedIds, setSelectedIds }) {
  const navigate = useNavigate();
  const [items, setItems] = useState(DUMMY_INGREDIENTS);
  const [filter, setFilter] = useState('all');
  const hasSelection = selectedIds.length > 0;

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
                const selected = selectedIds.includes(item.id);

                return (
                  <Chip
                    key={item.id}
                    type="button"
                    $selected={selected}
                    onClick={() => toggleSelect(item.id)}
                  >
                    <IngredientIcon icon={item.icon} />
                    <ChipName $selected={selected}>{item.name}</ChipName>
                    <ChipAmount $selected={selected}>{item.amount}</ChipAmount>
                  </Chip>
                );
              })}

              {/* 추가 버튼 — 이후 API 연동 시 연결 */}
              <AddChip type="button">
                <IconImg src={plusIcon} alt="" />
                <ChipName>추가</ChipName>
              </AddChip>
            </ChipRow>
          </Section>
        ))}
      </List>

      {/* 하단 액션: 기본 CTA / 선택 시 초기화·삭제 */}
      <BottomBar>
        {hasSelection ? (
          <ActionRow>
            <ResetBtn type="button" onClick={resetSelection}>
              <SmallIcon src={resetIcon} alt="" />
              초기화
            </ResetBtn>
            <DeleteBtn type="button" onClick={deleteSelected}>
              <SmallIcon src={trashIcon} alt="" />
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

/* 재료 섹션들을 담는 스크롤 리스트 */
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
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

/* 재료 칩(알약 모양 버튼) */
const Chip = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  border: none;
  border-radius: 30px;
  background: ${({ $selected }) => ($selected ? '#72d472' : '#fff')};
  box-shadow:
    0 0 7.9px -1px rgba(50, 40, 0, 0.08),
    0 0 40px 0 rgba(128, 83, 0, 0.05);
  cursor: pointer;
`;

/* 재료 추가 칩(+ 버튼) */
const AddChip = styled(Chip)`
  gap: 6px;
`;

/* 칩 안 재료 이름 텍스트 */
const ChipName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $selected }) => ($selected ? '#fff' : '#2a2a2a')};
`;

/* 칩 안 수량 텍스트 */
const ChipAmount = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ $selected }) => ($selected ? 'rgba(255,255,255,0.85)' : '#a9a9a9')};
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

/* 선택 모드 하단 버튼 가로 줄 */
const ActionRow = styled.div`
  display: flex;
  gap: 10px;
`;

/* 회색 초기화 버튼 */
const ResetBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 104px;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #f3f3f3;
  color: #2a2a2a;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

/* 초록 삭제 버튼 */
const DeleteBtn = styled.button`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #72d472;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

/* 초기화/삭제 버튼 안 작은 아이콘 */
const SmallIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export default IngredientsTab;
