import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styled from 'styled-components';

import heartEmpty from '../../assets/feed/heart-empty.svg';
import heartFilled from '../../assets/feed/heart-filled.svg';
import starEmpty from '../../assets/feed/star-empty.svg';
import starFilled from '../../assets/feed/star-filled.svg';
import chevronDown from '../../assets/recipe/chevron-down.svg';
import bagIcon from '../../assets/recipe/shopping-bag.svg';
import { deleteFavoriteRecipe, postFavoriteRecipe } from '../../api/favoriteRecipe';
import { getCanCookRecipe, getRecipeDetail } from '../../api/recipe';
import BackButton from '../../common/button/BackButton';
import { useUserStore } from '../../hooks/useUserStore';
import { addItemsToShopping } from '../../store/shoppingStore';
import CookStartModal from './CookStartModal';
import { EMPTY_RECIPE, mapRecipeDetail } from './mapRecipeDetail';

const SERVINGS = ['1인분', '2인분', '3인분'];

const pickMissingIngredientNames = (payload = {}) => {
  const list =
    payload.missingFoodIngredients ??
    payload.missingIngredients ??
    payload.lackingFoodIngredients ??
    [];

  return (Array.isArray(list) ? list : [])
    .map((item) =>
      typeof item === 'string' ? item : item?.name ?? item?.foodIngredientName ?? ''
    )
    .filter(Boolean);
};

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userLoginNumber } = useUserStore();
  const [recipe, setRecipe] = useState(EMPTY_RECIPE);
  const [similar, setSimilar] = useState([]);
  const [serving, setServing] = useState(SERVINGS[0]);
  const [open, setOpen] = useState(false);
  const [cookOpen, setCookOpen] = useState(false);
  const [canCook, setCanCook] = useState(true);
  const [missingIngredients, setMissingIngredients] = useState([]);
  const servingRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (!servingRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  useEffect(() => {
    if (!id || !userLoginNumber) return undefined;

    const fetchRecipeDetail = async () => {
      try {
        const response = await getRecipeDetail(id, {
          userNumber: userLoginNumber,
          servings: Number.parseInt(serving, 10) || 1,
        });
        const mapped = mapRecipeDetail(response.data ?? response);
        setRecipe(mapped);
        setSimilar(mapped.similar);
      } catch (error) {
        console.error('레시피 상세 조회 실패:', error);
      }
    };

    fetchRecipeDetail();
  }, [id, userLoginNumber, serving]);

  const handleStartCooking = async () => {
    if (!id || !userLoginNumber) {
      console.error('사용자 정보가 없습니다.');
      return;
    }

    try {
      const response = await getCanCookRecipe(id, {
        userNumber: userLoginNumber,
        servings: Number.parseInt(serving, 10) || 1,
      });
      const payload = response.data ?? response;
      setCanCook(Boolean(payload.canCook));
      setMissingIngredients(pickMissingIngredientNames(payload));
      setCookOpen(true);
    } catch (error) {
      console.error('요리 가능 여부 조회 실패:', error);
    }
  };

  return (
    // 페이지 루트 — 세로 full 사각
    <Page>
      {/* 원형 뒤로가기 버튼 */}
      <Back onClick={() => navigate(-1)} />

      {/* 스크롤 본문 — 세로 컬럼 */}
      <Scroll>
        {/* 히어로 — 둥근 회색 사각 + 음식 이미지 */}
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

        {/* 메타 — 시간·난이도·재료비·활용률 줄바꿈 가로 */}
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

        {/* 식재료·조미료 카드 묶음 */}
        <Boxes>
          <Box>
            <BoxTitle>식재료</BoxTitle>
            <Rows>
              {recipe.ingredients.map((item) => (
                <Row key={item.id ?? item.name}>
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
                <Row key={item.id ?? item.name}>
                  <span>{item.name}</span>
                  <span>{item.amount}</span>
                </Row>
              ))}
            </Rows>
          </Box>
        </Boxes>

        {/* 추천 재료 — 제목 + 칩 + 장보기 버튼 */}
        <Tips>
          <TipsTitle>이런 재료가 있으면 더 맛있어져요</TipsTitle>
          <Chips>
            {recipe.additionalIngredients.map((item) => (
              <Chip key={item.id ?? item.name}>{item.name}</Chip>
            ))}
          </Chips>
          <BagBtn
            type="button"
            onClick={() => {
              addItemsToShopping(recipe.title, recipe.additionalIngredients);
              navigate('/shopping-list');
            }}
          >
            <BagIcon src={bagIcon} alt="" />
            장보기 목록에 추가
          </BagBtn>
        </Tips>

        {/* 유사 요리 — 제목 + 가로 스크롤 카드 */}
        <SimilarTitle>이 레시피 재료와 유사한 요리</SimilarTitle>
        <SimilarRow>
          {similar.map((item) => (
            <SimilarCard key={item.id} onClick={() => navigate(`/similar-recipes/${item.id}`)}>
              <Thumb>
                <Heart
                  type="button"
                  aria-label="저장"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!userLoginNumber) {
                      console.error('사용자 정보가 없습니다.');
                      return;
                    }

                    if (item.isSaved) {
                      try {
                        await deleteFavoriteRecipe(item.id, userLoginNumber);
                        setSimilar((prev) =>
                          prev.map((s) => (s.id === item.id ? { ...s, isSaved: false } : s))
                        );
                      } catch (error) {
                        console.error('레시피 찜 해제 실패:', error);
                      }
                      return;
                    }

                    try {
                      await postFavoriteRecipe(item.id, userLoginNumber);
                      setSimilar((prev) =>
                        prev.map((s) => (s.id === item.id ? { ...s, isSaved: true } : s))
                      );
                    } catch (error) {
                      if (error.response?.status === 409) {
                        setSimilar((prev) =>
                          prev.map((s) => (s.id === item.id ? { ...s, isSaved: true } : s))
                        );
                        return;
                      }
                      console.error('레시피 찜 등록 실패:', error);
                    }
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

      {/* 하단 고정 바 — 둥근 상단 흰 사각 + CTA */}
      <Footer>
        <StartBtn type="button" onClick={handleStartCooking}>
          요리 시작하기
        </StartBtn>
      </Footer>

      <CookStartModal
        title={recipe.title}
        open={cookOpen}
        canCook={canCook}
        missingIngredients={missingIngredients}
        onClose={() => setCookOpen(false)}
        onStart={() => {
          setCookOpen(false);
          navigate(`/cooking/${id}`);
        }}
      />
    </Page>
  );
}

export default RecipeDetail;

/* —— 페이지 루트: 세로 full 사각 —— */
const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fffefd;
`;

/* —— 원형 뒤로가기: 좌상단 절대 배치 —— */
const Back = styled(BackButton)`
  position: absolute;
  top: 30px;
  left: 20px;
  z-index: 2;
`;

/* —— 스크롤 본문: 세로 컬럼 —— */
const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 95px 24px 132px;
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

/* —— 히어로 안 음식 사진: 원형에 가까운 사각 —— */
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

/* —— 인분 드롭다운 래퍼: 접힌 칩 너비 기준 —— */
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

/* —— 쉐브론: 작은 화살표(회전) —— */
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

/* —— 인분 옵션: 중앙 정렬 텍스트 버튼 —— */
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
  white-space: nowrap;
  cursor: pointer;
`;

/* —— 메타 줄: 가로 줄바꿈 래퍼 —— */
const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: center;
  margin-top: 12px;
`;

/* —— 메타 한 묶음: 가로 —— */
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

/* —— 별 아이콘: 15×15 사각 —— */
const Star = styled.img`
  width: 15px;
  height: 15px;
`;

/* —— 재료 카드 묶음: 세로 갭 —— */
const Boxes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 40px;
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

/* —— 카드 제목 텍스트 —— */
const BoxTitle = styled.h2`
  margin: 0;
  padding: 0 12px 0 8px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  color: #444;
`;

/* —— 재료 행 리스트: 세로 —— */
const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px 0 8px;
`;

/* —— 재료 한 줄: 이름|분량 가로 —— */
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
  color: #8b8b8b;
`;

/* —— 추천 재료 블록: 세로 —— */
const Tips = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 44px;
`;

/* —— 추천 제목 텍스트 —— */
const TipsTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.18px;
  color: #030303;
`;

/* —— 칩 가로 줄 —— */
const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

/* —— 추천 칩: 둥근 회색 사각(8) —— */
const Chip = styled.span`
  display: flex;
  align-items: center;
  height: 36px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f5f5f6;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  color: #727272;
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
  font-size: 16px;
  font-weight: 600;
  color: #2e2e2e;
  cursor: pointer;
`;

/* —— 장보기 아이콘: 18×18 —— */
const BagIcon = styled.img`
  width: 18px;
  height: 18px;
`;

/* —— 유사 요리 제목 —— */
const SimilarTitle = styled.h2`
  margin: 44px 0 12px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.18px;
  color: #030303;
`;

/* —— 유사 요리 가로 스크롤 트랙 —— */
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

/* —— 하트 버튼: 우상단 —— */
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

/* —— 유사 추가재료 텍스트 —— */
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
  background: #fffefd;
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
  background: #96D960;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.18px;
  color: #fff;
  cursor: pointer;
`;
