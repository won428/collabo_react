import { useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Col, Container, Form, Pagination, Row } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;  
/*
step 01
상품 목록을 상품 아이디가 역순으로 들어가있는 리스트형태의 데이터를 받아 읽어서 화면에 전체를 보여줍니다.
하나의 행에 3개의 열(Row)씩 보여줍니다.
필드 검색과 페이징 기능은 구현하지 않았습니다.

step 02
사용자 정보가 'ADMIN'이면, 등록/수정/삭제 버튼이 보이게 코딩
삭제 버튼에 대한 기능 구현
*/



function App({user}){
	// 스프링에서 넘겨 받은 상품 목록
	const [product, setProduct] = useState([]);
	
	// 페이징과 관련된 state를 정의합니다.
	const [paging, setPaging] = useState({
		totalElements : 0, // 전체 데이터 개수(165개)
		pageSize : 6, // 1페이지에 보여 주는 데이터 개수(6개)
		totalPages : 0, // 전체 페이지 개수(28페이지)
		pageNumber : 0, // 현재 페이지 번호(20페이지)
		pageCount : 10, // 페이지 하단 버튼의 개수(10개)
		beginPage : 0, // 페이징 시작 번호
		endPage : 0, // 페이징 끝 번호
		pagingStatus :'', // "pageNumber/ totalPages 페이지"
		// 자바의 searchDto 연관 필드(field)
		searchDateType: 'all', // 기간 검색 콤보 박스
		category:'', // 검색하고자 하는 특정 카테고리 콤보 박스
		searchMode: '', // 상품 검색 모드 콤보박스_상품 이름(name) 또는 상품 설명(description)
		searchKeyword:'', // 검색 키워드 입력 상자
	});

	
	// 스프링 부트에 "상품 목록"을 요청하기
	useEffect(()=>{
		const url = `${API_BASE_URL}/product/list`
		const parameters = {
			params:{
			pageNumber: paging.pageNumber,
			pageSize: paging.pageSize,
			searchDateType: paging.searchDateType, 
			category: paging.category,
			searchMode: paging.searchMode,
			searchKeyword: paging.searchKeyword		
			},
			withCredentials: true
		};
		axios
			.get(url, parameters)
			.then((response)=>{
				console.log('응답 받은 데이터')
				console.log(response.data.content)
				setProduct(response.data.content||[]);

				// 사용자가 Paginagtion 항목을 클릭하였으므로, 페이징 정보를 업데이트 해줍니다.
				// 주의) 0base이므로 코드 작성에 유의해서 작성하도록 합니다.
				setPaging((previous)=>{
					const totalElements = response.data.totalElements;
					const totalPages =response.data.totalPages;
					const pageNumber = response.data.pageable.pageNumber;
					// 만약 pageSize의 값이 고정적이라면 할당 받지 않아도 됩니다.
					// 단, 가변적인 경우 반드시 할당 받아야합니다.
					const pageSize = response.data.pageable.pageSize;

					//const pageCount = 10 ; // 고정값으로 진행

					
					const beginPage = Math.floor(pageNumber/ previous.pageCount )* previous.pageCount;
					const endPage = Math.min(beginPage + previous.pageCount -1, totalPages -1);

					// 주의) 0base이므로 +1을 해주어야 합니다
					const pagingStatus = `${pageNumber +1}/${totalPages} 페이지`;

					return {
						...previous,
						totalElements:totalElements,
						totalPages:totalPages,
						pageNumber:pageNumber,
						pageSize:pageSize,
						beginPage:beginPage,
						endPage:endPage,
						pagingStatus:pagingStatus
					};
				})
			})
			.catch((error)=>{
				console.log(error)
			});
	},[paging.pageNumber, paging.searchDateType, paging.category, paging.searchMode, paging.searchKeyword]);

	const navigate = useNavigate();
	// 이 함수는 관리자 모드일때 보여주는 '수정'과 '삭제'를 위한 버튼을 생성해주는 함수입니다.
	const makeAdminButton = (item, user, navigate) =>{
		if(user?.role !== 'ADMIN'){
			return null;
		}
 
		return(
			<div className="d-flex justify-content-center">
				<Button 
					variant="warning"
					size="sm"
					className="mb-2"
					onClick={(event)=>{
						event.stopPropagation();
						navigate(`/product/update/${item.id}`);
					}}
				>수정
				</Button>
				&nbsp;
				<Button 
					variant="danger"
					className="mb-2"
					size="sm"
					onClick={async (event)=>{
						event.stopPropagation();
						const isDelete = window.confirm(`${item.name} 상품을 삭제 하시겠습니까?`);
						
						if(isDelete === false){
						alert(`${item.name} 상품 삭제를 취소하셨습니다.`);
						return;
						}
						// 주의) 상품을 삭제하려면 반드시 primary key인 상품의 아이디를 넘겨 주어야 합니다.	
						try{ // 상품을 삭제 후 다시 상품 목록 페이지를 보여줍니다.
							await axios.delete(`${API_BASE_URL}/product/delete/${item.id}`,
								{withCredentials:true}
							);
							// alert 함수(modal 통신)와 비동기 통신 사용시, 화면 갱신에 유의 하도록 합니다.
							alert(`${item.name} 상품이 삭제 되었습니다.`);
							//삭제된 id를 배제하고, 상품 목록 state를 다시 갱신합니다.
							setProduct(prev => prev.filter(p => p.id !== item.id));
							navigate('/product/list')
						}
						catch(error){
							console.log(error);
							alert(`상품 삭제 실패 : ${error.response?.data || error.message}`)
						};
						
					}}
				>삭제
				</Button>
			</div>
		);
	};


	return(
			<Container className="my-4">
				<h1 className="my-4">상품 목록 페이지</h1>
				<Link to={'/product/insert'}>
				 {user?.role === 'ADMIN' && (
					<Button variant="primary" className="m-3">
						상품 등록
					</Button>
				 )}
				</Link>
				
				{/* 필드 검색 영역 */}
				<Form className="p-3">
					<Row className="mb-3">
						{/* 검색 기간 선택 */}
						<Col md={2}> 
				 			<Form.Select 
							name="searchDateType" 
							value={paging.searchDateType} 
							onChange={(e)=>setPaging((previous)=>({...previous, searchDateType:e.target.value}))}
							>
								<option value='ALL'>전체기간</option>
								<option value='1d'>1일</option>
								<option value='1w'>1주일</option>
								<option value='1m'>1개월</option>
								<option value='6m'>6개월</option>
							</Form.Select>
						</Col>

						{/* 카테고리 선택 */}
						<Col md={2}> 
				 			<Form.Select 
							name="category" 
							value={paging.category} 
							onChange={(e)=>setPaging((previous)=>({...previous, category:e.target.value}))}
							>
								<option value='ALL'>전체 카테고리</option>
								<option value='BEVERAGE'>음료</option>
								<option value='BREAD'>빵</option>
								<option value='CAKE'>케이크</option>
							</Form.Select>
						</Col>
						{/* 검색 모드 선택 */}
						<Col md={2}> 
				 			<Form.Select 
							name="searchMode" 
							value={paging.searchMode} 
							onChange={(e)=>setPaging((previous)=>({...previous, searchMode:e.target.value}))}
							>
								<option value='all'>전체 검색</option>
								<option value='name'>상품명</option>
								<option value='description'>상품 설명</option>
							</Form.Select>
						</Col>

						{/* 검색어 입력란 */}
				 		<Col md={4}> 
							<Form.Control
								name="searchKeyword"
								type="text"
								placeholder="검색어를 입력해 주세요."
								value={paging.searchKeyword}
								onChange={(e)=>{
									e.preventDefault();
									setPaging((previous)=>({...previous, searchKeyword:e.target.value}))
								}}
							/>
						</Col>
						{/* 페이징 상태 보여주기 */}
				 		<Col md={2}> 
							<Form.Control
								as="input"
								type="text"
								value={paging.pagingStatus}
								disabled
								style={{
                                fontSize: '15px',
                                backgroundColor: '#f0f0f0',
                                textAlign: 'center', // 텍스트 가운데 정렬
                                width: '100%', // 필요한 너비 설정
                                margin: '0 auto', // 가운데 정렬을 위한 자동 여백
                            }}
							/>
						</Col>
					</Row>
				</Form>
				
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
									onClick={()=>navigate(`/product/detail/${item.id}`)}
								/>
								<Card.Body>
									{/* borderCollapse : 각 셀의 테두리를 합칠 것인지, 별개로 보여 줄지를 설정하는 속성 */}
									<table style={{width:'100%', borderCollapse:'collapse', border:'none'}}>
										<tbody>
										<tr>
											<td style={{width:'70%', padding: '4px', border:'none'}}>
												<Card.Title>{item.name}({item.id})</Card.Title>
											</td>	
											{/* textAlign: 수평 정렬 방식, verticalAlign: 수직 자동 정렬 방식 지정 */}
											{/* rowspan 속성은 행 방향으로 병합시 사용 반대로는 colspan이 있음 */}
											<td rowSpan={2} style={{padding: '4px', border:'none', textAlign:'center', verticalAlign:'middle'}}>
												{makeAdminButton(item, user, navigate)}
											</td>
										</tr>
										<tr>
											<td style={{padding: '4px', border:'none'}}>
												<Card.Text>가격 : {item.price.toLocaleString()}원</Card.Text>
											</td>	
										</tr>
										</tbody>
									</table>
									
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
				{/* 페이징 처리 영역 */}
				  <Pagination className="justify-content-center mt-4">
					{/* 앞쪽 영역 */}
					<Pagination.First
						onClick={()=>{
							console.log('First 버튼 클릭(0 페이지로 이동)')
							setPaging((previous)=>({...previous, pageNumber: 0}))
						}}
						disabled={paging.pageNumber < paging.pageCount}
						as="button"
					>
						맨처음
					</Pagination.First>
					
					<Pagination.Prev
						onClick={()=>{
							const gotoPage = paging.beginPage -1;
							console.log(`Prev 버튼 클릭(${gotoPage} 페이지로 이동)`)
							setPaging((previous)=>({...previous, pageNumber: gotoPage}))
						}}
						disabled={paging.pageNumber < paging.pageCount}
						as="button"
					>
						이전
					</Pagination.Prev>

					
					{/* 숫자 링크가 들어가는 영역 */}
					{[...Array(paging.endPage - paging.beginPage + 1)].map((_, idx)=>{
						// pageIndex는 숫자 링크 번호입니다.
						const pageIndex = paging.beginPage + idx + 1 ;

						return(
							<Pagination.Item 
								key={pageIndex}
								active={paging.pageNumber === (pageIndex -1)}
								onClick={()=>{
								console.log(`(${pageIndex} 페이지로 이동)`)
								setPaging((previous)=>({...previous, pageNumber: pageIndex-1}))
						}}
							>
								{pageIndex}
							</Pagination.Item>
						)
					})}
					
					
					
					<Pagination.Next 
						onClick={()=>{
							const gotoPage = paging.endPage +1;
							console.log(`Next 버튼 클릭(${gotoPage} 페이지로 이동)`)
							setPaging((previous)=>({...previous, pageNumber: gotoPage}))
						}}
						disabled={paging.pageNumber >= Math.floor(paging.totalPages / paging.pageCount) * paging.pageCount}
						as="button"
					>
						다음
						</Pagination.Next>
					<Pagination.Last 
						onClick={()=>{
							const gotoPage = paging.totalPages -1;
							console.log(`Last 버튼 클릭(${gotoPage} 페이지로 이동)`)
							setPaging((previous)=>({...previous, pageNumber: gotoPage}))
						}}
						disabled={paging.pageNumber >= Math.floor(paging.totalPages / paging.pageCount) * paging.pageCount}
						as="button"	
					>
						맨끝
					</Pagination.Last>
				</Pagination>
			</Container>
			
		);
}

export default App;