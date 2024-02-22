import React, { useState } from 'react';
import axios from 'axios';
import "./algorithm.css"

function Algorithm () {
    const [datasetName, setDatasetName] = useState('');
    const [numPerturbSamples, setNumPerturbSamples] = useState('');
    const [topNode, setTopNode] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleButtonClick = async (command) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/run-command?command=${command}&dataset=${datasetName}&numPerturbSamples=${numPerturbSamples}&topNode=${topNode}`);
            setResult(response.data);
        } catch (error) {
            console.error(error);
            setResult('Error occurred while running the command.');
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
                        handleButtonClick(command);
                    }}
                    disabled={loading}
                >
                Load Github Code
                </button>
                <button
                    onClick={() => handleButtonClick(`python3 GenData.py --dataset ${datasetName}`)}
                    disabled={loading}
                >
                    Generate Data
                </button>
                <button
                    onClick={() => handleButtonClick(`python3 GenGroundTruth.py --dataset ${datasetName}`)}
                    disabled={loading}
                >
                    Generate Ground Truth
                </button>
                <button
                    onClick={() => handleButtonClick(`python3 train.py --dataset ${datasetName}`)}
                    disabled={loading}
                >
                    Train Model
                </button>
                <button
                    onClick={() => handleButtonClick(`python3 main.py --dataset ${datasetName} --num-perturb-samples ${numPerturbSamples} --top-node ${topNode}`)}
                    disabled={loading}
                >
                    Run Main Program
                </button>
                <button
                    onClick={() => handleButtonClick(`python3 evaluate_explanations.py --dataset ${datasetName} --num-perturb-samples ${numPerturbSamples} --top-node ${topNode}`)}
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