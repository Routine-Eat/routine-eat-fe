import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
width: 348px;
height: 48px;
border-radius: 10px;
background: #96D960;
border: none;
color: white;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 600;
cursor: pointer;
margin-top: auto;
`;

export default function BottomNextButton({ onClick, children = "다음" }) {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
}