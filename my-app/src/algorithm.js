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
    const [tooltip, setTooltip] = useState('');
    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);

    const handleCheckbox1Change = () => {
        setIsChecked1(!isChecked1);
    };

    const handleCheckbox2Change = () => {
        setIsChecked2(!isChecked2);
    };

    const handleButtonClick = async (action, mode, command, datasetName, numPerturbSamples, topNode) => {
        if (!datasetName || !numPerturbSamples || !topNode) {
            alert("请先在输入框中键入参数！");
            return;
        }
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
            <img alt="Logo" className="logo" src={require('./magi-logo.png')}/>
            <h2>图神经网络节点分类演示器</h2>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="请输入数据集名称"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="请输入样本扰动次数"
                    value={numPerturbSamples}
                    onChange={(e) => setNumPerturbSamples(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="请输入top-node"
                    value={topNode}
                    onChange={(e) => setTopNode(e.target.value)}
                />
            </div>
            <div className="button-container">
                <button
                    onMouseEnter={() => setTooltip('gen_data')}
                    onMouseLeave={() => setTooltip('')}
                    onClick={() => handleButtonClick('gen_data', `python3 GenData.py --dataset ${datasetName}`, datasetName, numPerturbSamples, topNode)}
                    disabled={loading}
                >
                    合成数据集
                </button>
                <div className={`tooltip ${tooltip === 'gen_data' ? 'show' : ''}`}>在基图的基础上进行添加或减少随机边的扰动操作，添加特征结构motif，并对每个节点添加特征值。</div>
                {/*<button*/}
                {/*    onClick={() => handleButtonClick('gen_truth', `python3 GenGroundTruth.py --dataset ${datasetName}`, datasetName, numPerturbSamples, topNode)}*/}
                {/*    disabled={loading}*/}
                {/*>*/}
                {/*    Generate Ground Truth*/}
                {/*</button>*/}
                <button
                    onMouseEnter={() => setTooltip('train_model')}
                    onMouseLeave={() => setTooltip('')}
                    onClick={() => handleButtonClick('train_model', `python3 train.py --dataset ${datasetName}`, datasetName, numPerturbSamples, topNode)}
                    disabled={loading}
                >
                    训练模型
                </button>
                <div className={`tooltip ${tooltip === 'train_model' ? 'show' : ''}`}>采用三层的图神经网络，将特征个数作为输入维度和层数，经过前向传播过程，返回[batch_size x num_nodes x embedding]格式的三维嵌入矩阵，将数据集划分为训练集、检验集和测试集，在1000个epoch上迭代训练，使用0.001的学习率，优化器采用Adam优化器。</div>
                <button
                    onMouseEnter={() => setTooltip('explain_pgm')}
                    onMouseLeave={() => setTooltip('')}
                    onClick={() => handleButtonClick('explain_pgm', `python3 main.py --dataset ${datasetName} --num-perturb-samples ${numPerturbSamples} --top-node ${topNode}`, datasetName, numPerturbSamples, topNode)}
                    disabled={loading}
                >
                    生成解释
                </button>
                <div className={`tooltip ${tooltip === 'explain_pgm' ? 'show' : ''}`}>对生成和预处理之后的样本数据进行扰动，形成给定p值的伯努利分布，观察扰动数据后的预测结果是否发生变化，如果变化则将待解释节点的目标样本值设为1，否则设为0。在对数据格式处理后，对于目标节点的邻居节点，分别计算卡方检验值和因果效应值，其中因果效应值代表了邻居节点对预测结果影响的显著性水平。</div>
                <button
                    onMouseEnter={() => setTooltip('eval_explain')}
                    onMouseLeave={() => setTooltip('')}
                    onClick={() => handleButtonClick('eval_explain', `python3 evaluate_explanations.py --dataset ${datasetName} --num-perturb-samples ${numPerturbSamples} --top-node ${topNode}`, datasetName, numPerturbSamples, topNode)}
                    disabled={loading}
                >
                    指标评估
                </button>
                <div className={`tooltip ${tooltip === 'eval_explain' ? 'show' : ''}`}>每个数据集上的Accuracy和Precision</div>
                {loading ? <p3>Loading...</p3> : <p3>{result}</p3>}
            </div>

            <div className="image-container">
                {imageData && <img src={`data:image/png;base64,${imageData}`} alt="Graph"/>}
            </div>

            <div className="checkbox-container">
                <div>
                    <input type="checkbox" checked={isChecked1} onChange={handleCheckbox1Change}/>
                    <label>确认服务端已启动</label>
                </div>
                <div>
                    <input type="checkbox" checked={isChecked2} onChange={handleCheckbox2Change}/>
                    <label>确认参数已填写</label>
                </div>
            </div>


        </div>
    );

    };

    export default Algorithm;