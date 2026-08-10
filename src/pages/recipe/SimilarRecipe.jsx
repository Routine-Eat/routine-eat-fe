import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styled from 'styled-components';

import starEmpty from '../../assets/feed/star-empty.svg';
import starFilled from '../../assets/feed/star-filled.svg';
import chevronDown from '../../assets/recipe/chevron-down.svg';
import kimchi1 from '../../assets/recipe/kimchi-1.svg';
import kimchi2 from '../../assets/recipe/kimchi-2.svg';
import shoppingBag from '../../assets/recipe/shopping-bag.svg';
import startCookingIcon from '../../assets/recipe/start-cooking-icon.png';
import BackButton from '../../common/button/BackButton';
import { SIMILAR_RECIPES } from '../../constants/dummySimilarRecipes';

const SERVING_OPTIONS = ['1인분', '2인분', '3인분'];

function SimilarRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = SIMILAR_RECIPES.find((r) => r.id === id) ?? SIMILAR_RECIPES[0];
  const [serving, setServing] = useState(SERVING_OPTIONS[0]);
  const [isServingOpen, setIsServingOpen] = useState(false);
  const servingRef = useRef(null);

  useEffect(() => {
    if (!isServingOpen) return undefined;
    const onDown = (e) => {
      if (servingRef.current && !servingRef.current.contains(e.target)) {
        setIsServingOpen(false);
      }
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [isServingOpen]);

  return (
    <Page>
      {/* 뒤로가기 버튼 */}
      <PageBackBtn onClick={() => navigate(-1)} />

      <Scroll>
        {/* 히어로: 회색 라운드 박스 + 원형 음식 이미지 */}
        <Hero>
          <HeroImg src={recipe.image} alt={recipe.title} />
        </Hero>

        {/* 제목 + 시간/난이도/재료비 */}
        <TitleBlock>
          <Title>{recipe.title}</Title>
          <MetaRow>
            <MetaGroup>
              <MetaLabel>시간</MetaLabel>
              <TimeValue>{recipe.time}</TimeValue>
            </MetaGroup>
            <MetaGroup>
              <MetaLabel>난이도</MetaLabel>
              <Stars>
                {Array.from({ length: 5 }, (_, i) => (
                  <StarImg key={i} src={i < recipe.difficulty ? starFilled : starEmpty} alt="" />
                ))}
              </Stars>
            </MetaGroup>
            <MetaGroup>
              <MetaLabel>재료비</MetaLabel>
              <MetaLabel>{recipe.cost}</MetaLabel>
            </MetaGroup>
          </MetaRow>
        </TitleBlock>

        {/* + 추가 재료 섹션 */}
        <ExtraTitle>+ 추가 재료</ExtraTitle>
        <ExtraChip>
          <KimchiIcon aria-hidden>
            <KimchiLayer src={kimchi1} alt="" />
            <KimchiLayer src={kimchi2} alt="" />
          </KimchiIcon>
          <ExtraName>{recipe.extraIngredients[0]?.name}</ExtraName>
          <ExtraAmount>{recipe.extraIngredients[0]?.amount}</ExtraAmount>
        </ExtraChip>

        {/* 장보기 목록에 추가 버튼 */}
        <CartBtn type="button" onClick={() => navigate('/shopping-list')}>
          <CartIcon src={shoppingBag} alt="" />
          장보기 목록에 추가
        </CartBtn>

        {/* 재료 섹션 */}
        <Section>
          <SectionHead>
            <SectionTitle>재료</SectionTitle>
            <ServingWrap ref={servingRef}>
              <ServingBtn
                type="button"
                aria-expanded={isServingOpen}
                onClick={() => setIsServingOpen((v) => !v)}
              >
                {serving}
                <ChevronWrap>
                  <ChevronImg src={chevronDown} alt="" $open={isServingOpen} />
                </ChevronWrap>
              </ServingBtn>
              {isServingOpen && (
                <ServingMenu role="listbox">
                  {SERVING_OPTIONS.map((option) => (
                    <ServingOption
                      key={option}
                      type="button"
                      $active={serving === option}
                      onClick={() => {
                        setServing(option);
                        setIsServingOpen(false);
                      }}
                    >
                      {option}
                    </ServingOption>
                  ))}
                </ServingMenu>
              )}
            </ServingWrap>
          </SectionHead>
          <ItemList>
            {recipe.ingredients.map((item) => (
              <ItemRow key={item.name}>
                <span>{item.name}</span>
                <span>{item.amount}</span>
              </ItemRow>
            ))}
          </ItemList>
        </Section>

        <Divider />

        {/* 조미료 및 기타 */}
        <Section>
          <SectionTitle>조미료 및 기타</SectionTitle>
          <ItemList>
            {recipe.seasonings.map((item) => (
              <ItemRow key={item.name}>
                <span>{item.name}</span>
                <span>{item.amount}</span>
              </ItemRow>
            ))}
          </ItemList>
        </Section>
      </Scroll>

      {/* 하단 고정 CTA 영역 */}
      <Footer>
        <StartBtn type="button">
          <StartIcon src={startCookingIcon} alt="" />
          요리 시작하기
        </StartBtn>
      </Footer>
    </Page>
  );
}

/* 페이지 전체 래퍼 */
const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fffdfc;
`;

/* 스크롤 가능한 본문 */
const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 48px 24px 140px;
`;

/* 좌상단 뒤로가기 — 피그마 1034:2764 y60 x24 */
const PageBackBtn = styled(BackButton)`
  position: absolute;
  top: 60px;
  left: 24px;
  z-index: 2;
`;

/* 히어로 회색 라운드 박스 */
const Hero = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 164px;
  margin-top: 42px;
  border-radius: 15px;
  background: #f1f1f1;
  overflow: hidden;
`;

/* 히어로 안 원형 음식 사진 */
const HeroImg = styled.img`
  width: 139px;
  height: 140px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow:
    0 0 10px 0 rgba(61, 32, 0, 0.05),
    0 0 40px 0 rgba(110, 58, 0, 0.13);
`;

/* 제목·메타 묶음 */
const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

/* 요리 제목 텍스트 */
const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  color: #212020;
`;

/* 시간·난이도·재료비 한 줄 */
const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

/* 메타 한 묶음 */
const MetaGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* 메타 회색 라벨 */
const MetaLabel = styled.span`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  color: #8b8b8b;
  white-space: nowrap;
`;

/* 소요시간 초록 텍스트 */
const TimeValue = styled.span`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  color: #72d472;
  white-space: nowrap;
`;

/* 난이도 별 줄 */
const Stars = styled.div`
  display: flex;
`;

/* 별 아이콘 */
const StarImg = styled.img`
  width: 15px;
  height: 15px;
`;

/* "+ 추가 재료" 제목 */
const ExtraTitle = styled.h2`
  margin: 24px 0 12px;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.2;
  color: #2e2e2e;
`;

/* 추가 재료 칩(흰 라운드 카드) */
const ExtraChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  border-radius: 30px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(3, 3, 3, 0.03),
    0 0 40px 0 rgba(3, 3, 3, 0.05);
`;

/* 김치 아이콘 프레임 */
const KimchiIcon = styled.span`
  position: relative;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

/* 김치 아이콘 레이어 */
const KimchiLayer = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

/* 추가 재료 이름 */
const ExtraName = styled.span`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.14px;
  color: #2a2a2a;
`;

/* 추가 재료 분량 */
const ExtraAmount = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #a9a9a9;
`;

/* 장보기 목록에 추가 버튼(연두) */
const CartBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 44px;
  margin-top: 16px;
  border: none;
  border-radius: 10px;
  background: #d6f3a1;
  box-shadow:
    0 2px 20px 0 rgba(0, 0, 0, 0.08),
    inset 0 0 4px 0 #fff;
  font-size: 16px;
  font-weight: 600;
  color: #444;
  cursor: pointer;
`;

/* 장바구니 아이콘 */
const CartIcon = styled.img`
  width: 18px;
  height: 18px;
`;

/* 재료/조미료 섹션 */
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
`;

/* 섹션 헤더(제목 + 인분) */
const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/* 섹션 제목 */
const SectionTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.2;
  color: #2e2e2e;
`;

/* 인분 선택 래퍼 */
const ServingWrap = styled.div`
  position: relative;
`;

/* 인분 트리거 칩 */
const ServingBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 25px;
  border: none;
  border-radius: 5px;
  background: #ebebeb;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #2e2e2e;
  cursor: pointer;
`;

/* 화살표 8×4 영역 */
const ChevronWrap = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8px;
  height: 4px;
  overflow: hidden;
`;

/* 화살표 이미지(우측→아래/위 회전) */
const ChevronImg = styled.img`
  width: 4px;
  height: 8px;
  transform: rotate(${({ $open }) => ($open ? '-90deg' : '90deg')});
`;

/* 인분 드롭다운 메뉴 */
const ServingMenu = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  box-sizing: border-box;
  width: 65px;
  height: 115px;
  padding: 16px 0;
  border-radius: 5px;
  background: #ebebeb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

/* 인분 옵션 */
const ServingOption = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ $active }) => ($active ? '#2e2e2e' : '#8b8b8b')};
  cursor: pointer;
`;

/* 재료 리스트 */
const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* 재료 한 줄 */
const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
  color: #8b8b8b;
`;

/* 재료/조미료 구분선 */
const Divider = styled.hr`
  margin: 20px 0 0;
  border: none;
  border-top: 0.5px solid #e5e5e5;
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

/* 요리 시작하기 초록 버튼 */
const StartBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 47px;
  border: none;
  border-radius: 10px;
  background: #72d472;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
`;

/* 요리 시작하기 아이콘(포크·나이프 원형) */
const StartIcon = styled.img`
  width: 21px;
  height: 21px;
  flex-shrink: 0;
  object-fit: contain;
`;

export default SimilarRecipe;
