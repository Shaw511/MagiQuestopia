import React, { useState } from 'react';
import axios from 'axios';
import "./algorithm.css";

function Algorithm () {

    const [datasetName, setDatasetName] = useState('');
    const [numPerturbSamples, setNumPerturbSamples] = useState('');
    const [topNode, setTopNode] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [imageData, setImageData] = useState('');

    const handleButtonClick = async (mode, command, datasetName, numPerturbSamples, topNode) => {
        setLoading(true);
        try {
            //建立WebSocket连接
            const socket = new WebSocket('ws://localhost:8000/MagiQuestopia/websocket');
            setResult(`${mode}, ${command}, ${datasetName}, ${numPerturbSamples}, ${topNode}`);
            socket.onopen = () => {
                socket.send(JSON.stringify({mode, command, datasetName, numPerturbSamples, topNode}));
                setResult('Message sent to WebSocket server');
                setLoading(false);
            }
            socket.onmessage = (event) => {
                setResult(event.data);
                setLoading(false);
            };
            // socket.onopen = () => {
            //     console.log('WebSocket Client Connected');
            //     socket.send('subscribe_algorithm_result_queue');
            // };
            // socket.onmessage = (message) => {
            //     const data = JSON.parse(message.data);
            //     setImageData(data.imageData);
            // };

            socket.onerror = function(event)  {
                const error = event.error;
                setResult('Error occurred while sending message to WebSocket server:(notice sometimes there would be nothing specific)', error);
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
                {/*<button*/}
                {/*    onClick={() => {*/}
                {/*        const isWindows = navigator.platform.includes('Win');*/}
                {/*        const command = isWindows ? 'powershell -Command "Invoke-WebRequest -Uri https://github.com/Shaw511/PGMExplainer/tree/master/PGM_Node -OutFile ..\\Algorithms\\Data\\PGM_Node"' : 'wget https://github.com/Shaw511/PGMExplainer/tree/master/PGM_Node -P ./Algorithms/Data';*/}
                {/*        handleButtonClick(command, datasetName, numPerturbSamples, topNode);*/}
                {/*    }}*/}
                {/*    disabled={loading}*/}
                {/*>*/}
                {/*Load Github Code*/}
                {/*</button>*/}
                <button
                    onClick={() => handleButtonClick('gen_data', `python3 GenData.py --dataset ${datasetName}`, datasetName, numPerturbSamples, topNode)}
                    disabled={loading}
                >
                    Generate Data 合成数据集
                </button>
                {/*<button*/}
                {/*    onClick={() => handleButtonClick('gen_truth', `python3 GenGroundTruth.py --dataset ${datasetName}`, datasetName, numPerturbSamples, topNode)}*/}
                {/*    disabled={loading}*/}
                {/*>*/}
                {/*    Generate Ground Truth*/}
                {/*</button>*/}
                <button
                    onClick={() => handleButtonClick('train_model', `python3 train.py --dataset ${datasetName}`, datasetName, numPerturbSamples, topNode)}
                    disabled={loading}
                >
                    Train Model 训练模型
                </button>
                <button
                    onClick={() => handleButtonClick('explain_pgm', `python3 main.py --dataset ${datasetName} --num-perturb-samples ${numPerturbSamples} --top-node ${topNode}`, datasetName, numPerturbSamples, topNode)}
                    disabled={loading}
                >
                    PGM Explain 生成解释
                </button>
                <button
                    onClick={() => handleButtonClick('eval_explain', `python3 evaluate_explanations.py --dataset ${datasetName} --num-perturb-samples ${numPerturbSamples} --top-node ${topNode}`, datasetName, numPerturbSamples, topNode)}
                    disabled={loading}
                >
                    Evaluate Explanations 指标评估
                </button>
                {loading ? <p3>Loading...</p3> : <p3>{result}</p3>}
            </div>
            <div className="image-container">
                {imageData && <img src={`data:image/png;base64,${imageData}`} alt="Graph"/>}
            </div>
        </div>
    );

};

export default Algorithm;