import React from "react"
import { FileUpload } from "./components"
import classes from "./App.module.css"
import AnimateHeight from "react-animate-height"

const App = () => {
  return (
    <AnimateHeight duration={500} height="auto">
      <div className={classes.container}>
        <h1 className="orange__text">Upload a File and Extract the Audio</h1>
        <p>
          Drag and drop your <strong>pptx</strong> file and click extract to extract
          all the audio files.
        </p>
        <FileUpload />
      </div>
    </AnimateHeight>
  )
}

export default App
