import { useState } from 'react';
import styled from 'styled-components';

import PillButton from '@/common/PillButton';

import RegisterMaterialModal from '../../../common/modal/RegisterMaterialModal';

function FourthStep({ ingredients, seasonings, onSaveIngredients, onSaveSeasonings }) {
  const [modal, setModal] = useState(null); /* 'ingredient' | 'seasoning' | null */

  return (
    <Wrap>
      <Header>
        <Title>집에 있는 재료를 등록해주세요</Title>
        <Subtitle>하나만 알려줘도 지금 만들기 좋은 요리를 찾아요.</Subtitle>
      </Header>

      <SectionLabel>식재료</SectionLabel>
      <ChipGrid>
        {ingredients.map((item) => (
          <PillButton
            key={item.id}
            kind="INGREDIENT"
            detailType={item.type}
            name={item.name}
            amountValue={item.qty}
          />
        ))}
        <PillButton kind="ETC" name="추가" onClick={() => setModal('ingredient')} />
      </ChipGrid>

      <SectionLabel $mt>조미료</SectionLabel>
      <ChipGrid>
        {seasonings.map((item) => (
          <PillButton
            key={item.id}
            kind="INGREDIENT"
            detailType={item.type || 'SEASONING'}
            name={item.name}
          />
        ))}
        <PillButton kind="ETC" name="추가" onClick={() => setModal('seasoning')} />
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
  padding: 40px 20px 16px;
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
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.48px;
  color: #030303;
  white-space: nowrap;
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
