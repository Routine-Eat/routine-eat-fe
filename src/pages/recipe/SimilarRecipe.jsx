import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styled from 'styled-components';

import heartEmpty from '../../assets/feed/heart-empty.svg';
import heartFilled from '../../assets/feed/heart-filled.svg';
import starEmpty from '../../assets/feed/star-empty.svg';
import starFilled from '../../assets/feed/star-filled.svg';
import chevronDown from '../../assets/recipe/chevron-down.svg';
import kimchiOuter from '../../assets/recipe/kimchi-1.svg';
import kimchiInner from '../../assets/recipe/kimchi-2.svg';
import bagIcon from '../../assets/recipe/shopping-bag.svg';
import BackButton from '../../common/button/BackButton';
import { SIMILAR_RECIPES } from '../../constants/dummySimilarRecipes';
import { addItemsToShopping } from '../../store/shoppingStore';
import CookStartModal from './CookStartModal';

const SERVINGS = ['1인분', '2인분', '3인분'];

function SimilarRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = SIMILAR_RECIPES.find((r) => r.id === id) ?? SIMILAR_RECIPES[0];
  const [list, setList] = useState(SIMILAR_RECIPES);
  const [serving, setServing] = useState(SERVINGS[0]);
  const [open, setOpen] = useState(false);
  const [cookOpen, setCookOpen] = useState(false);
  const servingRef = useRef(null);
  const others = list.filter((r) => r.id !== recipe.id);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (!servingRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  return (
    // 페이지 루트 — 세로 full 사각
    <Page>
      {/* 원형 뒤로가기 버튼 */}
      <Back onClick={() => navigate(-1)} />

      {/* 스크롤 본문 — 세로 컬럼 */}
      <Scroll>
        {/* 히어로 — 둥근 회색 사각 + 원형 음식 */}
        <Hero>
          <HeroImg src={recipe.image} alt={recipe.title} />
        </Hero>

        {/* 제목 행 — 제목 + 인분 칩 */}
        <TitleRow>
          <Title>{recipe.title}</Title>
          <ServingWrap ref={servingRef}>
            <ServingBtn type="button" onClick={() => setOpen((v) => !v)}>
              {serving}
              <Chevron src={chevronDown} alt="" $open={open} />
            </ServingBtn>
            {open && (
              <ServingMenu>
                {SERVINGS.map((opt) => (
                  <ServingOpt
                    key={opt}
                    type="button"
                    $on={serving === opt}
                    onClick={() => {
                      setServing(opt);
                      setOpen(false);
                    }}
                  >
                    {opt}
                  </ServingOpt>
                ))}
              </ServingMenu>
            )}
          </ServingWrap>
        </TitleRow>

        {/* 메타 — 시간·난이도·재료비·활용률 */}
        <Meta>
          <MetaItem>
            <Muted>시간</Muted>
            <Time>{recipe.time}</Time>
          </MetaItem>
          <MetaItem>
            <Muted>난이도</Muted>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} src={i < recipe.difficulty ? starFilled : starEmpty} alt="" />
            ))}
          </MetaItem>
          <MetaItem>
            <Muted>재료비</Muted>
            <Muted>{recipe.cost}</Muted>
          </MetaItem>
          <Muted>{recipe.utilization}</Muted>
        </Meta>

        {/* 추가 재료 — 제목 + 칩 + 장보기 버튼 */}
        <Extra>
          <ExtraTitle>+ 필요한 추가 재료</ExtraTitle>
          <ExtraChips>
            {recipe.extraIngredients.map((item) => (
              <ExtraChip key={item.name}>
                {/* 아이콘 20×20 — 피그마 1353:6425 (바깥 컵 + 안쪽 내용) */}
                <IconBox aria-hidden>
                  <IconSlot $inset="6.25% 7.85%">
                    <IconImg src={kimchiOuter} alt="" />
                  </IconSlot>
                  <IconSlot $inset="21.39% 18.3% 14.2% 19.07%">
                    <IconImg src={kimchiInner} alt="" />
                  </IconSlot>
                </IconBox>
                <ExtraName>{item.name}</ExtraName>
                <ExtraAmt>{item.amount}</ExtraAmt>
              </ExtraChip>
            ))}
          </ExtraChips>
          <BagBtn
            type="button"
            onClick={() => {
              addItemsToShopping(recipe.title, recipe.extraIngredients);
              navigate('/shopping-list');
            }}
          >
            <BagIcon src={bagIcon} alt="" />
            장보기 목록에 추가
          </BagBtn>
        </Extra>

        {/* 식재료·조미료 카드 */}
        <Boxes>
          <Box>
            <BoxTitle>식재료</BoxTitle>
            <Rows>
              {recipe.ingredients.map((item) => (
                <Row key={item.name}>
                  <span>{item.name}</span>
                  <span>{item.amount}</span>
                </Row>
              ))}
            </Rows>
          </Box>
          <Box>
            <BoxTitle>조미료</BoxTitle>
            <Rows>
              {recipe.seasonings.map((item) => (
                <Row key={item.name}>
                  <span>{item.name}</span>
                  <span>{item.amount}</span>
                </Row>
              ))}
            </Rows>
          </Box>
        </Boxes>

        {/* 유사 요리 — 제목 + 가로 스크롤 */}
        <SimilarTitle>이 레시피 재료와 유사한 요리</SimilarTitle>
        <SimilarRow>
          {others.map((item) => (
            <SimilarCard key={item.id} onClick={() => navigate(`/similar-recipes/${item.id}`)}>
              <Thumb>
                <Heart
                  type="button"
                  aria-label="저장"
                  onClick={(e) => {
                    e.stopPropagation();
                    setList((prev) =>
                      prev.map((s) => (s.id === item.id ? { ...s, isSaved: !s.isSaved } : s))
                    );
                  }}
                >
                  <HeartImg src={item.isSaved ? heartFilled : heartEmpty} alt="" />
                </Heart>
              </Thumb>
              <SimilarName>{item.title}</SimilarName>
              <SimilarExtra>{item.extra}</SimilarExtra>
            </SimilarCard>
          ))}
        </SimilarRow>
      </Scroll>

      {/* 하단 고정 바 — 상단 둥근 흰 사각 + CTA */}
      <Footer>
        <StartBtn type="button" onClick={() => setCookOpen(true)}>
          요리 시작하기
        </StartBtn>
      </Footer>

      <CookStartModal
        title={recipe.title}
        open={cookOpen}
        onClose={() => setCookOpen(false)}
        onStart={() => setCookOpen(false)}
      />
    </Page>
  );
}

