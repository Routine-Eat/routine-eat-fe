import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styled from 'styled-components';

import starEmpty from '../../assets/feed/star-empty.svg';
import starFilled from '../../assets/feed/star-filled.svg';
import heartEmpty from '../../assets/icons/HeartEmpty.svg';
import heartFilled from '../../assets/icons/HeartFilled.svg';
import chevronDown from '../../assets/recipe/chevron-down.svg';
import startCookingIcon from '../../assets/recipe/start-cooking-icon.png';
import BackButton from '../../common/button/BackButton';
import { RECIPE_INGREDIENTS, RECIPE_SEASONINGS } from '../../constants/dummyRecipeDetail';
import { DUMMY_RECIPES } from '../../constants/dummyRecipes';
import { SIMILAR_RECIPES } from '../../constants/dummySimilarRecipes';

const SERVING_OPTIONS = ['1인분', '2인분', '3인분'];

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = DUMMY_RECIPES.find((r) => r.id === id) ?? DUMMY_RECIPES[0];
  const costLabel = recipe.cost.replace(/^예상 재료비\s*/, '');
  const [similar, setSimilar] = useState(SIMILAR_RECIPES);
  const [serving, setServing] = useState(SERVING_OPTIONS[0]);
  const [isServingOpen, setIsServingOpen] = useState(false);
  const servingRef = useRef(null);

  const toggleSimilarSave = (itemId) => {
    setSimilar((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isSaved: !item.isSaved } : item))
    );
  };

  const openSimilar = (itemId) => {
    navigate(`/similar-recipes/${itemId}`);
  };

  useEffect(() => {
    if (!isServingOpen) return undefined;

    const handlePointerDown = (event) => {
      if (servingRef.current && !servingRef.current.contains(event.target)) {
        setIsServingOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isServingOpen]);

  return (
    <Page>
      {/* 뒤로가기 */}
      <PageBackBtn onClick={() => navigate(-1)} />

      <Scroll>
        {/* 히어로 이미지 영역 */}
        <Hero>
          <HeroImg src={recipe.image} alt={recipe.title} />
        </Hero>

        {/* 제목·메타 */}
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
              <MetaLabel>{costLabel}</MetaLabel>
            </MetaGroup>
          </MetaRow>
        </TitleBlock>

        {/* 재료 섹션 */}
        <Section>
          <SectionHead>
            <SectionTitle>재료</SectionTitle>
            <ServingWrap ref={servingRef}>
              <ServingBtn
                type="button"
                aria-expanded={isServingOpen}
                aria-haspopup="listbox"
                onClick={() => setIsServingOpen((prev) => !prev)}
              >
                {serving}
                <ServingChevronWrap>
                  <ServingChevron src={chevronDown} alt="" $open={isServingOpen} />
                </ServingChevronWrap>
              </ServingBtn>
              {isServingOpen && (
                <ServingMenu role="listbox" aria-label="인분 선택">
                  {SERVING_OPTIONS.map((option) => (
                    <ServingOption
                      key={option}
                      type="button"
                      role="option"
                      aria-selected={serving === option}
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
            {RECIPE_INGREDIENTS.map((item) => (
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
            {RECIPE_SEASONINGS.map((item) => (
              <ItemRow key={item.name}>
                <span>{item.name}</span>
                <span>{item.amount}</span>
              </ItemRow>
            ))}
          </ItemList>
        </Section>

        {/* 유사 요리 */}
        <SimilarTitle>이 레시피 재료와 유사한 요리</SimilarTitle>
        <SimilarRow>
          {similar.map((item) => (
            <SimilarCard key={item.id} onClick={() => openSimilar(item.id)}>
              <SimilarThumb>
                <HeartBtn
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSimilarSave(item.id);
                  }}
                  aria-label="저장"
                >
                  <HeartImg src={item.isSaved ? heartFilled : heartEmpty} alt="" />
                </HeartBtn>
              </SimilarThumb>
              <SimilarName>{item.title}</SimilarName>
              <SimilarExtra>{item.extra}</SimilarExtra>
            </SimilarCard>
          ))}
        </SimilarRow>
      </Scroll>

      {/* 하단 CTA */}
      <Footer>
        <StartBtn type="button">
          <StartIcon src={startCookingIcon} alt="" />
          요리 시작하기
        </StartBtn>
      </Footer>
    </Page>
  );
}

/* 상세 페이지 전체 */
const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fffdfc;
`;

/* 스크롤 본문 */
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

/* 히어로(회색 라운드 + 음식 이미지) */
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

/* 히어로 안 원형 음식 이미지 */
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

/* 레시피 제목 */
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

/* 메타 한 묶음(라벨+값) */
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

/* 소요 시간(초록) */
const TimeValue = styled.span`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  color: #3eb745;
  white-space: nowrap;
`;

/* 난이도 별 줄 */
const Stars = styled.div`
  display: flex;
  align-items: center;
`;

/* 별 아이콘 */
const StarImg = styled.img`
  width: 15px;
  height: 15px;
`;

/* 재료/조미료 섹션 */
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

/* 섹션 헤더(제목 + 인분 선택) */
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

/* 인분 드롭다운 트리거 칩 */
const ServingBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  border-radius: 5px;
  background: #ebebeb;
  padding: 4px 8px 4px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #2e2e2e;
  cursor: pointer;
`;

/* 인분 칩 화살표 영역 — 피그마 8×4 */
const ServingChevronWrap = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8px;
  height: 4px;
  overflow: hidden;
`;

/* 인분 칩 화살표(우측 화살표를 90° 회전해 아래/위) */
const ServingChevron = styled.img`
  width: 4px;
  height: 8px;
  transform: rotate(${({ $open }) => ($open ? '-90deg' : '90deg')});
  transition: transform 0.15s ease;
`;

/* 인분 드롭다운 메뉴 — 피그마 65×115 */
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

/* 인분 옵션 버튼 */
const ServingOption = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  line-height: 1.2;
  color: ${({ $active }) => ($active ? '#2e2e2e' : '#8b8b8b')};
  white-space: nowrap;
  cursor: pointer;
`;

/* 재료/조미료 리스트 */
const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* 재료 한 줄(이름 | 분량) */
const ItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  color: #8b8b8b;
`;

/* 재료/조미료 구분선 */
const Divider = styled.hr`
  margin: 24px 0 0;
  border: none;
  border-top: 0.5px solid #e5e5e5;
`;

/* 유사 요리 섹션 제목 */
const SimilarTitle = styled.h2`
  margin: 48px 0 12px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  color: #030303;
`;

/* 유사 요리 가로 스크롤 — 우측으로 넘쳐 스크롤 */
const SimilarRow = styled.div`
  display: flex;
  gap: 4px;
  margin-right: -24px;
  padding-right: 24px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/* 유사 요리 카드 */
const SimilarCard = styled.article`
  flex: 0 0 111px;
  width: 111px;
  cursor: pointer;
`;

/* 유사 요리 썸네일(회색 박스) */
const SimilarThumb = styled.div`
  position: relative;
  width: 111px;
  height: 91px;
  border-radius: 12px;
  background: #ededed;
`;

/* 유사 요리 하트 버튼 */
const HeartBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

/* 유사 요리 하트 아이콘 */
const HeartImg = styled.img`
  width: 14px;
  height: 12px;
`;

/* 유사 요리 이름 */
const SimilarName = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  color: #2e2e2e;
  white-space: nowrap;
`;

/* 유사 요리 추가재료 */
const SimilarExtra = styled.p`
  margin: 2px 0 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #bebebf;
`;

/* 하단 고정 CTA 영역 */
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
  box-shadow:
    0 0 10px 0 rgba(3, 3, 3, 0.03),
    0 0 40px 0 rgba(3, 3, 3, 0.05);
`;

/* 요리 시작하기 버튼 */
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

export default RecipeDetail;
