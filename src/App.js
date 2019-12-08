import React from "react";
import axios from "axios"
import { trackPromise } from 'react-promise-tracker';
import "./style/frameworks.css";
import "./style/softx.css";

import Scan from './components/Scan';
import Upload from "./components/Upload";


class App extends React.Component{


    constructor(props){
        super(props);

        this.state = {
            show: false,
            scans : []
        }

        this.handleClickUploadModal = this.handleClickUploadModal.bind(this);
        this.handleOutsideClickUploadModal = this.handleOutsideClickUploadModal.bind(this);
        this.process_images = this.process_images.bind(this);

    }

    handleClickUploadModal(e) {
        e.preventDefault();
        if (!this.state.show) {
                // attach/remove event handler
                document.addEventListener('click', this.handleOutsideClickUploadModal, false);
            } else {
                document.removeEventListener('click', this.handleOutsideClickUploadModal, false);
        }

        this.setState({
            show: !this.state.show
        });
    }

    handleOutsideClickUploadModal(e) {
        // ignore clicks on the component itself
        if (this.node === e.target){
            this.handleClickUploadModal(e);
        } else
        if (this.node.contains(e.target)) {
          return;
        }
    }


    process_images(images){

        // Close Modal
        this.setState({
            show: !this.state.show
        });
        document.removeEventListener('click', this.handleOutsideClickUploadModal, false);

        const app = this;



            for (var i = 0; i < images.length; i++) { //for multiple files
                const imageName = images[i].name;

                const formData = new FormData();
                formData.append("image", images[i]);
                trackPromise(
                axios({
                    method: 'POST',
                    url: 'http://15.206.187.32/predict/',
                    data: formData,
                    config: { headers: {'Content-Type': 'multipart/form-data'}}
                })
                .then(function (response) {
                    //handle success
                    const id = response.data.id;

                    const scan = <Scan key={`scan${id}`}
                                id = {id}
                                name = {imageName}
                                probs = {response.data.probs}
                                original = {response.data.original}
                                heatmap = {response.data.heatmap}/>

                    app.setState({ scans: [...app.state.scans, scan] });
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                })
                );
            }

        // Code for reading the image instead of loading it from the backend

        // for (var i = 0; i < images.length; i++) { //for multiple files
        //     (function(image) {
        //         const reader = new FileReader();
        //         reader.onload = function(event) {
        //             const dataUri = event.target.result;

        //             const formData = new FormData();
        //             formData.append("image", image);


        //             axios({
        //                 method: 'POST',
        //                 url: 'http://localhost:5000/predict',
        //                 data: formData,
        //                 config: { headers: {'Content-Type': 'multipart/form-data'}}
        //             })
        //             .then(function (response) {
        //                 //handle success
        //                 const id = response.data.id;
        //                 const probs = response.data.probs;


        //                 const scan = <Scan key={`scan${id}`}
        //                             id = {id}
        //                             name = {image.name}
        //                             probs = {probs}
        //                             image = {dataUri}
        //                             heatmap = {response.data.heatmap}/>

        //                 app.setState({ scans: [...app.state.scans, scan] });
        //             })
        //             .catch(function (response) {
        //                 //handle error
        //                 console.log(response);
        //             });
        //         }
        //         reader.readAsDataURL(image);
        //     })(images[i]);
        // }

    }

    defaultClick = (e) =>{
        e.preventDefault();
    }

    render(){
        return (
            <div id="app">
                <nav id="side-nav">
                    <img className="logo" src = {require("./assets/brand/icon-b.png")} alt="SofTx" />
                    <a className="active" href="/#" onClick={this.defaultClick}> <img className="side-icon active2" src = {require("./assets/icons/dashboard.png")} alt="" /> </a>
                    <a href="/#" onClick={this.defaultClick}> <img className="side-icon" src = {require("./assets/icons/addscan.png")} alt="" /> </a>
                </nav>
                <div id="viewport">
                    <header id="menu">
                        <li><a className="active" href="/#" onClick={this.defaultClick}>Dashboard</a></li>
                        <li><a href="/#" onClick={this.defaultClick}>Settings</a></li>
                    </header>
                    <span id="usermenu">
                        <img src = {require("./assets/etc/user.png")} alt="" />
                        <span id="textx">
                            <h5>Welcome back,</h5>
                            <h2>Dr. Greenberg</h2>
                        </span>
                    </span>
                    <section id="container">
                        <h1>PSP Plate Assesment<a href="/#" onClick={(event) => this.handleClickUploadModal(event)}><b>+</b> New Scan</a></h1>

                        <h6>Alpha Version (0.1)</h6>
                        <div id="dashboard">
                            <div id="dashboard-menu">
                                <li className="active"><a href="/#" onClick={this.defaultClick}><img src = {require("./assets/icons/d1.png")} alt="" /><b>Current Scan</b></a></li>
                                <li><a href="/#" onClick={this.defaultClick}><img src = {require("./assets/icons/d2b.png")} alt="" /><b>Scan History</b> <i>PRO</i> </a></li>
                                <li><a href="/#" onClick={this.defaultClick}><img src = {require("./assets/icons/d3b.png")} alt="" /><b>Routines</b> <i>PRO</i></a></li>
                                <li><a href="/#" onClick={this.defaultClick}><img src = {require("./assets/icons/d4b.png")} alt="" /><b>Notification</b> <i>PRO</i></a></li>
                                <li><a href="/#" onClick={this.defaultClick}><img src = {require("./assets/icons/d5b.png")} alt="" /><b>Settings</b> <i>PRO</i></a></li>
                                <li><a href="/#" onClick={this.defaultClick}><img src = {require("./assets/icons/d6b.png")} alt="" /><b>Support</b> <i>PRO</i></a></li>
                            </div>
                            <div id="dashboard-viewport">
                                {this.state.scans}
                            </div>

                        </div>
                    </section>
                </div>

                {
                    // Upload modal
                    this.state.show && (
                    <div className="modal" ref={node => { this.node = node; }}>
                        <Upload show={this.state.show}
                            onClose={(event) => this.handleClickUploadModal(event)}
                            onFilesAdded={(event) => this.process_images(event)}/>
                    </div>
                )}


            </div>

        );
    }

}

export default App;
