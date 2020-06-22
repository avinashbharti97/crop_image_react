import React, {Component} from 'react'

class PicUploadCrop extends Component {
  
  state = {
      photoFile: null,
      photoUrl: null
    }

  handleFile = e =>{
    this.setState({photoFile: e.target.files[0]})
    const file = e.target.files[0]
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      this.setState({photoFile: file, photoUrl: fileReader.result})
    }

    if(file){
      fileReader.readAsDataURL(file)
    }
  }

  handleSubmit = e =>{
    e.preventDefault()
    //Api post request
    const photoFile = this.state.photoFile;
    console.log(photoFile)
  }
  


  render(){
    const preview = <img src={this.state.photoUrl}/> 

    return (
      <form onSubmit = {this.handleSubmit}>
        <input type='file' id='upload_pic' value={this.state.upload_pic}
        onChange={this.handleFile} />
          {preview}
          <button>save</button>
      </form>
    )
  };
}     
export default PicUploadCrop 
