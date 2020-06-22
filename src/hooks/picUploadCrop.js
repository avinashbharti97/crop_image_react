import ReactDOM from 'react-dom'
import React, {useState, useCallback, useRef, useEffect} from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const pixelRatio = 4;

export default function PicUploadCrop() {
  
  const [photo, setPhoto] = useState({ photoFile: "", photoUrl: "" });
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16/9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const photoRef = useRef(null);
  const previewCanvasRef = useRef(null);

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
  const onLoad = useCallback(photo => {
    photoRef.current = photo;
  }, []);

  const handleSubmit = e =>{
    e.preventDefault()
    //Api post request
    //const croppedImg = this.state.croppedImageUrl
    //console.log(croppedmg)
  }

  useEffect(()=>{
    if(!completedCrop || !previewCanvasRef.current || !photoRef.current){
      return;
    }

    const image = photoRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = false;

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
  }, [completedCrop]);  

  return (
    <div>
        <div>
          <input type='file' id='upload_pic' onChange={handleFile} />
        </div>
          <ReactCrop
            src={photo}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={c=>setCrop(c)}
            onComplete={c=>setCompletedCrop(c)}
          />

          <div>
            <canvas
              ref={previewCanvasRef}
              style={{
                width: completedCrop.width,
                height: completedCrop.height
              }}
            />
          </div>

          <button onClick={handleSubmit}>upload</button>
    </div>
    )
}
