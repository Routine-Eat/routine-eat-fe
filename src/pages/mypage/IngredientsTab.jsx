import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import {
  deleteUserFoodIngredients,
  getUserFoodIngredients,
  postUserFoodIngredients,
} from '@/api/userApi';
import { useUserStore } from '@/hooks/useUserStore';

import resetIcon from '../../assets/mypage/reset.svg';
import trashIcon from '../../assets/mypage/trash.svg';
import PillButton from '../../common/PillButton';
import RegisterMaterialModal from '../../common/modal/RegisterMaterialModal';
import MarketBrowseButton from './MarketBrowseButton';
import {
  CATEGORY_FILTERS,
  DUMMY_INGREDIENTS,
  SECTION_META,
} from '../../constants/dummyIngredients';
import {
  getCustomOwnedIngredients,
  removeCustomOwnedIngredients,
} from '../../store/shoppingStore';

/* "200G" -> 200. Secondary 수량·단위는 사용하지 않음 */
const getPrimaryAmountValue = (qty) => {
  if (!qty) return null;

  const value = parseFloat(qty);

  return Number.isNaN(value) ? null : value;
};

const mapUserFoodIngredients = (data) =>
  (data?.foodIngredientList ?? []).map((item) => {
    const amount =
      item.primaryAmountValue != null
        ? `${item.primaryAmountValue}${item.foodIngredientPrimaryUnit ?? ''}`
        : '';

    return {
      id: item.foodIngredientId,
      name: item.foodIngredientName,
      amount,
      type: item.foodIngredientType,
      category: item.foodIngredientType === 'SEASONING' ? 'seasoning' : 'ingredient',
    };
  });

/** 마이페이지 재료 탭 — 피그마 1810:7375 / 편집 1812:7655 */
function IngredientsTab({ isEditing, selectedIds, setSelectedIds }) {
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.userId);
  const [items, setItems] = useState(DUMMY_INGREDIENTS);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null); /* 'ingredient' | 'seasoning' | null */

  /* 사용자-식재료 목록 조회 API (보유) */
  useEffect(() => {
    if (!userId) return;

    const fetchUserFoodIngredients = async () => {
      const customItems = getCustomOwnedIngredients(userId);

      try {
        const response = await getUserFoodIngredients(userId, 'OWN');
        setItems([...mapUserFoodIngredients(response.data), ...customItems]);
      } catch (error) {
        console.error('사용자 식재료 조회 실패:', error);
        if (customItems.length > 0) setItems(customItems);
      }
    };

    fetchUserFoodIngredients();
  }, [userId]);

  const sections = useMemo(
    () =>
      SECTION_META.map((section) => ({
        ...section,
        items: items.filter((item) => {
          if (item.category !== section.id) return false;
          if (filter === 'all') return true;
          return item.category === filter;
        }),
      })).filter(
        (section) => section.items.length > 0 || filter === 'all' || filter === section.id
      ),
    [filter, items]
  );

  const toggleSelect = (id) => {
    if (!isEditing) return;
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const resetSelection = () => setSelectedIds([]);

  const deleteSelected = async () => {
    if (!selectedIds.length) return;

    if (!userId) {
      console.error('사용자 정보가 없습니다.');
      return;
    }

    const customIds = selectedIds.filter((id) => String(id).startsWith('custom-'));
    const serverIds = selectedIds.filter((id) => !customIds.includes(id));

    try {
      removeCustomOwnedIngredients(userId, customIds);

      if (serverIds.length > 0) {
        await deleteUserFoodIngredients(userId, {
          relationType: 'OWN',
          foodIngredientList: serverIds,
        });
      }

      setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error('사용자 식재료 삭제 실패:', error);
    }
  };

  const saveFromModal = async (draft) => {
    const category = modal === 'seasoning' ? 'seasoning' : 'ingredient';
    const newDraft = draft.filter((d) => !items.some((i) => i.id === d.id));

    if (!newDraft.length) return;

    if (!userId) {
      console.error('사용자 정보가 없습니다.');
      return;
    }

    try {
      await postUserFoodIngredients(userId, {
        relationType: 'OWN',
        foodIngredientList: newDraft.map((item) => ({
          foodIngredientId: item.id,
          primaryAmountValue: getPrimaryAmountValue(item.qty),
        })),
      });

      setItems((prev) => [
        ...prev,
        ...newDraft.map((d) => ({
          id: d.id,
          name: d.name,
          amount: d.qty || '1팩',
          type: d.type ?? (category === 'seasoning' ? 'SEASONING' : undefined),
          category,
        })),
      ]);
    } catch (error) {
      console.error('사용자 식재료 생성 실패:', error);
    }
  };

  return (
    // 탭 루트 — 세로 full 직사각형
    <Wrap>
      {/* 필터 행: 전체 | 식재료 | 조미료 텍스트 */}
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
          /* 섹션: 제목 + 칩 줄바꿈 영역 */
          <Section key={section.id}>
            <SectionTitle>{section.label}</SectionTitle>
            <ChipRow>
              {section.items.map((item) => (
                <PillButton
                  key={item.id}
                  kind="INGREDIENT"
                  detailType={item.type}
                  name={item.name}
                  amountValue={item.amount}
                  isSelected={isEditing && selectedIds.includes(item.id)}
                  onClick={isEditing ? () => toggleSelect(item.id) : undefined}
                />
              ))}
              <PillButton
                kind="ETC"
                name="추가"
                onClick={() => setModal(section.id === 'seasoning' ? 'seasoning' : 'ingredient')}
              />
            </ChipRow>
          </Section>
        ))}
      </List>

      {/* 하단 고정 바: 상단 둥근 흰 직사각형 */}
      <BottomBar>
        {isEditing ? (
          /* 편집 모드: 초기화 | 삭제 가로 버튼 (1812:7655) */
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
          /* 일반: 마켓 CTA 흰 테두리 둥근 직사각형 */
          <MarketBrowseButton onClick={() => navigate('/market')} />
        )}
      </BottomBar>

      <RegisterMaterialModal
        type={modal === 'seasoning' ? 'seasoning' : 'ingredient'}
        open={!!modal}
        onClose={() => setModal(null)}
        onSave={saveFromModal}
      />
    </Wrap>
  );
}

