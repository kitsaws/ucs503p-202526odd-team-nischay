import AppRoutes from "./routes/AppRoutes"
import { useUser } from "./context/userContext"
import { Navigate } from "react-router-dom";
import { Rings } from 'react-loader-spinner'

function App() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Rings
          visible={true}
          height="80"
          width="80"
          color="#7c3bed"
          ariaLabel="rings-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    )
  }
  
  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
