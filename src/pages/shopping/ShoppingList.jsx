import { useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import addItemIcon from '../../assets/shopping/add-item.svg';
import checkOn from '../../assets/shopping/check-on.svg';
import heartEmpty from '../../assets/shopping/heart-empty.svg';
import heartFilled from '../../assets/shopping/heart-filled.svg';
import marketIcon from '../../assets/shopping/market-icon.png';
import BackButton from '../../common/button/BackButton';
import { MARKET_PRODUCTS, OTHER_GROUP_ID } from '../../constants/dummyShoppingList';
import {
  addOtherShoppingItem,
  getShoppingGroups,
  removeShoppingItems,
  subscribeShopping,
} from '../../store/shoppingStore';
import AddShoppingItemModal from './AddShoppingItemModal';
import ShoppingDoneModal from './ShoppingDoneModal';

/** 장보기 목록 — 피그마 1854:2899 */
function ShoppingList() {
  const navigate = useNavigate();
  const groups = useSyncExternalStore(subscribeShopping, getShoppingGroups);
  const [checked, setChecked] = useState(() => new Set());
  const [products, setProducts] = useState(MARKET_PRODUCTS);
  const [modalStep, setModalStep] = useState(null); // null | 'confirm' | 'done'
  const [addOpen, setAddOpen] = useState(false);
  const hasChecked = checked.size > 0;

  const recipeGroups = groups.filter((g) => g.id !== OTHER_GROUP_ID);
  const otherGroup = groups.find((g) => g.id === OTHER_GROUP_ID) ?? {
    id: OTHER_GROUP_ID,
    title: '기타',
    items: [],
  };

  const clearCheckedItems = () => {
    removeShoppingItems(checked);
    setChecked(new Set());
  };

  const renderItem = (item) => {
    const on = checked.has(item.id);
    return (
      /* 재료 행 — 체크 + (재료명·수량) 한 카드 */
      <ItemRow key={item.id} onClick={() => toggleItem(item.id)}>
        <Check type="button" $on={on} aria-pressed={on}>
          {on && <CheckOn src={checkOn} alt="" />}
        </Check>
        <ItemCard $on={on}>
          <ItemName>{item.name}</ItemName>
          <ItemAmount>{item.amount}</ItemAmount>
        </ItemCard>
      </ItemRow>
    );
  };

  const toggleItem = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deleteSelected = () => {
    if (!hasChecked) return;
    clearCheckedItems();
  };

  const selectAll = () => {
    const allIds = groups.flatMap((g) => g.items.map((i) => i.id));
    setChecked(new Set(allIds));
  };

  const finishSelected = () => {
    clearCheckedItems();
    setModalStep('done');
  };

  const toggleLike = (id) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p)));
  };

  return (
    // 페이지 루트 — 세로 full 직사각형
    <Page>
      {/* 상단 바 — 뒤로가기 + 제목 */}
      <TopBar>
        <BackButton onClick={() => navigate(-1)} />
        <PageTitle>장보기 목록</PageTitle>
        <TopSpacer aria-hidden />
      </TopBar>

      <Scroll>
        {/* 목록 카드 — 둥근 흰 직사각형(radius 22) + 그림자 */}
        <ListCard>
          {/* 항목 추가 — 카드 우상단 텍스트+플러스 */}
          <CardAdd type="button" aria-label="항목 추가" onClick={() => setAddOpen(true)}>
            <CardAddLabel>항목 추가</CardAddLabel>
            <CardAddIcon src={addItemIcon} alt="" />
          </CardAdd>

          {recipeGroups.map((group) => (
            /* 레시피 그룹 — 제목 + 재료 행 세로 묶음 */
            <Group key={group.id}>
              <GroupTitle>{group.title}</GroupTitle>
              <ItemList>{group.items.map(renderItem)}</ItemList>
            </Group>
          ))}

          {/* 기타 — 항상 표시 */}
          <Group>
            <GroupTitle>{otherGroup.title}</GroupTitle>
            {otherGroup.items.length > 0 && <ItemList>{otherGroup.items.map(renderItem)}</ItemList>}
          </Group>

          {/* 하단 액션 — 가로 나란한 둥근 직사각형 두 개 */}
          <Actions>
            {/* 전체 선택(미선택) / 삭제(선택됨) — 흰 테두리 둥근 직사각형 132×48 */}
            <SideBtn type="button" onClick={hasChecked ? deleteSelected : selectAll}>
              {hasChecked ? '삭제' : '전체 선택'}
            </SideBtn>
            {/* 장보기 완료 — 비활성 회 / 활성 연두 둥근 직사각형 */}
            <DoneBtn
              type="button"
              $on={hasChecked}
              disabled={!hasChecked}
              onClick={() => setModalStep('confirm')}
            >
              장보기 완료
            </DoneBtn>
          </Actions>
        </ListCard>

        {/* 관련 마켓 제품 — 제목 + 가로 스크롤 */}
        <MarketTitle>관련 마켓 제품</MarketTitle>
        <ProductRow>
          {products.map((product) => (
            /* 제품 카드 — 썸네일 정사각 + 텍스트 세로 */
            <ProductCard key={product.id}>
              {/* 썸네일 — 124×104 둥근 직사각형(radius 10) */}
              <ProductThumb>
                {/* 하트 — 우상단 16×14 */}
                <HeartBtn type="button" onClick={() => toggleLike(product.id)}>
                  <HeartImg src={product.liked ? heartFilled : heartEmpty} alt="" />
                </HeartBtn>
              </ProductThumb>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>{product.price}</ProductPrice>
            </ProductCard>
          ))}
        </ProductRow>

        {/* 마켓 CTA — 흰 테두리 둥근 직사각형 342×56 */}
        <MarketBtn type="button" onClick={() => navigate('/market')}>
          {/* 접시·포크·나이프 아이콘 — 20×20 정사각 (피그마 1382:7816) */}
          <PlateImg src={marketIcon} alt="" />
          마켓에서 재료 둘러보기
        </MarketBtn>
      </Scroll>

      <AddShoppingItemModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(name, amount) => addOtherShoppingItem(name, amount)}
      />

      <ShoppingDoneModal
        step={modalStep}
        onClose={() => setModalStep(null)}
        onConfirm={finishSelected}
        onOk={() => setModalStep(null)}
      />
    </Page>
  );
}

