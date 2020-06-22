import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

class PicUploadCrop extends Component {
  
  state = {
    photoFile: null,
    photoUrl: null,
    crop: {
      unit: '%',
      width: 30,
      aspect: 16/9
    }
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

  onImageLoaded = image =>{
    this.imageRef = image;
  }

  onCropComplete = crop =>{
    this.makeClientCrop(crop);
  }

  onCropChange = (crop) => {
    this.setState({crop});
  }

  async makeClientCrop(crop){
    if (this.imageRef && crop.width && crop.height){
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );
      this.setState({croppedImageUrl})
    }
  }

  getCroppedImg(image, crop, fileName){
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
    );
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });

  }

  handleSubmit = e =>{
    e.preventDefault()
    //Api post request
    const croppedImg = this.state.croppedImageUrl
    console.log(croppedImg)
  }
  


  render(){
    //const preview = <img src={this.state.photoUrl}/> 
    const { crop, croppedImageUrl,  photoUrl} = this.state;

    return (
      <form onSubmit = {this.handleSubmit}>
        <div>
          <input type='file' id='upload_pic' value={this.state.upload_pic}
            onChange={this.handleFile} />
        </div>
          {photoUrl && (
            <ReactCrop
              src = {photoUrl}
              crop = {crop}
              ruleOfThirds
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
            />
          )}

              {
                croppedImageUrl && (
                  <img style={{maxWidth: '100%'}} src={croppedImageUrl}/>
                )
              }
          <button>save</button>
      </form>
    )
  }
};
export default PicUploadCrop 
