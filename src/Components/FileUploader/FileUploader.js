import React, { Component } from 'react'
import axios from 'axios'
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

import './FileUploader.css'

const endpoint = 'https://6jm8rnjkxf.execute-api.us-east-1.amazonaws.com/staging';

// File size limit: 2gb (https://whatsabyte.com/P1/byteconverter.htm)
const fileSizeLimit = 2147483648;

class FileUploader extends Component {

  constructor(props) {
    super(props);

    this.fileUpload = React.createRef();
    this.showFileUploadDialog = this.showFileUploadDialog.bind(this);

    this.state = {
      caseNumber: props.caseNumber || "",
      uploading: false,
      selectedFile: null,
      loaded: 0,
      url: "",
      fields: [],
      filename: "",
      filesize: "",
      key: ""
    }
  }

  showFileUploadDialog = () => {
      this.fileUpload.current.click();
  }

  parseSignatureResponse = (res) => {
    console.log("parseSignatureResponse: ");
    console.log(res.data);
    console.log(res.data["creds"]["fields"])
    this.setState({
      url: res.data["url"],
      key: res.data["key"],
      fields: res.data["creds"]["fields"]
    });
  }

  retrieveFileSignature = (key, caseNum) => {
    console.log("retrieveFileSignature: " + key + ", " + caseNum);
    axios({
      url: endpoint + "/uploads/request-signature",
      method: 'get',
      params: {
        file: key,
        case: caseNum
      }
    }).then(res => {
      console.log(res.statusText);
      this.parseSignatureResponse(res);
    }).catch(error => {
      console.log(error);
    });
  }

  showFileDetails = (file) => {
    console.log("showFileDetails: " + file.name);
    console.log("The file selected has been handled.");
    console.log("File selected Name: " + file.name);
    console.log("File selected Size: " + file.size);
    console.log("Changing state...");
  }

  handleselectedFile = (event) => {

    const file = event.target.files[0];
    let filesize = 0;
    let filename = "";
    let caseNumber = "";

    try {
      filesize = file.size;
      filename = file.name;
      caseNumber = this.state.caseNumber;

      if(filesize >= fileSizeLimit) {
        alert("The file is too large, the limit is 2gb");
        console.log("The file is too large, the limit is 2gb");
        event.target.value = null;
        return null;
      }

      this.showFileDetails(file)
      this.retrieveFileSignature(filename, caseNumber);

      this.setState({
        selectedFile: file,
        loaded: 0,
        filename: filename,
        filesize: filesize
      });
    }
    catch {
      filesize = 0;
      filename = "";

      this.setState({
        selectedFile: null,
        loaded: 0,
        filename: "",
        filesize: ""
      });
    }
  }

  humanFileSize = (size) => {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }



  handleUpload = () => {
    const data = new FormData();

    let fields = [];

    try {
      fields = Object.keys(this.state.fields);
      console.log("handleUpload() Object keys loaded");
    } catch {
      fields = [];
      console.log("Yikes, no good");
    }

    for (const key of fields) {
      console.log(key + " = " + this.state.fields[key]);
      data.append(key, this.state.fields[key]);
    }



    data.append('file', this.state.selectedFile, this.state.key);

    console.log("The file upload has been handled.");

    this.setState({
      uploading: true
    })
    axios
      .post(this.state.url, data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          })
        },
      })
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  }


  render = () => {
    let fileSelected = this.state.filename !== "";
    let fileDetailsClass = "FileUploader__title" + (fileSelected ? "" : "-hidden");
    let uploadButtonClass = "FileUploader__submitbutton" + (fileSelected ? "" : "-hidden");
    let uploadMessage = "FileUploader__uploadmessage";// + (fileSelected ? "" : "-hidden");

    let progressStatus = {}
    let uploadingStatus = {}

    if(this.state.uploading == false) {
      progressStatus = {
        "display": "none"
      }

      uploadingStatus = {}
    } else {
      progressStatus = {}

      uploadingStatus = {
          "display": "none"
      }
    }

    return (
      <div className="FileUploader">
        <div className="FileUploader__casenumber">Case Number<br/>{this.state.caseNumber}</div>
        <div className={fileDetailsClass}>
          <div>File Details: </div>
          <p>Name: <span>{this.state.filename}</span></p>
          <p>Size: <span>{this.humanFileSize(this.state.filesize)} (limit: {this.humanFileSize(fileSizeLimit)})</span></p>
        </div>
        <input
            style={{ display: "none" }}
            type="file" name="file" id="file"
            onChange={this.handleselectedFile} ref={this.fileUpload}
          />
        <div style={uploadingStatus} className="FileUploader__selectbutton" onClick={this.showFileUploadDialog}>
          <input
              type="image"
              src="http://www.graphicssimplified.com/wp-content/uploads/2015/04/upload-cloud.png"
              width="30px"
            />
            <span>Tap to select or change file.</span>
        </div>

        <button style={uploadingStatus} className={uploadButtonClass} onClick={this.handleUpload}>Upload</button>

        <div style={progressStatus} className={uploadMessage}>Uploading, please wait...</div>

        <Progress
          style={progressStatus}
          type="circle"
          width={100}
          percent={Math.round(this.state.loaded, 2)}
        />
      </div>
    )
  }
}

export default FileUploader
