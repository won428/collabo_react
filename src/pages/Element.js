import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Table } from "react-bootstrap";

function App(){
    const [element, setElement] = useState({})
	useEffect(()=>{
		const url = `${API_BASE_URL}/bread`

		axios.get(url,{}).then((respones)=>{
			setElement(respones.data);
			
		})
	},[])
	
	return(
			<>
			<Table>
				<tbody>
					<tr>
						<td>아이디</td>
						<td>{element.id}</td>
					</tr>
					<tr>
						<td>이름</td>
						<td>{element.name}</td>
					</tr>
					<tr>
						<td>가격</td>
						<td>{element.price}</td>
					</tr>
					<tr>
						<td>재고</td>
						<td>{element.stock}</td>
					</tr>
					<tr>
						<td>이미지</td>
						<td>{element.image}</td>
					</tr>
					<tr>
						<td>카테고리</td>
						<td>{element.category}</td>
					</tr>
					<tr>
						<td>상세설명</td>
						<td>{element.description}</td>
					</tr>

				</tbody>
			</Table>
			</>
		);
}

export default App;