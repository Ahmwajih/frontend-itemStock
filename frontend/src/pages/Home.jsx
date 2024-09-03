import { Typography } from "@mui/material"
import KpiCards from "../components/KpiCards"
import Charts from "../components/Charts"
import useStockCall from "../hooks/useStockCall"
import { useEffect, useState } from "react"

const Home = () => {
  const { getStockData } = useStockCall()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getStockData("sales")
        await getStockData("purchases")
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [getStockData])

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>
  }

  return (
    <div>
      <Typography variant="h4" color="error" mb={2}>
        Dashboard
      </Typography>

      <KpiCards />

      <Charts />
    </div>
  )
}

export default Home