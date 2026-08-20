 import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import cameraIcon from "../../assets/icons/camera2.svg";
import checkIcon from "../../assets/icons/checkRounded.svg";
import BottomFixedButton from "../../common/button/BottomFixedButton";
import { useCookingStore } from "../../hooks/useCookingStore";
import { useUserStore } from "../../hooks/useUserStore";
import { getRecipeDetail } from "../../api/recipe";

 // 텍스트가 박스 폭을 넘으면 넘지 않을 때까지 폰트 크기를 줄여주는 훅
 function useShrinkToFit(text, { max = 20, min = 12, step = 1 } = {}) {
   const ref = useRef(null);
   const [fontSize, setFontSize] = useState(max);

   useLayoutEffect(() => {
     const el = ref.current;
     if (!el) return;

     let size = max;
     el.style.fontSize = `${size}px`;
     el.style.whiteSpace = "nowrap";

     while (el.scrollWidth > el.clientWidth && size > min) {
       size -= step;
       el.style.fontSize = `${size}px`;
     }

     setFontSize(size);
      }, [text, max, min, step]);

   return { ref, fontSize };
 }

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

  > button:last-child {
    transition:
      transform 100ms ease,
      background-color 100ms ease,
      color 100ms ease,
      font-size 100ms ease;
    transform-origin: center;
  }

  > button:last-child:active:not(:disabled) {
    background: #36a73c;
    color: #c6f5a6;
    font-size: 17px;
    transform: translateX(-50%) scale(0.97);
  }
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
  }

 .comment {
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

    const userLoginNumber = useUserStore((state) => state.userLoginNumber);
   const [dishName, setDishName] = useState("");
   const completedDate = (() => {
       const today = new Date();
       return `${today.getMonth() + 1}월 ${today.getDate()}일`;
   })();

      // 한글 단어 끝 받침 유무에 따라 "이에요"/"예요" 선택
   const getHasBatchim = (word) => {
       if (!word) return false;
       const lastChar = word.charCodeAt(word.length - 1);
       if (lastChar < 0xac00 || lastChar > 0xd7a3) return false; // 한글 완성형 범위 밖
       return (lastChar - 0xac00) % 28 !== 0;
   };

   const comment = dishName
       ? `정말 아름다운 ${dishName}${getHasBatchim(dishName) ? "이에요" : "예요"}`
       : "";

         const dishNameFit = useShrinkToFit(dishName, { max: 20, min: 14 });
  const commentFit = useShrinkToFit(comment, { max: 14, min: 10 });

   useEffect(() => {
       if (!mealId || !userLoginNumber) return;

       getRecipeDetail(mealId, { userNumber: userLoginNumber, servings: 1 })
           .then((response) => {
               const payload = response.data ?? response;
               setDishName(payload.recipeName ?? "");
           })
           .catch((error) => console.error("레시피 이름 조회 실패:", error));
   }, [mealId, userLoginNumber]);
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
                   <DishName ref={dishNameFit.ref} style={{ fontSize: dishNameFit.fontSize, whiteSpace: "nowrap" }}>
           {dishName}
         </DishName>
         <DishMeta>
            <p>{completedDate} 완성!</p>
                     <p
             ref={commentFit.ref}
             className="comment"
             style={{ fontSize: commentFit.fontSize, whiteSpace: "nowrap" }}
           >
             {comment}
           </p>
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