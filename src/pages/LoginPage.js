import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/config";
import axios from "axios";




function App({setUser}){
// setUser : 사용자 정보를 저장하기 위한 setter 메소드
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const [errors, setErrors] = useState('');

const navigate = useNavigate();

const LoginAction = async (event) => {
    event.preventDefault();

    try{
        const url = `${API_BASE_URL}/member/login`
        const parameters= {email, password};
        
        // 스프링 부트가 넘겨주는 정보는 Map<String, Object> 타입 입니다.
        const response = await axios.post(url, parameters);

        // message에는 '로그인 성공 여부'를 알리는 내용, member에는 로그인 한 사람의 객체 정보가 반환 됩니다.
        const {message, member} = response.data;

        if(message === 'success'){ // 자바에서 map.put("message", "로그인 성공") 식으로 코딩을 했습니다.
            console.log('로그인 한 사람의 정보');
            console.log(member);
            // 로그인 성공시 사용자 정보를 어딘가에 저장해야 합니다.
            setUser(member);


            navigate('/') // 로그인 성공 후 홈 페이지로 이동
        }else{
            setErrors(message);
        }

    }catch(error){ // 로그인 실패
        if(error.response){
            setErrors(error.response.data.message || '로그인 실패')
        }else{
            setErrors('Server Error')
        }
    }
}


    return(
			<Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 justify-content-center">
				<Col md = {6}> 
					<Card>
					<Card.Body>
						<h2 className="text-center mb-4">로그인</h2>
						{/* 일반 오류 발생시 사용자에게 alret 메세지를 보여줍니다. */}
						{/* contextual : 상황에 맞는 적절한 색상 */}
						{errors && <Alert variant="danger">{errors}</Alert>}

						{/*
							!! 연산자는 어떠한 값을 강제로 boolean 형태로 변환해주는 자바스크립트 기법입니다.
							
							isInvalid 속성은 해당 control의 유효성을 검사하는 속성입니다.
							값이 true이면 Form.Control.Feedback에 메세지를 보여주는데, variant="danger"가 danger로 설정되어있기 때문에 빨간 오류 메세지를 보여줍니다.
						*/}


						<Form onSubmit={LoginAction}>
							
								<Form.Group className="mb-3">
								<Form.Label>이메일</Form.Label>
								<Form.Control
									type="text"
									placeholder="이메일을 입력해 주세요."
									value={email}
									onChange={(event)=> setEmail(event.target.value)}
									required
								/>
								
								</Form.Group>
								<Form.Group className="mb-3">
								<Form.Label>비밀번호</Form.Label>
								<Form.Control
									type="password"
									placeholder="비밀번호를 입력해 주세요."
									value={password}
									onChange={(event)=> setPassword(event.target.value)}
									required
								/>
								
								</Form.Group>
							<Row>
                                <Col xs={8}>
                                <Button variant="primary" type="submit" className="w-100">
                                    로그인
                        	    </Button>   
                                </Col>
                                <Col xs={4}>
                                    <Link to={`/member/signup`} className="btn btn-outline-secondary w-100">
                                    회원 가입
                        	        </Link>
                                </Col>
                            </Row>
                           
						</Form>
					</Card.Body>
				</Card>
				</Col>
            </Row>
        </Container>
		);
}

export default App;