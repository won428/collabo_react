import axios from "axios";

import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Image, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../config/config";

function App({ user }) {
    const thStyle = { fontSize: '1.2rem' }; // 테이블 헤더 스타일

    // 보여 주고자하는 `카트 상품` 배열 정보
    const [cartProducts, setCartProducts] = useState([]);

    // 화면에 보여 주는 주문 총 금액을 위한 스테이트
    const [orderTotalPrice, setOrderTotalPrice] = useState(0);

    const navigate = useNavigate();

    // 사용자의 정보가 바뀔 때 화면을 렌더링해주어야 합니다.
    // user?.id : Optional Chaining(물음표를 적어 주면 오류가 발생하지 않고 undefined를 반환해 줍니다.)
    // 즉, 오류 화면을 보여 주지 않고 아무런 일이 없었다는 듯이 동작함
    useEffect(() => {
        if (user && user?.id) {
            fetchCartProducts();
        }
    }, [user]);

    // 특정 고객이 장바구니에 담은 `카트 상품` 목록을 조회합니다.
    const fetchCartProducts = async () => {
        try {
            const url = `${API_BASE_URL}/cart/list/${user.id}`;
            const response = await axios.get(url);
            console.log('카트 상품 조회 결과');
            console.log(response.data);

            setCartProducts(response.data || []);
            if(cartProducts.length < 0){
            alert(`'카트 상품' 정보가 존재하지 않아서 상품 목록 페이지로 이동합니다.`);
            navigate('/product/list');
            }
            

        } catch (error) {
            console.log('오류 정보');
            console.log(error);
            alert(`'카트 상품' 정보가 존재하지 않아서 상품 목록 페이지로 이동합니다.`);
            navigate('/product/list');
        }
    };

    // `전체 선택` 체크 박스를 Toggle 했습니다.
    const toggleAllCheckBox = (isAllCheck) => {
        // isAllCheck : `전체 선택` 체크 박스의 boolean 값
        setCartProducts((previous) => {
            // 모든 객체(카트 상품)들의 나머지 속성은 보존하고, 체크 상태(checked)를 
            // `전체 선택` 체크 상태와 동일하게 설정합니다.
            const updatedProducts = previous.map((product) => ({
                ...product,
                checked: isAllCheck
            }));

            // 비동기적 렌더링 문제로 수정된 updatedProducts 항목을 매개 변수로 넘겨야 정상적으로 동작합니다.
            refreshOrderTotalPrice(updatedProducts);

            return updatedProducts;
        });
    };

    // 체크 박스의 상태가 Toggle될 때 마다, 전체 요금을 다시 재계산하는 함수입니다.
    const refreshOrderTotalPrice = (products) => {
        let total = 0; // 총 금액 변수

        products.forEach((bean) => {
            if (bean.checked) { // 선택된 체크 박스에 대하여
                total += bean.price * bean.quantity; // 총 금액 누적
            }
        });

        setOrderTotalPrice(total); // State 업데이트
    };

    // 개별 체크 박스를 클릭하였습니다.
    const toggleCheckBox = (cartProductId) => {
        console.log(`카트 상품 아이디 : ${cartProductId}`);

        setCartProducts((previous) => {
            // !product.checked는 체크 상태를 toggle 시키는 역할을 합니다.
            const updatedProducts = previous.map((product) =>
                product.cartProductId === cartProductId
                    ? { ...product, checked: !product.checked }
                    : product
            );

            refreshOrderTotalPrice(updatedProducts);
            return updatedProducts;
        });
    };

    // 카트 상품 목록에서 특정 상품의 구매 수량을 변경하였습니다.
    const changeQuantity = async (cartProductId, quantity) => {
        // NaN : Not A Number
        if (isNaN(quantity)) { // 숫자 형식이 아니면
            // 값을 0으로 변경한 다음, 함수를 반환하도록 합니다.
            setCartProducts((previous) => {
                previous.map((product) =>
                    product.cartProductId === cartProductId
                        ? { ...product, quantity: 0 }
                        : product
                );
            });

            alert('변경 수량은 최소 1이상이어야 합니다.');
            return;
        }

        try {
            // 사용 예시 : 100번 항목을 10개로 수정해주세요.
            // http://localhost:9000/cart/edit/100?quantity=10
            const url = `${API_BASE_URL}/cart/edit/${cartProductId}?quantity=${quantity}`;

            // patch 동작은 전체가 아닌 일부 데이터를 변경하고자 할때 사용됩니다.
            // 스프링의 WebConfig 클래스안의 addCorsMappings() 메소드를 참조하시길 바랍니다.
            const response = await axios.patch(url,{},{withCredentials:true});

            console.log(response.data || '');

            // cartProducts의 수량 정보를 갱신합니다.
            setCartProducts((previous) => {
                const updatedProducts = previous.map((product) =>
                    product.cartProductId === cartProductId
                        ? { ...product, quantity: quantity }
                        : product
                );

                refreshOrderTotalPrice(updatedProducts);
                return updatedProducts;
            });

        } catch (error) {
            console.log('카트 상품 수량 변경 실패');
            console.log(error);
        }
    };

    // 선택된 카트 상품 아이디를 이요하여 해당 품목을 목록에서 배제 합니다.
    const deleteCartProduct = async (cartProductId) => {
        const isConfiremed = window.confirm('해당 카트 상품을 정말로 삭제하시겠습니까?')

        if(isConfiremed){
            console.log('삭제할 카트 상품 아이디 : ' + cartProductId);
            try {
                const url = `${API_BASE_URL}/cart/delete/${cartProductId}`;
                const response = await axios.delete(url);

                // 카트 상품 목록을 갱신하고, 요금을 다시 계산합니다.
                setCartProducts((previous)=>{
                    const updatedProducts = previous.filter((bean)=> bean.cartProductId !== cartProductId);

                    refreshOrderTotalPrice(updatedProducts);
                    return updatedProducts
                })
                
                alert(response.data);
                
            } catch (error) {
                console.log('카트 상품 삭제 동작 오류');
                console.log(error)
            }
        }else{
            alert('"카트 상품" 삭제를 취소하셨습니다.')
        }
    }

    // 사용자가 '주문하기' 버튼을 클릭하였습니다.
    const makeOrder = async () => {
        // 체크 박스가 on 상태인 것만 필터링합니다.
        const selectedProducts = cartProducts.filter((bean)=> bean.checked);

        if(selectedProducts.length === 0){
            alert('주문할 상품을 선택해 주세요.')
            return ;
        }
        
        try {
            const url = `${API_BASE_URL}/order`;
            // 스프링 부트의 OrderDto, OrderItemDto 클래스와 연관이 있습니다.
            // 주의) parameters 작성시 key의 이름은 OrderDto의 변수 이름과 동일하게 작성해야 합니다.
            const parameters = {
                memberId: user.id,
                status: 'PENDING',
                orderItems: selectedProducts.map((product)=>({
                    cartProductId: product.cartProductId,
                    productId: product.productId,
                    quantity: product.quantity
                }))
            };
            
            console.log('주문할 데이터 정보')
            console.log(parameters);

            const response = await axios.post(url, parameters) ;
            alert(response.data)

            // 방금 주문한 품목은 이제 장바구니 목록에서 제거되어야 합니다.
            setCartProducts((previous)=> // state로 관리하는 가장 최근 값을 previous라는 이름으로 참조해서 사용
                previous.filter((product)=> !product.checked)
            )

            setOrderTotalPrice(0)// 총 주문 금액 초기화
            
        } catch (error) {
            console.log('주문 기능 실패');
            console.log(error);
        };
        
        
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">
                {/* xxrem은 주위 글꼴의 xx배를 의미합니다. */}
                <span style={{ color: 'blue', fontSize: '2rem' }}>{user?.name}</span>
                <span style={{ fontSize: '1.3rem' }}>님의 장바구니</span>
            </h2>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th style={{ ...thStyle, width: '30%' }}>
                            {/* `전체 선택` 체크 박스의 체크 상태(boolean)를 toggleAllCheckBox 함수에 전달 */}
                            <Form.Check
                                type="checkbox"
                                label="전체 선택"
                                onChange={(event) => toggleAllCheckBox(event.target.checked)}
                            />
                        </th>
                        <th style={thStyle}>상품 정보</th>
                        <th style={thStyle}>수량</th>
                        <th style={thStyle}>금액</th>
                        <th style={thStyle}>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {cartProducts.length > 0 ? (
                        cartProducts.map((product) => (
                            <tr key={product.cartProductId}>
                                <td className="text-center align-middle">
                                    {/* 어떤 체크인지 식별하기 위하여 toggleCheckBox 함수에 cartProductId를 넘기도록 합니다. */}
                                    <Form.Check
                                        type="checkbox"
                                        checked={product.checked}
                                        style={{ transform: "scale(1.4)", cursor: "pointer" }}
                                        onChange={() => toggleCheckBox(product.cartProductId)}
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    <Row> {/* 좌측 4칸은 이미지 영역, 우측 8칸은 상품 이름 영역 */}
                                        <Col xs={4}>
                                            <Image
                                                src={`${API_BASE_URL}/images/${product.image}`}
                                                thumbnail
                                                alt={product.name}
                                                width={`80`}
                                                height={`80`}
                                            />
                                        </Col>
                                        <Col xs={8} className="d-flex align-items-center">
                                            {product.name}
                                        </Col>
                                    </Row>
                                </td>
                                <td className="text-center align-middle">
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        value={product.quantity}
                                        onChange={(event) =>
                                            changeQuantity(
                                                product.cartProductId,
                                                parseInt(event.target.value)
                                            )}
                                        style={{ width: '80px', margin: '0 auto' }}
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    {(product.price * product.quantity).toLocaleString()} 원
                                </td>
                                <td className="text-center align-middle">
                                    <Button variant="danger" size="sm"
                                        onClick={()=>deleteCartProduct(product.cartProductId)}
                                    >
                                        삭제
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={5}>장바구니가 비어 있습니다.</td></tr>
                    )}
                </tbody>
            </Table>

            {/* 좌측 정렬(text-start), 가운데 정렬(text-center), 우측 정렬(text-end) */}
            <h3 className="text-end mt-3">총 주문 금액 : {orderTotalPrice.toLocaleString()}원</h3>
            <div className="text-end">
                <Button variant="primary" size="lg" onClick={makeOrder}>
                    주문하기
                </Button>
            </div>
        </Container>
    );
}

export default App;