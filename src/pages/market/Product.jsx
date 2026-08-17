import ShoppingCart from '@/pages/market/ShoppingCart';
import styled from 'styled-components';


export default function Product({ imgUrl, name, price, discountRate, discountPrice }) {
  return (
    <Card>
      <Thumbnail src={imgUrl} />
      <Name>{name}</Name>
      <Price>{price.toLocaleString()}원</Price>
      <DiscountBar>
        <DiscountRate>{discountRate}%</DiscountRate>
        <DiscountPrice>{discountPrice.toLocaleString()}원</DiscountPrice>
      </DiscountBar>
      <ShoppingCart top="85px" left="115px" />
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const Thumbnail = styled.img`
  display: flex;
  height: 140px;
  width: 170px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 12px;
  background: #f2f2f2;
`;
const Name = styled.div`
  color: var(--700, #2e2e2e);
  font-family: 'Wanted Sans Variable';
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 20.8px */
`;
const Price = styled.div`
  color: var(--100, #d9d9da);
  font-family: 'Wanted Sans Variable';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 148%; /* 20.72px */
  text-decoration-line: line-through;
`;
const DiscountBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
const DiscountRate = styled.div`
  color: #ff6e42;
  font-family: 'Wanted Sans Variable';
  font-size: 19px;
  font-style: normal;
  font-weight: 600;
  line-height: 148%; /* 28.12px */
`;
const DiscountPrice = styled.div`
  color: var(--900, #030303);
  font-family: 'Wanted Sans Variable';
  font-size: 19px;
  font-style: normal;
  font-weight: 600;
  line-height: 148%; /* 28.12px */
`;
