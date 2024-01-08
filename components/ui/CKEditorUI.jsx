import React, { useState } from 'react'
import { CKEditor } from 'ckeditor4-react'

const CKEditorUI = ({ onChange, initData = '', name = 'editor1', allowUploadImage = false }) => {

  return (
    <CKEditor
      config={{
        removePlugins: !allowUploadImage ? "image" : "",
        allowedContent: true
      }}
      initData={initData}
      name={name}
      onChange={onChange}
      editorUrl="https://cdn.ckeditor.com/4.22.1/full/ckeditor.js"
     />
  )
}

export default CKEditorUI
