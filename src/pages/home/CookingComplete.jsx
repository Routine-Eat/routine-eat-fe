import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import cameraIcon from "../../assets/icons/camera2.svg";
import checkIcon from "../../assets/icons/checkRounded.svg";
import BottomFixedButton from "../../common/button/BottomFixedButton";
import { useCookingStore } from "../../hooks/useCookingStore";

const PageContainer = styled.div`
  background: #fffefd;
  max-width: 390px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 24px 120px;
`;

const Headline = styled.p`
  margin: 116px 0 0;
  color: #481c00;
  font-size: 24px;
  font-family: Wanted Sans Variable;
  font-weight: 800;
  letter-spacing: -0.24px;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 8px 0 0;
  color: #481c00;
  font-size: 22px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.22px;
  text-align: center;
`;

const PhotoCardWrap = styled.div`
  margin-top: 40px;
  width: 220px;
  border-radius: 30px;
  padding: 12px 12px 16px;
  position: relative;
  background: linear-gradient(150deg, #fff6b4 14%, #fffbe1 44%, #ffeca0 57%, #fff6b4 80%);
  box-shadow: 0px 0px 20px 0px rgba(72, 28, 0, 0.15), 0px 0px 10px 0px rgba(72, 28, 0, 0.04);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0px 0px 15px 0px white;
    pointer-events: none;
  }
`;

const PhotoBox = styled.button`
  width: 100%;
  height: 153px;
  border-radius: 26px;
  background: #f5f5f6;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 0px 5px 0px rgba(107, 56, 0, 0.08), 0px 0px 40px 0px rgba(97, 51, 0, 0.05);

  .camera-icon {
    width: 40px;
    height: 40px;
    display: block;
    margin:-30px auto 0;
  }

    .preview-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PhotoHint = styled.p`
  position: absolute;
  left: 50%;
  top: 84px;
  transform: translateX(-50%);
  margin: 0;
  color: #8b8b8b;
  font-size: 16px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.32px;
  white-space: nowrap;
`;

const DishInfo = styled.div`
  margin-top: 16px;
`;

const DishName = styled.p`
  margin: 0;
  color: #481c00;
  font-size: 20px;
  font-family: Wanted Sans Variable;
  font-weight: 700;
  letter-spacing: -0.4px;
`;

const DishMeta = styled.div`
  margin-top: 8px;
  color: #805200;
  font-size: 14px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  letter-spacing: -0.28px;
  line-height: 1.4;

  p {
    margin: 0;
    white-space: nowrap;
  }
`;

const SkipRow = styled.button`
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

    .checkbox {
    width: 24px;
    height: 24px;
    border-radius: 6px;
     background: white;
    border: 1.5px solid #d9d9da;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .checkbox img {
    width: 14px;
    height: 11px;
    display: block;
  }

  span {
    color: #8b8b8b;
    font-size: 16px;
    font-family: Wanted Sans Variable;
    font-weight: 500;
  }
`;

export default function CookingComplete() {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const [skipPhoto, setSkipPhoto] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(null);
  const fileInputRef = useRef(null);
  const setPhotoFile = useCookingStore((state) => state.setPhotoFile);

  const dishName = "꾸덕한 오징어볶음";
  const completedDate = "8월 21일";
  const comment = "정말 아름다운 오징어볶음이에요";

  const handlePhotoBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setSkipPhoto(false);
    setPhotoFile(file);
  };

  return (
    <PageContainer>
      <Headline>요리 완성!</Headline>
      <Subtitle>완성한 한 끼를 사진으로 남겨주세요</Subtitle>

      <PhotoCardWrap>
               <PhotoBox onClick={handlePhotoBoxClick}>
          {photoUrl ? (
            <img className="preview-img" src={photoUrl} alt="첨부한 사진" />
          ) : (
            <>
              <img className="camera-icon" src={cameraIcon} alt="사진 촬영" />
              <PhotoHint>클릭해 이미지 등록</PhotoHint>
            </>
          )}
        </PhotoBox>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <DishInfo>
          <DishName>{dishName}</DishName>
          <DishMeta>
            <p>{completedDate} 완성!</p>
            <p>{comment}</p>
          </DishMeta>
        </DishInfo>
      </PhotoCardWrap>

            <SkipRow $checked={skipPhoto} onClick={() => setSkipPhoto((prev) => !prev)}>
        <div className="checkbox">
          {skipPhoto && <img src={checkIcon} alt="" />}
        </div>
        <span>사진은 나중에 등록할게요</span>
      </SkipRow>

      <BottomFixedButton onClick={() => navigate(`/cooking/${mealId}/review`)}>
        완료
      </BottomFixedButton>
    </PageContainer>
  );
}