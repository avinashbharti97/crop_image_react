import React, {useState, useCallback, useRef, useEffect} from 'react'
import PicUploadCrop from './picUploadCrop';
import './uploadImagePrevContainer.css'

export default function ImageContainer(){
  return (
    <div id="ImageContainer">
      <PicUploadCrop/> 
    </div>
  )
}