export default ShoppingList;

/* —— 페이지 루트: 세로 full 직사각형 —— */
const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fffefd;
`;

/* —— 상단 바: 3열 그리드(뒤로·제목·균형) —— */
const TopBar = styled.header`
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  box-sizing: border-box;
  padding: 12px 20px 14px;
  padding-top: max(30px, env(safe-area-inset-top));
  background: #fefdfd;
`;

/* —— 제목 중앙 정렬용 빈 슬롯 —— */
const TopSpacer = styled.span`
  width: 48px;
`;

/* —— 페이지 제목 텍스트 —— */
const PageTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.2px;
  color: #2e2e2e;
  text-align: center;
`;

/* —— 스크롤 본문: 세로 직사각형 —— */
const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 32px 20px 40px;
`;

/* —— 목록 카드: 둥근 흰 직사각형(radius 22) —— */
const ListCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 28px;
  box-sizing: border-box;
  width: 100%;
  padding: 49px 24px 20px;
  border-radius: 22px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(3, 3, 3, 0.06),
    0 0 40px 0 rgba(3, 3, 3, 0.08);
`;

/* —— 항목 추가: 카드 우상단 가로 버튼 —— */
const CardAdd = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

/* —— 항목 추가 텍스트 —— */
const CardAddLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.15px;
  color: #adadad;
`;

/* —— 항목 추가 플러스: 28×28 정사각 —— */
const CardAddIcon = styled.img`
  display: block;
  width: 28px;
  height: 28px;
