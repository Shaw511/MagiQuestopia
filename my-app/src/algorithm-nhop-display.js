import React, { useState } from 'react';
import axios from 'axios';
import "./algorithm-nhop-display.css";
import './App.css';
import Home from "./App";
import NotFoundPage from "./App";
import {HashRouter, Route, Routes, Outlet, Link} from "react-router-dom";
import Sub_Politics from "./sub_politics";
import Algorithm from "./algorithm";


function NhopDisplay () {

    const [datasetName, setDatasetName] = useState('');
    const [numPerturbSamples, setNumPerturbSamples] = useState('');
    const [topNode, setTopNode] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [imageData, setImageData] = useState('');
    const [tooltip, setTooltip] = useState('');
    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);

    const dataSets = {
        '1': 1,
        '2': 2,
        '3': 3,
        '6': 6
    };

    const handleCheckbox1Change = () => {
        setIsChecked1(!isChecked1);
    };

    const handleCheckbox2Change = () => {
        setIsChecked2(!isChecked2);
    };

    const Images = ({ dataSet }) => {
        const images = [];
        const folderPath = `./result/syn${dataSet}/nhops_graph`;
        const imagePaths = [
            require(`${folderPath}/${currentImageIndex+300}_subgraph.png`),
        ];
        return (
            <div>
                {imagePaths.map((image, index) => (
                    <img key={index} src={image} alt={`Image ${index}`} />
                ))}
            </div>
        );
    };

    const [currentDataSet, setCurrentDataSet] = useState(Object.keys(dataSets)[0]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleDataSetChange = (dataSet) => {
        const dataSetValue = dataSets[dataSet]; // 获取dataSet对应的数字值
        setCurrentDataSet(dataSetValue);
        setCurrentImageIndex(0);
    };

    const handleNextImage = () => {
        // Add logic to move to the next image in the current data set
        setCurrentImageIndex(prevIndex => prevIndex + 1); //
    };
    return (
        <div className="Algorithm_Page">
            <img alt="Logo" className="logo" src={require('./magi-logo-w.png')}/>
            <h2>图神经网络节点分类演示器</h2>
            <div className="image-container">
                {imageData && <img src={`data:image/png;base64,${imageData}`} alt="Graph"/>}
            </div>

            <div className="checkbox-container">
                <div>
                    <input type="checkbox" checked={isChecked1} onChange={handleCheckbox1Change}/>
                    <label>确认服务端已启动</label>
                </div>
            </div>
            <div className="display-switch">
                <Link to="/algorithm">算法运行</Link>
                <Link to="/algorithm-nhop-display">过程输出</Link>
            </div>
            <div class="dataset-button">
                {Object.keys(dataSets).map(dataSet => (
                    <button key={dataSet} onClick={() => handleDataSetChange(dataSet)}>{dataSet}</button>
                ))}
            </div>
            <div className="centered-image">
                <Images dataSet={currentDataSet}/>
            </div>
            <div class="pic-switch">
                <button onClick={handleNextImage}>切换下一张</button>
            </div>
        </div>
    )
        ;

};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/algorithm" element={<Algorithm/>}/>
            <Route path="/algorithm-nhop-display" element={<NhopDisplay/>}/>
            <Route path="/sub_politics" element={<Sub_Politics/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
            <Route/>
        </Routes>
    );
};


export default NhopDisplay;