import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import { Table } from "react-bootstrap";

function App(){
    const [elementList, setElementList] = useState([]);

	useEffect(()=>{
		const url = `${API_BASE_URL}/bread/list`
		axios.get(url,{}).then((response)=>{
			setElementList(response.data)
		})
	},[]);

	const elementListTable = (elementList.map((bean)=>(
		<tr>
			<td>{bean.id}</td>
			<td>{bean.name}</td>
			<td>{bean.price}</td>
			<td>{bean.stock}</td>
			<td>{bean.image}</td>
			<td>{bean.category}</td>
			<td>{bean.description}</td>
		</tr>
	)));
	
	return(
			<>
			<Table>
				<thead>
					<th>아이디</th>
					<th>이름</th>
					<th>가격</th>
					<th>재고</th>
					<th>이미지</th>
					<th>카테고리</th>
					<th>상세설명</th>
				</thead>
				<tbody>
					{elementListTable}
				</tbody>
			</Table>
			</>
		);
}

export default App;