`;

/* —— 레시피 그룹: 세로 직사각형 —— */
const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

/* —— 레시피 제목 텍스트 —— */
const GroupTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.17px;
  color: #727272;
`;

/* —— 재료 리스트: 세로 갭 8 —— */
const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* —— 재료 행: 체크 + 한 줄 카드 가로 —— */
const ItemRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  cursor: pointer;
`;

/* —— 체크박스: 36×36 둥근 정사각(radius 10) —— */
const Check = styled.button`
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: ${({ $on }) => ($on ? 'transparent' : '#f5f5f6')};
  pointer-events: none;
`;

/* —— 선택 체크: 36×36 회색 둥근 정사각 SVG —— */
const CheckOn = styled.img`
  position: absolute;
  inset: 0;
  width: 36px;
  height: 36px;
`;

/* —— 재료 카드: 이름 왼쪽 + 수량 오른쪽 한 줄 —— */
const ItemCard = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
  min-width: 0;
  height: 44px;
  padding: 0 16px;
  border-radius: 10px;
  background: ${({ $on }) => ($on ? '#d6f3a1' : '#f5f5f6')};
`;

/* —— 재료명 텍스트 —— */
const ItemName = styled.span`
  min-width: 0;
  overflow: hidden;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  color: #444;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

/* —— 수량 텍스트 —— */
const ItemAmount = styled.span`
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
  color: #727272;
  white-space: nowrap;
`;

/* —— 액션 행: 가로 직사각형 —— */
const Actions = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

/* —— 전체 선택/삭제: 흰 테두리 둥근 직사각형 132×48 —— */
const SideBtn = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 132px;
  height: 48px;
  border: 1px solid #bebebf;
  border-radius: 12px;
  background: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.16px;
  color: #5a5a5b;
  cursor: pointer;
`;

/* —— 장보기 완료: 비활성 회 / 활성 연두 둥근 직사각형 160×48 —— */
const DoneBtn = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: ${({ $on }) => ($on ? '#d6f3a1' : '#d9d9da')};
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.16px;
  color: ${({ $on }) => ($on ? '#444' : '#5a5a5b')};
  cursor: ${({ $on }) => ($on ? 'pointer' : 'default')};
`;

/* —— 관련 마켓 제목 텍스트 —— */
const MarketTitle = styled.h2`
  margin: 40px 4px 12px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  color: #1a1a1a;
`;

/* —— 제품 가로 스크롤: 직사각형 트랙 —— */
const ProductRow = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin: 0 -20px;
  padding: 0 20px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/* —— 제품 카드: 세로 124폭 직사각형 —— */
const ProductCard = styled.article`
  display: flex;
  flex: 0 0 124px;
  flex-direction: column;
  gap: 8px;
  width: 124px;
`;

/* —— 썸네일: 124×104 둥근 직사각형(radius 10) —— */
const ProductThumb = styled.div`
  position: relative;
  width: 124px;
  height: 104px;
  overflow: hidden;
  border-radius: 10px;
  background: #f1f1f1;
`;

/* —— 하트 버튼: 우상단 —— */
const HeartBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 18px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

/* —— 하트 아이콘: 16×14 —— */
const HeartImg = styled.img`
  width: 16px;
  height: 14px;
`;

/* —— 제품명 텍스트 —— */
const ProductName = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  color: #2e2e2e;
`;

/* —— 가격 텍스트 —— */
const ProductPrice = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #bebebf;
`;

/* —— 마켓 CTA: 흰 테두리 둥근 직사각형(radius 12) —— */
const MarketBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 56px;
  margin-top: 28px;
  border: 1px solid #bebebf;
  border-radius: 12px;
  background: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  color: #2e2e2e;
  cursor: pointer;
`;

/* —— 접시·포크·나이프 아이콘: 20×20 정사각 —— */
const PlateImg = styled.img`
  display: block;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  object-fit: contain;
`;
