import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

/* 
상품 상세 보기
전체 화면 좌우측을 1대2로 분리합니다.
왼쪽은 상품의 이미지 정보, 오른쪽은 상품의 정보 및 장바구니와 구매하기 버튼을 만듭니다.
*/
function App({user}){
	const [product, setProduct] = useState(null); // 백엔드에서 넘어온 상품 정보
	const {id} = useParams();
	// 로딩 상태를 의미하는 state로, 값이 true이면 현재 로딩 중입니다.
	const [loading, setLoading] = useState(true);
	const [quantity, setQuantity] = useState(0);
	
	const navigate = useNavigate();
	
	useEffect(()=>{
		const url = `${API_BASE_URL}/product/detail/${id}`;

		axios
			.get(url)
			.then((response)=>{
				setProduct(response.data);
				setLoading(false);
			})
			.catch((error)=>{
				console.log({error})
				alert("상품 정보를 불러 오는 중에 오류가 발생하였습니다.");
				navigate(-1); // 이전 페이지로 이동하기
			})
	},[id]);

	// 백엔드에서 정보가 넘어오지 않았을때를 대비한 코딩입니다.
	if(loading === true){
		return(
			<Container className="my-4 text-center">
				<h3>
					상품 정보를 읽어 오는 중입니다.
				</h3>
			</Container>
		);
	}

	// 상품에 대한 정보가 없는 경우를 대비한 코딩입니다.
	if(!product){
		return(
			<Container className="my-4 text-center">
				<h3>
					상품 정보를 찾을 수 없습니다.
				</h3>
			</Container>
		);
	}

	// 장바구니 관련 코딩
	// 수량 체인지 관련 이벤트 핸들서 함수 정의
	const QuantityChange = (event) => {
		// parseInt() 메소드는 정수형으로 생긴 문자열( ex) "123" )을 정수 값으로 변환해 줍니다.
		const newValue = parseInt(event.target.value)
		setQuantity(newValue);
	};

	// 사용자가 수량을 입력하고, '장바구니' 버튼을 눌렀습니다.
	const addToCart = async () => {
		if(quantity < 1){
			alert(`구매 수량은 1개 이상이어야 합니다.`); 
			return ;
		}else if(isNaN(quantity)){
			alert(`수량을 입력해주세요`)
			return ;
		}	
		//alert(`${product.name} ${quantity}개를 장바구니에 담았습니다.`)

		try{
			const url = `${API_BASE_URL}/cart/insert`;
			// 카트에 담을 내용은 회원 id, 상품 id, 수량 입니다. 이 데이터를 보내기 위해서 객체로 만들어 스프링으로 보냅니다.
			// BackEnd 영역에서 CartProductDto라는 클래스와 매치됩니다.
			const parameters = {
				memberId: user.id,
					productId: product.id,
					quantity: quantity
			};
			const response = await axios.post(url, parameters);

			alert(response.data);
			navigate('/product/list') // 상품 목록 페이지로 이동

		}catch(error){
			console.log('오류 발생 : ' + error)
			if(error.response){
				alert(error.response.data)
				console.log(error.response.data)
			}
		}
	}

	const buyNow = async () =>{
		try {
            const url = `${API_BASE_URL}/order`;
            // 스프링 부트의 OrderDto, OrderItemDto 클래스와 연관이 있습니다.
            // 주의) parameters 작성시 key의 이름은 OrderDto의 변수 이름과 동일하게 작성해야 합니다.
			// 상품 상세보기 페이지에서는 무조건 1개의 상품만 주문을 할 수 있습니다.
            if(quantity < 1){
				alert('수량을 1개 이상 선택해 주셔야 합니다.');
				return;
			}
			
			const parameters = {
                memberId: user.id,
                status: 'PENDING',
                orderItems:[{
					productId: product.id,
					quantity: quantity
				}] 
            };
            
            console.log('주문할 데이터 정보')
            console.log(parameters);

            const response = await axios.post(url, parameters) ;
            alert(response.data)
			alert(`${product.name} ${quantity}개를 주문하였습니다.`)

           navigate('/product/list') // 목록 페이지로 이동
            
        } catch (error) {
            console.log('주문 기능 실패');
            console.log(error);
        };
	}


	
	return(
			<>
				<Container className="my-4">
					<Card>
						<Card>
							<Row className="g-0">
								{/* 좌측 상품 이미지 */}
								<Col md={4}>
									<Card.Img 
										variant="top"
										src={`${API_BASE_URL}/images/${product.image}`}
										alt={`${product.name}`}
										style={{width: '100%', height:'400px'}}
									/>
								</Col>
								{/* 우측 상품 정보 및 구매 관련 버튼 */}
								<Col md={8}>
									<Card.Body>
										<Card.Title className="fs-3">
											{product.name}
										</Card.Title>
										<Table striped>
											<tbody>
												<tr>
													<td className="text-center">가격</td>
													<td>{product.price}</td>
												</tr>
												<tr>
													<td className="text-center">카테고리</td>
													<td>{product.category}</td>
												</tr>
												<tr>
													<td className="text-center">재고</td>
													<td>{product.stock}</td>
												</tr>
												<tr>
													<td className="text-center">설명</td>
													<td>{product.description}</td>
												</tr>
												<tr>
													<td className="text-center">등록일자</td>
													<td>{product.inputdate}</td>
												</tr>
											</tbody>
										</Table>
										
										{/* 구매 수량 입력란 */}
										{/* as={Row}는 렌더링시 기본값인 <div>말고 Row로 렌더링하도록 해줍니다. */}
										<Form.Group as={Row} className="mb-3 align-items-center">
											<Col xs={3} className="text-center">
												<strong>구매 수량</strong>
											</Col>
											<Col xs={5} className="text-center" >
												{/* 구매 수량은 최소 1이상으로 설정했고, user모드에 따라서 분기 코딩했습니다. */}
												<Form.Control type="number" min="1" disabled={!user} value={quantity} onChange={QuantityChange}/>
											</Col>
										</Form.Group>

										<div className="d-flex justify-content-center mt-3">
											<Button variant="primary" className="me-3 px-4" onClick={()=>{navigate("/product/list")}}>
												이전 목록
											</Button>
											<Button variant="success" className="me-3 px-4" 
												onClick={()=>{
													if(!user){
														alert('로그인이 필요한 서비스입니다.')
														return navigate('/member/login')
													}else{
														addToCart();
													}
												}}
											>
												장바구니
											</Button>
											<Button variant="danger" className="me-3 px-4" 
												onClick={()=>{
													if(!user){
														alert('로그인이 필요한 서비스입니다.')
														return navigate('/member/login')
													}else{
														buyNow();
													}
												}}
											
											>
												주문하기
											</Button>
										</div>

										{/* 버튼(이전 목록, 장바구니, 구매하기) */}

									</Card.Body>
								</Col>
							</Row>
						</Card>
					</Card>
				</Container>
			</>
		);
}

export default App;