import { useEffect, useState } from 'react';

import styled from 'styled-components';

import clockIconUrl from '@/assets/market/clockIcon.svg';
import ShoppingCart from '@/pages/market/ShoppingCart';
import { useNavigate } from 'react-router-dom';

function getTimeLeft(targetDate) {
  if (!targetDate) return { hours: '00', minutes: '00', seconds: '00', isEnded: true };

  const diff = +new Date(targetDate) - +new Date();

  if (diff <= 0) {
    return { hours: '00', minutes: '00', seconds: '00', isEnded: true };
  }

  const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
  const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

  return { hours, minutes, seconds, isEnded: false };
}

export default function TimeSaleProduct({ id,imgUrl, name, price, discountRate, discountPrice, targetDate }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));
  const navigate=useNavigate();
  useEffect(() => {
    // 1초(1000ms)마다 남아있는 시간 재계산
    const timer = setInterval(() => {
      const remaining = getTimeLeft(targetDate);
      setTimeLeft(remaining);

      // 시간이 다 되면 타이머 멈춤
      if (remaining.isEnded) {
        clearInterval(timer);
      }
    }, 1000);

    // 컴포넌트 언마운트 시 메모리 누수 방지 (타이머 해제)
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <Card onClick={()=>navigate(`/market/product/${id}`)}>
      <Thumbnail src={imgUrl} />
      <InfoBox>
        <Time>
          <img src={clockIconUrl} />
          {`${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}
        </Time>
        <Name>{name}</Name>
        <Price>{price.toLocaleString()}원</Price>
        <DiscountBar>
          <DiscountRate>{discountRate}%</DiscountRate>
          <DiscountPrice>{discountPrice.toLocaleString()}원</DiscountPrice>
        </DiscountBar>
        <Ment>{timeLeft.isEnded ? '타임세일이 종료되었습니다.' : '이 시간에만 이 가격으로!'}</Ment>
      </InfoBox>
      <ShoppingCart top="95px" left="120px" />
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  position: relative;
  gap: 12px;
  margin-left: 20px;
`;
const Thumbnail = styled.img`
  display: flex;
  width: 170px;
  height: 147px;
  justify-content: flex-end;
  align-items: center;
  border-radius: 12px;
  background: #f2f2f2;
`;
const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Time = styled.div`
  display: flex;
  width: 87px;
  height: 23px;
  padding: 3px 0;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background: var(--50, #f5f5f6);
  color: var(--300, #8b8b8b);
  font-family: 'Wanted Sans Variable';
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 148%; /* 19.24px */
  align-items: center;
  gap: 4px;
`;
const Name = styled.div`
  color: var(--700, #2e2e2e);
  font-family: 'Wanted Sans Variable';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 23.4px */
`;
const Price = styled.div`
  color: var(--100, #d9d9da);
  font-family: 'Wanted Sans Variable';
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 148%; /* 22.2px */
  text-decoration-line: line-through;
`;
const DiscountBar = styled.div`
  display: flex;
  gap: 10px;
`;
const DiscountRate = styled.div`
  color: #ff6e42;
  font-family: 'Wanted Sans Variable';
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 148%; /* 29.6px */
`;
const DiscountPrice = styled.div`
  color: var(--900, #030303);
  font-family: 'Wanted Sans Variable';
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 148%; /* 29.6px */
`;
const Ment = styled.div`
  color: var(--300, #8b8b8b);
  font-family: 'Wanted Sans Variable';
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 148%; /* 22.2px */
`;
