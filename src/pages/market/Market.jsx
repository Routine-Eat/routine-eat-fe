import { useState } from 'react';

import styled from 'styled-components';

import searchIconUrl from '@/assets/market/searchIcon.svg';
import { products, saveRecipeProducts, timeSaleProduct } from '@/constants/dummyMarket';
import Product from '@/pages/market/Product';
import TimeSaleProduct from '@/pages/market/TimeSaleProduct';

const TABS = ['추천', '베스트', '단독', '세일'];

function Market() {
  const [isSelect, setIsSelect] = useState('추천');
  return (
    <Contents>
      <SearchBar>
        <SearchIcon src={searchIconUrl} />
        <SearchInput placeholder="원하는 재료를 검색을 통해 찾아보세요" />
      </SearchBar>
      <TypeBar>
        {TABS.map((tab) => (
          <TypeButton key={tab} $isSelect={isSelect === tab} onClick={() => setIsSelect(tab)}>
            {tab}
          </TypeButton>
        ))}
      </TypeBar>
      <ProductIntro>스텝업 식단 속 메뉴 재료</ProductIntro>
      <ProductsBar>
        {products.map((p, index) => (
          <Product key={index} {...p} />
        ))}
      </ProductsBar>
      <ProductIntro>자취생 인기 만능 소스</ProductIntro>
      <TimeSaleProduct {...timeSaleProduct} />
      <AdBanner>광고 배너</AdBanner>
      <ProductIntro>저장한 레시피 속 재료</ProductIntro>
      <ProductsBar>
        {saveRecipeProducts.map((p, index) => (
          <Product key={index} {...p} />
        ))}
      </ProductsBar>
    </Contents>
  );
}

export default Market;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
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
const SearchBar = styled.div`
  display: flex;
  margin: 10px 20px 17px 20px;
  padding-left: 20px;
  height: 48px;
  box-shadow:
    0 0 8px 0 rgba(3, 3, 3, 0.05),
    0 0 10px 0 rgba(3, 3, 3, 0.05);
  border-radius: 12px;
  align-items: center;
  gap: 8px;
`;
const SearchInput = styled.input`
  width: 250px;
  border: none;
  outline: none;
  &:focus {
    border: none;
    outline: none;
  }
  &::placeholder {
    color: var(--200, #bebebf);
    font-family: 'Wanted Sans Variable';
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%; /* 19.5px */
  }
`;
const SearchIcon = styled.img`
  width: 22px;
  height: 22px;
`;
const TypeBar = styled.div`
  display: flex;
  gap: 24px;
  margin-left: 28px;
`;
const TypeButton = styled.button`
  background-color: white;
  border: none;
  padding: 1px;
  color: ${({ $isSelect }) => ($isSelect ? '#ff6127' : '#8B8B8B')};
  font-family: 'Wanted Sans Variable';
  font-size: 15px;
  font-style: normal;
  font-weight: ${({ $isSelect }) => ($isSelect ? '600' : '500')};
  line-height: 120%; /* 18px */
`;
const ProductIntro = styled.p`
  margin-left: 20px;
  color: var(--800, #1a1a1a);
  font-family: 'Wanted Sans Variable';
  font-size: 21px;
  font-style: normal;
  font-weight: 700;
  line-height: 148%; /* 31.08px */
`;
const ProductsBar = styled.div`
  gap: 20px;
  margin-bottom: 50px;
  display: flex;
  padding: 0 20px 0 20px;
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
const AdBanner = styled.div`
  margin: 50px 0 50px 0;
  display: flex;
  height: 118px;
  justify-content: center;
  align-items: center;
  background: #efefef;
  color: #000;
  text-align: center;
  font-family: 'Wanted Sans Variable';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 23.4px */
`;
