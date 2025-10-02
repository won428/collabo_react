import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useNavigate } from "react-router-dom";

function App({user}){
	
	// loading이 true이면 현재 데이터를 읽고 있는 중입니다.
	const [loading, setLoading] = useState(true);
	
	// 오류 정보를 저장할 스테이트
	const [error, setError] = useState('');

	// 주문 목록을을 저장할 스테이트
	const [orders, setOrders] = useState([]);

	const navigate = useNavigate();


	// 다음의 hook은 사용자 정보 user가 변경될 때마다 rendering 됩니다.
	useEffect(()=>{
		if(!user){
			setError('로그인이 필요합니다.');
			setLoading(false);
		}

		// 스프링 부트의 OrderController의 getOrderList() 메소드 참조
		const fetchOrders = async () =>{
			try {
				const url = `${API_BASE_URL}/order/list`;
				// get 방식은 파라미터를 넘길 때, params라는 키를 사용하여 넘겨야 합니다.
				// 여기서 role은 관리자 유무를 판단하기 위하여 넘겨줍니다.
				const parameters = {
					params:{
						memberId: user.id,
						role: user.role
					}
					
				};
				const response = await axios.get(url, parameters);
				
				if(user.role === 'ADMIN'){
					setOrders(response.data.filter((oreder)=>oreder.status==='PENDING'));
				}else{
					setOrders(response.data)
				}
				
				 

			} catch (error) {
				setError('주문 목록을 불러 오는데 실패하였습니다.');
			}finally{
				setLoading(false);
			}
		}

		// 함수 호출
		fetchOrders();
	},[user]);
	
	// 관리자를 위한 컴포넌트, 함수

	

	const makeAdminButton = (bean) => {
		if(user?.role !== "ADMIN" && user?.role !== "USER"){
			return null;
		}
		 // if (!["ADMIN", "USER"].includes(user?.role)) return null;

		// 완료 버튼을 클릭하여 PENDING 상태를 COMPLETED 상태로 변경합니다.
		const changeStatus = async (newStatus) => {
			try {
				const url = `${API_BASE_URL}/order/update/status/${bean.orderId}?status=${newStatus}`;
				await axios.put(url);

				alert(`주문 번호${bean.orderId}의 주문 상태가 ${newStatus}으로 변경이 되었습니다.`)

				// COMPLETED 모드로 변경되고 나면, 화면에 보이지 않습니다. >> 추후에 화면에 나타나지만 status 별로 분류해서 보여주는 방식으로 수정
				setOrders((previous)=>
				previous.filter((order)=> order.orderId !== bean.orderId)
			);
			} catch (error) {
				console.log(error);
				alert('주문을 처리하지 못했습니다.');
			}

		};

		// '취소' 버튼을 클릭하여 대기 상태인 주문 내역을 취소합니다.
		const orderCancel = async () => {
			try {
				const url = `${API_BASE_URL}/order/delete/${bean.orderId}`;
				await axios.delete(url);

				alert(`주문 번호${bean.orderId}의 주문이 취소 되었습니다.`)

				setOrders((previous)=>
				previous.filter((order)=> order.orderId !== bean.orderId)
			);
			} catch (error) {
				console.log(error);
				alert('주문을 취소하지 못했습니다.');
			}
		}
		return(
			<div  className="d-flex justify-content-end" style={{padding:"10px"}}>
				{/* 완료 버튼은 관리자만 볼 수 있습니다. */}
				{user?.role === 'ADMIN' && (
					<Button
					variant="success"
					size="sm"
					className="me-2"
					onClick={() => changeStatus('COMPLETED')}
                >
                    완료
                </Button>
				)}
				
				<Button
					variant="danger"
					size="sm"
					className="me-2"
					onClick={()=>orderCancel()}
				>
					취소
				</Button>
			</div>
		);
	};
	
	if(loading){
		return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">주문 목록을 불러오는 중입니다.</span>
                </Spinner>
            </div>
        );
	}
	if(error){
		 return (
            <Container className="my-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
	}
	

	return(
			<Container className="my-4">
				<h1 className="my-4">주문 내역</h1>
				{orders.length === 0 ? (
					<Alert variant="secondary">주문 내역이 없습니다.</Alert>	
				) : (
					<Row> 
						{orders.map((bean)=>(
							<Col key={bean.orderId} md={12} className="mb-4">
								<Card className="h-100 shadow-sm">
									<Card.Body>
										<div className="d-flex justify-content-between">
											<Card.Title>주문 번호 : {bean.orderId}</Card.Title>
											<small className="text-muted">{bean.orderdate}</small>
										</div>
									</Card.Body>
									<ul style={{paddingLeft: "30px"}}>
									{bean.orderItems.map((item, index)=>(
										<li key={index}>{item.productName} {item.quantity}개</li>
									))}
									</ul>
									<Card.Text style={{padding: "10px"}}>
										상태 : <strong>{bean.status}</strong>
									</Card.Text>
									{/* 관리자 전용 버튼 생성 */}
									{makeAdminButton(bean)}
								</Card>
								
							</Col>
						))}
						
					</Row>
				)}
			</Container>
		);
}

export default App;