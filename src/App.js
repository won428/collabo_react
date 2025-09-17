import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './App.css';

// 분리된 리액트컴포넌트 import
import MenuItems from './ui/MenuItems';
import AppRoutes from './routes/AppRoutes';

function App() {
	const appName = "IT Academy Coffee Shop"

  return (
  <>
		<Navbar bg="dark" variant="dark" expand="lg">
			<Container>
				<Navbar.Brand href='/'>{appName}</Navbar.Brand>
				<Nav className = "me-auto" >
					<MenuItems/>
				</Nav>
			</Container>
		</Navbar>

		{/* 분리된 라우터 정보 */}
		<AppRoutes />


		<footer className="bg-dark text-light text-center py-3 mt-5">
			<p>&copy; 2025 {appName}. All right reserved.</p>
		</footer>
	</>
  );
}

export default App;