export default SimilarRecipe;

/* —— 페이지 루트: 세로 full 사각 —— */
const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fffefd;
`;

/* —— 원형 뒤로가기: 좌상단 —— */
const Back = styled(BackButton)`
  position: absolute;
  top: 12px;
  left: 20px;
  z-index: 2;
`;

/* —— 스크롤 본문: 세로 컬럼 —— */
const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 72px 24px 132px;
`;

/* —— 히어로: 둥근 회색 사각(15) —— */
const Hero = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 164px;
  overflow: hidden;
  border-radius: 15px;
  background: #f5f5f6;
`;

/* —— 히어로 안 원형 음식 사진 —— */
const HeroImg = styled.img`
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow:
    0 0 10px 0 rgba(61, 32, 0, 0.05),
    0 0 40px 0 rgba(110, 58, 0, 0.13);
`;

/* —— 제목 행: 가로 space-between —— */
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  padding-right: 4px;
`;

/* —— 레시피 제목 텍스트 —— */
const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.22px;
  color: #1a1a1a;
`;

/* —— 인분 드롭다운 래퍼 —— */
const ServingWrap = styled.div`
  position: relative;
  flex-shrink: 0;
  width: fit-content;
`;

/* —— 인분 칩: 둥근 회색 사각(5) —— */
const ServingBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-sizing: border-box;
  height: 28px;
  padding: 4px 9px 4px 12px;
  border: none;
  border-radius: 5px;
  background: #f5f5f6;
  font-size: 14px;
  font-weight: 600;
  color: #2e2e2e;
  white-space: nowrap;
  cursor: pointer;
`;

/* —— 쉐브론: 작은 화살표 —— */
const Chevron = styled.img`
  width: 4px;
  height: 8px;
  transform: rotate(${({ $open }) => ($open ? '-90deg' : '90deg')});
`;

/* —— 인분 메뉴: 접힌 칩과 동일 가로, 세로 115 —— */
const ServingMenu = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 115px;
  padding: 16px 0;
  overflow: hidden;
  border-radius: 5px;
  background: #f5f5f6;
`;

/* —— 인분 옵션 텍스트 버튼 —— */
const ServingOpt = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: ${({ $on }) => ($on ? 600 : 500)};
  line-height: 1.2;
  color: ${({ $on }) => ($on ? '#2e2e2e' : '#8b8b8b')};
  cursor: pointer;
`;

