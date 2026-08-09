import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import backIcon from '../../assets/recipe/back.svg';
import plusIcon from '../../assets/recipe/plus.svg';
import startCookingIcon from '../../assets/recipe/start-cooking-icon.png';
import {
  RECOMMENDED_PRODUCTS,
  SHOPPING_GROUPS,
} from '../../constants/dummyShoppingList';

function ShoppingList() {
  const navigate = useNavigate();

  return (
    <Page>
      {/* 상단 바: 뒤로가기 · 제목 · 추가(+) */}
      <TopBar>
        <IconBtn type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <BackImg src={backIcon} alt="" />
        </IconBtn>
        <PageTitle>장보기 목록</PageTitle>
        <IconBtn type="button" aria-label="추가">
          <PlusImg src={plusIcon} alt="" />
        </IconBtn>
      </TopBar>

      <Scroll>
        {/* 레시피별 장보기 그룹 */}
        {SHOPPING_GROUPS.map((group) => (
          <Group key={group.id}>
            <GroupHead>
              <GroupTitle>{group.title}</GroupTitle>
              {group.editable && <EditBtn type="button">수정</EditBtn>}
            </GroupHead>
            <ItemList>
              {group.items.map((item) => (
                <ItemCard key={`${group.id}-${item.name}`}>
                  <ItemName>{item.name}</ItemName>
                  <ItemAmount>{item.amount}</ItemAmount>
                </ItemCard>
              ))}
            </ItemList>
          </Group>
        ))}

        {/* 관련 추천 제품 */}
        <RecommendTitle>관련 추천 제품</RecommendTitle>
        <ProductRow>
          {RECOMMENDED_PRODUCTS.map((product) => (
            <ProductCard key={product.id}>
              <ProductThumb />
              <ProductName>{product.name}</ProductName>
              <ProductPrice>{product.price}</ProductPrice>
            </ProductCard>
          ))}
        </ProductRow>
      </Scroll>

      {/* 하단 고정 CTA */}
      <Footer>
        <MarketBtn type="button" onClick={() => navigate('/market')}>
          <MarketIcon src={startCookingIcon} alt="" />
          마켓에서 재료 둘러보기
        </MarketBtn>
      </Footer>
    </Page>
  );
}

/* 장보기 목록 페이지 전체 */
const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fffdfc;
`;

/* 상단 바(뒤로가기·제목·플러스) — 피그마 title y76 / plus y70 */
const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 70px 24px 0;
`;

/* 아이콘 버튼(뒤로가기/플러스) */
const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

/* 뒤로가기 화살표 */
const BackImg = styled.img`
  width: 12px;
  height: 20px;
`;

/* 페이지 제목 "장보기 목록" */
const PageTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  color: #212020;
`;

/* 우측 플러스 아이콘 */
const PlusImg = styled.img`
  width: 32px;
  height: 32px;
`;

/* 스크롤 본문 — 피그마 첫 그룹 y171 기준 상단 여백 */
const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 69px 24px 140px;
`;

/* 레시피 단위 그룹 */
const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;

  & + & {
    margin-top: 36px;
  }
`;

/* 그룹 헤더(레시피명 + 수정) */
const GroupHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/* 레시피 그룹 제목 */
const GroupTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.2;
  color: #2e2e2e;
`;

/* 수정 텍스트 버튼 */
const EditBtn = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font-size: 17px;
  font-weight: 500;
  color: #72d472;
  cursor: pointer;
`;

/* 재료 카드 리스트 */
const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* 재료 한 줄 카드(회색 라운드) */
const ItemCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  border-radius: 10px;
  background: #f5f5f6;
`;

/* 재료 이름 */
const ItemName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #8b8b8b;
`;

/* 재료 분량 */
const ItemAmount = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #8b8b8b;
`;

/* 관련 추천 제품 제목 */
const RecommendTitle = styled.h2`
  margin: 56px 0 12px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  color: #030303;
`;

/* 추천 제품 가로 줄 */
const ProductRow = styled.div`
  display: flex;
  gap: 4px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/* 추천 제품 카드 */
const ProductCard = styled.article`
  flex: 0 0 111px;
  width: 111px;
`;

/* 제품 썸네일(회색 박스) */
const ProductThumb = styled.div`
  width: 111px;
  height: 91px;
  border-radius: 10px;
  background: #f1f1f1;
`;

/* 제품 이름 */
const ProductName = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  color: #2e2e2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* 제품 가격 */
const ProductPrice = styled.p`
  margin: 2px 0 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #bebebf;
`;

/* 하단 고정 CTA 패널 */
const Footer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  padding: 34px 21px 42px;
  background: #fff;
  border-radius: 22px 22px 0 0;
  box-shadow: 0 -1px 14.6px 0 rgba(201, 201, 189, 0.25);
`;

/* 마켓에서 재료 둘러보기 버튼 */
const MarketBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #72d472;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
`;

/* 버튼 안 포크·나이프 아이콘 */
const MarketIcon = styled.img`
  width: 21px;
  height: 21px;
  object-fit: contain;
`;

export default ShoppingList;
