import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import cameraIcon from "../../assets/icons/camera.svg";
import checkIcon from "../../assets/icons/checkRounded.svg";
import BottomNextButton from "../../common/button/BottomNextButton";

const PageContainer = styled.div`
background: #e4e4e4;
max-width: 390px;
margin: 0 auto;
min-height: 100vh;
position: relative;
display: flex;
flex-direction: column;
align-items: center;
padding: 102px 20px 24px;
overflow: hidden;
`;

const Title = styled.p`
margin: 0;
color: #000;
font-size: 24px;
font-family: Pretendard Variable;
font-weight: 600;
line-height: 1.48;
text-align: center;
`;

const SubtitleGroup = styled.div`
margin-top: 50px;
text-align: center;
`;

const Headline = styled.p`
margin: 0;
color: #000;
font-size: 24px;
font-family: Pretendard Variable;
font-weight: 600;
line-height: 1.48;
`;

const Description = styled.div`
margin-top: 20px;
color: #7d7d7d;
font-size: 18px;
font-family: Pretendard Variable;
font-weight: 600;
line-height: 1.48;

p{
margin: 0;
}
`;

const PhotoSection = styled.div`
margin-top: 40px;
display: flex;
flex-direction: column;
align-items: center;
`;

const PhotoLabel = styled.p`
margin: 0 0 8px;
color: #000;
font-size: 20px;
font-family: Pretendard Variable;
font-weight: 600;
`;

const CameraButton = styled.button`
width: 106px;
height: 87px;
border-radius: 21px;
background: white;
border: none;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;

img{
width: 66px;
height: 66px;
}
`;

const NoPhotoRow = styled.div`
margin-top: 24px;
display: flex;
align-items: center;
justify-content: center;
gap: 8px;
cursor: pointer;

span{
color: #000;
font-size: 20px;
font-family: Pretendard Variable;
font-weight: 600;
}

.check-box{
width: 32px;
height: 32px;
border-radius: 5px;
background: white;
display: flex;
align-items: center;
justify-content: center;
}

img{
width: 20px;
height: 15px;
}
`;

export default function CookingComplete() {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const [skipPhoto, setSkipPhoto] = useState(true);

  return (
    <PageContainer>
      <Title>요리 완성!!</Title>

      <SubtitleGroup>
        <Headline>완성한 한 끼를 남겨볼까요?</Headline>
        <Description>
          <p>레시피 후기를 남기면</p>
          <p>더 좋은 레시피를 추천해드릴게요.</p>
        </Description>
      </SubtitleGroup>

      <PhotoSection>
        <PhotoLabel>사진 촬영</PhotoLabel>
        <CameraButton>
          <img src={cameraIcon} alt="사진 촬영" />
        </CameraButton>
      </PhotoSection>

      <NoPhotoRow onClick={() => setSkipPhoto((prev) => !prev)}>
        <span>사진 없이 완료</span>
        <div className="check-box">
          {skipPhoto && <img src={checkIcon} alt="선택됨" />}
        </div>
      </NoPhotoRow>

      <BottomNextButton onClick={() => navigate(`/cooking/${mealId}/review`)} />
    </PageContainer>
  );
}