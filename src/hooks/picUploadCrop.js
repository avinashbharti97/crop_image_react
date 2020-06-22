import ReactDOM from 'react-dom'
import React, {useState} from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export default function PicUploadCrop() {
  
  const [photo, setPhoto] = useState({ photoFile: "", photoUrl: "" });

  const handleFile = e =>{
    const file = e.target.files[0]
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      //this.setState({photoFile: file, photoUrl: fileReader.result})
      setPhoto({
        photoFile: file,
        photoUrl: fileReader.result
      })
    }

    if(file){
      fileReader.readAsDataURL(file)
    }
  }


  const handleSubmit = e =>{
    e.preventDefault()
    //Api post request
    //const croppedImg = this.state.croppedImageUrl
    //console.log(croppedmg)
  }

  return (
    <div>
        <div>
          <input type='file' id='upload_pic' onChange={handleFile} />
        </div>
        <img src={photo.photoUrl}/> 
          <button onClick={handleSubmit}>upload</button>
    </div>
    )
}
