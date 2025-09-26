// Central Chart.js registration to avoid duplicate registrations across components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

let registered = false

export function ensureChartsRegistered() {
  if (registered) return
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  )
  registered = true
}

// Optionally call immediately so import has side-effects
ensureChartsRegistered()
