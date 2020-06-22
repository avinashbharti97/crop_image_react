import ReactDOM from 'react-dom'
import React, {useState, useCallback, useRef, useEffect} from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import './picUploadCrop.css'

const pixelRatio = 4;

function getNewCanvas(canvas, newWidth, newHeight){
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = newWidth;
  tmpCanvas.height = newHeight;

  const ctx = tmpCanvas.getContext("2d");
  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    newWidth,
    newHeight
  );

  return tmpCanvas;
}

export default function PicUploadCrop() {
  
  const [photo, setPhoto] = useState();
  const [croppedPhotoUrl, setCropPhotoUrl] = useState();
  const [crop, setCrop] = useState({ unit: "%", width: 50, height: 50, x: 25, y: 25});
  const [completedCrop, setCompletedCrop] = useState(null);
  const photoRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const handleFile = e =>{
    const file = e.target.files[0]
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      //this.setState({photoFile: file, photoUrl: fileReader.result})
      setPhoto(fileReader.result)
    }

    if(file){
      fileReader.readAsDataURL(file)
    }

  }
  const onLoad = useCallback(photo => {
    photoRef.current = photo;
  }, []);

  const handleSubmit=(previewCanvas, crop) =>{
    if (!crop || !previewCanvas){
      return;
    }
    const canvas = getNewCanvas(previewCanvas, crop.width, crop.height)
    canvas.toBlob(
      blob=>{
        const croppedPhotoUrl = window.URL.createObjectURL(blob);
        setCropPhotoUrl(croppedPhotoUrl)
        window.URL.revokeObjectURL(croppedPhotoUrl);
      },
      "image/jpeg",
      1
    )

    var headers = new Headers();
    headers.append("Authorization", "Client-ID 7e0bbcd94277dbe");
    var formData = new FormData();
    formData.append("image", croppedPhotoUrl)

    var requestOptions = {
      method: 'POST',
      headers: headers,
      body: formData,
    }

    fetch("url", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error))
  };



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
  
  const inputStyle = {
    margin: "15px",
  }

  return (
    <React.Fragment>
      {!photo?
        <label class="Button" id="selectButton">
          <input type='file' onChange={handleFile} />
            Select Image
            </label>:
          <div>
            <ReactCrop
              src={photo}
              ruleOfThirds
              onImageLoaded={onLoad}
              crop={crop}
              onChange={c=>setCrop(c)}
              onComplete={c=>setCompletedCrop(c)}
            />
            <div id="uploadButton">
              <button className="Button" onClick={()=>handleSubmit(previewCanvasRef.current, completedCrop)}>upload</button>
            </div>
        </div>
      }

        {/* ---------Cropped Image Preview-----------*/}

      {/*<div>
        <canvas
          ref={previewCanvasRef}
          style={{
            width: completedCrop?.width ?? 0,
            height: completedCrop?.height ?? 0
          }}
        />
      </div>*/}

      {/* ---------Cropped Image Preview ends-----------*/}
    </React.Fragment>
    )
}
