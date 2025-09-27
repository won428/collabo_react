import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Container, Form, Table } from "react-bootstrap";

function App({user}){
	const {id} = useParams();
	const [cartList, setCartList] = useState([]);
	const thStyle = {fontSize: '1.2rem'} // 테이블 헤더 스타일

	useEffect(()=>{
		const url = `${API_BASE_URL}/cart/list`

		axios
			.get(url)
			.then((response)=>{

			})
			.catch((error)=>{

			})

	},[]);

	/* rem은 'xxrem' 이면 기준이되는 폰트 사이즈에 xx만큼 곱한 숫자를 폰트사이즈로 지정한다. */
	return(
			<Container className="mt-4">
				<h2 className="mb-4">
					<span style={{color:'blue', fontSize:'2rem'}}>{user?.name}</span>
					<span style={{fontSize:'1.3rem'}}>님의 장바구니</span>
				</h2>
				<Table striped bordered>
					<thead>
						<tr>
						<th style={thStyle}>
							<Form.Check
								type="checkbox"
								label="전체 선택"
								onChange={``}
							/>

						</th>
						<th style={thStyle}>상품 정보</th>
						<th style={thStyle}>수량</th>
						<th style={thStyle}>금액</th>
						<th style={thStyle}>삭제</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>xx</td>
						</tr>
					</tbody>
				</Table>
				{/* 좌측 정렬(text-start), 가운데 정렬(text-center), 우측 정렬(text-end) */}
				<h3 className="text-end mt-3">총 주문금액 : 0원</h3>
				<div className="text-end mt-3">
					<Button variant="primary" size="lg" onClick={``}>
						주문하기
					</Button>
				</div>
			</Container>
		);
}

export default App;