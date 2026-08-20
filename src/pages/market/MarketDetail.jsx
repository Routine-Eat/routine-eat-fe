import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styled from 'styled-components';

import headerCart from '@/assets/market/header-cart-detail.svg';
import HeartEmpty from '@/assets/market/heartEmptyIcon.svg';
import HeartFull from '@/assets/market/heartFullIcon.svg';
import { recipes } from '@/constants/dummyMarket';
import { productsDetail } from '@/constants/dummyMarket';

import BackButton from '../../common/button/BackButton';

const TABS = ['상품설명', '상세정보', '후기'];

export default function MarketDetail() {
  const { productId } = useParams();
  const [isSelect, setIsSelect] = useState('상품설명');
  // productId와 일치하는 상품 찾기 (숫자 변환 처리)
  const targetProduct = productsDetail.find((p) => p.id === Number(productId)) || products[0];
  const [productData, setProductData] = useState(targetProduct);
  const navigate = useNavigate();

  return (
    <Contents>
      <Header>
        <BackButton onClick={() => navigate(-1)} />
        <HeaderCart src={headerCart} alt="" />
      </Header>
      <ButtonBar>
        {TABS.map((tab) => (
          <InfoTypeButton key={tab} $isSelect={isSelect === tab} onClick={() => setIsSelect(tab)}>
            {tab}
          </InfoTypeButton>
        ))}
      </ButtonBar>
      <ProductImg src={productData.imgUrl} />
      <InfoBox>
        <InfoHead>
          <RankingBox>{productData.rank}</RankingBox>
          {productData.isSave ? (
            <img
              src={HeartFull}
              onClick={() => setProductData((prev) => ({ ...prev, isSave: false }))}
            />
          ) : (
            <img
              src={HeartEmpty}
              onClick={() => setProductData((prev) => ({ ...prev, isSave: true }))}
            />
          )}
        </InfoHead>
        <NameAndReview>
          <ProductName>{productData.name}</ProductName>
          <Review onClick={() => setIsSelect('후기')}>
            후기 {productData.review?.toLocaleString()}건
          </Review>
        </NameAndReview>
        <MadeIn>원산지: {productData.origin}</MadeIn>
        <Price>{productData.price?.toLocaleString()}원</Price>
        <DiscountBar>
          <DiscountRate>{productData.discountRate}%</DiscountRate>
          <DiscountPrice>{productData.discountPrice?.toLocaleString()}원</DiscountPrice>
        </DiscountBar>
        <DeliveryBox>
          <DeliverySymbol>배송</DeliverySymbol>
          <DeliveryContents>
            23시 전 주문시 수도권/충청 내일 아침 7시 전 도착 (그 외 지역 아침 8시 전 도착)
          </DeliveryContents>
        </DeliveryBox>
        <DeliveryBox>
          <DeliverySymbol>배송비</DeliverySymbol>
          <DeliveryContents>3,000원 (3만원 이상 무료)</DeliveryContents>
        </DeliveryBox>
      </InfoBox>
      <Recipe>활용 레시피</Recipe>
      <RecipesBox>
        {recipes.map((r) => (
          <RecipeCard>
            <RecipeImg src={r.imgUrl} />
            <RecipeBackground />
            <RecipeName>{r.name}</RecipeName>
          </RecipeCard>
        ))}
      </RecipesBox>
    </Contents>
  );
}
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 20px 20px;
  background: #fffefd;
`;
const HeaderCart = styled.img`
  display: block;
  width: 30px;
  height: 30px;
`;
const ProductName = styled.div`
  color: var(--800, #1a1a1a);
  font-family: 'Wanted Sans Variable';
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  line-height: 148%; /* 29.6px */
  width: 200px;
  justify-content: flex-start;
`;
const ButtonBar = styled.div`
  display: flex;
  padding-left: 24px;
  gap: 5px;
`;
const InfoTypeButton = styled.button`
  color: ${({ $isSelect }) => ($isSelect ? '#72D472' : '#8B8B8B')};
  font-family: 'Wanted Sans Variable';
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 19.2px */
  display: flex;
  height: 30px;
  justify-content: center;
  align-items: center;
  border: none;
  border-bottom: ${({ $isSelect }) => ($isSelect ? '2px solid #72D472' : 'none')};
  background-color: white;
`;
const ProductImg = styled.img`
  height: 250px;
  background-color: #ece9e9;
`;
const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 12px 24px 0 24px;
  gap: 8px;
`;
const RankingBox = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px;
  width: fit-content;
  align-items: center;
  border-radius: 10px;
  background: var(--50, #f5f5f6);
  color: var(--300, #8b8b8b);
  font-family: 'Wanted Sans Variable';
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 148%; /* 20.72px */
`;
const MadeIn = styled.div`
  color: var(--900, #030303);
  font-family: 'Wanted Sans Variable';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 148%; /* 23.68px */
`;
const Price = styled.div`
  color: var(--100, #d9d9da);
  font-family: 'Wanted Sans Variable';
  font-size: 19px;
  font-style: normal;
  font-weight: 500;
  line-height: 148%; /* 28.12px */
  text-decoration-line: line-through;
`;
const DiscountBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
const DiscountRate = styled.div`
  color: #72d472;
  font-family: 'Wanted Sans Variable';
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 148%; /* 35.52px */
`;
const DiscountPrice = styled.div`
  color: var(--900, #030303);
  font-family: 'Wanted Sans Variable';
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 148%; /* 35.52px */
`;
const InfoHead = styled.div`
  display: flex;
  justify-content: space-between;
`;
const NameAndReview = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Review = styled.div`
  color: var(--700, #2e2e2e);
  font-family: 'Wanted Sans Variable';
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 148%; /* 22.2px */
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: none;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
  &:hover {
    cursor: pointer;
  }
`;
const DeliveryBox = styled.div`
  display: flex;
  gap: 24px;
`;
const DeliverySymbol = styled.div`
  color: var(--300, #8b8b8b);
  font-family: 'Wanted Sans Variable';
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 148%; /* 23.68px */
  width: 60px;
  display: flex;
  flex-shrink: 0;
`;
const DeliveryContents = styled.div`
  color: var(--700, #2e2e2e);
  font-family: 'Wanted Sans Variable';
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 148%; /* 22.2px */
  letter-spacing: -0.15px;
`;
const Recipe = styled.div`
  color: var(--800, #1a1a1a);
  font-family: 'Wanted Sans Variable';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 23.4px */
  margin: 44px 0 12px 24px;
`;
const RecipesBox = styled.div`
  display: flex;
  padding: 0 24px 0 20px;
  gap: 12px;
  overflow: auto;
  /* Chrome, Safari, Opera, Edge */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Firefox */
  scrollbar-width: none;
  /* IE, 구형 Edge */
  -ms-overflow-style: none;
`;
const RecipeCard = styled.div`
  position: relative;
  display: flex;
  height: 144px;
  width: 144px;
  border-radius: 12px;
  flex-shrink: 0;
`;
const RecipeImg = styled.img`
  height: 144px;
  width: 144px;
  border-radius: 12px;
`;
const RecipeName = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  width: 90px;
  color: white;
  font-family: 'Wanted Sans Variable';
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 148%; /* 22.2px */
`;
const RecipeBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
`;
