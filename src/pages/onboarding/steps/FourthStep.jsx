import { useState } from 'react';
import styled from 'styled-components';

import plusIcon from '../../../assets/onboarding/register/plus.svg';
import sauceIcon from '../../../assets/onboarding/register/sauce.svg';
import RegisterMaterialModal from '../../../common/modal/RegisterMaterialModal';
import { IngredientIcon } from './SecondStep';

function FourthStep({ ingredients, seasonings, onSaveIngredients, onSaveSeasonings }) {
  const [modal, setModal] = useState(null); /* 'ingredient' | 'seasoning' | null */

  return (
    <Wrap>
      <Header>
        <Title>재료를 등록해주세요</Title>
        <Subtitle>수량을 입력하면 더 정확하게 추천해드려요</Subtitle>
      </Header>

      <SectionLabel>식재료</SectionLabel>
      <ChipGrid>
        {ingredients.map((item) => (
          <RegChip key={item.id} type="button">
            <IngredientIcon icon={item.icon} />
            <ChipText>{item.name}</ChipText>
            {item.qty && <QtyText>{item.qty}</QtyText>}
          </RegChip>
        ))}
        <AddChip type="button" onClick={() => setModal('ingredient')}>
          <AddIconFrame>
            <AddIcon src={plusIcon} alt="" />
          </AddIconFrame>
          <ChipText>추가</ChipText>
        </AddChip>
      </ChipGrid>

      <SectionLabel $mt>조미료</SectionLabel>
      <ChipGrid>
        {seasonings.map((item) => (
          <RegChip key={item.id} type="button">
            <SauceImg src={item.icon || sauceIcon} alt="" />
            <ChipText>{item.name}</ChipText>
          </RegChip>
        ))}
        <AddChip type="button" onClick={() => setModal('seasoning')}>
          <AddIconFrame>
            <AddIcon src={plusIcon} alt="" />
          </AddIconFrame>
          <ChipText>추가</ChipText>
        </AddChip>
      </ChipGrid>

      <RegisterMaterialModal
        type={modal === 'seasoning' ? 'seasoning' : 'ingredient'}
        open={!!modal}
        onClose={() => setModal(null)}
        onSave={(draft) => {
          if (modal === 'ingredient') onSaveIngredients(draft);
          else onSaveSeasonings(draft);
        }}
      />
    </Wrap>
  );
}

export default FourthStep;

const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 40px 20px 160px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px;
`;

const Title = styled.h1`
  margin: 0;
  width: 214px;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.48px;
  color: #030303;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  color: #bebebf;
  white-space: nowrap;
`;

const SectionLabel = styled.p`
  margin: ${({ $mt }) => ($mt ? '28px' : '24px')} 12px 12px;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  color: #8b8b8b;
`;

const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 4px;
  padding: 0 12px;
`;

const RegChip = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 15px;
  border: none;
  border-radius: 30px;
  background: #fff;
  box-shadow:
    0 0 8px rgba(3, 3, 3, 0.05),
    0 0 30px rgba(3, 3, 3, 0.05);
  cursor: default;
`;

const AddChip = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 83px;
  height: 37px;
  padding: 0 16px;
  border: none;
  border-radius: 30px;
  background: #fff;
  box-shadow:
    0 0 8px rgba(3, 3, 3, 0.05),
    0 0 30px rgba(3, 3, 3, 0.05);
  cursor: pointer;
`;

const AddIconFrame = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19px;
  height: 19px;
  flex-shrink: 0;
  overflow: hidden;
`;

const AddIcon = styled.img`
  display: block;
  width: 13.48px;
  height: 13.48px;
  object-fit: contain;
`;

const SauceImg = styled.img`
  width: 19px;
  height: 19px;
  object-fit: contain;
`;

const ChipText = styled.span`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  color: #1a1a1a;
`;

const QtyText = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #5a5a5b;
`;
