
import { ThemeProvider } from "@/services/ThemeProvider"
import ProjectedCalculator from "@/pages/ProjectedCalculator"
import { ToggleMode } from "./components/toggleMode"


function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ToggleMode></ToggleMode>
      <ProjectedCalculator></ProjectedCalculator>
    </ThemeProvider>
  )
}

export default App
