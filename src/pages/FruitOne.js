import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import { Table } from "react-bootstrap";

// axios 라이브러리를 이용하여 리액트에서 스프링으로 데이터를 요청해야 합니다.
function App(){
    const [fruit, setFruit] = useState({});
   
	useEffect(()=>{// BackEnd 서버에서 데이터 읽어오기
		const url = `${API_BASE_URL}/fruit`; // 요청할 url 주소

		axios.get(url,{}).then((response)=> {
			console.log('응답 받은 데이터');
			console.log(response.data);
			setFruit(response.data);
			})
	}, []);
	
    return(
			<>
				<Table hover style={{margin: '5px'}}>
					<tbody>
						<tr>
							<td>아이디</td>
							<td>{fruit.id}</td>
						</tr>
						<tr>
							<td>상품명</td>
							<td>{fruit.name}</td>
						</tr>
						<tr>
							<td>단가</td>
							<td>{Number(fruit.price).toLocaleString()}원</td>
						</tr>
					</tbody>
				</Table>
			</>
		);
} 

export default App;