import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
/*
step 01
상품 목록을 상품 아이디가 역순으로 들어가있는 리스트형태의 데이터를 받아 읽어서 화면에 전체를 보여줍니다.
하나의 행에 3개의 열(Row)씩 보여줍니다.
필드 검색과 페이징 기능은 구현하지 않았습니다.
*/



function App({user}){
	// 스프링에서 넘겨 받은 상품 목록
	const [product, setProduct] = useState([]);
	
	// 스프링 부트에 "상품 목록"을 요청하기
	useEffect(()=>{
		const url = `${API_BASE_URL}/product/list`
		axios
			.get(url, {})
			.then((response)=>{
				console.log('응답 받은 데이터')
				console.log(response.data)
				setProduct(response.data);
			})
			.catch((error)=>{
				console.log(error)
			});
	},[]);


	return(
			<Container className="my-4">
				<h1 className="my-4">상품 목록 페이지</h1>
				
				{/* 필드 검색 영역 */}
				
				{/* 자료 보여주는 영역 */}
				<Row>
					{/* products는 상품 배열, item은 상품 1개를 의미 */}
					{product.map((item)=>(
						<Col key={item.id} md={4} className="mb-4">
							<Card className="h-100" style={{cursor:'pointer'}}>
								<Card.Img
									variant=""
									src = {`${API_BASE_URL}/images/${item.image}`}
									alt = {item.name}
									style={{width: '100%', height: '200px'}}
								/>
								<Card.Body>
									<Card.Title>{item.name}({item.id})</Card.Title>
									<Card.Text>가격 : {item.price.toLocaleString()}원</Card.Text>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
				{/* 페이징 처리 영역 */}
			</Container>
			
		);
}

export default App;