/* —— 메타 줄: 가로 줄바꿈 —— */
const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: center;
  margin-top: 12px;
`;

/* —— 메타 한 묶음 —— */
const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* —— 회색 메타 텍스트 —— */
const Muted = styled.span`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.15px;
  color: #8b8b8b;
  white-space: nowrap;
`;

/* —— 소요시간: 금색 텍스트(피그마 sub-brand/400) —— */
const Time = styled.span`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  color: #997000;
  white-space: nowrap;
`;

/* —— 별 아이콘 15×15 —— */
const Star = styled.img`
  width: 15px;
  height: 15px;
`;

/* —— 추가 재료 블록 —— */
const Extra = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 40px;
`;

/* —— 추가 재료 제목 —— */
const ExtraTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  color: #2e2e2e;
`;

/* —— 추가 재료 칩 줄: 한 줄에 최대 3개 —— */
const ExtraChips = styled.div`
  display: grid;
  grid-template-columns: repeat(3, max-content);
  gap: 12px 8px;
  justify-content: start;
`;

/* —— 추가 재료 칩: 흰 pill —— */
const ExtraChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 8px;
  border-radius: 30px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(3, 3, 3, 0.03),
    0 0 40px 0 rgba(3, 3, 3, 0.05);
`;

/* —— 아이콘 박스: 20×20 사각 (피그마 1353:6425) —— */
const IconBox = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  overflow: hidden;
`;

/* —— 아이콘 슬롯: 피그마 inset 영역 —— */
const IconSlot = styled.span`
  position: absolute;
  inset: ${({ $inset }) => $inset};
`;

/* —— 아이콘 벡터 이미지: 슬롯을 채움 —— */
const IconImg = styled.img`
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
`;

/* —— 추가 재료명 —— */
const ExtraName = styled.span`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  color: #444;
`;

/* —— 추가 재료 분량 —— */
const ExtraAmt = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #bebebf;
`;

/* —— 장보기 버튼: 연두 둥근 사각(10) —— */
const BagBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 10px;
  background: #d6f3a1;
  box-shadow: inset 0 0 4px 0 #fff;
  font-size: 15px;
  font-weight: 600;
  color: #2e2e2e;
  cursor: pointer;
`;

/* —— 장보기 아이콘 18×18 —— */
const BagIcon = styled.img`
  width: 18px;
  height: 18px;
`;

/* —— 재료 카드 묶음 —— */
const Boxes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 36px;
`;

/* —— 재료 카드: 둥근 회색 사각(20) —— */
const Box = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 24px;
  border-radius: 20px;
  background: #f5f5f6;
`;

/* —— 카드 제목 —— */
const BoxTitle = styled.h2`
  margin: 0;
  padding: 0 12px 0 8px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  color: #444;
`;

/* —— 재료 행 리스트 —— */
const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px 0 8px;
`;

/* —— 재료 한 줄 —— */
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
  color: #8b8b8b;
`;

/* —— 유사 요리 제목 —— */
const SimilarTitle = styled.h2`
  margin: 36px 0 12px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.18px;
  color: #030303;
`;

/* —— 유사 요리 가로 스크롤 —— */
const SimilarRow = styled.div`
  display: flex;
  gap: 8px;
  margin-right: -24px;
  padding-right: 24px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/* —— 유사 카드: 세로 124폭 —— */
const SimilarCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 0 0 124px;
  width: 124px;
  cursor: pointer;
`;

/* —— 유사 썸네일: 둥근 회색 사각(10) —— */
const Thumb = styled.div`
  position: relative;
  width: 124px;
  height: 104px;
  border-radius: 10px;
  background: #f1f1f1;
`;

/* —— 하트 버튼 —— */
const Heart = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

/* —— 하트 아이콘 —— */
const HeartImg = styled.img`
  width: 16px;
  height: 14px;
`;

/* —— 유사 요리명 —— */
const SimilarName = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  color: #2e2e2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* —— 유사 추가재료 —— */
const SimilarExtra = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #bebebf;
`;

/* —— 하단 바: 상단만 둥근 흰 사각 —— */
const Footer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  height: 108px;
  padding: 24px 21px 0;
  border-radius: 22px 22px 0 0;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(3, 3, 3, 0.06),
    0 0 40px 0 rgba(3, 3, 3, 0.08);
`;

/* —— 요리 시작 CTA: 노란 둥근 사각(12) —— */
const StartBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 348px;
  height: 52px;
  border: none;
  border-radius: 12px;
  background: #f4bf4c;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.18px;
  color: #fff;
  cursor: pointer;
`;
