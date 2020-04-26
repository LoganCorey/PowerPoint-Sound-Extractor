import React, { useState, useEffect, FormEvent, RefObject } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons"
import { Files, FileDrop } from "../index"
import classes from "./FileUpload.module.css"

/**
 * Component is used for uploading files
 */
const FileUpload = () => {
  const ref: RefObject<HTMLDivElement> = React.createRef()
  useEffect(() => {
    let div: any = ref.current
    div.addEventListener("dragenter", () => {
      setDrag(true)
    })
    div.addEventListener("dragleave", () => {
      setDrag(false)
    })
  }, [ref])
  const [files, setFiles] = useState([])
  const [drag, setDrag] = useState(false)
  const formChangeHandler = (event: FormEvent<HTMLFormElement>) => {
    //@ts-ignore
    if (event.target.files[0]) {
      //@ts-ignore
      setFiles(files.concat([event.target.files[0]]))
    }
  }

  return (
    <div className={classes.border}>
      <FileDrop setFiles={setFiles} files={files}>
        <div ref={ref}>
          <form
            className={
              classes.FileUploadContainer +
              " " +
              (drag === true ? classes.hover__border : null)
            }
            onChange={(event) => formChangeHandler(event)}
            encType="multipart/form-deta"
          >
            <FontAwesomeIcon
              className={
                classes.upload__icon +
                " " +
                (drag === true ? classes.hover__icon : null)
              }
              size="9x"
              icon={faCloudUploadAlt}
            />
            <h3>Drag and drop or</h3>
            <input
              name="file"
              id="file"
              type="file"
              className={classes.file__input}
              accept=".pptx"
            />
            <label className={classes.button} htmlFor="file">
              Click to Select a File
            </label>
          </form>
        </div>
      </FileDrop>
      <Files files={files} />
    </div>
  )
}

export default FileUpload
