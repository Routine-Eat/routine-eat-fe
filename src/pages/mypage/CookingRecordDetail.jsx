import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import styled from 'styled-components';

import starEmpty from '../../assets/feed/star-empty.svg';
import starFilled from '../../assets/feed/star-filled.svg';
import faceBad from '../../assets/icons/faceBad.svg';
import faceGood from '../../assets/icons/faceGood.svg';
import faceNeutral from '../../assets/icons/faceNeutral.svg';
import { getCookingRecordDetail } from '../../api/cookingRecord';
import BackButton from '../../common/button/BackButton';
import { useUserStore } from '../../hooks/useUserStore';

const DIFFICULTY_OPTIONS = {
  easy: { icon: faceGood, label: '쉬웠어요' },
  normal: { icon: faceNeutral, label: '보통이었어요' },
  hard: { icon: faceBad, label: '어려웠어요' },
};

const parseLevel = (value) => {
  const level = Number(String(value ?? '').replace('LEVEL_', ''));
  return Number.isFinite(level) && level > 0 ? level : 0;
};

const mapDifficulty = (value) => {
  const level = parseLevel(value);
  if (level <= 1) return DIFFICULTY_OPTIONS.easy;
  if (level <= 3) return DIFFICULTY_OPTIONS.normal;
  return DIFFICULTY_OPTIONS.hard;
};

const formatCost = (value) => {
  const cost = Number(value);
  if (!Number.isFinite(cost)) return '';
  return `약 ${cost.toLocaleString('ko-KR')}원`;
};

function CookingRecordDetail() {
  const { cookingRecordId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userLoginNumber } = useUserStore();
  const [record, setRecord] = useState(location.state?.record ?? null);

  useEffect(() => {
    if (
      !cookingRecordId ||
      !userLoginNumber ||
      location.state?.canFetchDetail === false
    ) {
      return undefined;
    }

    const fetchDetail = async () => {
      try {
        const response = await getCookingRecordDetail(cookingRecordId, userLoginNumber);
        setRecord(response.data ?? response);
      } catch (error) {
        console.error('요리 기록 상세 조회 실패:', error);
      }
    };

    fetchDetail();
  }, [cookingRecordId, location.state?.canFetchDetail, userLoginNumber]);

  const menuLevel = parseLevel(record?.difficultyLevel);
  const userDifficulty = mapDifficulty(record?.userDifficultyLevel);
  const thumbnail = record?.thumbnailUrl || '';
  const reviewPhoto = record?.userCookingRecordPhotoUrl || '';
  const ingredientCost = formatCost(record?.foodIngredientCost ?? record?.ingredientCost);
  const cookingTip = record?.cookingTip || record?.recommendedTip || '';

  return (
    <Page>
      <Back onClick={() => navigate(-1)} />

      <Scroll>
        <Hero>
          {thumbnail ? <HeroImg src={thumbnail} alt={record?.menuName ?? ''} /> : null}
        </Hero>

        <Info>
          <Title>{record?.menuName ?? ''}</Title>
          <Meta>
            <MetaItem>
              <Muted>시간</Muted>
              <Time>
                {record?.timeRequired != null ? `${record.timeRequired}분 소요` : ''}
              </Time>
            </MetaItem>
            <MetaItem>
              <Muted>난이도</Muted>
              <Stars>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} src={i < menuLevel ? starFilled : starEmpty} alt="" />
                ))}
              </Stars>
            </MetaItem>
            {ingredientCost ? (
              <MetaItem>
                <Muted>재료비</Muted>
                <Cost>{ingredientCost}</Cost>
              </MetaItem>
            ) : null}
          </Meta>
        </Info>

        <Photo>
          {reviewPhoto ? (
            <ReviewImg src={reviewPhoto} alt={`${record?.menuName ?? '요리'} 완성 사진`} />
          ) : (
            <PhotoPlaceholder>음식 이미지</PhotoPlaceholder>
          )}
        </Photo>

        <DifficultyRow>
          <DifficultyTitle>난이도</DifficultyTitle>
          <DifficultyBadge>
            <DifficultyIcon src={userDifficulty.icon} alt="" />
            <DifficultyLabel>{userDifficulty.label}</DifficultyLabel>
          </DifficultyBadge>
        </DifficultyRow>

        {cookingTip ? (
          <Tip>
            <TipTitle>추천 Tip</TipTitle>
            <TipText>{cookingTip}</TipText>
          </Tip>
        ) : null}
      </Scroll>
    </Page>
  );
}

export default CookingRecordDetail;

const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  background: #fffdfc;
`;

const Back = styled(BackButton)`
  position: absolute;
  top: 30px;
  left: 20px;
  z-index: 2;
`;

const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 110px 24px 72px;
`;

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

const HeroImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Info = styled.div`
  margin-top: 20px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.22px;
  color: #1a1a1a;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: center;
  margin-top: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Muted = styled.span`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  color: #8b8b8b;
`;

const Time = styled.span`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  color: #997000;
`;

const Cost = styled(Muted)``;

const Stars = styled.span`
  display: flex;
  align-items: center;
`;

const Star = styled.img`
  display: block;
  width: 15px;
  height: 15px;
`;

const Photo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 183px;
  margin-top: 32px;
  overflow: hidden;
  border-radius: 20px;
  background: #f2f2f2;
`;

const ReviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoPlaceholder = styled.span`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  color: #000;
`;

const DifficultyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 22px;
`;

const DifficultyTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  color: #000;
`;

const DifficultyBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: 46px;
  background: #f5f5f6;
`;

const DifficultyIcon = styled.img`
  display: block;
  width: 28px;
  height: 28px;
`;

const DifficultyLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  color: #2e2e2e;
`;

const Tip = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
  margin-top: 17px;
  padding: 16px 25px;
  border-radius: 18px;
  background: #d6f3a1;
`;

const TipTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  color: #2e2e2e;
`;

const TipText = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  color: #2e2e2e;
`;
