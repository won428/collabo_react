import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import { Table } from "react-bootstrap";

function App(){
   const [fruitList, setFruitList] = useState([]);

	useEffect(()=>{// BackEnd 서버에서 데이터 읽어오기
		const url = `${API_BASE_URL}/fruit/list`; // 요청할 url 주소

		axios.get(url,{}).then((response)=> {
			console.log('응답 받은 데이터');
			console.log(response.data);
			setFruitList(response.data);
			})
	}, []);
	
	const fruitListTable = (fruitList.map((fruit) => (
		<tr key = {fruit.id}>
			<td>{fruit.id}</td>
			<td>{fruit.name}</td>
			<td>{Number(fruit.price).toLocaleString()}원</td>
		</tr>

	)))	
	

	return(
			<>
			<Table>
			 	<thead>
					<tr>
						<th>아이디</th>
						<th>이름</th>
						<th>단가</th>
					</tr>
				</thead>
				<tbody>
					{fruitListTable}
				</tbody>	
			</Table>	
			</>
		);
}

export default App;