export default IngredientsTab;

/* —— 탭 루트: 세로 full 직사각형 —— */
const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

/* —— 필터 행: 가로 텍스트 —— */
const FilterRow = styled.div`
  display: flex;
  gap: 18px;
  padding: 16px 24px 8px;
`;

const FilterBtn = styled.button`
  padding: 0;
  border: none;
  background: transparent;
  white-space: nowrap;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ $active }) => ($active ? '#72d472' : '#adadad')};
  cursor: pointer;
`;

/* —— 스크롤 리스트: 세로 직사각형 —— */
const List = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 48px;
  padding: 12px 20px 140px;
  overflow-y: auto;
`;

/* —— 섹션: 세로 묶음 —— */
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: #727272;
`;

/* —— 칩 줄: 가로 wrap —— */
const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 4px;
  max-width: 350px;
`;

/* —— 하단 바: 상단 둥근 흰 직사각형 —— */
const BottomBar = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 15;
  box-sizing: border-box;
  width: 100%;
  max-width: 390px;
  padding: 28px 24px 32px;
  transform: translateX(-50%);
  border-radius: 22px 22px 0 0;
  background: #fff;
  box-shadow: 0 -1px 14.6px 0 rgba(201, 201, 189, 0.25);
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

/* —— 초기화: 160×48 회색 둥근 직사각형 —— */
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
  font-size: 16px;
  font-weight: 600;
  color: #3e3e3e;
  cursor: pointer;
`;

/* —— 삭제: 160×48 초록 둥근 직사각형 —— */
const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 160px;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #96D960;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition:
    transform 100ms ease,
    background-color 100ms ease,
    color 100ms ease,
    font-size 100ms ease;

  &:active {
    background: #36a73c;
    color: #c6f5a6;
    font-size: 15px;
    transform: scale(0.97);
  }
`;

const ResetIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const DeleteIcon = styled.img`
  width: 16px;
  height: 16px;
`;
