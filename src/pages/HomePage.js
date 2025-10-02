import { Carousel, Container } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App(){
    // 메인 화면에 보여주고자 하는 상품정보들(파일 이름에 'bigsize' 문자열이 들어 있음)
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        // 이미지 파일 이름에 "bigs"라는 글자가 포함되어 있는 이미지만 추출합니다.
        const url = `${API_BASE_URL}/product?filter=bigs`;
        axios
            .get(url)
            .then((response)=> setProducts(response.data))
            .catch((error)=>
                console.log(error)
            )
    },[]);
    
    const detailView = (id) => {
        navigate(`/product/detail/${id}`)
    }

    return(
			
            <Container className="mt-4">
                <Carousel>
                    {products.map((bean)=>(
                        <Carousel.Item key={bean.id}>
                    <img
                        className="d-block w-100"
                        src={`${API_BASE_URL}/images/${bean.image}`}
                        alt= {bean.name}
                        style={{cursor:'pointer'}}
                        onClick={()=> detailView(bean.id)}
                    />
                    <Carousel.Caption>
                        <h3>{bean.name}</h3>
                        <p>{bean.description.length > 10 
                            ? bean.description.substring(0, 10) + '...'
                            : bean.description}</p>
                    </Carousel.Caption>
                  
                    </Carousel.Item>
                    ))}
                    
                </Carousel>
            </Container>
            
		);
}

export default App; 