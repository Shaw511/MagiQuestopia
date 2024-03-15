import React, { useState } from 'react';
import axios from 'axios';
import "./algorithm.css";

function Algorithm () {
    const [datasetName, setDatasetName] = useState('');
    const [numPerturbSamples, setNumPerturbSamples] = useState('');
    const [topNode, setTopNode] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleButtonClick = async (command, datasetName, numPerturbSamples, topNode) => {
        setLoading(true);
        try {
            //建立WebSocket连接
            const socket = new WebSocket('ws://localhost:8000');
            setResult(`${command}, ${datasetName}, ${numPerturbSamples}, ${topNode}`);
            socket.onopen = () => {
                socket.send(JSON.stringify({command, datasetName, numPerturbSamples, topNode}));
                setResult('Message sent to WebSocket server');
                setLoading(false);
            }
            socket.onmessage = (event) => {
                setResult(event.data);
                setLoading(false);
            };

            socket.onerror = (error) => {
                console.error(error);
                setResult('Error occurred while sending message to WebSocket server');
                setLoading(false);
            };

        } catch (error) {
            console.error(error);
            setResult('Error occurred while sending message to RabbitMQ');
        }
        setLoading(false);
    };

    return (
        <div className="Algorithm_Page">
            <h2>Algorithm Demonstrator</h2>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Dataset Name"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Num Perturb Samples"
                    value={numPerturbSamples}
                    onChange={(e) => setNumPerturbSamples(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Top Node"
                    value={topNode}
                    onChange={(e) => setTopNode(e.target.value)}
                />
            </div>
            <div className="button-container">
                <button
                    onClick={() => {
                        const isWindows = navigator.platform.includes('Win');
                        const command = isWindows ? 'powershell -Command "Invoke-WebRequest -Uri https://github.com/Shaw511/PGMExplainer/tree/master/PGM_Node -OutFile ..\\Algorithms\\Data\\PGM_Node"' : 'wget https://github.com/Shaw511/PGMExplainer/tree/master/PGM_Node -P ./Algorithms/Data';
                        handleButtonClick(command, datasetName, numPerturbSamples, topNode);
                    }}
                    disabled={loading}
                >
                Load Github Code
                </button>
                <button
                    onClick={() => handleButtonClick(`python3 GenData.py --dataset ${datasetName}`, datasetName, numPerturbSamples, topNode)}
                    disabled={loading}
                >
                    Generate Data
                </button>
                <button
                    onClick={() => handleButtonClick(`python3 GenGroundTruth.py --dataset ${datasetName}`, datasetName, numPerturbSamples, topNode)}
                    disabled={loading}
                >
                    Generate Ground Truth
                </button>
                <button
                    onClick={() => handleButtonClick(`python3 train.py --dataset ${datasetName}`, datasetName, numPerturbSamples, topNode)}
                    disabled={loading}
                >
                    Train Model
                </button>
                <button
                    onClick={() => handleButtonClick(`python3 main.py --dataset ${datasetName} --num-perturb-samples ${numPerturbSamples} --top-node ${topNode}`, datasetName, numPerturbSamples, topNode)}
                    disabled={loading}
                >
                    Run Main Program
                </button>
                <button
                    onClick={() => handleButtonClick(`python3 evaluate_explanations.py --dataset ${datasetName} --num-perturb-samples ${numPerturbSamples} --top-node ${topNode}`, datasetName, numPerturbSamples, topNode)}
                    disabled={loading}
                >
                    Evaluate Explanations
                </button>
                {loading ? <p3>Loading...</p3> : <p3>{result}</p3>}
            </div>
        </div>
    );

};

export default Algorithm;