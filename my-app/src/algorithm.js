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
        <div>
            <h1>Algorithm Demonstrator</h1>
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
            <button
                onClick={() => handleButtonClick('python3 GenData.py')}
                disabled={loading}
            >
                Load Github Code
            </button>
            <button
                onClick={() => handleButtonClick('python3 GenData.py --dataset [dataset-name]')}
                disabled={loading}
            >
                Generate Data
            </button>
            <button
                onClick={() => handleButtonClick('python3 GenGroundTruth.py --dataset [dataset-name]')}
                disabled={loading}
            >
                Generate Ground Truth
            </button>
            <button
                onClick={() => handleButtonClick('python3 train.py --dataset [dataset-name]')}
                disabled={loading}
            >
                Train Model
            </button>
            <button
                onClick={() => handleButtonClick('python3 main.py --dataset [dataset-name] --num-perturb-samples [int1] --top-node [int2]')}
                disabled={loading}
            >
                Run Main Program
            </button>
            <button
                onClick={() => handleButtonClick('python3 evaluate_explanations.py --dataset [dataset-name] --num-perturb-samples [int1] --top-node [int2]')}
                disabled={loading}
            >
                Evaluate Explanations
            </button>
            {loading ? <p>Loading...</p> : <p>{result}</p>}
        </div>
    );

};

export default Algorithm;