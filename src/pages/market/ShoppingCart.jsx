import styled from 'styled-components';
import CartIconUrl from "@/assets/market/shoppingCartIcon.svg"

export function ShoppingCart({top,left}) {
    return(
        <Circle $top={top} $left={left}>
            <CartIcon src={CartIconUrl}/>
        </Circle>
    )
}

const Circle = styled.div`
  display: flex;
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({$left})=>$left};
  height: 46px;
  padding: 8px;
  align-items: flex-start;
  gap: 10px;
  border-radius: 23px;
  background: rgba(0, 0, 0, 0.25);
`;
const CartIcon=styled.img`
    
`
