import React, { RefObject, DragEvent } from "react"

class FileDrop extends React.Component<{ setFiles: any; files: any }, {}> {
  dropRef: RefObject<HTMLDivElement> = React.createRef()
  handleDrag = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
  }
  handleDragIn = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
  }
  handleDragOut = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
  }
  handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0 &&
      e.dataTransfer.files[0].name.split(".")[1] === "pptx"
    ) {
      this.props.setFiles(this.props.files.concat(e.dataTransfer.files[0]))
    }
  }

  componentDidMount() {
    let div: any = this.dropRef.current
    div.addEventListener("dragenter", this.handleDragIn)
    div.addEventListener("dragleave", this.handleDragOut)
    div.addEventListener("dragover", this.handleDrag)
    div.addEventListener("drop", this.handleDrop)
  }

  componentWillUnmount() {
    let div: any = this.dropRef.current
    div.removeEventListener("dragenter", this.handleDragIn)
    div.removeEventListener("dragleave", this.handleDragOut)
    div.removeEventListener("dragover", this.handleDrag)
    div.removeEventListener("drop", this.handleDrop)
  }

  render() {
    return (
      <div ref={this.dropRef} style={{ width: "100%", height: "100%" }}>
        {" "}
        {this.props.children}
      </div>
    )
  }
}

export default FileDrop
