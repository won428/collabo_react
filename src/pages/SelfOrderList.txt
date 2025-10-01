import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { useParams } from "react-router-dom";

function App({user}){

const [orderList, setOrderList] = useState([]);
const {id} = useParams();

useEffect(()=>{
	const url = `${API_BASE_URL}/order/list/${id}`
	
	axios
		.get(url)
		.then((response)=>{
		setOrderList(response.data)

		console.log(response.data)
		
		})
		.catch((error)=>{
			console.log(error);
			alert('주문 목록을 불러오지 못했습니다.')
		})
},[])



	
	return(
		<Container>
			<Table>
				<thead>
					<tr>
						<td>주문 번호</td>
						<td>주문 상품</td>
						<td>개수</td>
						<td>주문 금액</td>
					</tr>
				</thead>
				<tbody>
					
				</tbody>
			</Table>
		</Container>
		);
}

export default App;