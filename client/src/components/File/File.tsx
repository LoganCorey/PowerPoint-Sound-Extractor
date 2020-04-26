import React, { useState } from "react"
import axios from "axios"
import { Downloading } from "../index"
import classes from "./File.module.css"
interface IFile {
  file: File
}

const File = (props: IFile) => {
  const [extracted, setExtracted] = useState("Not Extracted")
  const [downloading, setDownloading] = useState(false)
  /**
   * Sends the pptx to the server and downloads the completed file
   */
  const downloadFileHandler = (): void => {
    setDownloading(true)

    let form = new FormData()
    form.append("file", props.file)

    axios
      .post("/extract", form)
      .then((response: any) => {
        createDownload(response)
        setDownloading(false)
        setExtracted("Extracted")
      })
      .catch((error: any) => {
        console.log(error)
        setDownloading(false)
        setExtracted("No sound found")
      })
  }

  /**
   * Downloads the file for the user
   * @param response
   */
  const createDownload = (response: any) => {
    console.log(response)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    console.log(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = url
    // Sets the download attribute to the name of the file
    link.setAttribute("download", response.data)
    link.download = response.data
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
  return (
    <tr className={classes.row}>
      <td className={classes.cell}>{props.file.name}</td>
      <td className={classes.cell}>
        <button className={classes.button} onClick={downloadFileHandler}>
          {downloading === true ? <Downloading /> : "Click to Download"}
        </button>
      </td>
      <td className={classes.cell}>{extracted}</td>
    </tr>
  )
}
export default File
