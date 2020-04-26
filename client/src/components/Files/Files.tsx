import React from "react"
import { File } from "../index"

import classes from "./Files.module.css"

interface IFiles {
  files: File[]
}

const Files = (props: IFiles) => {
  return (
    <div className={classes.table__container}>
      {props.files.length > 0 ? (
        <div>
          <h2 className={classes.uploaded}>Uploaded Files</h2>
          <table className={classes.table}>
            <thead>
              <tr>
                <th>PowerPoint</th>
                <th>Extract</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {props.files.map((file: File) => (
                <File key={file.name} file={file} />
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
export default Files
