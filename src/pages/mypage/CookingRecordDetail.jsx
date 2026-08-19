import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styled from 'styled-components';

import starEmpty from '../../assets/feed/star-empty.svg';
import starFilled from '../../assets/feed/star-filled.svg';
import faceBad from '../../assets/icons/faceBad.svg';
import faceGood from '../../assets/icons/faceGood.svg';
import faceNeutral from '../../assets/icons/faceNeutral.svg';
import { getCookingRecordDetail } from '../../api/cookingRecord';
import BackButton from '../../common/button/BackButton';
import { useUserStore } from '../../hooks/useUserStore';

const DIFFICULTY_FEEDBACK = {
  1: '아주 간단해요',
  2: '간단한 편이에요',
  3: '과정이 조금 있어요',
  4: '과정이 많은 편이에요',
  5: '과정이 꽤 복잡해요',
};

const TASTE_OPTIONS = {
  1: { icon: faceBad, label: '별로예요' },
  2: { icon: faceNeutral, label: '보통이에요' },
  3: { icon: faceGood, label: '맛있어요' },
};

const parseLevel = (value) => {
  const level = Number(String(value ?? '').replace('LEVEL_', ''));
  return Number.isFinite(level) && level > 0 ? level : 0;
};

const mapTaste = (value) => {
  const level = parseLevel(value);
  if (level <= 1) return TASTE_OPTIONS[1];
  if (level === 2) return TASTE_OPTIONS[2];
  return TASTE_OPTIONS[3];
};

function CookingRecordDetail() {
  const { cookingRecordId } = useParams();
  const navigate = useNavigate();
  const { userLoginNumber } = useUserStore();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    if (!cookingRecordId || !userLoginNumber) return undefined;

    const fetchDetail = async () => {
      try {
        const response = await getCookingRecordDetail(cookingRecordId, userLoginNumber);
        setRecord(response.data ?? response);
      } catch (error) {
        console.error('요리 기록 상세 조회 실패:', error);
      }
    };

    fetchDetail();
  }, [cookingRecordId, userLoginNumber]);

  const menuLevel = parseLevel(record?.difficultyLevel);
  const userLevel = parseLevel(record?.userDifficultyLevel);
  const taste = mapTaste(record?.userTasteRating);
  const photo = record?.userCookingRecordPhotoUrl || record?.thumbnailUrl || '';

  return (
    <Page>
      <Back onClick={() => navigate(-1)} />

      <Scroll>
        <Hero>
          {photo ? <HeroImg src={photo} alt={record?.menuName ?? ''} /> : null}
        </Hero>

        <Title>{record?.menuName ?? ''}</Title>

        <Meta>
          <MetaItem>
            <Muted>시간</Muted>
            <Time>
              {record?.timeRequired != null ? `${record.timeRequired}분 소요` : ''}
            </Time>
          </MetaItem>
          <MetaItem>
            <Muted>메뉴 난이도</Muted>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} src={i < menuLevel ? starFilled : starEmpty} alt="" />
            ))}
          </MetaItem>
        </Meta>

        <Section>
          <SectionTitle>나의 평가</SectionTitle>
          <TasteRow>
            <TasteIcon src={taste.icon} alt="" />
            <TasteLabel>{taste.label}</TasteLabel>
          </TasteRow>
          <MetaItem>
            <Muted>체감 난이도</Muted>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} src={i < userLevel ? starFilled : starEmpty} alt="" />
            ))}
          </MetaItem>
          {DIFFICULTY_FEEDBACK[userLevel] ? (
            <Feedback>{DIFFICULTY_FEEDBACK[userLevel]}</Feedback>
          ) : null}
        </Section>

        {record?.cookingTip ? (
          <Section>
            <SectionTitle>요리 팁</SectionTitle>
            <Tip>{record.cookingTip}</Tip>
          </Section>
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
  height: 100%;
  background: #fffefd;
`;

const Back = styled(BackButton)`
  position: absolute;
  top: 12px;
  left: 20px;
  z-index: 2;
`;

const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 72px 24px 40px;
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
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow:
    0 0 10px 0 rgba(61, 32, 0, 0.05),
    0 0 40px 0 rgba(110, 58, 0, 0.13);
`;

const Title = styled.h1`
  margin: 20px 0 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.22px;
  color: #1a1a1a;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: center;
  margin-top: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Muted = styled.span`
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.13px;
  color: #8b8b8b;
`;

const Time = styled.span`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.13px;
  color: #c9a227;
`;

const Star = styled.img`
  display: block;
  width: 14px;
  height: 14px;
`;

const Section = styled.section`
  margin-top: 28px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.16px;
  color: #1a1a1a;
`;

const TasteRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const TasteIcon = styled.img`
  display: block;
  width: 32px;
  height: 32px;
`;

const TasteLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.16px;
  color: #1a1a1a;
`;

const Feedback = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.14px;
  color: #8b8b8b;
`;

const Tip = styled.p`
  margin: 0;
  padding: 16px;
  border-radius: 12px;
  background: #f5f5f6;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.14px;
  color: #1a1a1a;
`;
