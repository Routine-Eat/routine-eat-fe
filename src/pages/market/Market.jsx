import { useState } from 'react';

import styled from 'styled-components';

import headerCart from '@/assets/market/header-cart.svg';
import headerHeart from '@/assets/market/header-heart.svg';
import searchIconUrl from '@/assets/market/searchIcon.svg';
import { products, saveRecipeProducts, timeSaleProduct } from '@/constants/dummyMarket';
import Product from '@/pages/market/Product';
import TimeSaleProduct from '@/pages/market/TimeSaleProduct';
import AdImgUrl from "@/assets/market/adImg.png"

const TABS = ['추천', '베스트', '단독', '세일'];

function Market() {
  const [isSelect, setIsSelect] = useState('추천');
  return (
    <Contents>
      <Header>
        <HeaderActions>
          <HeaderIcon type="button" aria-label="찜">
            <HeartIcon src={headerHeart} alt="" />
          </HeaderIcon>
          <HeaderIcon type="button" aria-label="장바구니">
            <CartIcon src={headerCart} alt="" />
          </HeaderIcon>
        </HeaderActions>
      </Header>
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
      <AdBanner src={AdImgUrl}/>
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

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  flex-shrink: 0;
  height: 62px;
  padding: 24px 20px 0;
  background: #fffefd;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderIcon = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const HeartIcon = styled.img`
  display: block;
  width: 22px;
  height: 20px;
`;

const CartIcon = styled.img`
  display: block;
  width: 30px;
  height: 30px;
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
  color: ${({ $isSelect }) => ($isSelect ? '#72D472' : '#8B8B8B')};
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
const AdBanner = styled.img`
  margin: 50px 0 50px 0;
  display: flex;
  height: 118px;
  justify-content: center;
  align-items: center;
  background: #efefef;
`;
